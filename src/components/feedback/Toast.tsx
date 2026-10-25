import { Alert, Snackbar } from '@mui/material'
import { useToast } from '../../hooks/useToast'

export function Toast() {
  const { toast, dismissToast } = useToast()
  return (
    <Snackbar
      key={toast?.id}
      open={Boolean(toast)}
      autoHideDuration={4000}
      onClose={dismissToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={dismissToast} severity={toast?.severity ?? 'info'} variant="filled">
        {toast?.message}
      </Alert>
    </Snackbar>
  )
}
