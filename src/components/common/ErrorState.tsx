import { Alert, Button, Stack } from '@mui/material'

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      <Stack>{message}</Stack>
    </Alert>
  )
}
