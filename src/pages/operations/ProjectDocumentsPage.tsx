import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, TextField } from '@mui/material'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Download } from '@mui/icons-material'
import type { GridColDef } from '@mui/x-data-grid'
import { listDocuments } from '../../api/documentApi'
import { DataTable } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import type { UploadedDocument } from '../../types'
import { useDebounce } from '../../hooks/useDebounce'

export function ProjectDocumentsPage() {
  const [query, setQuery] = useState('')
  const search = useDebounce(query, 400)
  const documents = useQuery({ queryKey: ['documents'], queryFn: listDocuments })
  const rows = (documents.data ?? []).filter((item) =>
    `${item.title} ${item.fileName} ${item.country}`.toLowerCase().includes(search.toLowerCase()),
  )
  const columns = useMemo<GridColDef<UploadedDocument>[]>(
    () => [
      { field: 'title', headerName: 'Name', flex: 1, minWidth: 180 },
      { field: 'documentType', headerName: 'Type', width: 140 },
      {
        field: 'project',
        headerName: 'Project',
        width: 150,
        valueGetter: () => 'Regulatory library',
      },
      { field: 'uploadedBy', headerName: 'Uploaded By', width: 150 },
      { field: 'uploadedAt', headerName: 'Date', width: 180 },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="download"
            label="Download"
            icon={<Download />}
            onClick={() => {
              const content = new Blob(
                [`Document: ${row.title}\nFile: ${row.fileName}\nCountry: ${row.country}`],
                { type: 'text/plain' },
              )
              const link = document.createElement('a')
              link.href = URL.createObjectURL(content)
              link.download = row.fileName
              link.click()
              URL.revokeObjectURL(link.href)
            }}
          />,
        ],
      },
    ],
    [],
  )
  return (
    <Box>
      <PageHeader
        title="Project Documents"
        subtitle="Search project and regulatory library documents."
      />
      <TextField
        label="Search documents"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        sx={{ mb: 2, width: { xs: '100%', sm: 360 } }}
      />
      <DataTable
        rows={rows}
        columns={columns}
        loading={documents.isLoading}
        error={documents.isError ? 'Unable to load documents.' : undefined}
        onRetry={() => void documents.refetch()}
        pageSizeOptions={[10, 25]}
      />
    </Box>
  )
}
