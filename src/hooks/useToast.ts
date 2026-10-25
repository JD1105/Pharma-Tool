import { useCallback, useSyncExternalStore } from 'react'

type ToastMessage = {
  id: number
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
}
let current: ToastMessage | null = null
const listeners = new Set<() => void>()
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
function getSnapshot() {
  return current
}
function publish(value: ToastMessage | null) {
  current = value
  listeners.forEach((listener) => listener())
}

export function useToast() {
  const toast = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const showToast = useCallback((message: string, severity: ToastMessage['severity'] = 'info') => {
    publish({ id: Date.now(), message, severity })
    window.setTimeout(() => publish(null), 4000)
  }, [])
  const dismissToast = useCallback(() => publish(null), [])
  return { toast, showToast, dismissToast }
}
