import type {
  AuditEntry, CountryUpdate, Ingredient, ImpactAssessment, Project, RegulatoryItem,
  Task, UploadedDocument, User, WatchlistItem,
} from '../types'

export const countries = [
  'United States', 'European Union', 'India', 'United Kingdom', 'Japan', 'Canada', 'Australia', 'Brazil',
]
const ingredientSeeds = [
  ['Paracetamol', '103-90-2', 'Active API'], ['Ibuprofen', '15687-27-1', 'Active API'],
  ['Lactose Monohydrate', '64044-51-5', 'Excipient'], ['Magnesium Stearate', '557-04-0', 'Excipient'],
  ['Microcrystalline Cellulose', '9004-34-6', 'Excipient'], ['Titanium Dioxide', '13463-67-7', 'Colorant'],
  ['Methylparaben', '99-76-3', 'Preservative'], ['Povidone', '9003-39-8', 'Excipient'],
  ['Ascorbic Acid', '50-81-7', 'Active API'], ['Sodium Benzoate', '532-32-1', 'Preservative'],
  ['Citric Acid', '77-92-9', 'Excipient'], ['Stearic Acid', '57-11-4', 'Excipient'],
  ['Propylparaben', '94-13-3', 'Preservative'], ['Brilliant Blue FCF', '3844-45-9', 'Colorant'],
  ['Vanillin', '121-33-5', 'Flavour'], ['Menthol', '89-78-1', 'Flavour'],
  ['Amoxicillin', '26787-78-0', 'Active API'], ['Omeprazole', '73590-58-6', 'Active API'],
  ['Sorbitol', '50-70-4', 'Excipient'], ['Pectin', '9000-69-5', 'Excipient'],
  ['Dextrose', '50-99-7', 'Excipient'], ['Talc', '14807-96-6', 'Excipient'],
  ['Iron Oxide Red', '1309-37-1', 'Colorant'], ['Sucralose', '56038-13-2', 'Flavour'],
  ['Sodium Chloride', '7647-14-5', 'Excipient'], ['Calcium Carbonate', '471-34-1', 'Excipient'],
]
const statuses = ['Approved', 'Restricted', 'Banned', 'Under Review'] as const
export const ingredients: Ingredient[] = Array.from({ length: 52 }, (_, index) => {
  const seed = ingredientSeeds[index % ingredientSeeds.length]!
  return {
    id: `ING-${String(index + 1).padStart(3, '0')}`, name: seed[0]!, synonyms: [seed[0]!, `${seed[0]} ${index + 1}`],
    casNumber: seed[1]!, type: seed[2] as Ingredient['type'], country: countries[index % countries.length]!,
    status: statuses[index % statuses.length]!,
    description: `Sample regulatory profile for ${seed[0]}. Verify against official sources.`,
    lastUpdated: new Date(Date.now() - index * 86400000).toISOString().slice(0, 10),
  }
})

const categorySeeds: RegulatoryItem['category'][] = ['GUIDANCE', 'REGULATION', 'NEWS', 'ASSOCIATION']
const sources = ['FDA', 'EMA', 'CDSCO', 'MHRA', 'PMDA', 'Health Canada', 'TGA', 'ANVISA']
const industries = ['Pharmaceuticals', 'Biotech', 'Medical Devices', 'Cosmetics', 'Nutraceuticals', 'Food Supplements']
const businessAreas = ['Regulatory Affairs', 'Quality', 'CMC', 'Clinical', 'Pharmacovigilance', 'Labeling']
export const regulatoryItems: RegulatoryItem[] = Array.from({ length: 84 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() - (index * 6) % 540)
  return {
    id: `REG-${String(index + 1).padStart(3, '0')}`,
    title: `${sources[index % sources.length]} ${categorySeeds[index % 4]!.toLowerCase()} update ${index + 1}`,
    category: categorySeeds[index % 4]!, country: countries[index % countries.length]!,
    industry: industries[index % industries.length]!, businessArea: businessAreas[index % businessAreas.length]!,
    source: sources[index % sources.length]!,
    summary: `Sample intelligence item ${index + 1}. Review the official publication for authoritative requirements.`,
    sourceUrl: 'https://example.org/regulatory-source', publishedDate: date.toISOString().slice(0, 10),
    reviewStatus: (['PENDING', 'IN_REVIEW', 'REVIEWED'] as const)[index % 3]!,
    reviewer: index % 3 === 2 ? 'reviewer@vistar.demo' : undefined, lastUpdated: date.toISOString(),
  }
})

