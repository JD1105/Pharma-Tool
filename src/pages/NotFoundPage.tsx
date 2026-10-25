import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <Box sx={{ minHeight: '55vh', display: 'grid', placeContent: 'center', textAlign: 'center', gap: 1 }}>
    <Typography variant="h2" component="p" fontWeight={700} color="primary.main">404</Typography>
    <Typography variant="h5" component="h1">Page not found</Typography>
    <Typography color="text.secondary">The requested page does not exist.</Typography>
    <Button component={Link} to="/summarize" variant="contained" sx={{ justifySelf: 'center', mt: 1 }}>Back to home</Button>
  </Box>
}