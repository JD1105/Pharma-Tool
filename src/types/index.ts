export type Role = 'ADMIN' | 'DEVELOPER' | 'CLIENT' | 'TEMP'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  organisation?: string
  validUntil?: string | null
  enabled: boolean
}

export interface DietarySupplement {
  id: string
  name: string
  synonyms: string[]
  commonName: string
  type: 'Vitamin' | 'Mineral' | 'Herbal / Botanical' | 'Amino Acid' | 'Probiotic' | 'Fatty Acid'
  country: string
  status: 'Approved' | 'Restricted' | 'Banned' | 'Under Review'
  description?: string
  lastUpdated: string
}

export type RegulatoryCategory = 'GUIDANCE' | 'REGULATION' | 'NEWS' | 'ASSOCIATION'
export type ReviewStatus = 'PENDING' | 'IN_REVIEW' | 'REVIEWED'

export interface RegulatoryItem {
  id: string
  title: string
  category: RegulatoryCategory
  country: string
  industry: string
  businessArea: string
  source: string
  summary: string
  sourceUrl?: string
  publishedDate: string
  reviewStatus: ReviewStatus
  reviewer?: string
  bookmarked?: boolean
  lastUpdated: string
}

export interface AuditEntry {
  id: string
  timestamp: string
  userEmail: string
  role: Role
  action: string
  entityType: string
  entityId?: string
  ip?: string
}

export interface UploadedDocument {
  id: string
  title: string
  fileName: string
  fileSize: number
  country: string
  documentType: string
  category: string
  industry: string
  businessArea: string
  effectiveDate: string
  uploadedBy: string
  uploadedAt: string
}

export interface CountryUpdate {
  id: string
  country: string
  type: 'New Regulation' | 'Amendment' | 'Guidance' | 'Notification'
  title: string
  summary: string
  date: string
  read?: boolean
}

export interface Project {
  id: string
  name: string
  owner: string
  country: string
  status: 'Planned' | 'Active' | 'On Hold' | 'Completed'
  progress: number
  dueDate: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  assignee: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  dueDate: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ListParams {
  page?: number
  size?: number
  q?: string
  country?: string
  category?: string
  type?: string
  industry?: string
  businessArea?: string
}

export interface DietarySupplementFilters extends ListParams {
  ids?: string[]
}

export interface LoginResult {
  token: string
  user: User
}

export interface ImpactAssessment {
  id: string
  title: string
  regulation: string
  country: string
  impactLevel: 'High' | 'Medium' | 'Low'
  owner: string
  dueDate: string
  status: string
  notes?: string
}

export interface WatchlistItem {
  id: string
  topic: string
  country: string
  lastChange: string
  newChange: boolean
}
