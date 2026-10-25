import { Box, Typography } from '@mui/material'

export function PrototypeBanner() {
  return (
    <Box sx={{ px: 3, py: 0.75, bgcolor: 'secondary.main', color: 'common.white' }}>
      <Typography variant="caption" fontWeight={600}>
        Prototype: sample data only
      </Typography>
    </Box>
  )
}
