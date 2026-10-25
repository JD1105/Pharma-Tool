import { describe, expect, it } from 'vitest'
import { login } from './authApi'
import { searchIngredients } from './ingredientApi'
import { getBookmarkedIds, reviewRegulatoryItem, searchRegulatoryItems, toggleBookmark } from './regulatoryApi'
import { auditLog, countryUpdates, ingredients, projects, regulatoryItems, tasks } from '../mocks/db'
import { getMenuForRole } from '../config/menu'
import { can } from '../config/permissions'
import { uploadDocument, listDocuments } from './documentApi'
import { uploadedDocuments } from '../mocks/db'
import { listUsers, saveUser } from './userApi'
import { markCountryUpdateRead } from './countryUpdateApi'
import { addWatchlistItem, createImpactAssessment, createProject, createTask, listWatchlist, removeWatchlistItem } from './projectApi'

describe('mock API contract', () => {
  it('provides the required sample dataset sizes', () => {
    expect(ingredients).toHaveLength(52)
    expect(regulatoryItems).toHaveLength(84)
    expect(countryUpdates).toHaveLength(40)
    expect(projects).toHaveLength(8)
    expect(tasks).toHaveLength(30)
    expect(auditLog).toHaveLength(60)
  })

  it('searches synonyms and CAS numbers and paginates results', async () => {
    const found = await searchIngredients({ q: '103-90-2', size: 5 })
    expect(found.totalElements).toBeGreaterThan(0)
    expect(found.content.length).toBeLessThanOrEqual(5)
    expect(found.content[0]?.casNumber).toBe('103-90-2')
    const synonym = await searchIngredients({ q: 'paracetamol 1', size: 5 })
    expect(synonym.totalElements).toBeGreaterThan(0)
    const filtered = await searchIngredients({ type: 'Active API', country: 'United States', size: 5 })
    expect(filtered.content.every((item) => item.type === 'Active API' && item.country === 'United States')).toBe(true)
  })

  it('filters regulatory items by category and paginates', async () => {
    const page = await searchRegulatoryItems({ category: 'NEWS', size: 5 })
    expect(page.content).toHaveLength(5)
    expect(page.content.every((item) => item.category === 'NEWS')).toBe(true)
    expect(page.totalElements).toBeGreaterThan(page.content.length)
  })

  it('authenticates demo users and blocks expired temporary accounts', async () => {
    await expect(login('admin@vistar.demo', 'Demo@123')).resolves.toMatchObject({ user: { role: 'ADMIN' } })
    await expect(login('expired@vistar.demo', 'Demo@123')).rejects.toThrow(
      'Your temporary access has expired. Please contact your administrator.',
    )
  })

  it('shows the role-specific navigation and permissions', () => {
    const tempLabels = getMenuForRole('TEMP').map((item) => item.label)
    const adminLabels = getMenuForRole('ADMIN').map((item) => item.label)
    expect(tempLabels).toContain('Ingredient DB')
    expect(tempLabels).not.toContain('RI Operations')
    expect(tempLabels).not.toContain('Summarize Dashboard')
    expect(adminLabels).toContain('Admin')
    expect(can('CLIENT', 'record:review')).toBe(true)
    expect(can('TEMP', 'record:review')).toBe(false)
    expect(can('DEVELOPER', 'admin:users')).toBe(false)
  })

  it('records a review decision and adds an audit entry', async () => {
    const record = regulatoryItems[0]!
    const before = auditLog.length
    const reviewed = await reviewRegulatoryItem(record.id, 'Approved', 'Reviewed in test')
    expect(reviewed.reviewStatus).toBe('REVIEWED')
    expect(auditLog).toHaveLength(before + 1)
    expect(auditLog[0]?.entityId).toBe(record.id)
  })

  it('persists uploaded metadata in the mock document store', async () => {
    const before = uploadedDocuments.length
    const saved = await uploadDocument({
      title: 'Test document', fileName: 'sample.pdf', fileSize: 1024, country: 'India',
      documentType: 'Guidance', category: 'Regulatory', industry: 'Pharmaceuticals',
      businessArea: 'Quality', effectiveDate: '2026-10-25', uploadedBy: 'tester',
    })
    expect(saved.id).toBeTruthy()
    expect(await listDocuments()).toHaveLength(before + 1)
  })

  it('marks country updates read and adds a watchlist topic', async () => {
    const update = countryUpdates[0]!
    await markCountryUpdateRead(update.id)
    expect(update.read).toBe(true)
    await addWatchlistItem({ topic: update.title, country: update.country })
    expect((await listWatchlist())[0]).toMatchObject({ topic: update.title, country: update.country })
  })

  it('creates and removes RI Operations mock records', async () => {
    const assessment = await createImpactAssessment({ title: 'Test IA', regulation: 'Test rule', country: 'India', impactLevel: 'High', owner: 'Tester', dueDate: '2026-12-01', status: 'Open' })
    expect(assessment.id).toBeTruthy()
    const project = await createProject({ name: 'Test project', owner: 'Tester', country: 'India', status: 'Active', progress: 0, dueDate: '2026-12-01' })
    const task = await createTask({ projectId: project.id, title: 'Test task', assignee: 'Tester', status: 'TODO', dueDate: '2026-12-01' })
    expect(task.projectId).toBe(project.id)
    const watch = await addWatchlistItem({ topic: 'Remove me', country: 'India' })
    await removeWatchlistItem(watch.id)
    expect((await listWatchlist()).some((item) => item.id === watch.id)).toBe(false)
  })

  it('supports admin user management including temporary expiry', async () => {
    const created = await saveUser({ name: 'Temp Test', email: 'temp-test@vistar.demo', role: 'TEMP', organisation: 'Test Org', validUntil: '2026-12-31T00:00:00.000Z', enabled: true })
    const fetched = await listUsers()
    expect(fetched.find((user) => user.id === created.id)).toMatchObject({ email: 'temp-test@vistar.demo', role: 'TEMP', validUntil: '2026-12-31T00:00:00.000Z' })
  })

  it('persists bookmarks separately for each user', async () => {
    const itemId = regulatoryItems[1]!.id
    expect(await toggleBookmark(itemId, 'user-a')).toBe(true)
    expect(getBookmarkedIds('user-a')).toContain(itemId)
    expect(getBookmarkedIds('user-b')).not.toContain(itemId)
    expect(await toggleBookmark(itemId, 'user-a')).toBe(false)
  })
})