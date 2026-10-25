import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid'
import { History, OpenInNew, RateReview } from '@mui/icons-material'
import { searchRegulatoryItems, getRegulatoryActivity, reviewRegulatoryItem } from '../../api/regulatoryApi'
import { useAuth } from '../../auth/useAuth'
import { can } from '../../config/permissions'
import { DataTable } from '../../components/common/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusChip } from '../../components/common/StatusChip'
import { useDebounce } from '../../hooks/useDebounce'
import type { RegulatoryItem, ReviewStatus } from '../../types'

export function SummarizeDashboardPage() {
  const [country, setCountry] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<RegulatoryItem | null>(null)
  const [activityId, setActivityId] = useState('')
  const [reviewItem, setReviewItem] = useState<RegulatoryItem | null>(null)
  const [decision, setDecision] = useState<'Approved' | 'Rejected'>('Approved')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const debouncedQuery = useDebounce(query, 400)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['summarize-dashboard', country, category, status, debouncedQuery],
    queryFn: () => searchRegulatoryItems({ country, category, q: debouncedQuery, size: 100 }),
  })
  const rows = (data?.content ?? []).filter((item) => !status || item.reviewStatus === status)
  const activityQuery = useQuery({ queryKey: ['activity', activityId], queryFn: () => getRegulatoryActivity(activityId), enabled: Boolean(activityId) })
  const counts = useMemo(() => ({
    Total: data?.totalElements ?? 0,
    Pending: (data?.content ?? []).filter((item) => item.reviewStatus === 'PENDING').length,
    'In Review': (data?.content ?? []).filter((item) => item.reviewStatus === 'IN_REVIEW').length,
    Reviewed: (data?.content ?? []).filter((item) => item.reviewStatus === 'REVIEWED').length,
  }), [data])
  const saveReview = async () => {
    if (!reviewItem) return
    setError('')
    try {
      await reviewRegulatoryItem(reviewItem.id, decision, comment)
      await queryClient.invalidateQueries({ queryKey: ['summarize-dashboard'] })
      setReviewItem(null)
      setComment('')
    } catch {
      setError('Unable to save this review.')
    }
  }
  const columns = useMemo<GridColDef<RegulatoryItem>[]>(() => [
    { field: 'id', headerName: 'ID', width: 110 }, { field: 'title', headerName: 'Title', minWidth: 220, flex: 1 },
    { field: 'category', headerName: 'Category', width: 140 }, { field: 'country', headerName: 'Country', width: 140 },
    { field: 'reviewStatus', headerName: 'Status', width: 130, renderCell: ({ value }) => <StatusChip status={String(value)} /> },
    { field: 'reviewer', headerName: 'Reviewer', width: 180 }, { field: 'lastUpdated', headerName: 'Last Updated', width: 150 },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: can(user?.role, 'record:review') ? 150 : 110, getActions: ({ row }) => [
      <GridActionsCellItem key="view" label="View" icon={<OpenInNew />} onClick={() => setSelected(row)} />,
      <GridActionsCellItem key="activity" label="View Activity" icon={<History />} onClick={() => setActivityId(row.id)} />,
      ...(can(user?.role, 'record:review') ? [<GridActionsCellItem key="review" label="Review" icon={<RateReview />} onClick={() => setReviewItem(row)} />] : []),
    ] },
  ], [user?.role])

  return <Box>
    <PageHeader title="Summarize Dashboard" subtitle="Review and track regulatory intelligence records." />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
      {Object.entries(counts).map(([label, value]) => <Card key={label}><CardContent><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" fontWeight={700}>{value}</Typography></CardContent></Card>)}
    </Box>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
      <TextField label="Keyword" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth />
      <FormControl sx={{ minWidth: 160 }}><InputLabel>Country</InputLabel><Select label="Country" value={country} onChange={(event) => setCountry(event.target.value)}><MenuItem value="">All</MenuItem>{['United States','European Union','India','United Kingdom','Japan','Canada','Australia','Brazil'].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</Select></FormControl>
      <FormControl sx={{ minWidth: 150 }}><InputLabel>Category</InputLabel><Select label="Category" value={category} onChange={(event) => setCategory(event.target.value)}><MenuItem value="">All</MenuItem>{['GUIDANCE','REGULATION','NEWS','ASSOCIATION'].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}</Select></FormControl>
      <FormControl sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}><MenuItem value="">All</MenuItem>{(['PENDING','IN_REVIEW','REVIEWED'] as ReviewStatus[]).map((value) => <MenuItem key={value} value={value}>{value.replace('_',' ')}</MenuItem>)}</Select></FormControl>
    </Stack>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <DataTable rows={rows} columns={columns} loading={isLoading} error={isError ? 'Unable to load records.' : undefined} onRetry={() => void refetch()} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
    <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)} PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, p: 3 } }}>
      {selected && <Stack spacing={2}><Typography variant="h6">{selected.title}</Typography><Chip label={selected.country} sx={{ alignSelf: 'flex-start' }} /><Typography>{selected.summary}</Typography><Typography variant="body2">Source: {selected.source}</Typography><Typography variant="body2">Published: {selected.publishedDate}</Typography><Button onClick={() => setSelected(null)}>Close</Button></Stack>}
    </Drawer>
    <Dialog open={Boolean(activityId)} onClose={() => setActivityId('')} fullWidth maxWidth="sm"><DialogTitle>Record activity</DialogTitle><DialogContent dividers>{activityQuery.isLoading ? <Typography>Loading activity…</Typography> : activityQuery.data?.length ? activityQuery.data.map((entry) => <Box key={entry.id} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}><Typography fontWeight={600}>{entry.action}</Typography><Typography variant="body2" color="text.secondary">{entry.userEmail} · {new Date(entry.timestamp).toLocaleString()}</Typography></Box>) : <Typography color="text.secondary">No activity recorded.</Typography>}</DialogContent><DialogActions><Button onClick={() => setActivityId('')}>Close</Button></DialogActions></Dialog>
    <Dialog open={Boolean(reviewItem)} onClose={() => setReviewItem(null)} fullWidth maxWidth="sm"><DialogTitle>Review record</DialogTitle><DialogContent><Typography sx={{ mb: 2 }}>{reviewItem?.title}</Typography><FormControl fullWidth sx={{ mb: 2 }}><InputLabel>Decision</InputLabel><Select label="Decision" value={decision} onChange={(event) => setDecision(event.target.value as 'Approved' | 'Rejected')}><MenuItem value="Approved">Approved</MenuItem><MenuItem value="Rejected">Rejected</MenuItem></Select></FormControl><TextField label="Comment" multiline rows={3} value={comment} onChange={(event) => setComment(event.target.value)} fullWidth /></DialogContent><DialogActions><Button onClick={() => setReviewItem(null)}>Cancel</Button><Button variant="contained" onClick={() => void saveReview()}>Save review</Button></DialogActions></Dialog>
  </Box>
}