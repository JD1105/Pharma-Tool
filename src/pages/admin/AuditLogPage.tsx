import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Button, Stack, TextField } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { listAuditEntries } from '../../api/auditApi'
import { DataTable } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { downloadCsv } from '../../utils/download'
import type { AuditEntry } from '../../types'

export function AuditLogPage() {
  const [user, setUser] = useState('')
  const [action, setAction] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const query = useQuery({ queryKey: ['audit'], queryFn: listAuditEntries })
  const rows = (query.data ?? []).filter(
    (entry) =>
      (!user || entry.userEmail.toLowerCase().includes(user.toLowerCase())) &&
      (!action || entry.action.toLowerCase().includes(action.toLowerCase())) &&
      (!from || entry.timestamp.slice(0, 10) >= from) &&
      (!to || entry.timestamp.slice(0, 10) <= to),
  )
  const columns = useMemo<GridColDef<AuditEntry>[]>(
    () => [
      { field: 'timestamp', headerName: 'Timestamp', minWidth: 190, flex: 1 },
      { field: 'userEmail', headerName: 'User', minWidth: 200, flex: 1 },
      { field: 'role', headerName: 'Role', width: 130 },
      { field: 'action', headerName: 'Action', minWidth: 180, flex: 1 },
      { field: 'entityType', headerName: 'Entity', width: 160 },
      { field: 'ip', headerName: 'IP', width: 140 },
    ],
    [],
  )
  return (
    <Box>
      <PageHeader
        title="Audit Log"
        subtitle="Read-only activity history."
        actions={
          <Button
            variant="outlined"
            onClick={() =>
              downloadCsv(
                'audit-log.csv',
                rows.map((entry) => ({
                  Timestamp: entry.timestamp,
                  User: entry.userEmail,
                  Role: entry.role,
                  Action: entry.action,
                  Entity: entry.entityType,
                  IP: entry.ip ?? '',
                })),
              )
            }
          >
            Export CSV
          </Button>
        }
      />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField label="User" value={user} onChange={(event) => setUser(event.target.value)} />
        <TextField
          label="Action"
          value={action}
          onChange={(event) => setAction(event.target.value)}
        />
        <TextField
          type="date"
          label="From"
          InputLabelProps={{ shrink: true }}
          value={from}
          onChange={(event) => setFrom(event.target.value)}
        />
        <TextField
          type="date"
          label="To"
          InputLabelProps={{ shrink: true }}
          value={to}
          onChange={(event) => setTo(event.target.value)}
        />
      </Stack>
      <DataTable
        rows={rows}
        columns={columns}
        loading={query.isLoading}
        error={query.isError ? 'Unable to load audit entries.' : undefined}
        onRetry={() => void query.refetch()}
        pageSizeOptions={[10, 25, 50]}
      />
    </Box>
  )
}
