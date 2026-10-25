import { DataGrid, type DataGridProps, type GridValidRowModel } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { EmptyState } from './EmptyState'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'

type Props<T extends GridValidRowModel> = Omit<DataGridProps<T>, 'slots'> & { error?: string; onRetry?: () => void }

export function DataTable<T extends GridValidRowModel>({ loading, rows, error, onRetry, ...props }: Props<T>) {
  if (error) return <Box sx={{ p: 2 }}><ErrorState message={error} onRetry={onRetry} /></Box>
  const tableRows = rows ?? []
  if (loading && tableRows.length === 0) return <LoadingState />
  return <DataGrid autoHeight disableRowSelectionOnClick rows={tableRows} slots={{ noRowsOverlay: EmptyState as DataGridProps<T>['slots'] extends infer S ? S extends { noRowsOverlay?: infer N } ? N : never : never }} {...props} loading={loading} />
}