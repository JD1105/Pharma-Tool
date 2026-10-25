import { useState, type ChangeEvent, type DragEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Box, Button, LinearProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { CloudUpload, DeleteOutline } from '@mui/icons-material'
import { z } from 'zod'
import { uploadDocument, listDocuments } from '../../api/documentApi'
import { useToast } from '../../hooks/useToast'
import { DataTable } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { countries } from '../../mocks/db'
import type { UploadedDocument } from '../../types'
import type { GridColDef } from '@mui/x-data-grid'

const allowedTypes = new Set(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
const fileSchema = z.custom<File>((value) => value instanceof File && allowedTypes.has(value.type) && value.size <= 10 * 1024 * 1024, 'Choose a PDF, DOCX, or XLSX file up to 10 MB.')
const formSchema = z.object({
  country: z.string().min(1, 'Country is required.'), documentType: z.string().min(1, 'Document type is required.'),
  category: z.string().min(1, 'Category is required.'), industry: z.string().min(1, 'Industry is required.'),
  businessArea: z.string().min(1, 'Business area is required.'), effectiveDate: z.string().min(1, 'Effective date is required.'),
  title: z.string().min(1, 'Title is required.'), description: z.string(),
})
type FormValues = z.infer<typeof formSchema>
const initialForm: FormValues = { country: '', documentType: '', category: '', industry: '', businessArea: '', effectiveDate: '', title: '', description: '' }

export function DocumentUploadPage() {
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fileError, setFileError] = useState('')
  const [progress, setProgress] = useState(0)
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const documentsQuery = useQuery({ queryKey: ['documents'], queryFn: listDocuments })
  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = formSchema.safeParse(form)
      const parsedFile = fileSchema.safeParse(file)
      if (!parsed.success || !parsedFile.success) {
        setErrors(Object.fromEntries(parsed.success ? [] : parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])))
        setFileError(parsedFile.success ? '' : parsedFile.error.issues[0]?.message ?? 'Select a valid file.')
        throw new Error('Please correct the highlighted fields.')
      }
      setErrors({})
      setFileError('')
      setProgress(20)
      const interval = window.setInterval(() => setProgress((value) => Math.min(value + 20, 80)), 180)
      try {
        return await uploadDocument({
          ...parsed.data, fileName: parsedFile.data.name, fileSize: parsedFile.data.size,
          uploadedBy: 'Current user',
        }, parsedFile.data)
      } finally {
        window.clearInterval(interval)
      }
    },
    onSuccess: async () => {
      setProgress(100)
      setForm(initialForm)
      setFile(null)
      await queryClient.invalidateQueries({ queryKey: ['documents'] })
      showToast('Document uploaded successfully', 'success')
      window.setTimeout(() => setProgress(0), 900)
    },
    onError: (error) => { if (error.message !== 'Please correct the highlighted fields.') showToast('Unable to upload document.', 'error'); setProgress(0) },
  })
  const setValue = (key: keyof FormValues, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const acceptFile = (candidate: File | undefined) => {
    if (!candidate) return
    const result = fileSchema.safeParse(candidate)
    if (!result.success) { setFile(null); setFileError(result.error.issues[0]?.message ?? 'Choose a supported file.'); return }
    setFile(candidate)
    setFileError('')
  }
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0])
  const onDrop = (event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); acceptFile(event.dataTransfer.files[0]) }
  const columns: GridColDef<UploadedDocument>[] = [
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 180 }, { field: 'fileName', headerName: 'File', flex: 1, minWidth: 180 },
    { field: 'documentType', headerName: 'Type', width: 140 }, { field: 'country', headerName: 'Country', width: 150 },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 150 }, { field: 'uploadedAt', headerName: 'Date', width: 180 },
  ]

  return <Box>
    <PageHeader title="Document Upload" subtitle="Add regulatory documents to the intelligence library." />
    <Paper component="form" onSubmit={(event) => { event.preventDefault(); mutation.mutate() }} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
          <TextField select label="Country" value={form.country} onChange={(event) => setValue('country', event.target.value)} error={Boolean(errors.country)} helperText={errors.country}>{countries.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
          <TextField select label="Document Type" value={form.documentType} onChange={(event) => setValue('documentType', event.target.value)} error={Boolean(errors.documentType)} helperText={errors.documentType}>{['Guidance','Regulation','Notification','Dossier','Other'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
          <TextField label="Category" value={form.category} onChange={(event) => setValue('category', event.target.value)} error={Boolean(errors.category)} helperText={errors.category} />
          <TextField select label="Industry" value={form.industry} onChange={(event) => setValue('industry', event.target.value)} error={Boolean(errors.industry)} helperText={errors.industry}>{['Pharmaceuticals','Biotech','Medical Devices','Cosmetics','Nutraceuticals','Food Supplements'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
          <TextField select label="Business Area" value={form.businessArea} onChange={(event) => setValue('businessArea', event.target.value)} error={Boolean(errors.businessArea)} helperText={errors.businessArea}>{['Regulatory Affairs','Quality','CMC','Clinical','Pharmacovigilance','Labeling'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
          <TextField type="date" label="Effective Date" InputLabelProps={{ shrink: true }} value={form.effectiveDate} onChange={(event) => setValue('effectiveDate', event.target.value)} error={Boolean(errors.effectiveDate)} helperText={errors.effectiveDate} />
          <TextField label="Title" value={form.title} onChange={(event) => setValue('title', event.target.value)} error={Boolean(errors.title)} helperText={errors.title} />
          <TextField label="Description (optional)" value={form.description} onChange={(event) => setValue('description', event.target.value)} />
        </Box>
        <Box component="label" onDragOver={(event) => event.preventDefault()} onDrop={onDrop} sx={{ minHeight: 150, border: '1px dashed', borderColor: fileError ? 'error.main' : 'divider', borderRadius: 1, p: 2, display: 'grid', placeItems: 'center', textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' } }}>
          <input hidden type="file" accept=".pdf,.docx,.xlsx" onChange={onFileChange} />
          <Stack alignItems="center" spacing={1}><CloudUpload color="primary" /><Typography>{file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Drop a file here or click to browse'}</Typography><Typography variant="caption" color="text.secondary">PDF, DOCX, XLSX · Max 10 MB</Typography></Stack>
        </Box>
        <Typography variant="caption" color="text.secondary">Files are scanned before they are made available.</Typography>
        {fileError && <Alert severity="error">{fileError}</Alert>}
        {file && <Button startIcon={<DeleteOutline />} onClick={() => setFile(null)} sx={{ alignSelf: 'flex-start' }}>Remove {file.name}</Button>}
        {progress > 0 && <LinearProgress variant="determinate" value={progress} />}
        {mutation.isError && mutation.error.message === 'Please correct the highlighted fields.' && <Alert severity="error">Please correct the highlighted fields and select a supported file.</Alert>}
        <Button type="submit" variant="contained" disabled={mutation.isPending || !file} sx={{ alignSelf: 'flex-start' }}>{mutation.isPending ? 'Uploading…' : 'Upload document'}</Button>
      </Stack>
    </Paper>
    <PageHeader title="Recently uploaded" />
    <DataTable rows={documentsQuery.data ?? []} columns={columns} loading={documentsQuery.isLoading} error={documentsQuery.isError ? 'Unable to load documents.' : undefined} onRetry={() => void documentsQuery.refetch()} pageSizeOptions={[10, 25]} />
  </Box>
}