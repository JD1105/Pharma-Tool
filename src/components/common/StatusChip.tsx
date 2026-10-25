import { Chip } from '@mui/material'

const colors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  Approved: 'success', REVIEWED: 'success', Completed: 'success',
  Restricted: 'warning', PENDING: 'warning', 'In Review': 'warning', IN_REVIEW: 'warning',
  Banned: 'error', Rejected: 'error', High: 'error',
  'Under Review': 'info', Active: 'info',
}

export function StatusChip({ status }: { status: string }) {
  return <Chip size="small" variant="outlined" label={status.replaceAll('_', ' ')} color={colors[status] ?? 'default'} />
}