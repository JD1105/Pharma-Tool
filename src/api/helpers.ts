import type { ListParams, PagedResponse } from '../types'
import { delay } from '../mocks/delay'

export async function mockPage<T>(rows: T[], params: ListParams = {}): Promise<PagedResponse<T>> {
  await delay()
  const page = Math.max(0, params.page ?? 0)
  const size = Math.max(1, params.size ?? 10)
  return {
    content: rows.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: rows.length,
    totalPages: Math.ceil(rows.length / size),
  }
}

export function matchText(value: string, query?: string): boolean {
  return !query || value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
}