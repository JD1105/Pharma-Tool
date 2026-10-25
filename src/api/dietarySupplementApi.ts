import { env } from '../config/env'
import { dietarySupplements } from '../mocks/db'
import type { DietarySupplement, DietarySupplementFilters, PagedResponse } from '../types'
import { apiClient } from './client'
import { matchText, mockPage } from './helpers'

export async function searchDietarySupplements(
  params: DietarySupplementFilters = {},
): Promise<PagedResponse<DietarySupplement>> {
  if (!env.useMock)
    return (
      await apiClient.get<PagedResponse<DietarySupplement>>('/dietary-supplements', { params })
    ).data
  const rows = dietarySupplements.filter(
    (item) =>
      (!params.country || item.country === params.country) &&
      (!params.type || item.type === params.type) &&
      (!params.q ||
        matchText(`${item.name} ${item.synonyms.join(' ')} ${item.commonName}`, params.q)),
  )
  return mockPage(rows, params)
}

export async function compareDietarySupplements(ids: string[]): Promise<DietarySupplement[]> {
  if (!env.useMock)
    return (
      await apiClient.get<DietarySupplement[]>('/dietary-supplements/compare', {
        params: { ids: ids.join(',') },
      })
    ).data
  return dietarySupplements.filter((item) => ids.includes(item.id))
}
