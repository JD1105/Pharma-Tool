import { env } from '../config/env'
import { users } from '../mocks/db'
import type { User } from '../types'
import { apiClient } from './client'

export async function listUsers(): Promise<User[]> {
  if (!env.useMock) return (await apiClient.get<User[]>('/admin/users')).data
  return [...users]
}
export async function saveUser(value: Omit<User, 'id'> & { id?: string }): Promise<User> {
  if (!env.useMock) return (await apiClient.post<User>('/admin/users', value)).data
  const record = { ...value, id: value.id ?? `USR-${Date.now()}` }
  const existingIndex = users.findIndex((user) => user.id === record.id)
  if (existingIndex >= 0) users[existingIndex] = record
  else users.push(record)
  return record
}
