import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { getPrimaryMedia, getPreviewUrl } from '../../utils/media'

function EventCard({ event }) {
  const tags = Array.isArray(event?.tags) ? event.tags : []
  const category = event?.category || event?.format || 'Event'
  const date = event?.date || 'TBA'
  const location = event?.location || 'Location TBA'
  const media = getPrimaryMedia(event?.files)
  const previewUrl = media ? getPreviewUrl(media) : ''

  return (
    <Link to={`/content/${event?.id}`} className="block h-full">
      <Card className="flex h-full flex-col transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="flex-1">
          <div className="relative mb-4 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-bg)">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={media?.name || event?.title}
                className="h-44 w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = media?.url || previewUrl
                }}
              />
            ) : (
              <div className="flex h-44 items-center justify-center text-xs uppercase tracking-widest text-(--color-muted)">
                No Preview
              </div>
            )}
            {media?.url && (
              <button
                type="button"
                onClick={(eventClick) => {
                  eventClick.stopPropagation()
                  window.open(media.url, '_blank', 'noopener,noreferrer')
                }}
                className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-(--color-primary) shadow-sm transition hover:bg-white"
              >
                Open
              </button>
            )}
          </div>
          <Badge>{category}</Badge>
          <h3 className="section-title mt-3 text-lg text-(--color-primary)">{event?.title}</h3>
        <p className="mt-2 text-sm text-(--color-muted)">{event?.description}</p>
        <p className="mt-3 text-xs text-(--color-muted)">{date} · {location}</p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-(--color-secondary)">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
        </div>
        <div className="mt-6">
          <Button variant="ghost">View Report</Button>
        </div>
      </Card>
    </Link>
  )
}

export default EventCard
