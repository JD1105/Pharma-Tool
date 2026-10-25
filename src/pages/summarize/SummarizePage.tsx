import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { type GridColDef } from '@mui/x-data-grid'
import { searchRegulatoryItems } from '../../api/regulatoryApi'
import { countries } from '../../mocks/db'
import { DataTable } from '../../components/common/DataTable'
import { CompareDialog } from '../../components/common/CompareDialog'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusChip } from '../../components/common/StatusChip'
import { useDebounce } from '../../hooks/useDebounce'
import type { RegulatoryItem } from '../../types'

const industries = ['Pharmaceuticals', 'Biotech', 'Medical Devices', 'Cosmetics', 'Nutraceuticals', 'Food Supplements']
const businessAreas = ['Regulatory Affairs', 'Quality', 'CMC', 'Clinical', 'Pharmacovigilance', 'Labeling']

export function SummarizePage() {
  const [query, setQuery] = useState('')
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selection, setSelection] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 400)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['summarize', debouncedQuery, selectedIndustries, selectedAreas, selectedCountries],
    queryFn: () => searchRegulatoryItems({ q: debouncedQuery, size: 100 }),
  })
  const rows = (data?.content ?? []).filter((item) =>
    (!selectedIndustries.length || selectedIndustries.includes(item.industry)) &&
    (!selectedAreas.length || selectedAreas.includes(item.businessArea)) &&
    (!selectedCountries.length || selectedCountries.includes(item.country)),
  )
  const counts = useMemo(() => ({
    Results: data?.totalElements ?? 0,
    Guidance: (data?.content ?? []).filter((item) => item.category === 'GUIDANCE').length,
    Regulations: (data?.content ?? []).filter((item) => item.category === 'REGULATION').length,
  }), [data])
  const columns = useMemo<GridColDef<RegulatoryItem>[]>(() => [
    { field: 'title', headerName: 'Title', minWidth: 240, flex: 1 }, { field: 'country', headerName: 'Country', width: 150 },
    { field: 'industry', headerName: 'Industry', width: 170 }, { field: 'summary', headerName: 'Summary', minWidth: 300, flex: 1.2 },
    { field: 'publishedDate', headerName: 'Date', width: 130 },
    { field: 'reviewStatus', headerName: 'Status', width: 140, renderCell: ({ value }) => <StatusChip status={String(value)} /> },
  ], [])
  const compareItems = rows.filter((item) => selection.includes(item.id))
  const reset = () => { setQuery(''); setSelectedIndustries([]); setSelectedAreas([]); setSelectedCountries([]); setSelection([]) }

  return <Box>
    <PageHeader title="Summarize" subtitle="Search and compare regulatory intelligence across markets." />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
      {Object.entries(counts).map(([label, value]) => <Card key={label}><CardContent><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h5" fontWeight={700}>{value}</Typography></CardContent></Card>)}
    </Box>
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack spacing={1.5}>
        <TextField label="Search keywords" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
          <FormControl><InputLabel>Industry</InputLabel><Select multiple label="Industry" value={selectedIndustries} onChange={(event) => setSelectedIndustries(event.target.value as string[])}>{industries.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
          <FormControl><InputLabel>Business Area</InputLabel><Select multiple label="Business Area" value={selectedAreas} onChange={(event) => setSelectedAreas(event.target.value as string[])}>{businessAreas.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
          <FormControl><InputLabel>Country</InputLabel><Select multiple label="Country" value={selectedCountries} onChange={(event) => setSelectedCountries(event.target.value as string[])}>{countries.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
        </Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="body2" color="text.secondary">{rows.length} matching records</Typography><Stack direction="row" spacing={1}><Button onClick={reset}>Reset</Button><Button variant="contained" disabled={selection.length < 2 || selection.length > 3} onClick={() => setCompareOpen(true)}>Compare ({selection.length})</Button></Stack></Stack>
      </Stack>
    </Paper>
    <DataTable rows={rows} columns={columns} loading={isLoading} error={isError ? 'Unable to load regulatory records.' : undefined} onRetry={() => void refetch()} checkboxSelection rowSelectionModel={selection} onRowSelectionModelChange={(model) => setSelection(model.map(String).slice(0, 3))} getRowHeight={() => 'auto'} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
    <CompareDialog open={compareOpen} onClose={() => setCompareOpen(false)} items={compareItems} fields={[{ key: 'country', label: 'Country' }, { key: 'industry', label: 'Industry' }, { key: 'businessArea', label: 'Business Area' }, { key: 'summary', label: 'Summary' }, { key: 'publishedDate', label: 'Date' }, { key: 'reviewStatus', label: 'Status' }]} />
  </Box>
}