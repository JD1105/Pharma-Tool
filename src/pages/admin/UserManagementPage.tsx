import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Add, Edit, LockReset, Password, ToggleOff, ToggleOn } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { listUsers, saveUser } from '../../api/userApi'
import type { Role, User } from '../../types'
import { DataTable } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusChip } from '../../components/common/StatusChip'
import { useToast } from '../../hooks/useToast'

type UserForm = Omit<User, 'id'> & { id?: string }
const blank: UserForm = {
  name: '',
  email: '',
  role: 'CLIENT',
  organisation: '',
  validUntil: null,
  enabled: true,
}

export function UserManagementPage() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<UserForm>(blank)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const query = useQuery({ queryKey: ['users'], queryFn: listUsers })
  const mutation = useMutation({
    mutationFn: saveUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      setOpen(false)
      setForm(blank)
      showToast('User saved', 'success')
    },
  })
  const edit = (user: User) => {
    setForm({ ...user })
    setOpen(true)
  }
  const persist = (user: User) => mutation.mutate({ ...user, enabled: !user.enabled })
  const columns: GridColDef<User>[] = [
    { field: 'name', headerName: 'Name', minWidth: 160, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'organisation', headerName: 'Organisation', minWidth: 160, flex: 1 },
    {
      field: 'enabled',
      headerName: 'Status',
      width: 130,
      renderCell: ({ row }) => (
        <StatusChip
          status={
            !row.enabled
              ? 'Disabled'
              : row.role === 'TEMP' && row.validUntil && new Date(row.validUntil) < new Date()
                ? 'Expired'
                : 'Active'
          }
        />
      ),
    },
    {
      field: 'validUntil',
      headerName: 'Valid Until',
      width: 160,
      valueGetter: (_, row) =>
        row.validUntil ? new Date(row.validUntil).toLocaleDateString() : '—',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 155,
      getActions: ({ row }) => [
        <GridActionsCellItem key="edit" label="Edit" icon={<Edit />} onClick={() => edit(row)} />,
        <GridActionsCellItem
          key="toggle"
          label={row.enabled ? 'Disable' : 'Enable'}
          icon={row.enabled ? <ToggleOff /> : <ToggleOn />}
          onClick={() => persist(row)}
        />,
        <GridActionsCellItem
          key="extend"
          label="Extend access"
          icon={<LockReset />}
          disabled={row.role !== 'TEMP'}
          onClick={() => edit(row)}
        />,
        <GridActionsCellItem
          key="reset"
          label="Reset password"
          icon={<Password />}
          onClick={() => showToast(`Password reset for ${row.email}`, 'success')}
        />,
      ],
    },
  ]
  const save = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.organisation?.trim() ||
      (form.role === 'TEMP' && !form.validUntil)
    ) {
      setError('Complete all required fields. Temporary users require a valid-until date.')
      return
    }
    setError('')
    mutation.mutate(form)
  }
  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="Manage users and temporary access."
        actions={
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => {
              setForm(blank)
              setOpen(true)
            }}
          >
            Create User
          </Button>
        }
      />
      <DataTable
        rows={query.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.isError ? 'Unable to load users.' : undefined}
        onRetry={() => void query.refetch()}
        pageSizeOptions={[10, 25]}
      />
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <TextField
              select
              label="Role"
              value={form.role}
              onChange={(event) =>
                setForm({
                  ...form,
                  role: event.target.value as Role,
                  validUntil: event.target.value === 'TEMP' ? form.validUntil : null,
                })
              }
            >
              {[
                ['ADMIN', 'Admin'],
                ['DEVELOPER', 'Developer'],
                ['CLIENT', 'Client'],
                ['TEMP', 'Temp'],
              ].map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Organisation"
              value={form.organisation ?? ''}
              onChange={(event) => setForm({ ...form, organisation: event.target.value })}
            />
            <TextField
              type="date"
              label="Valid Until"
              InputLabelProps={{ shrink: true }}
              disabled={form.role !== 'TEMP'}
              value={form.validUntil?.slice(0, 10) ?? ''}
              onChange={(event) =>
                setForm({
                  ...form,
                  validUntil: event.target.value
                    ? new Date(event.target.value).toISOString()
                    : null,
                })
              }
            />
            {error && <Alert severity="error">{error}</Alert>}
            {mutation.isError && <Alert severity="error">Unable to save user.</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
