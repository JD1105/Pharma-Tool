export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  const headers = Object.keys(rows[0] ?? {})
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
  const contents = [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header] ?? '')).join(','))].join('\n')
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}