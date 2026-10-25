import { Box, CircularProgress, Typography } from '@mui/material'

export function LoadingState({ label = 'Loading data' }: { label?: string }) {
  return (
    <Box
      role="status"
      sx={{ py: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1.5 }}
    >
      <CircularProgress size={22} />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  )
}
