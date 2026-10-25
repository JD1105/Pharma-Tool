import { env } from '../config/env'
import { uploadedDocuments } from '../mocks/db'
import type { UploadedDocument } from '../types'
import { apiClient } from './client'
import { delay } from '../mocks/delay'

export async function listDocuments(): Promise<UploadedDocument[]> {
  if (!env.useMock) return (await apiClient.get<UploadedDocument[]>('/documents')).data
  await delay()
  return [...uploadedDocuments]
}

export async function uploadDocument(document: Omit<UploadedDocument, 'id' | 'uploadedAt'>, file?: File): Promise<UploadedDocument> {
  if (!env.useMock) {
    const formData = new FormData()
    formData.append('metadata', new Blob([JSON.stringify(document)], { type: 'application/json' }))
    if (file) formData.append('file', file)
    return (await apiClient.post<UploadedDocument>('/documents', formData)).data
  }
  await delay()
  const saved = { ...document, id: `DOC-${Date.now()}`, uploadedAt: new Date().toISOString() }
  uploadedDocuments.unshift(saved)
  return saved
}