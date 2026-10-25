import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

export function CompareDialog<T extends object>({ open, onClose, items, fields }: { open: boolean; onClose: () => void; items: T[]; fields: { key: keyof T; label: string }[] }) {
  return <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle>Compare records</DialogTitle>
    <DialogContent dividers><Table size="small"><TableHead><TableRow><TableCell>Field</TableCell>{items.map((item, index) => <TableCell key={index}>{String((item as Record<string, unknown>).name ?? (item as Record<string, unknown>).title ?? `Record ${index + 1}`)}</TableCell>)}</TableRow></TableHead><TableBody>{fields.map(({ key, label }) => <TableRow key={String(key)}><TableCell component="th">{label}</TableCell>{items.map((item, index) => <TableCell key={index}>{String(item[key] ?? '—')}</TableCell>)}</TableRow>)}</TableBody></Table></DialogContent>
    <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
  </Dialog>
}