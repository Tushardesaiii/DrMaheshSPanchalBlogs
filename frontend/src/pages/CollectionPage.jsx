import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Filter, BookOpen, Download, LayoutGrid, Info, ArrowUpRight, GraduationCap, FileText, BarChart3, Languages, Award, Calendar } from 'lucide-react'

import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const COLLECTIONS = {
  'literature': {
    title: 'Literature',
    description: 'Curated reading lists, critical summaries, and academic references from classical to contemporary eras.',
    tags: ['Classics', 'Analysis', 'Poetry', 'Criticism'],
    icon: BookOpen,
    color: 'blue'
  },
  'competitive-exams': {
    title: 'Competitive Exams',
    description: 'Strategic preparation modules and curated resources for UPSC, GPSC, and National Level examinations.',
    tags: ['UPSC', 'GPSC', 'Strategic Notes', 'Practice'],
    icon: GraduationCap,
    color: 'purple'
  },
  'learning-resources': {
    title: 'Learning Resources',
    description: 'Structured academic modules and study frameworks designed for comprehensive curriculum mastery.',
    tags: ['Study Guides', 'Frameworks', 'Modules'],
    icon: FileText,
    color: 'emerald'
  },
  'research-papers': {
    title: 'Research Papers',
    description: 'A repository of peer-reviewed journals, methodology references, and faculty publications.',
    tags: ['Methodology', 'Citations', 'Peer Review'],
    icon: BarChart3,
    color: 'rose'
  },
  'library-reports': {
    title: 'Library Reports',
    description: 'Annual archival summaries, institutional insights, and library performance metrics.',
    tags: ['Archive', 'Metrics', 'Documentation'],
    icon: Info,
    color: 'slate'
  },
  'gujarati-content': {
    title: 'Gujarati Content',
    description: 'Specialized regional literature, language guides, and cultural research papers.',
    tags: ['Regional', 'Language', 'Culture'],
    icon: Languages,
    color: 'amber'
  },
  'scholarships': {
    title: 'Scholarships',
    description: 'Active funding opportunities, application guidelines, and student financial aid updates.',
    tags: ['Grants', 'Funding', 'Opportunities'],
    icon: Award,
    color: 'cyan'
  },
  'events-and-workshops': {
    title: 'Events & Workshops',
    description: 'Upcoming academic conferences, skill-building workshops, and faculty training sessions.',
    tags: ['Workshops', 'Conferences', 'Training'],
    icon: Calendar,
    color: 'indigo'
  }
}

function CollectionPage() {
  const { collection } = useParams()
  const data = COLLECTIONS[collection]

  // Dynamic Theme Mapping
  const theme = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Info className="text-slate-200 mb-4" size={64} />
        <h2 className="text-2xl font-bold text-slate-900 font-serif">Section Unavailable</h2>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">Return to Library Home</Link>
      </div>
    )
  }

  const Icon = data.icon

  return (
    <div className="mx-auto max-w-6xl px-6 space-y-12 py-10">
      {/* 1. Header Navigation */}
      <nav className="flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Archive Index
        </Link>
        <div className="flex items-center gap-4 text-slate-300">
           <span className="text-[10px] uppercase tracking-widest font-bold">Ref. No: {collection.substring(0,3).toUpperCase()}-2026</span>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start border-b border-slate-100 pb-16">
        <div className="space-y-6">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1 border ${theme[data.color]}`}>
             <Icon size={14} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Departmental Archive</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 font-serif italic">
            {data.title}
          </h1>
          <p className="text-xl leading-relaxed text-slate-500 max-w-2xl font-medium">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {data.tags.map((tag) => (
              <Badge key={tag} className="bg-white text-slate-500 border-slate-200"># {tag}</Badge>
            ))}
          </div>
        </div>

        {/* Floating Side Info */}
        <div className="hidden lg:block w-64 p-8 rounded-3xl bg-slate-50 border border-slate-100">
           <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Collection
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Indexed</p>
                <p className="text-sm font-bold text-slate-900">Feb 10, 2026</p>
              </div>
           </div>
        </div>
      </header>

      {/* 3. Content Stacks (Placeholder for Backend Data) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <h3 className="text-lg font-bold text-slate-900 tracking-tight">Archived Documents</h3>
           <div className="flex gap-2">
             <Button variant="ghost" className="h-8 w-8 p-0"><Filter size={14} /></Button>
             <Button variant="ghost" className="h-8 w-8 p-0"><LayoutGrid size={14} /></Button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-4/5 rounded-2xl bg-slate-50 border border-slate-200 p-8 flex flex-col justify-between transition-all group-hover:shadow-2xl group-hover:border-slate-300 group-hover:-translate-y-1">
                <div className="flex justify-between items-start">
                   <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                      <FileText size={20} />
                   </div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Doc-00{i}</span>
                </div>
                <div className="space-y-3">
                   <div className="h-2 w-24 bg-slate-200 rounded-full group-hover:bg-blue-200 transition-colors" />
                   <div className="h-4 w-full bg-slate-200 rounded-lg" />
                   <div className="h-4 w-2/3 bg-slate-200 rounded-lg" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between px-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Connecting Archive...</p>
                 <ArrowUpRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default CollectionPage