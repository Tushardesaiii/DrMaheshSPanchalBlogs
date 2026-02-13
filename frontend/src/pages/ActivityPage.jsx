import { useLocation, useParams, Link } from 'react-router-dom'
import { ChevronLeft, Image as ImageIcon, Users, Presentation, BarChart3 } from 'lucide-react'

import Button from '../components/ui/Button'
import EventCard from '../components/cards/EventCard'
import BookCard from '../components/cards/BookCard'
import ArticleCard from '../components/cards/ArticleCard'
import { useContent } from '../context/ContentContext'

// Icon Mapping helper
const IconMap = {
  Presentation: Presentation,
  Users: Users,
  BarChart3: BarChart3,
  ImageIcon: ImageIcon
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
  const slug = collection ?? location.pathname.split('/').filter(Boolean).pop()
  const data = COLLECTIONS_DATA[slug]
  const { loading, getNormalizedBySection } = useContent()

  if (!data || data.type !== 'activity') {
    return <div className="py-20 text-center font-serif italic">Activity archive not found.</div>
  }

  const Icon = IconMap[data.icon]
  const sectionName = data?.title
  const sectionItems = sectionName ? getNormalizedBySection(sectionName) : []

  const renderCard = (item) => <EventCard key={item.id} event={item} />

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* 1. Immersive Hero Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-11">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-all mb-8">
            <ChevronLeft size={14} /> Back to Library Hub
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                    <Icon size={24} />
                 </div>
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Activity & Events Record</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 font-serif">
                {data.title}
              </h1>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed">{data.description}</p>
            </div>
            
            <div className="hidden lg:block border-l border-slate-100 pl-10">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Entries</p>
                  <p className="text-6xl font-light text-slate-200">12</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Activity Grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 text-sm text-slate-500">Loading archive...</p>
          ) : sectionItems.length > 0 ? (
            sectionItems.map((item) => renderCard(item))
          ) : (
            <p className="col-span-3 text-sm text-slate-500">No content found for this section.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default ActivityPage