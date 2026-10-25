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
  { label: 'Summarize', path: '/summarize', roles: everyone },
  { label: 'Ingredient DB', path: '/ingredients', roles: everyone },
  { label: 'HUNT', path: '/hunt', roles: everyone },
  { label: 'RI Operations', path: '/ri-operations', roles: standard, children: [
    { label: 'Impact Assessment', path: '/ri-operations/impact-assessment', roles: standard },
    { label: 'Watchlist', path: '/ri-operations/watchlist', roles: standard },
    { label: 'Projects', path: '/ri-operations/projects', roles: standard },
    { label: 'Documents', path: '/ri-operations/documents', roles: standard },
  ] },
  { label: 'Summarize Dashboard', path: '/summarize-dashboard', roles: standard },
  { label: 'Document Upload', path: '/document-upload', roles: standard },
  { label: 'Country Updates', path: '/country-updates', roles: everyone },
  { label: 'CMC Dashboard', path: '/cmc-dashboard', roles: standard },
  { label: 'Admin', path: '/admin', roles: ['ADMIN', 'DEVELOPER'], children: [
    { label: 'User Management', path: '/admin/users', roles: ['ADMIN'] },
    { label: 'Audit Log', path: '/admin/audit', roles: ['ADMIN', 'DEVELOPER'] },
  ] },
]

export function getMenuForRole(role: Role): MenuItem[] {
  return menuItems.flatMap((item) => {
    if (!item.roles.includes(role)) return []
    const children = item.children?.filter((child) => child.roles.includes(role))
    return [{ ...item, ...(children ? { children } : {}) }]
  })
}