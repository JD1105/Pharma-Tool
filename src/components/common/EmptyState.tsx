import { Box, Typography } from '@mui/material'

export function EmptyState({ title = 'No results match your filters.', description }: { title?: string; description?: string }) {
  return <Box sx={{ py: 6, textAlign: 'center' }}><Typography fontWeight={700}>{title}</Typography>{description && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{description}</Typography>}</Box>
}