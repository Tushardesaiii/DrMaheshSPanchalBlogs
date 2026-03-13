import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Calendar, ExternalLink, MapPin, User } from 'lucide-react'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { FiLink } from 'react-icons/fi'
import PostMediaAttachments from './PostMediaAttachments'

const platformMeta = {
  youtube: {
    label: 'YouTube',
    Icon: FaYoutube,
    iconClass: 'text-red-600',
    chipClass: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
    iconWrapClass: 'bg-red-100 ring-red-200',
    externalClass: 'text-red-400',
  },
  instagram: {
    label: 'Instagram',
    Icon: FaInstagram,
    iconClass: 'text-fuchsia-600',
    chipClass: 'border-fuchsia-200 bg-linear-to-r from-pink-50 to-orange-50 text-fuchsia-700 hover:from-pink-100 hover:to-orange-100',
    iconWrapClass: 'bg-pink-100 ring-pink-200',
    externalClass: 'text-fuchsia-400',
  },
  facebook: {
    label: 'Facebook',
    Icon: FaFacebook,
    iconClass: 'text-blue-600',
    chipClass: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
    iconWrapClass: 'bg-blue-100 ring-blue-200',
    externalClass: 'text-blue-400',
  },
  other: {
    label: 'External',
    Icon: FiLink,
    iconClass: 'text-emerald-600',
    chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    iconWrapClass: 'bg-emerald-100 ring-emerald-200',
    externalClass: 'text-emerald-400',
  },
}

const getResourceLinks = (event) => {
  const links = Array.isArray(event?.resourceLinks)
    ? event.resourceLinks
    : Array.isArray(event?.raw?.resourceLinks)
      ? event.raw.resourceLinks
      : []

  const normalized = links
    .map((link) => {
      const platform = typeof link?.platform === 'string' ? link.platform.toLowerCase() : 'other'
      const url = typeof link?.url === 'string' ? link.url.trim() : ''
      if (!url) return null

      return {
        platform: platformMeta[platform] ? platform : 'other',
        url,
        label: typeof link?.label === 'string' ? link.label.trim() : '',
      }
    })
    .filter(Boolean)

  const fallbackExternalUrl = typeof event?.externalUrl === 'string'
    ? event.externalUrl.trim()
    : typeof event?.raw?.externalUrl === 'string'
      ? event.raw.externalUrl.trim()
      : ''

  if (fallbackExternalUrl && !normalized.some((link) => link.url === fallbackExternalUrl)) {
    normalized.push({ platform: 'other', url: fallbackExternalUrl, label: '' })
  }

  return normalized
}

function EventCard({ event }) {
  const tags = Array.isArray(event?.tags) ? event.tags : []
  const category = event?.category || event?.format || 'Event'
  const date = event?.eventDate ? new Date(event.eventDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : (event?.date || 'TBA')
  const location = event?.location || 'Location TBA'
  const eventTime = event?.eventTime
  const speaker = event?.speaker
  const featured = event?.featured
  const resourceLinks = getResourceLinks(event)

  const hasImage = event?.files?.some(f => f.type?.includes('image') || f.url?.match(/\.(jpg|jpeg|png|webp)$/i));
  const firstImage = hasImage ? event.files.find(f => f.type?.includes('image')).url : null;

  return (
    <Link to={`/content/${event?.id}`} className="block h-132 sm:h-136 group outline-none">
      {/* ANIMATED BORDER WRAPPER:
          - Default: Rotating Royal Green Gradient.
          - Hover: Animation stops and gradient disappears (bg-slate-200).
      */}
      <div className="relative h-full p-0.5 rounded-xl overflow-hidden transition-all duration-500 bg-slate-200 group-hover:bg-none">
        
        {/* The "Moving Rounds" Background - Hidden on Hover */}
        <div className="absolute -inset-full bg-[conic-gradient(from_0deg,#064e3b,#10b981,#064e3b)] animate-[spin_4s_linear_infinite] group-hover:opacity-0 transition-opacity duration-500" />

        <Card className="relative z-10 flex h-full flex-col p-0 overflow-hidden border-none rounded-[10px] bg-white shadow-none">
          
          {/* Photo Section: Static, No Hover Effects */}
          {hasImage && (
            <div className="relative h-36 w-full overflow-hidden border-b border-slate-100 bg-slate-50 shrink-0">
              <img 
                src={firstImage} 
                alt={event?.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-5 flex flex-1 flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <Badge variant="default" className="bg-[#064e3b] hover:bg-[#064e3b] text-white rounded-none px-3">
                {category}
              </Badge>
              {featured && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b]">Featured</p>
              )}
            </div>

            <h3 className="text-xl font-bold mb-2 line-clamp-2 text-slate-900 group-hover:text-[#064e3b] transition-colors">
              {event?.title}
            </h3>

            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
              {event?.description}
            </p>

            {/* Date & Location */}
            <div className="space-y-3 mb-5 border-t border-slate-50 pt-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar size={16} className="text-[#10b981]" />
                <span className="font-medium">{date}</span>
                {eventTime && (eventTime.start || eventTime.end) && (
                  <span className="text-xs ml-auto font-mono bg-slate-50 px-2 py-0.5 rounded">
                    {eventTime.start} {eventTime.end && `- ${eventTime.end}`}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-[#10b981]" />
                <span className="font-medium truncate">{location}</span>
              </div>

              {speaker && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <User size={16} className="text-[#10b981]" />
                  <span className="font-medium">{speaker}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
                {tags.length > 2 && <span className="text-[10px] text-slate-400">+{tags.length - 2}</span>}
              </div>
            )}

            {resourceLinks.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2.5 border-t border-slate-50 pt-4">
                {resourceLinks.slice(0, 4).map((resource, index) => {
                  const meta = platformMeta[resource.platform] || platformMeta.other
                  const Icon = meta.Icon

                  return (
                    <button
                      key={`${resource.url}-${index}`}
                      type="button"
                      onClick={(clickEvent) => {
                        clickEvent.preventDefault()
                        clickEvent.stopPropagation()
                        window.open(resource.url, '_blank', 'noopener,noreferrer')
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(15,23,42,0.12)] ${meta.chipClass}`}
                      aria-label={`Open ${resource.label || meta.label} link`}
                    >
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ring-1 ${meta.iconWrapClass}`}>
                        <Icon className={`${meta.iconClass} text-[15px]`} />
                      </span>
                      <span className="max-w-20 truncate text-[11px] uppercase tracking-[0.04em]">
                        {resource.label || meta.label}
                      </span>
                      <ExternalLink size={13} className={meta.externalClass} />
                    </button>
                  )
                })}
              </div>
            )}

            {/* Button: Transitions to Solid Green on Hover */}
            <div className="mt-auto">
              <Button 
                variant="ghost" 
                className="w-full justify-center border-slate-200 group-hover:bg-[#064e3b] group-hover:text-white transition-all duration-300"
              >
                View Report
              </Button>
            </div>

            <div className="hidden">
              <PostMediaAttachments files={event?.files} title={event?.title} />
            </div>
          </div>
        </Card>
      </div>
    </Link>
  )
}

export default EventCard