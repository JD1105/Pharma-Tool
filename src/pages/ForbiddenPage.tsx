import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function ForbiddenPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeContent: 'center',
        textAlign: 'center',
        gap: 1,
        p: 3,
      }}
    >
      <Typography variant="h2" component="p" fontWeight={700} color="error.main">
        403
      </Typography>
      <Typography variant="h5" component="h1">
        Access denied
      </Typography>
      <Typography color="text.secondary">
        Your account does not have access to this page.
      </Typography>
      <Button
        component={Link}
        to="/summaries"
        variant="contained"
        sx={{ justifySelf: 'center', mt: 1 }}
      >
        Back to home
      </Button>
    </Box>
  )
}
