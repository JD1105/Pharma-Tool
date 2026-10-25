import { env } from '../config/env'
import { impactAssessments, projects, tasks, watchlist } from '../mocks/db'
import type { ImpactAssessment, Project, Task, WatchlistItem } from '../types'
import { apiClient } from './client'
import { delay } from '../mocks/delay'

export async function listProjects(): Promise<Project[]> {
  if (!env.useMock) return (await apiClient.get<Project[]>('/projects')).data
  await delay()
  return [...projects]
}
export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  if (!env.useMock) return (await apiClient.post<Project>('/projects', project)).data
  const saved = { ...project, id: `PRJ-${Date.now()}` }
  projects.unshift(saved)
  return saved
}
export async function listTasks(projectId?: string): Promise<Task[]> {
  if (!env.useMock)
    return (await apiClient.get<Task[]>(projectId ? `/projects/${projectId}/tasks` : '/tasks')).data
  await delay()
  return tasks.filter((task) => !projectId || task.projectId === projectId)
}
export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  if (!env.useMock) return (await apiClient.post<Task>('/tasks', task)).data
  const saved = { ...task, id: `TSK-${Date.now()}` }
  tasks.unshift(saved)
  return saved
}
export async function listImpactAssessments(): Promise<ImpactAssessment[]> {
  if (!env.useMock) return (await apiClient.get<ImpactAssessment[]>('/impact-assessments')).data
  await delay()
  return [...impactAssessments]
}
export async function createImpactAssessment(
  value: Omit<ImpactAssessment, 'id'>,
): Promise<ImpactAssessment> {
  if (!env.useMock)
    return (await apiClient.post<ImpactAssessment>('/impact-assessments', value)).data
  const saved = { ...value, id: `IA-${Date.now()}` }
  impactAssessments.unshift(saved)
  return saved
}
export async function listWatchlist(): Promise<WatchlistItem[]> {
  if (!env.useMock) return (await apiClient.get<WatchlistItem[]>('/watchlist')).data
  await delay()
  return [...watchlist]
}
export async function addWatchlistItem(
  value: Omit<WatchlistItem, 'id' | 'lastChange' | 'newChange'>,
): Promise<WatchlistItem> {
  if (!env.useMock) return (await apiClient.post<WatchlistItem>('/watchlist', value)).data
  const saved = {
    ...value,
    id: `WATCH-${Date.now()}`,
    lastChange: new Date().toISOString(),
    newChange: true,
  }
  watchlist.unshift(saved)
  return saved
}
export async function removeWatchlistItem(id: string): Promise<void> {
  if (!env.useMock) {
    await apiClient.delete(`/watchlist/${id}`)
    return
  }
  await delay()
  const index = watchlist.findIndex((item) => item.id === id)
  if (index >= 0) watchlist.splice(index, 1)
}
