import { useMemo, useState } from 'react'
import { Download, CompareArrows } from '@mui/icons-material'
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Tab, Tabs, TextField, Typography } from '@mui/material'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import type { Ingredient } from '../../types'
import { countries } from '../../mocks/db'
import { searchIngredients } from '../../api/ingredientApi'
import { useDebounce } from '../../hooks/useDebounce'
import { DataTable } from '../../components/common/DataTable'
import { CompareDialog } from '../../components/common/CompareDialog'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusChip } from '../../components/common/StatusChip'
import { downloadCsv } from '../../utils/download'

const types = ['Active API', 'Excipient', 'Preservative', 'Colorant', 'Flavour']

export function IngredientPage() {
  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')
  const [country, setCountry] = useState('')
  const [selection, setSelection] = useState<string[]>([])
  const [reportSelection, setReportSelection] = useState<string[]>([])
  const [reportCountries, setReportCountries] = useState<string[]>([])
  const [reportReady, setReportReady] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 400)
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ingredients', debouncedQuery, type, country],
    queryFn: () => searchIngredients({ q: debouncedQuery, type, country, size: 100 }),
  })
  const ingredients = data?.content ?? []
  const columns = useMemo<GridColDef<Ingredient>[]>(() => [
    { field: 'name', headerName: 'Name', minWidth: 180, flex: 1 },
    { field: 'casNumber', headerName: 'CAS Number', width: 150 },
    { field: 'type', headerName: 'Type', minWidth: 130, flex: 0.8 },
    { field: 'country', headerName: 'Country', minWidth: 150, flex: 0.8 },
    { field: 'status', headerName: 'Status', width: 150, renderCell: ({ value }) => <StatusChip status={String(value)} /> },
    { field: 'lastUpdated', headerName: 'Last Updated', width: 130 },
    { field: 'actions', type: 'actions', headerName: 'Actions', getActions: ({ row }) => [<GridActionsCellItem key="details" label="Select for compare" icon={<CompareArrows />} onClick={() => setSelection((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : current.length < 3 ? [...current, row.id] : current)} />] },
  ], [])
  const selectedIngredients = ingredients.filter((item) => selection.includes(item.id))
  const reportRows = ingredients.filter((item) => (!reportSelection.length || reportSelection.includes(item.id)) && (!reportCountries.length || reportCountries.includes(item.country)))

  return <Box>
    <PageHeader title="Ingredient DB" subtitle="Search regulatory ingredient information across markets." />
    <Paper sx={{ p: 2, mb: 2 }}><Tabs value={tab} onChange={(_, value: number) => setTab(value)}><Tab label="Search" /><Tab label="Reports" /></Tabs></Paper>
    {tab === 0 ? <>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
        <TextField label="Ingredient name, synonym or CAS" value={query} onChange={(event) => setQuery(event.target.value)} sx={{ flex: '1 1 280px' }} />
        <FormControl sx={{ minWidth: 180 }}><InputLabel>Type</InputLabel><Select label="Type" value={type} onChange={(event) => setType(event.target.value)}><MenuItem value="">All types</MenuItem>{types.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</Select></FormControl>
        <FormControl sx={{ minWidth: 190 }}><InputLabel>Country</InputLabel><Select label="Country" value={country} onChange={(event) => setCountry(event.target.value)}><MenuItem value="">All countries</MenuItem>{countries.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</Select></FormControl>
        <Button variant="outlined" disabled={selection.length < 2 || selection.length > 3} onClick={() => setCompareOpen(true)}>Compare ({selection.length})</Button>
      </Box>
      {isError ? <Alert severity="error" action={<Button onClick={() => void refetch()}>Retry</Button>}>Unable to load ingredients.</Alert> : <DataTable rows={ingredients} columns={columns} loading={isLoading} checkboxSelection rowSelectionModel={selection} onRowSelectionModelChange={(model) => setSelection(model.map(String).slice(0, 3))} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />}
      <CompareDialog open={compareOpen} onClose={() => setCompareOpen(false)} items={selectedIngredients} fields={[{ key: 'casNumber', label: 'CAS Number' }, { key: 'type', label: 'Type' }, { key: 'country', label: 'Country' }, { key: 'status', label: 'Status' }, { key: 'description', label: 'Description' }]} />
    </> : <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Ingredient report</Typography>
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
        <FormControl sx={{ minWidth: 260, flex: '1 1 260px' }}><InputLabel>Ingredients</InputLabel><Select multiple label="Ingredients" value={reportSelection} onChange={(event) => setReportSelection(event.target.value as string[])}>{ingredients.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}</Select></FormControl>
        <FormControl sx={{ minWidth: 260, flex: '1 1 260px' }}><InputLabel>Countries</InputLabel><Select multiple label="Countries" value={reportCountries} onChange={(event) => setReportCountries(event.target.value as string[])}>{countries.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</Select></FormControl>
        <Button variant="contained" onClick={() => setReportReady(true)}>Generate Report</Button>
      </Box>
      {reportReady && <><Typography color="text.secondary" sx={{ mb: 1 }}>{reportRows.length} records</Typography><Button startIcon={<Download />} onClick={() => downloadCsv('ingredient-report.csv', reportRows.map(({ name, casNumber, type: ingredientType, country: ingredientCountry, status }) => ({ Name: name, 'CAS Number': casNumber, Type: ingredientType, Country: ingredientCountry, Status: status })))}>Download CSV</Button><DataTable rows={reportRows} columns={columns.filter((column) => column.field !== 'actions')} pageSizeOptions={[10, 25]} /></>}
    </Paper>}
  </Box>
}