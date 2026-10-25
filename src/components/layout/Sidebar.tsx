import { useState } from 'react'
import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material'
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { NavLink, useLocation } from 'react-router-dom'
import { getMenuForRole } from '../../config/menu'
import { useAuth } from '../../auth/useAuth'

const drawerWidth = 260

function MenuContent({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const { user } = useAuth()
  const location = useLocation()
  const items = user ? getMenuForRole(user.role) : []
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  return (
    <Box
      sx={{
        width: collapsed ? 64 : drawerWidth,
        height: '100%',
        bgcolor: 'primary.main',
        color: 'common.white',
        transition: 'width 180ms',
      }}
    >
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'rgba(255,255,255,.16)',
        }}
      >
        {!collapsed && (
          <Typography variant="h6" fontWeight={700}>
            Pharma Tool
          </Typography>
        )}
      </Box>
      <List sx={{ px: 1, py: 2 }}>
        {items.map((item) => {
          const active =
            location.pathname === item.path ||
            Boolean(item.children?.some((child) => location.pathname === child.path))
          const content = (
            <ListItemButton
              component={item.children ? 'button' : NavLink}
              to={item.children ? undefined : item.path}
              selected={active}
              onClick={() =>
                item.children
                  ? setExpanded((current) => ({ ...current, [item.label]: !current[item.label] }))
                  : onNavigate?.()
              }
              sx={{
                color: 'inherit',
                borderRadius: 1,
                '&.Mui-selected': { bgcolor: 'rgba(255,255,255,.16)' },
                '&.Mui-selected:hover': { bgcolor: 'rgba(255,255,255,.2)' },
              }}
            >
              <ListItemText
                primary={collapsed ? item.label.slice(0, 1) : item.label}
                primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }}
              />
              {!collapsed &&
                item.children &&
                (expanded[item.label] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          )
          return (
            <Box key={item.path}>
              {collapsed ? (
                <Tooltip title={item.label} placement="right">
                  {content}
                </Tooltip>
              ) : (
                content
              )}
              {item.children && !collapsed && (
                <Collapse in={expanded[item.label] ?? active} timeout="auto" unmountOnExit>
                  <List disablePadding sx={{ pl: 2 }}>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={NavLink}
                        to={child.path}
                        onClick={onNavigate}
                        selected={location.pathname === child.path}
                        sx={{
                          color: 'inherit',
                          borderRadius: 1,
                          '&.Mui-selected': { bgcolor: 'rgba(255,255,255,.16)' },
                        }}
                      >
                        <ListItemText
                          primary={child.label}
                          primaryTypographyProps={{ fontSize: 13 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          )
        })}
      </List>
    </Box>
  )
}

export function Sidebar({
  mobileOpen,
  onMobileClose,
  collapsed,
  onToggle,
}: {
  mobileOpen: boolean
  onMobileClose: () => void
  collapsed: boolean
  onToggle: () => void
}) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))
  if (mobile)
    return (
      <Drawer open={mobileOpen} onClose={onMobileClose} PaperProps={{ sx: { border: 0 } }}>
        <MenuContent onNavigate={onMobileClose} />
      </Drawer>
    )
  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? 64 : drawerWidth,
        flexShrink: 0,
        position: 'fixed',
        inset: '0 auto 0 0',
        zIndex: theme.zIndex.drawer,
        transition: 'width 180ms',
      }}
    >
      <MenuContent collapsed={collapsed} />
      <IconButton
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={onToggle}
        sx={{ position: 'absolute', bottom: 12, right: 12, color: 'common.white' }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  )
}
