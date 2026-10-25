import { env } from '../config/env'
import { auditLog } from '../mocks/db'
import type { AuditEntry } from '../types'
import { apiClient } from './client'
import { delay } from '../mocks/delay'

export async function listAuditEntries(): Promise<AuditEntry[]> {
  if (!env.useMock) return (await apiClient.get<AuditEntry[]>('/admin/audit')).data
  await delay()
  return [...auditLog]
}
