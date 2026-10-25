import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'

export function ConfirmDialog({ open, title, message, onCancel, onConfirm, confirmLabel = 'Confirm' }: { open: boolean; title: string; message: string; onCancel: () => void; onConfirm: () => void; confirmLabel?: string }) {
  return <Dialog open={open} onClose={onCancel}><DialogTitle>{title}</DialogTitle><DialogContent><Typography>{message}</Typography></DialogContent><DialogActions><Button onClick={onCancel}>Cancel</Button><Button color="error" variant="contained" onClick={onConfirm}>{confirmLabel}</Button></DialogActions></Dialog>
}