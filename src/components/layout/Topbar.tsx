import { useState } from 'react'
import { AccountCircle, Menu as MenuIcon, NotificationsNone } from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

const titles: Record<string, string> = {
  '/summaries': 'Summaries',
  '/dietary-supplements': 'Dietary Supplements',
  '/documents': 'Documents',
  '/summaries-dashboard': 'Summaries Dashboard',
  '/document-upload': 'Document Upload',
  '/country-updates': 'Country Updates',
  '/cmc-dashboard': 'CMC Dashboard',
  '/operations/impact-assessment': 'Impact Assessment',
  '/operations/watchlist': 'Watchlist',
  '/operations/projects': 'Projects',
  '/operations/documents': 'Project Documents',
  '/admin/users': 'User Management',
  '/admin/audit': 'Audit Log',
}

export function Topbar({
  onMenuClick,
  sidebarWidth,
}: {
  onMenuClick: () => void
  sidebarWidth: number
}) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const title = titles[location.pathname] ?? 'Pharma Tool'
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        borderBottom: '1px solid #E3E8EF',
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important', gap: 1 }}>
        <IconButton
          aria-label="Open navigation"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton aria-label="Notifications">
          <NotificationsNone />
        </IconButton>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">{user?.name}</Typography>
          {user && <Chip label={user.role} size="small" color="primary" variant="outlined" />}
        </Box>
        <IconButton aria-label="Account menu" onClick={(event) => setAnchor(event.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32 }}>
            <AccountCircle />
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <MenuItem disabled>Profile</MenuItem>
          <MenuItem
            onClick={() => {
              setAnchor(null)
              logout()
              navigate('/login', { replace: true })
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
