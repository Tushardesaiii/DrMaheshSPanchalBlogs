import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Calendar, MapPin, User } from 'lucide-react'
import PostMediaAttachments from './PostMediaAttachments'

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