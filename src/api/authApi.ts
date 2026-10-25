import { env } from '../config/env'
import { users } from '../mocks/db'
import type { LoginResult } from '../types'
import { apiClient } from './client'
import { delay } from '../mocks/delay'

export async function login(email: string, password: string): Promise<LoginResult> {
  if (!env.useMock)
    return (await apiClient.post<LoginResult>('/auth/login', { email, password })).data
  await delay()
  const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase())
  if (!user || password !== 'Demo@123' || !user.enabled)
    throw new Error('Invalid email or password.')
  if (user.role === 'TEMP' && user.validUntil && new Date(user.validUntil) < new Date()) {
    throw new Error('Your temporary access has expired. Please contact your administrator.')
  }
  return { token: `mock-token-${user.id}`, user }
}

export async function logout(): Promise<void> {
  if (!env.useMock) await apiClient.post('/auth/logout')
  else await delay(0, 0)
}
