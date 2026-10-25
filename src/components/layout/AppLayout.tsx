import { useState, type ReactNode } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { PrototypeBanner } from '../common/PrototypeBanner'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Toast } from '../feedback/Toast'

export function AppLayout({ children }: { children?: ReactNode }) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const sidebarWidth = collapsed ? 64 : 260
  const expires = user?.role === 'TEMP' && user.validUntil ? new Date(user.validUntil).toLocaleDateString() : null
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <Topbar onMenuClick={() => setMobileOpen(true)} sidebarWidth={mobile ? 0 : sidebarWidth} />
      <Box component="main" sx={{ ml: { md: `${sidebarWidth}px` }, pt: '64px', transition: 'margin 180ms' }}>
        {user?.role === 'TEMP' && expires && <Box sx={{ bgcolor: 'warning.light', color: 'common.black', px: 3, py: 1, fontSize: 13 }}>Temporary access: expires on {expires}</Box>}
        <PrototypeBanner />
        <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 3 } }}>{children ?? <Outlet />}</Box>
      </Box>
      <Toast />
    </Box>
  )
}