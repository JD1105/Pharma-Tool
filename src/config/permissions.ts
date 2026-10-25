import type { Role } from '../types'

export type Permission =
  | 'record:review'
  | 'document:upload'
  | 'project:manage'
  | 'watchlist:manage'
  | 'country-update:manage'
  | 'admin:users'
  | 'admin:audit'
  | 'result:bookmark'
  | 'result:share'

const permissionMap: Record<Permission, Role[]> = {
  'record:review': ['ADMIN', 'DEVELOPER', 'CLIENT'],
  'document:upload': ['ADMIN', 'DEVELOPER', 'CLIENT'],
  'project:manage': ['ADMIN', 'DEVELOPER', 'CLIENT'],
  'watchlist:manage': ['ADMIN', 'DEVELOPER', 'CLIENT'],
  'country-update:manage': ['ADMIN', 'DEVELOPER', 'CLIENT'],
  'admin:users': ['ADMIN'],
  'admin:audit': ['ADMIN', 'DEVELOPER'],
  'result:bookmark': ['ADMIN', 'DEVELOPER', 'CLIENT'],
  'result:share': ['ADMIN', 'DEVELOPER', 'CLIENT'],
}

export function can(role: Role | undefined, permission: Permission): boolean {
  return role !== undefined && permissionMap[permission].includes(role)
}
