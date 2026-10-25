import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Add } from '@mui/icons-material'
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
import type { GridColDef } from '@mui/x-data-grid'
import { createImpactAssessment, listImpactAssessments } from '../../api/projectApi'
import { countries } from '../../mocks/db'
import type { ImpactAssessment } from '../../types'
import { DataTable } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusChip } from '../../components/common/StatusChip'

const blank = {
  title: '',
  regulation: '',
  country: '',
  impactLevel: 'Medium' as ImpactAssessment['impactLevel'],
  owner: '',
  dueDate: '',
  notes: '',
}

export function ImpactAssessmentPage() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['impact-assessments'], queryFn: listImpactAssessments })
  const mutation = useMutation({
    mutationFn: createImpactAssessment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['impact-assessments'] })
      setForm(blank)
      setOpen(false)
    },
  })
  const columns: GridColDef<ImpactAssessment>[] = [
    { field: 'title', headerName: 'Title', minWidth: 200, flex: 1 },
    { field: 'regulation', headerName: 'Regulation', minWidth: 180, flex: 1 },
    { field: 'country', headerName: 'Country', width: 150 },
    {
      field: 'impactLevel',
      headerName: 'Impact Level',
      width: 140,
      renderCell: ({ value }) => <StatusChip status={String(value)} />,
    },
    { field: 'owner', headerName: 'Owner', width: 150 },
    { field: 'dueDate', headerName: 'Due Date', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
  ]
  const submit = () => {
    if (!form.title || !form.regulation || !form.country || !form.owner || !form.dueDate) {
      setError('Complete all required fields.')
      return
    }
    setError('')
    mutation.mutate({ ...form, status: 'Open' })
  }
  return (
    <Box>
      <PageHeader
        title="Impact Assessment"
        subtitle="Assess the operational impact of regulatory changes."
        actions={
          <Button startIcon={<Add />} variant="contained" onClick={() => setOpen(true)}>
            New Assessment
          </Button>
        }
      />
      <DataTable
        rows={query.data ?? []}
        columns={columns}
        loading={query.isLoading}
        error={query.isError ? 'Unable to load assessments.' : undefined}
        onRetry={() => void query.refetch()}
        pageSizeOptions={[10, 25]}
      />
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Assessment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              required
              label="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <TextField
              required
              label="Regulation"
              value={form.regulation}
              onChange={(event) => setForm({ ...form, regulation: event.target.value })}
            />
            <TextField
              select
              required
              label="Country"
              value={form.country}
              onChange={(event) => setForm({ ...form, country: event.target.value })}
            >
              {countries.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Impact Level"
              value={form.impactLevel}
              onChange={(event) =>
                setForm({
                  ...form,
                  impactLevel: event.target.value as ImpactAssessment['impactLevel'],
                })
              }
            >
              {['High', 'Medium', 'Low'].map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              required
              label="Owner"
              value={form.owner}
              onChange={(event) => setForm({ ...form, owner: event.target.value })}
            />
            <TextField
              required
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
            />
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
            {error && <Alert severity="error">{error}</Alert>}
            {mutation.isError && <Alert severity="error">Unable to save assessment.</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
