import type {
  AuditEntry,
  CountryUpdate,
  ImpactAssessment,
  Project,
  RegulatoryItem,
  Task,
  UploadedDocument,
  User,
  WatchlistItem,
} from '../types'
export { dietarySupplements } from './dietarySupplements'

export const countries = [
  'United States',
  'European Union',
  'India',
  'United Kingdom',
  'Japan',
  'Canada',
  'Australia',
  'Brazil',
]
const categorySeeds: RegulatoryItem['category'][] = [
  'GUIDANCE',
  'REGULATION',
  'NEWS',
  'ASSOCIATION',
]
const sources = ['FDA', 'EMA', 'CDSCO', 'MHRA', 'PMDA', 'Health Canada', 'TGA', 'ANVISA']
const industries = [
  'Pharmaceuticals',
  'Biotech',
  'Medical Devices',
  'Cosmetics',
  'Nutraceuticals',
  'Food Supplements',
]
const businessAreas = [
  'Regulatory Affairs',
  'Quality',
  'CMC',
  'Clinical',
  'Pharmacovigilance',
  'Labeling',
]
export const regulatoryItems: RegulatoryItem[] = Array.from({ length: 84 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() - ((index * 6) % 540))
  return {
    id: `REG-${String(index + 1).padStart(3, '0')}`,
    title: `${sources[index % sources.length]} ${categorySeeds[index % 4]!.toLowerCase()} update ${index + 1}`,
    category: categorySeeds[index % 4]!,
    country: countries[index % countries.length]!,
    industry: industries[index % industries.length]!,
    businessArea: businessAreas[index % businessAreas.length]!,
    source: sources[index % sources.length]!,
    summary: `Sample intelligence item ${index + 1}. Review the official publication for authoritative requirements.`,
    sourceUrl: 'https://example.org/regulatory-source',
    publishedDate: date.toISOString().slice(0, 10),
    reviewStatus: (['PENDING', 'IN_REVIEW', 'REVIEWED'] as const)[index % 3]!,
    reviewer: index % 3 === 2 ? 'reviewer@pharmatool.demo' : undefined,
    lastUpdated: date.toISOString(),
  }
})

const updateTypes: CountryUpdate['type'][] = [
  'New Regulation',
  'Amendment',
  'Guidance',
  'Notification',
]
export const countryUpdates: CountryUpdate[] = Array.from({ length: 40 }, (_, index) => ({
  id: `UPD-${String(index + 1).padStart(3, '0')}`,
  country: countries[index % countries.length]!,
  type: updateTypes[index % updateTypes.length]!,
  title: `Regulatory update ${index + 1}`,
  summary: `Sample country update ${index + 1}; check the linked regulator publication for details.`,
  date: new Date(Date.now() - index * 86400000).toISOString().slice(0, 10),
}))

export const projects: Project[] = Array.from({ length: 8 }, (_, index) => ({
  id: `PRJ-${index + 1}`,
  name: [
    'Market authorization refresh',
    'Label harmonization',
    'CMC variation review',
    'Safety update',
  ][index % 4]!,
  owner: ['A. Morgan', 'J. Chen', 'R. Patel', 'S. Davis'][index % 4]!,
  country: countries[index % countries.length]!,
  status: (['Active', 'Planned', 'On Hold', 'Completed'] as const)[index % 4]!,
  progress: (index * 17 + 12) % 101,
  dueDate: new Date(Date.now() + (index - 3) * 86400000 * 20).toISOString().slice(0, 10),
}))
export const tasks: Task[] = Array.from({ length: 30 }, (_, index) => ({
  id: `TSK-${String(index + 1).padStart(3, '0')}`,
  projectId: projects[index % projects.length]!.id,
  title: `Review deliverable ${index + 1}`,
  assignee: ['A. Morgan', 'J. Chen', 'R. Patel'][index % 3]!,
  status: (['TODO', 'IN_PROGRESS', 'DONE'] as const)[index % 3]!,
  dueDate: new Date(Date.now() + (index - 8) * 86400000).toISOString().slice(0, 10),
}))

export const users: User[] = [
  {
    id: 'USR-1',
    name: 'Pharma Tool Admin',
    email: 'admin@pharmatool.demo',
    role: 'ADMIN',
    organisation: 'Pharma Tool',
    enabled: true,
  },
  {
    id: 'USR-2',
    name: 'Pharma Tool Developer',
    email: 'dev@pharmatool.demo',
    role: 'DEVELOPER',
    organisation: 'Pharma Tool',
    enabled: true,
  },
  {
    id: 'USR-3',
    name: 'Pharma Tool Client',
    email: 'client@pharmatool.demo',
    role: 'CLIENT',
    organisation: 'Client Co.',
    enabled: true,
  },
  {
    id: 'USR-4',
    name: 'Guest User',
    email: 'guest@pharmatool.demo',
    role: 'TEMP',
    organisation: 'Guest Co.',
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    enabled: true,
  },
  {
    id: 'USR-5',
    name: 'Expired Guest',
    email: 'expired@pharmatool.demo',
    role: 'TEMP',
    organisation: 'Guest Co.',
    validUntil: new Date(Date.now() - 86400000).toISOString(),
    enabled: true,
  },
]
export const auditLog: AuditEntry[] = Array.from({ length: 60 }, (_, index) => ({
  id: `AUD-${index + 1}`,
  timestamp: new Date(Date.now() - index * 3600000).toISOString(),
  userEmail: users[index % users.length]!.email,
  role: users[index % users.length]!.role,
  action: ['LOGIN', 'VIEW', 'REVIEW', 'UPLOAD', 'BOOKMARK'][index % 5]!,
  entityType: ['SESSION', 'REGULATORY_ITEM', 'DOCUMENT'][index % 3]!,
  entityId: `REG-${index + 1}`,
  ip: `192.0.2.${(index % 250) + 1}`,
}))
export const uploadedDocuments: UploadedDocument[] = []
export const impactAssessments: ImpactAssessment[] = []
export const watchlist: WatchlistItem[] = []
export const bookmarks = new Map<string, Set<string>>()
