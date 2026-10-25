import { env } from '../config/env'
import { bookmarks, regulatoryItems, auditLog } from '../mocks/db'
import type { AuditEntry, ListParams, PagedResponse, RegulatoryItem } from '../types'
import { apiClient } from './client'
import { matchText, mockPage } from './helpers'
import { delay } from '../mocks/delay'

export async function searchRegulatoryItems(
  params: ListParams = {},
): Promise<PagedResponse<RegulatoryItem>> {
  if (!env.useMock)
    return (await apiClient.get<PagedResponse<RegulatoryItem>>('/regulatory-items', { params }))
      .data
  const rows = regulatoryItems.filter(
    (item) =>
      (!params.country || item.country === params.country) &&
      (!params.category || item.category === params.category) &&
      (!params.industry || item.industry === params.industry) &&
      (!params.businessArea || item.businessArea === params.businessArea) &&
      (!params.q || matchText(`${item.title} ${item.summary} ${item.source}`, params.q)),
  )
  return mockPage(rows, params)
}

export async function getRegulatoryItem(id: string): Promise<RegulatoryItem | undefined> {
  if (!env.useMock) return (await apiClient.get<RegulatoryItem>(`/regulatory-items/${id}`)).data
  await delay()
  return regulatoryItems.find((item) => item.id === id)
}

export async function toggleBookmark(id: string, userId = 'demo'): Promise<boolean> {
  if (!env.useMock)
    return (await apiClient.post<{ bookmarked: boolean }>(`/regulatory-items/${id}/bookmark`)).data
      .bookmarked
  await delay()
  const userBookmarks = bookmarks.get(userId) ?? new Set<string>()
  if (userBookmarks.has(id)) userBookmarks.delete(id)
  else userBookmarks.add(id)
  bookmarks.set(userId, userBookmarks)
  return userBookmarks.has(id)
}

export async function reviewRegulatoryItem(
  id: string,
  decision: 'Approved' | 'Rejected',
  comment: string,
): Promise<RegulatoryItem> {
  if (!env.useMock)
    return (
      await apiClient.post<RegulatoryItem>(`/regulatory-items/${id}/review`, { decision, comment })
    ).data
  await delay()
  const item = regulatoryItems.find((record) => record.id === id)
  if (!item) throw new Error('Regulatory item not found')
  item.reviewStatus = 'REVIEWED'
  item.reviewer = 'admin@pharmatool.demo'
  auditLog.unshift({
    id: `AUD-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userEmail: 'admin@pharmatool.demo',
    role: 'ADMIN',
    action: `${decision}: ${comment}`,
    entityType: 'REGULATORY_ITEM',
    entityId: id,
  })
  return item
}

export async function getRegulatoryActivity(id: string): Promise<AuditEntry[]> {
  if (!env.useMock)
    return (await apiClient.get<AuditEntry[]>(`/regulatory-items/${id}/activity`)).data
  await delay()
  return auditLog.filter((entry) => entry.entityId === id)
}

export function getBookmarkedIds(userId = 'demo'): string[] {
  return [...(bookmarks.get(userId) ?? new Set<string>())]
}
