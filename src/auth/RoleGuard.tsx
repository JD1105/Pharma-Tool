import { Navigate, Outlet } from 'react-router-dom'
import type { Role } from '../types'
import { useAuth } from './useAuth'

export function RoleGuard({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user } = useAuth()
  return user && allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/forbidden" replace />
}