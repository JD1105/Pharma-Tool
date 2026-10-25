import type { Role } from '../types'

export interface MenuItem {
  label: string
  path: string
  roles: Role[]
  children?: MenuItem[]
}

const everyone: Role[] = ['ADMIN', 'DEVELOPER', 'CLIENT', 'TEMP']
const standard: Role[] = ['ADMIN', 'DEVELOPER', 'CLIENT']

export const menuItems: MenuItem[] = [
  { label: 'Summaries', path: '/summaries', roles: everyone },
  { label: 'Dietary Supplements', path: '/dietary-supplements', roles: everyone },
  { label: 'Documents', path: '/documents', roles: everyone },
  {
    label: 'Operations',
    path: '/operations',
    roles: standard,
    children: [
      { label: 'Impact Assessment', path: '/operations/impact-assessment', roles: standard },
      { label: 'Watchlist', path: '/operations/watchlist', roles: standard },
      { label: 'Projects', path: '/operations/projects', roles: standard },
      { label: 'Project Documents', path: '/operations/documents', roles: standard },
    ],
  },
  { label: 'Summaries Dashboard', path: '/summaries-dashboard', roles: standard },
  { label: 'Document Upload', path: '/document-upload', roles: standard },
  { label: 'Country Updates', path: '/country-updates', roles: everyone },
  { label: 'CMC Dashboard', path: '/cmc-dashboard', roles: standard },
  {
    label: 'Admin',
    path: '/admin',
    roles: ['ADMIN', 'DEVELOPER'],
    children: [
      { label: 'User Management', path: '/admin/users', roles: ['ADMIN'] },
      { label: 'Audit Log', path: '/admin/audit', roles: ['ADMIN', 'DEVELOPER'] },
    ],
  },
]

export function getMenuForRole(role: Role): MenuItem[] {
  return menuItems.flatMap((item) => {
    if (!item.roles.includes(role)) return []
    const children = item.children?.filter((child) => child.roles.includes(role))
    return [{ ...item, ...(children ? { children } : {}) }]
  })
}
