import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Add, DoneAll, MoreVert } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { listCountryUpdates, markCountryUpdateRead } from '../../api/countryUpdateApi'
import { addWatchlistItem } from '../../api/projectApi'
import { useAuth } from '../../auth/useAuth'
import { can } from '../../config/permissions'
import { countries } from '../../mocks/db'
import { PageHeader } from '../../components/layout/PageHeader'
import { StatusChip } from '../../components/common/StatusChip'
import { useDebounce } from '../../hooks/useDebounce'
import type { CountryUpdate } from '../../types'

export function CountryUpdatesPage() {
  const [country, setCountry] = useState('United States')
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [activeUpdate, setActiveUpdate] = useState<CountryUpdate | null>(null)
  const debouncedQuery = useDebounce(query, 400)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['country-updates'],
    queryFn: () => listCountryUpdates({ size: 100 }),
  })
  const filteredUpdates = (data?.content ?? []).filter(
    (item) =>
      item.country === country &&
      (!type || item.type === type) &&
      (!debouncedQuery ||
        `${item.title} ${item.summary}`.toLowerCase().includes(debouncedQuery.toLowerCase())),
  )
  const updates = filteredUpdates.filter(
    (item) => (!from || item.date >= from) && (!to || item.date <= to),
  )
  const counts = useMemo(
    () =>
      Object.fromEntries(
        countries.map((item) => [
          item,
          (data?.content ?? []).filter((update) => update.country === item).length,
        ]),
      ),
    [data],
  )
  const readMutation = useMutation({
    mutationFn: (id: string) => markCountryUpdateRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['country-updates'] }),
  })
  const watchMutation = useMutation({
    mutationFn: (update: CountryUpdate) =>
      addWatchlistItem({ topic: update.title, country: update.country }),
  })
  const openMenu = (event: React.MouseEvent<HTMLElement>, update: CountryUpdate) => {
    setMenuAnchor(event.currentTarget)
    setActiveUpdate(update)
  }
  const mayManage = can(user?.role, 'country-update:manage')

  return (
    <Box>
      <PageHeader title="Country Updates" subtitle="Track regulatory changes by market." />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
        <Paper sx={{ width: { xs: '100%', md: 270 }, flexShrink: 0, overflow: 'hidden' }}>
          <Typography variant="subtitle2" sx={{ px: 2, py: 1.5 }}>
            Markets
          </Typography>
          <List dense sx={{ maxHeight: { md: '70vh' }, overflow: 'auto' }}>
            {countries.map((item) => (
              <ListItemButton
                key={item}
                selected={country === item}
                onClick={() => setCountry(item)}
              >
                <ListItemText primary={item} />
                <Chip size="small" label={counts[item] ?? 0} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                select
                label="Update Type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                sx={{ minWidth: 180 }}
              >
                {['', 'New Regulation', 'Amendment', 'Guidance', 'Notification'].map((item) => (
                  <MenuItem key={item || 'all'} value={item}>
                    {item || 'All types'}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />
              <TextField
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={to}
                onChange={(event) => setTo(event.target.value)}
              />
              <TextField
                label="Search updates"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                fullWidth
              />
            </Stack>
          </Paper>
          {isError ? (
            <Alert severity="error" action={<Button onClick={() => void refetch()}>Retry</Button>}>
              Unable to load country updates.
            </Alert>
          ) : isLoading ? (
            <Typography>Loading updates…</Typography>
          ) : updates.length ? (
            <Stack spacing={1.5}>
              {updates.map((update) => (
                <Paper key={update.id} sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {update.title}
                        </Typography>
                        <StatusChip status={update.type} />
                        {update.read && <Chip size="small" label="Read" />}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {update.summary}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {update.country} · {update.date}
                      </Typography>
                    </Box>
                    {mayManage && (
                      <IconButton
                        aria-label={`Manage ${update.title}`}
                        onClick={(event) => openMenu(event, update)}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography>No updates match your filters.</Typography>
            </Paper>
          )}
        </Box>
      </Stack>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            if (activeUpdate) readMutation.mutate(activeUpdate.id)
            setMenuAnchor(null)
          }}
        >
          <DoneAll fontSize="small" sx={{ mr: 1 }} />
          Mark as read
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeUpdate) watchMutation.mutate(activeUpdate)
            setMenuAnchor(null)
          }}
        >
          <Add fontSize="small" sx={{ mr: 1 }} />
          Add to watchlist
        </MenuItem>
      </Menu>
    </Box>
  )
}
