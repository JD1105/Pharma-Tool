import { useState } from 'react'
import { Bookmark, BookmarkBorder, ContentCopy, Download } from '@mui/icons-material'
import { IconButton, Stack, Tooltip } from '@mui/material'
import { useAuth } from '../../auth/useAuth'
import { can } from '../../config/permissions'
import { useToast } from '../../hooks/useToast'

export function ResultActions({
  title,
  url,
  onDownload,
  onBookmark,
}: {
  title: string
  url?: string
  onDownload: () => void
  onBookmark?: () => Promise<boolean>
}) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [bookmarked, setBookmarked] = useState(false)
  const [busy, setBusy] = useState(false)
  const mayBookmark = can(user?.role, 'result:bookmark')
  const mayShare = can(user?.role, 'result:share')
  const toggle = async () => {
    if (!onBookmark) return
    setBusy(true)
    try {
      setBookmarked(await onBookmark())
    } finally {
      setBusy(false)
    }
  }
  const share = async () => {
    await navigator.clipboard.writeText(url ?? window.location.href)
    showToast('Link copied', 'success')
  }
  return (
    <Stack direction="row" spacing={0.25}>
      <Tooltip title="Download">
        <IconButton aria-label={`Download ${title}`} onClick={onDownload}>
          <Download />
        </IconButton>
      </Tooltip>
      {mayBookmark && (
        <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark'}>
          <span>
            <IconButton
              aria-label={bookmarked ? `Unbookmark ${title}` : `Bookmark ${title}`}
              disabled={busy}
              onClick={() => void toggle()}
            >
              {bookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </span>
        </Tooltip>
      )}
      {mayShare && (
        <Tooltip title="Share">
          <IconButton aria-label={`Share ${title}`} onClick={() => void share()}>
            <ContentCopy />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  )
}
