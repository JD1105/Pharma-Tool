import { useState, type FormEvent } from 'react'
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material'
import { useLocation, useNavigate, type Location } from 'react-router-dom'
import { z } from 'zod'
import { env } from '../config/env'
import { useAuth } from '../auth/useAuth'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})
const demoAccounts = [
  ['Admin', 'admin@pharmatool.demo'],
  ['Developer', 'dev@pharmatool.demo'],
  ['Client', 'client@pharmatool.demo'],
  ['Temporary', 'guest@pharmatool.demo'],
]

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Check your login details.')
      return
    }
    setLoading(true)
    try {
      await login(parsed.data.email, parsed.data.password)
      const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/summaries'
      navigate(from, { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}
    >
      <Paper sx={{ width: '100%', p: { xs: 3, sm: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              {env.appName}
            </Typography>
            <Typography color="text.secondary">Regulatory intelligence workspace</Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={submit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </Box>
          {env.useMock && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Use demo account
              </Typography>
              <Stack spacing={0.5}>
                {demoAccounts.map(([role, accountEmail]) => (
                  <Button
                    key={role}
                    size="small"
                    variant="text"
                    sx={{ justifyContent: 'flex-start' }}
                    onClick={() => {
                      setEmail(accountEmail!)
                      setPassword('Demo@123')
                    }}
                  >
                    {role}: {accountEmail}
                  </Button>
                ))}
                <Typography variant="caption" color="text.secondary">
                  Password: Demo@123
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}
