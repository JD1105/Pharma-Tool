import { env } from '../config/env'
import { countryUpdates } from '../mocks/db'
import type { CountryUpdate, ListParams, PagedResponse } from '../types'
import { apiClient } from './client'
import { matchText, mockPage } from './helpers'

export async function listCountryUpdates(params: ListParams = {}): Promise<PagedResponse<CountryUpdate>> {
  if (!env.useMock) return (await apiClient.get<PagedResponse<CountryUpdate>>('/country-updates', { params })).data
  const rows = countryUpdates.filter((row) =>
    (!params.country || row.country === params.country) && (!params.type || row.type === params.type) &&
    (!params.q || matchText(`${row.title} ${row.summary}`, params.q)),
  )
  return mockPage(rows, params)
}

export async function markCountryUpdateRead(id: string): Promise<CountryUpdate | undefined> {
  if (!env.useMock) return (await apiClient.patch<CountryUpdate>(`/country-updates/${id}/read`)).data
  const row = countryUpdates.find((item) => item.id === id)
  if (row) row.read = true
  return row
}