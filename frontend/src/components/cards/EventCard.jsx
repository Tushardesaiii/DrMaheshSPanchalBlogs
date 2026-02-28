import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { getPrimaryMedia, getPreviewUrl } from '../../utils/media'
import { ExternalLink, Calendar, MapPin, ArrowRight } from 'lucide-react'

function EventCard({ event }) {
  const tags = Array.isArray(event?.tags) ? event.tags : []
  const category = event?.category || event?.format || 'Event'
  const date = event?.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : (event?.date || 'TBA')
  const location = event?.location || 'Location TBA'
  const media = getPrimaryMedia(event?.files)
  const previewUrl = media ? getPreviewUrl(media) : ''
  const eventTime = event?.eventTime
  const speaker = event?.speaker
  const featured = event?.featured

  return (
    <Link to={`/content/${event?.id}`} className="block h-full group">
      <Card className="flex h-full flex-col overflow-hidden p-0">
        {/* Media Section with Overlay */}
        <div className="relative w-full overflow-hidden bg-linear-to-br from-[#f0e8df] to-[#e8dfd5]">
          <div className="media-wrapper">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={media?.name || event?.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = media?.url || previewUrl
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center min-h-56">
                <div className="text-center">
                  <div className="text-5xl mb-2">🎯</div>
                  <p className="text-xs uppercase tracking-widest text-(--color-muted)">No Preview</p>
                </div>
              </div>
            )}
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-[rgba(15,23,42,0.7)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <ArrowRight size={16} />
                View Event
              </div>
            </div>

            {/* Featured Badge */}
            {featured && (
              <div className="absolute left-3 top-3 bg-linear-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                ⭐ Featured
              </div>
            )}

            {/* Media Badge */}
            {media?.url && (
              <button
                type="button"
                onClick={(eventClick) => {
                  eventClick.preventDefault()
                  eventClick.stopPropagation()
                  window.open(media.url, '_blank', 'noopener,noreferrer')
                }}
                className="absolute right-3 top-3 media-badge flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:scale-110"
              >
                <ExternalLink size={14} />
                Open
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3">
            <Badge variant="default">{category}</Badge>
          </div>

          <h3 className="section-title text-xl mb-2 line-clamp-2 text-(--color-primary) group-hover:text-[#d4a574] transition-colors">
            {event?.title}
          </h3>

          <p className="text-sm text-(--color-muted) line-clamp-2 mb-4 flex-1">
            {event?.description}
          </p>

          {/* Date & Location */}
          <div className="space-y-2 mb-4 border-t border-(--color-border) pt-4">
            <div className="flex items-center gap-2 text-sm text-(--color-muted)">
              <Calendar size={16} className="text-(--color-accent)" />
              <span className="font-medium">{date}</span>
              {eventTime && (eventTime.start || eventTime.end) && (
                <span className="text-xs ml-auto">
                  {eventTime.start && eventTime.start}
                  {eventTime.start && eventTime.end && ' - '}
                  {eventTime.end && eventTime.end}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-(--color-muted)">
              <MapPin size={16} className="text-(--color-accent)" />
              <span className="font-medium">{location}</span>
            </div>
            {speaker && (
              <div className="flex items-center gap-2 text-sm text-(--color-muted)">
                <span className="text-(--color-accent)">👤</span>
                <span className="font-medium">{speaker}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag-style">#{tag}</span>
              ))}
              {tags.length > 2 && <span className="text-xs text-(--color-muted)">+{tags.length - 2}</span>}
            </div>
          )}

          {/* Button */}
          <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-center">View Report</Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default EventCard
