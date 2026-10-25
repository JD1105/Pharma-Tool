import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { getBookmarkedIds, searchRegulatoryItems, toggleBookmark } from '../../api/regulatoryApi'
import { countries } from '../../mocks/db'
import { useAuth } from '../../auth/useAuth'
import { DataTable } from '../../components/common/DataTable'
import { ResultActions } from '../../components/common/ResultActions'
import { PageHeader } from '../../components/layout/PageHeader'
import { useDebounce } from '../../hooks/useDebounce'
import type { RegulatoryItem } from '../../types'
import type { GridColDef } from '@mui/x-data-grid'

type HuntCategory = 'GUIDANCE_REGULATION' | 'NEWS' | 'ASSOCIATION'
const categories: { label: string; value: HuntCategory }[] = [
  { label: 'Guidances & Regulations', value: 'GUIDANCE_REGULATION' },
  { label: 'Updates / News', value: 'NEWS' },
  { label: 'Associations', value: 'ASSOCIATION' },
]

export function HuntPage() {
  const [category, setCategory] = useState<HuntCategory>('GUIDANCE_REGULATION')
  const [country, setCountry] = useState('')
  const [query, setQuery] = useState('')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const debouncedQuery = useDebounce(query, 400)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hunt', category, country, debouncedQuery],
    queryFn: () => searchRegulatoryItems({ category: category === 'GUIDANCE_REGULATION' ? undefined : category, country, q: debouncedQuery, size: 100 }),
  })
  const categoryRows = (data?.content ?? []).filter((item) => category !== 'GUIDANCE_REGULATION' || item.category === 'GUIDANCE' || item.category === 'REGULATION')
  const rows = categoryRows.filter((item) => {
    if (!bookmarkedOnly) return true
    return getBookmarkedIds(user?.id).includes(item.id)
  })
  const columns = useMemo<GridColDef<RegulatoryItem>[]>(() => [
    { field: 'title', headerName: 'Title', minWidth: 250, flex: 1, renderCell: ({ row }) => <Box sx={{ py: 1 }}><Typography fontWeight={700}>{row.title}</Typography><Typography variant="body2" color="text.secondary">{row.summary}</Typography></Box> },
    { field: 'source', headerName: 'Source', width: 140 },
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'publishedDate', headerName: 'Published', width: 120 },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 145, getActions: ({ row }) => [<ResultActions key={row.id} title={row.title} url={row.sourceUrl} onDownload={() => {
      const file = new Blob([`${row.title}\n\n${row.summary}\nSource: ${row.source}`], { type: 'text/plain' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = `${row.id}.txt`
      link.click()
      URL.revokeObjectURL(link.href)
    }} onBookmark={async () => { const result = await toggleBookmark(row.id, user?.id); await queryClient.invalidateQueries({ queryKey: ['hunt'] }); return result }} />] },
  ], [user?.id, queryClient])

  return <Box>
    <PageHeader title="HUNT" subtitle="Discover guidance, regulatory updates, and industry associations." />
    <Paper sx={{ p: 2, mb: 2 }}>
      <Tabs value={category} onChange={(_, value: HuntCategory) => setCategory(value)} variant="scrollable" allowScrollButtonsMobile>
        {categories.map((item) => <Tab key={item.value} label={item.label} value={item.value} />)}
      </Tabs>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
        <TextField label="Search keywords" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth />
        <FormControl sx={{ minWidth: 210 }}><InputLabel>Country</InputLabel><Select label="Country" value={country} onChange={(event) => setCountry(event.target.value)}><MenuItem value="">All countries</MenuItem>{countries.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
        <Button variant={bookmarkedOnly ? 'contained' : 'outlined'} onClick={() => setBookmarkedOnly((value) => !value)}>Bookmarked only</Button>
      </Stack>
    </Paper>
    <DataTable rows={rows} columns={columns} loading={isLoading} error={isError ? 'Unable to load regulatory intelligence.' : undefined} onRetry={() => void refetch()} getRowHeight={() => 'auto'} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
  </Box>
}