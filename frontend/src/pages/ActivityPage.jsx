import { useLocation, useParams, Link } from 'react-router-dom'
import { ChevronLeft, Calendar as CalendarIcon, MapPin, ArrowRight, Image as ImageIcon, Users, Presentation, BarChart3 } from 'lucide-react'

import Button from '../components/ui/Button'

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

  if (!data || data.type !== 'activity') {
    return <div className="py-20 text-center font-serif italic">Activity archive not found.</div>
  }

  const Icon = IconMap[data.icon]

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

      {/* 2. Timeline-style Activity Grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group relative grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-center bg-white rounded-[3rem] p-4 border border-slate-100 transition-all hover:shadow-md hover:border-blue-100">
              
              {/* Image/Visual Part */}
              <div className="aspect-video md:aspect-square rounded-[2.5rem] bg-slate-100 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                   <ImageIcon size={48} strokeWidth={1} />
                </div>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 text-center shadow-xl">
                   <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Feb</p>
                   <p className="text-lg font-bold text-slate-900">1{item}</p>
                </div>
              </div>

              {/* Content Part */}
              <div className="pr-8 py-4">
                <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest text-blue-600">
                   <span className="flex items-center gap-1"><CalendarIcon size={12} /> 2026 Archive</span>
                   <span className="flex items-center gap-1"><MapPin size={12} /> Main Campus</span>
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                  Annual {data.title} Proceedings: Volume {item}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-8">
                  A detailed documentation of the academic initiatives, participant lists, and key outcomes recorded during this {data.title.toLowerCase()}.
                </p>
                <div className="flex items-center gap-6">
                  <Button className="rounded-full bg-slate-900 hover:bg-blue-600">View Details</Button>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                     Download Report <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ActivityPage