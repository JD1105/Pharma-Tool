import { Box, Card, CardContent, Paper, Stack, Typography } from '@mui/material'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '../../components/layout/PageHeader'

const submissions = [
  { month: 'May', count: 18 },
  { month: 'Jun', count: 24 },
  { month: 'Jul', count: 21 },
  { month: 'Aug', count: 32 },
  { month: 'Sep', count: 27 },
  { month: 'Oct', count: 38 },
]
const countryData = [
  { country: 'US', count: 24 },
  { country: 'EU', count: 19 },
  { country: 'India', count: 15 },
  { country: 'UK', count: 12 },
  { country: 'Japan', count: 9 },
]
const activity = [
  ['Variation dossier submitted', 'United States · 2 hours ago'],
  ['CMC module review completed', 'European Union · Yesterday'],
  ['Stability commitment updated', 'India · 2 days ago'],
  ['Manufacturing site change logged', 'Japan · 4 days ago'],
]

export function CmcDashboardPage() {
  return (
    <Box>
      <PageHeader
        title="CMC Dashboard"
        subtitle="Chemistry, manufacturing, and controls activity."
      />
      <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'info.50', borderColor: 'info.light' }}>
        <Typography variant="body2">
          Layout is indicative. Final content to be confirmed.
        </Typography>
      </Paper>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
          gap: 2,
          mb: 2,
        }}
      >
        {[
          ['Active Submissions', 38],
          ['Markets', 8],
          ['Pending Reviews', 12],
          ['Completed This Quarter', 24],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <Paper sx={{ p: 2, height: 340 }}>
          <Typography fontWeight={700}>Submissions over time</Typography>
          <ResponsiveContainer width="100%" height="92%">
            <LineChart data={submissions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#0E9AA7"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <Paper sx={{ p: 2, height: 340 }}>
          <Typography fontWeight={700}>Submissions by country</Typography>
          <ResponsiveContainer width="100%" height="92%">
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1F3A5F" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Recent activity
        </Typography>
        <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
          {activity.map(([title, detail]) => (
            <Box key={title} sx={{ py: 1.2 }}>
              <Typography fontWeight={600}>{title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {detail}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  )
}
