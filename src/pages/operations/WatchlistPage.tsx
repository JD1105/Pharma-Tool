import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Add, VisibilityOff } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { addWatchlistItem, listWatchlist, removeWatchlistItem } from '../../api/projectApi'
import { countries } from '../../mocks/db'
import { PageHeader } from '../../components/layout/PageHeader'

export function WatchlistPage() {
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState('')
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['watchlist'], queryFn: listWatchlist })
  const mutation = useMutation({
    mutationFn: addWatchlistItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['watchlist'] })
      setTopic('')
      setCountry('')
      setOpen(false)
    },
  })
  const removeMutation = useMutation({
    mutationFn: removeWatchlistItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist'] }),
  })
  const submit = () => {
    if (!topic.trim() || !country) {
      setError('Enter a topic and choose a country.')
      return
    }
    setError('')
    mutation.mutate({ topic, country })
  }
  return (
    <Box>
      <PageHeader
        title="Watchlist"
        subtitle="Monitor topics and regulations for new changes."
        actions={
          <Button startIcon={<Add />} variant="contained" onClick={() => setOpen(true)}>
            Add to watchlist
          </Button>
        }
      />
      {query.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Unable to load watchlist.
        </Alert>
      )}
      <Stack spacing={1}>
        {(query.data ?? []).map((item) => (
          <Paper key={item.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={700}>{item.topic}</Typography>
                {item.newChange && <Chip color="error" size="small" label="New change" />}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {item.country} · Last change {new Date(item.lastChange).toLocaleDateString()}
              </Typography>
            </Box>
            <Button startIcon={<VisibilityOff />} onClick={() => removeMutation.mutate(item.id)}>
              Unwatch
            </Button>
          </Paper>
        ))}
        {!query.isLoading && !query.data?.length && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>No watched topics yet.</Paper>
        )}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add to watchlist</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Topic"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
            <TextField
              select
              label="Country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            >
              {countries.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
