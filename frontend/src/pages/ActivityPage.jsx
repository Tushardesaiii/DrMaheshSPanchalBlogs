import { useLocation, useParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ChevronLeft, Image as ImageIcon, Users, Presentation, BarChart3 } from 'lucide-react'

import EventCard from '../components/cards/EventCard'
import { useContent } from '../context/ContentContext'
import { getPrimaryMedia, getPreviewUrl } from '../utils/media'

const IconMap = {
  Presentation: Presentation,
  Users: Users,
  BarChart3: BarChart3,
  ImageIcon: ImageIcon,
}

const COLLECTIONS_DATA = {
  'activities-and-events': {
    title: 'Activities & Events',
    description: 'Highlights from institutional activities, campus events, and annual programs.',
    type: 'activity',
    icon: 'Presentation',
  },
  conferences: {
    title: 'Conferences',
    description: 'Academic conferences, keynote sessions, and scholarly exchanges.',
    type: 'activity',
    icon: 'Presentation',
  },
  workshops: {
    title: 'Workshops',
    description: 'Skill-building workshops, training sessions, and learning labs.',
    type: 'activity',
    icon: 'Users',
  },
  reports: {
    title: 'Reports',
    description: 'Official reports, summaries, and institutional documentation.',
    type: 'activity',
    icon: 'BarChart3',
  },
  gallery: {
    title: 'Gallery',
    description: 'Photo archives and visual highlights from campus activities.',
    type: 'activity',
    icon: 'ImageIcon',
  },
}

function ActivityPage() {
  const { collection } = useParams()
  const location = useLocation()
  const [previewImage, setPreviewImage] = useState(null)
  const slug = collection ?? location.pathname.split('/').filter(Boolean).pop()
  const data = COLLECTIONS_DATA[slug]
  const { loading, getNormalizedBySection } = useContent()

  if (!data || data.type !== 'activity') {
    return <div className="py-20 text-center font-serif italic">Activity archive not found.</div>
  }

  const Icon = IconMap[data.icon]
  const sectionName = data?.title
  const sectionItems = sectionName ? getNormalizedBySection(sectionName) : []

  const galleryPhotos = useMemo(() => {
    if (slug !== 'gallery') return []

    return sectionItems
      .map((item) => {
        const media = getPrimaryMedia(item?.files)
        if (!media || media.type !== 'image') return null

        return {
          id: item.id,
          title: item.title,
          previewUrl: getPreviewUrl(media),
          originalUrl: media.url,
        }
      })
      .filter(Boolean)
  }, [sectionItems, slug])

  if (slug === 'gallery') {
    return (
      <div className="min-h-screen bg-[#fafafa] px-4 py-6 md:px-6 md:py-8">
        {loading ? (
          <p className="text-center text-sm text-slate-500">Loading gallery...</p>
        ) : galleryPhotos.length > 0 ? (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5 [&>button]:mb-3">
            {galleryPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                className="block w-full break-inside-avoid overflow-hidden rounded-xl bg-white"
                onClick={() => setPreviewImage(photo)}
              >
                <img
                  src={photo.previewUrl || photo.originalUrl}
                  alt={photo.title}
                  className="h-auto w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  loading="lazy"
                  onError={(event) => {
                    if (photo.originalUrl && event.currentTarget.src !== photo.originalUrl) {
                      event.currentTarget.src = photo.originalUrl
                    }
                  }}
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500">No gallery photos found.</p>
        )}

        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage.previewUrl || previewImage.originalUrl}
              alt={previewImage.title}
              className="max-h-[92vh] max-w-[92vw] rounded-lg object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="border-b border-slate-100 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-11">
          <Link to="/" className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 transition-all hover:text-blue-600">
            <ChevronLeft size={14} /> Back to Library Hub
          </Link>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-lg">
                  <Icon size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Activity & Events Record</span>
              </div>
              <h1 className="font-serif text-5xl font-extrabold tracking-tighter text-slate-900 md:text-7xl">{data.title}</h1>
              <p className="max-w-xl text-xl leading-relaxed text-slate-500">{data.description}</p>
            </div>

            <div className="hidden border-l border-slate-100 pl-10 lg:block">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Entries</p>
                <p className="text-6xl font-light text-slate-200">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 text-sm text-slate-500">Loading archive...</p>
          ) : sectionItems.length > 0 ? (
            sectionItems.map((item) => <EventCard key={item.id} event={item} />)
          ) : (
            <p className="col-span-3 text-sm text-slate-500">No content found for this section.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default ActivityPage