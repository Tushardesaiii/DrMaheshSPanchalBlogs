import { ExternalLink, FileText, Image as ImageIcon, PlayCircle } from 'lucide-react'
import { getFileType, getPreviewUrl } from '../../utils/media'

const MAX_IMAGE_PREVIEWS = 3

const getAttachmentLabel = (fileType) => {
  if (fileType === 'pdf') return 'PDF'
  if (fileType === 'video') return 'Video'
  if (fileType === 'image') return 'Image'
  return 'Document'
}

function PostMediaAttachments({ files, title }) {
  const normalizedFiles = Array.isArray(files)
    ? files
        .map((file) => ({
          ...file,
          resolvedType: getFileType(file),
        }))
        .filter((file) => file?.url)
    : []

  if (normalizedFiles.length === 0) return null

  const imageFiles = normalizedFiles.filter((file) => file.resolvedType === 'image')
  const otherFiles = normalizedFiles.filter((file) => file.resolvedType !== 'image')

  return (
    <div className="mt-5 border-t border-(--color-border) pt-4">
      {imageFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-muted)">
            <ImageIcon size={14} />
            <span>Images</span>
          </div>
          <div className={imageFiles.length === 1 ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-2 gap-2'}>
            {imageFiles.slice(0, MAX_IMAGE_PREVIEWS).map((file, index) => {
              const previewUrl = getPreviewUrl(file)
              const remaining = imageFiles.length - MAX_IMAGE_PREVIEWS
              const isLastVisibleTile = index === MAX_IMAGE_PREVIEWS - 1 && imageFiles.length > MAX_IMAGE_PREVIEWS

              return (
                <button
                  key={file.url + String(index)}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    window.open(file.url, '_blank', 'noopener,noreferrer')
                  }}
                  className="relative overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg)"
                  aria-label={`Open image ${index + 1} for ${title || 'post'}`}
                >
                  <img
                    src={previewUrl || file.url}
                    alt={file?.name || `${title || 'Post'} image ${index + 1}`}
                    className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = file.url
                    }}
                  />
                  {isLastVisibleTile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(15,23,42,0.55)] text-sm font-semibold text-white">
                      +{remaining} more
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {otherFiles.length > 0 && (
        <div className={imageFiles.length > 0 ? 'mt-3 space-y-2' : 'space-y-2'}>
          {otherFiles.map((file, index) => {
            const fileType = file.resolvedType
            const label = getAttachmentLabel(fileType)

            return (
              <button
                key={file.url + String(index)}
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  window.open(file.url, '_blank', 'noopener,noreferrer')
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-(--color-border) bg-[rgba(255,255,255,0.8)] px-3 py-2 text-left transition-colors hover:bg-white"
                aria-label={`Open ${label.toLowerCase()} attachment for ${title || 'post'}`}
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(212,165,116,0.18)] text-(--color-accent-dark)">
                  {fileType === 'video' ? <PlayCircle size={16} /> : <FileText size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-(--color-primary)">{file?.name || `${label} Attachment`}</p>
                  <p className="text-xs text-(--color-muted)">{label}</p>
                </div>
                <ExternalLink size={14} className="shrink-0 text-(--color-muted)" />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PostMediaAttachments
