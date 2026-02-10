import { Search, Bell, ArrowRight, ExternalLink, BookOpen, GraduationCap, FileText, BarChart3, Languages, Award, Calendar, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'

function Home() {
  const categories = [
    { name: 'Literature', icon: BookOpen, color: 'bg-blue-50' },
    { name: 'Competitive Exams', icon: GraduationCap, color: 'bg-purple-50' },
    { name: 'Learning Resources', icon: FileText, color: 'bg-orange-50' },
    { name: 'Research Papers', icon: FileText, color: 'bg-emerald-50' },
    { name: 'Library Reports', icon: BarChart3, color: 'bg-rose-50' },
    { name: 'Gujarati Content', icon: Languages, color: 'bg-amber-50' },
    { name: 'Scholarships', icon: Award, color: 'bg-cyan-50' },
    { name: 'Events & Workshops', icon: Calendar, color: 'bg-indigo-50' },
  ]

  return (
    <div className="space-y-24 pb-24 overflow-hidden">
      
      {/* 1. Minimal Slogan */}
      <section className="mt-12 text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-(--color-accent) opacity-80">
          The Knowledge Archive
        </h2>
        <h1 className="mt-4 text-4xl font-light text-(--color-primary) md:text-5xl">
          Curating wisdom for the <span className="italic font-serif">next generation.</span>
        </h1>
      </section>

      {/* 2. Enhanced Latest Updates (Horizontal Cards) */}
      <section className="relative px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h3 className="font-semibold uppercase tracking-widest text-xs text-(--color-primary)">Live Updates</h3>
          </div>
          <button className="text-xs font-bold text-(--color-accent) hover:underline">View Archive</button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-75 group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 flex justify-between items-start">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">NEWS</span>
                <span className="text-[10px] text-gray-400">Feb 10, 2026</span>
              </div>
              <h4 className="line-clamp-2 font-medium text-(--color-primary) group-hover:text-(--color-accent)">
                New research paper added to the Gujarat History collection.
              </h4>
              <div className="mt-4 flex items-center text-xs font-bold text-(--color-accent) opacity-0 group-hover:opacity-100 transition-opacity">
                READ MORE <ArrowRight size={14} className="ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Search Bar with "Glow" Effect */}
      <section className="relative mx-auto max-w-4xl px-4">
        <div className="absolute -inset-1 rounded-4xl bg-linear-to-r from-(--color-accent) to-blue-500 opacity-20 blur-xl"></div>
        <div className="relative flex items-center rounded-2xl bg-white shadow-2xl">
          <Search className="ml-6 text-gray-400" size={24} />
          <input 
            type="text" 
            placeholder="Search the entire archive..." 
            className="w-full bg-transparent py-8 pl-4 pr-8 text-xl outline-none placeholder:text-gray-300"
          />
          <div className="mr-4 hidden sm:block">
            <kbd className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-400">⌘ K</kbd>
          </div>
        </div>
      </section>

      {/* 4. The "Attractive" Auto-Scrolling Categories */}
    <section className="relative px-6 pb-32">
  {/* Header for Discovery */}
  <div className="mx-auto mb-12 max-w-7xl">
    <div className="flex items-end justify-between border-b border-slate-100 pb-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Browse Collections</h2>
        <p className="mt-2 text-slate-500 font-medium">Explore hand-picked resources across all academic departments.</p>
      </div>
      <button className="text-sm font-bold text-(--color-accent) hover:text-black transition">View All Folders</button>
    </div>
  </div>

  {/* The Big Auto-Scrolling Content Showcase */}
  <div className="relative overflow-hidden py-10">
    <div className="flex animate-marquee gap-8 whitespace-nowrap hover:[animation-play-state:paused]">
      {[...categories, ...categories].map((cat, index) => (
        <div 
          key={index}
          className="group relative w-95 shrink-0 cursor-pointer overflow-hidden rounded-[2.5rem] bg-white p-4 ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:ring-(--color-accent)"
        >
          {/* Visual Content Preview (The "Content" Display) */}
          <div className="relative h-64 w-full overflow-hidden rounded-[1.8rem] bg-slate-100 transition-all group-hover:bg-slate-50">
            {/* Background Decorative Graphic (mimics document/content) */}
            <div className="absolute inset-x-8 top-12 h-64 rounded-t-xl bg-white shadow-2xl transition-transform duration-500 group-hover:translate-y-2.5 group-hover:rotate-2">
              {/* Fake Content Lines to mimic a document/book */}
              <div className="p-6">
                <div className="h-4 w-3/4 rounded-full bg-slate-100 mb-4" />
                <div className="h-2 w-full rounded-full bg-slate-100 mb-2" />
                <div className="h-2 w-full rounded-full bg-slate-100 mb-2" />
                <div className="h-2 w-2/3 rounded-full bg-slate-100" />
              </div>
            </div>
            {/* Icon Overlay */}
            <div className="absolute bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-(--color-accent) shadow-xl backdrop-blur-md">
              <cat.icon size={28} />
            </div>
          </div>

          {/* Info Section */}
          <div className="px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold tracking-tight text-slate-900">{cat.name}</h4>
                <p className="text-sm font-medium text-slate-400">
                  {/* Dynamic description or dummy count */}
                  {cat.stats || 'Recently Updated'}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 opacity-0 transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:opacity-100">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Fading Edge Mask */}
    <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-linear-to-r from-[#fafafa] to-transparent z-10" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-linear-to-l from-[#fafafa] to-transparent z-10" />
  </div>
</section>

<style>{`
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-100% - 2rem)); }
  }
  .animate-marquee {
    animation: marquee 60s linear infinite;
  }
`}</style>

      {/* Custom Styles for the Animation (Add to your global CSS) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Home