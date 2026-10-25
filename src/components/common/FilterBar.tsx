import { Box, Button, Stack } from '@mui/material'
import type { ReactNode } from 'react'

export function FilterBar({ children, onApply, onReset }: { children: ReactNode; onApply: () => void; onReset: () => void }) {
  return <Box component="form" onSubmit={(event) => { event.preventDefault(); onApply() }} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }} flexWrap="wrap">
      {children}<Box sx={{ flexGrow: 1 }} /><Button type="submit" variant="contained">Apply</Button><Button type="button" onClick={onReset}>Reset</Button>
    </Stack>
  </Box>
}