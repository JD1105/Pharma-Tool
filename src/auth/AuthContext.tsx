import { useEffect, useState, type ReactNode } from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { login as loginRequest, logout as logoutRequest } from '../api/authApi'
import { AuthContext } from './context'
import type { User } from '../types'
const IDLE_WARNING_MS = 28 * 60 * 1000
const IDLE_TIMEOUT_MS = 30 * 60 * 1000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('vistar-token'))
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('vistar-user')
    return storedUser ? (JSON.parse(storedUser) as User) : null
  })
  const [idleWarning, setIdleWarning] = useState(false)

  const logout = () => {
    void logoutRequest().catch(() => undefined)
    sessionStorage.removeItem('vistar-token')
    sessionStorage.removeItem('vistar-user')
    setToken(null)
    setUser(null)
    setIdleWarning(false)
  }

  const login = async (email: string, password: string) => {
    const result = await loginRequest(email, password)
    // Production should use secure httpOnly cookies instead of browser-accessible token storage.
    sessionStorage.setItem('vistar-token', result.token)
    sessionStorage.setItem('vistar-user', JSON.stringify(result.user))
    setToken(result.token)
    setUser(result.user)
  }

  useEffect(() => {
    const onUnauthorized = () => logout()
    const onForbidden = () => window.location.assign('/forbidden')
    window.addEventListener('vistar:unauthorized', onUnauthorized)
    window.addEventListener('vistar:forbidden-response', onForbidden)
    return () => {
      window.removeEventListener('vistar:unauthorized', onUnauthorized)
      window.removeEventListener('vistar:forbidden-response', onForbidden)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    let warningTimer: ReturnType<typeof setTimeout>
    let logoutTimer: ReturnType<typeof setTimeout>
    const resetTimers = () => {
      clearTimeout(warningTimer)
      clearTimeout(logoutTimer)
      setIdleWarning(false)
      warningTimer = setTimeout(() => setIdleWarning(true), IDLE_WARNING_MS)
      logoutTimer = setTimeout(logout, IDLE_TIMEOUT_MS)
    }
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, resetTimers, { passive: true }))
    resetTimers()
    return () => {
      clearTimeout(warningTimer)
      clearTimeout(logoutTimer)
      events.forEach((event) => window.removeEventListener(event, resetTimers))
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token && user), login, logout }}>
      {children}
      <Dialog open={idleWarning} onClose={() => setIdleWarning(false)}>
        <DialogTitle>Session timeout warning</DialogTitle>
        <DialogContent>
          <Alert severity="warning">You will be signed out after 30 minutes of inactivity.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.dispatchEvent(new Event('pointerdown'))}>Continue session</Button>
          <Button color="error" onClick={logout}>Log out</Button>
        </DialogActions>
      </Dialog>
    </AuthContext.Provider>
  )
}