const updateTypes: CountryUpdate['type'][] = ['New Regulation', 'Amendment', 'Guidance', 'Notification']
export const countryUpdates: CountryUpdate[] = Array.from({ length: 40 }, (_, index) => ({
  id: `UPD-${String(index + 1).padStart(3, '0')}`, country: countries[index % countries.length]!,
  type: updateTypes[index % updateTypes.length]!, title: `Regulatory update ${index + 1}`,
  summary: `Sample country update ${index + 1}; check the linked regulator publication for details.`,
  date: new Date(Date.now() - index * 86400000).toISOString().slice(0, 10),
}))

export const projects: Project[] = Array.from({ length: 8 }, (_, index) => ({
  id: `PRJ-${index + 1}`, name: ['Market authorization refresh', 'Label harmonization', 'CMC variation review', 'Safety update'][index % 4]!,
  owner: ['A. Morgan', 'J. Chen', 'R. Patel', 'S. Davis'][index % 4]!, country: countries[index % countries.length]!,
  status: (['Active', 'Planned', 'On Hold', 'Completed'] as const)[index % 4]!, progress: (index * 17 + 12) % 101,
  dueDate: new Date(Date.now() + (index - 3) * 86400000 * 20).toISOString().slice(0, 10),
}))
export const tasks: Task[] = Array.from({ length: 30 }, (_, index) => ({
  id: `TSK-${String(index + 1).padStart(3, '0')}`, projectId: projects[index % projects.length]!.id,
  title: `Review deliverable ${index + 1}`, assignee: ['A. Morgan', 'J. Chen', 'R. Patel'][index % 3]!,
  status: (['TODO', 'IN_PROGRESS', 'DONE'] as const)[index % 3]!,
  dueDate: new Date(Date.now() + (index - 8) * 86400000).toISOString().slice(0, 10),
}))

export const users: User[] = [
  { id: 'USR-1', name: 'Vistar Admin', email: 'admin@vistar.demo', role: 'ADMIN', organisation: 'Vistar', enabled: true },
  { id: 'USR-2', name: 'Developer', email: 'dev@vistar.demo', role: 'DEVELOPER', organisation: 'Vistar', enabled: true },
  { id: 'USR-3', name: 'Client User', email: 'client@vistar.demo', role: 'CLIENT', organisation: 'Client Co.', enabled: true },
  { id: 'USR-4', name: 'Guest User', email: 'guest@vistar.demo', role: 'TEMP', organisation: 'Guest Co.', validUntil: new Date(Date.now() + 7 * 86400000).toISOString(), enabled: true },
  { id: 'USR-5', name: 'Expired Guest', email: 'expired@vistar.demo', role: 'TEMP', organisation: 'Guest Co.', validUntil: new Date(Date.now() - 86400000).toISOString(), enabled: true },
]
export const auditLog: AuditEntry[] = Array.from({ length: 60 }, (_, index) => ({
  id: `AUD-${index + 1}`, timestamp: new Date(Date.now() - index * 3600000).toISOString(),
  userEmail: users[index % users.length]!.email, role: users[index % users.length]!.role,
  action: ['LOGIN', 'VIEW', 'REVIEW', 'UPLOAD', 'BOOKMARK'][index % 5]!,
  entityType: ['SESSION', 'REGULATORY_ITEM', 'DOCUMENT'][index % 3]!, entityId: `REG-${index + 1}`,
  ip: `192.0.2.${index % 250 + 1}`,
}))
export const uploadedDocuments: UploadedDocument[] = []
export const impactAssessments: ImpactAssessment[] = []
export const watchlist: WatchlistItem[] = []
export const bookmarks = new Map<string, Set<string>>()