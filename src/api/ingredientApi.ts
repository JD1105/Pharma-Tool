import { env } from '../config/env'
import { ingredients } from '../mocks/db'
import type { Ingredient, IngredientFilters, PagedResponse } from '../types'
import { apiClient } from './client'
import { matchText, mockPage } from './helpers'

export async function searchIngredients(params: IngredientFilters = {}): Promise<PagedResponse<Ingredient>> {
  if (!env.useMock) return (await apiClient.get<PagedResponse<Ingredient>>('/ingredients', { params })).data
  const rows = ingredients.filter((item) =>
    (!params.country || item.country === params.country) && (!params.type || item.type === params.type) &&
    (!params.q || matchText(`${item.name} ${item.synonyms.join(' ')} ${item.casNumber}`, params.q)),
  )
  return mockPage(rows, params)
}

export async function compareIngredients(ids: string[]): Promise<Ingredient[]> {
  if (!env.useMock) return (await apiClient.get<Ingredient[]>('/ingredients/compare', { params: { ids: ids.join(',') } })).data
  return ingredients.filter((item) => ids.includes(item.id))
}