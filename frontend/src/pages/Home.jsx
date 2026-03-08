import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, ArrowRight, Camera, MapPin, Mail, Phone, UserSquare2, ChevronUp } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { getPrimaryMedia } from '../utils/media'

// SVG Components for Library Aesthetics
function PencilStrokeUnderline({ className = "", inView = true }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 200 8" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M2 4C45 2.5 95 1.8 198 3.5" 
        stroke="#B45309" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeDasharray="200"
        strokeDashoffset={inView ? "0" : "200"}
        style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
      />
    </svg>
  )
}

function FountainPenIcon({ className = "" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M3 21L7 17L12 12L17 7L18 6L20 4L21 3L19 1L18 2L17 3L12 8L7 13L2 17L1 21L3 21Z" 
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path 
        d="M16 8L18 10" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  )
}

function Home() {
  const { loading, getNormalizedByFormat, getNormalizedBySection } = useContent()
  const [searchQuery, setSearchQuery] = useState('')
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [headingInView, setHeadingInView] = useState({})
  
  const headingRefs = useRef({})
  
  // Get all content that can be searched
  const allContent = getNormalizedByFormat('Article')
  
  // Sort by date to get most recent first
  const recentPosts = useMemo(() => {
    return [...allContent]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8)
  }, [allContent])

  // Search functionality - search across title, description, and sections
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return allContent.filter((item) => {
      const title = item.title?.toLowerCase() || ''
      const description = item.description?.toLowerCase() || ''
      const sections = (item.sections || []).map((s) => s.toLowerCase()).join(' ')
      
      return title.includes(query) || description.includes(query) || sections.includes(query)
    })
  }, [searchQuery, allContent])

  // Dynamic categories from actual content sections
  const categoryPostsMap = useMemo(() => {
    const sectionMap = {}
    
    // Collect all unique sections from content
    allContent.forEach((post) => {
      if (post.sections && Array.isArray(post.sections)) {
        post.sections.forEach((section) => {
          if (!sectionMap[section]) {
            sectionMap[section] = []
          }
          sectionMap[section].push(post)
        })
      }
    })
    
    // Sort posts within each section by date (most recent first)
    Object.keys(sectionMap).forEach((section) => {
      sectionMap[section].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    })
    
    return sectionMap
  }, [allContent])

  // Gallery photos preview
  const galleryPhotos = useMemo(() => {
    const galleryItems = getNormalizedBySection('Gallery')
    return galleryItems
      .map((item) => {
        const media = getPrimaryMedia(item?.files)
        if (!media || media.type !== 'image') return null
        return {
          id: item.id,
          title: item.title,
          url: media.url,
        }
      })
      .filter(Boolean)
      .slice(0, 6) // Get first 6 photos
  }, [getNormalizedBySection])

  const heroGalleryPhotos = useMemo(() => {
    if (galleryPhotos.length > 0) {
      return galleryPhotos.slice(0, 5)
    }

    return [
      { id: 'placeholder-1', title: 'Academic Leadership Portrait', url: null },
      { id: 'placeholder-2', title: 'Library Engagement Session', url: null },
      { id: 'placeholder-3', title: 'Research Program Event', url: null },
    ]                 
  }, [galleryPhotos])

   useEffect(() => {
    if (heroGalleryPhotos.length <= 1) return undefined

    const timer = setInterval(() => {
      setActivePhotoIndex((prevIndex) => (prevIndex + 1) % heroGalleryPhotos.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [heroGalleryPhotos.length])

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for heading animations
  useEffect(() => {
    const observers = []
    Object.entries(headingRefs.current).forEach(([key, ref]) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setHeadingInView((prev) => ({ ...prev, [key]: true }))
            }
          },
          { threshold: 0.5 }
        )
        observer.observe(ref)
        observers.push(observer)
      }
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="overflow-hidden">
      {/* 1. Full Window Hero */}
      <section className="relative min-h-[88vh] w-full overflow-hidden ">
        <div className="absolute inset-0">
          {heroGalleryPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-all duration-900 ${
                index === activePhotoIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              {photo.url ? (
                <img src={photo.url} alt={photo.title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center bg-linear-to-br from-[#e8dccb] via-[#f2e9dc] to-[#dbe7f5]">
                  <div className="passport-photo-placeholder min-h-80 w-full max-w-96 rounded-2xl border-2 border-dashed border-[#c89c69] bg-white/40 backdrop-blur-sm">
                    <UserSquare2 size={52} className="text-(--color-accent)" />
                    <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">Hero Gallery</p>
                    <p className="mt-1 text-sm text-slate-600">Upload gallery photos to activate this slider</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="absolute inset-0  bg-linear-to-r from-black/70 via-black/40 to-black/30" />

        <div className="relative z-10 flex min-h-[88vh] items-end px-6 pb-10 pt-20 md:px-12 md:pb-14">
          <div className="mx-auto flex w-full max-w-350 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl text-white">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f4d9b7]">Official Website</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                Dr. Mahesh K. Solanki
              </h1>
              <p className="mt-3 text-lg font-medium text-white/90 md:text-2xl">
                University Librarian, Gujarat Technological University
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
                With over 18 years in Library and Information Science, committed to research support,
                innovation, and modern digital library services.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium md:text-sm">
                <span className="rounded-full border border-white/40 bg-white/15 px-4 py-2 backdrop-blur-sm">MLISc</span>
                <span className="rounded-full border border-white/40 bg-white/15 px-4 py-2 backdrop-blur-sm">GSLET</span>
                <span className="rounded-full border border-white/40 bg-white/15 px-4 py-2 backdrop-blur-sm">Ph.D. (LIS)</span>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-white/25 bg-white/12 p-4 text-white backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.2em] text-white/75">Current Slide</p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold">{heroGalleryPhotos[activePhotoIndex]?.title || 'Academic Visual'}</p>
              <div className="mt-4 flex gap-2">
                {heroGalleryPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === activePhotoIndex ? 'w-8 bg-white' : 'w-2 bg-white/55 hover:bg-white/80'}`}
                    aria-label={`Show hero slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="mt-4 grid gap-2 text-sm text-white/90">
                <a href="tel:+918401067372" className="inline-flex items-center gap-2 hover:text-white">
                  <Phone size={15} /> +91 8401067372
                </a>
                <a href="mailto:librarian@gtu.edu.in" className="inline-flex items-center gap-2 hover:text-white">
                  <Mail size={15} /> librarian@gtu.edu.in
                </a>
                <div className="inline-flex items-start gap-2 text-white/85">
                  <MapPin size={15} className="mt-0.5" />
                  <span>Central Library, GTU, Chandkheda, Ahmedabad</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-white/85">
          <a href="#home-content" className="inline-flex flex-col items-center gap-1 text-[11px] uppercase tracking-[0.2em]">
            Scroll
            <span className="h-8 w-px bg-white/65" />
          </a>
        </div>
      </section>

      <div id="home-content" className="relative z-10 bg-(--color-bg) container-shell space-y-24 pb-24 pt-16">

      {/* 2. Enhanced Latest Updates (Dynamic Recent Posts) */}
      <section className="relative px-4 pt-15">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 
                ref={(el) => (headingRefs.current['updates'] = el)}
                className="font-bold text-2xl text-[#1E293B] mb-2"
              >
                Recent Acquisitions
              </h3>
              <PencilStrokeUnderline 
                className="w-48 h-2 -mt-1" 
                inView={headingInView['updates']} 
              />
            </div>
            <a href="/all-blogs" className="text-xs font-bold text-[#B45309] hover:underline uppercase tracking-wider">Archive Index</a>
          </div>
        </div>

        {loading ? (
          <div className="text-slate-500 text-sm font-mono">Cataloging entries...</div>
        ) : recentPosts.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {recentPosts.map((post) => (
              <a 
                key={post.id} 
                href={`/content/${post.id}`}
                className="library-card min-w-75 group relative rounded-r-xl rounded-l-sm bg-[#FAF9F6] p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 border-[#B45309]"
              >
                <div className="mb-4 flex justify-between items-start">
                  <span className="rounded bg-[#1E293B] px-3 py-1 text-[10px] font-bold text-[#FAF9F6] tracking-wider font-mono">
                    {post.format || 'ARTICLE'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently Added'}
                  </span>
                </div>
                <h4 className="line-clamp-2 font-semibold text-[#1E293B] group-hover:text-[#B45309] transition-colors">
                  {post.title}
                </h4>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2">{post.description}</p>
                <div className="mt-4 flex items-center text-xs font-bold text-[#B45309] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                  REFERENCE <ArrowRight size={14} className="ml-1" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-sm font-mono">No entries cataloged yet.</div>
        )}
      </section>

      {/* 3. Search Bar with Library Catalog Drawer */}
      <section className="relative mx-auto max-w-4xl px-4">
        <div className="mb-3 text-center">
          <h3 
            ref={(el) => (headingRefs.current['search'] = el)}
            className="font-bold text-2xl text-[#1E293B] inline-block"
          >
            Card Catalog Search
          </h3>
          <PencilStrokeUnderline 
            className="w-56 h-2 mx-auto" 
            inView={headingInView['search']} 
          />
        </div>
        <div className="relative">
          <div className="flex items-center rounded-r-lg rounded-l-sm bg-[#FAF9F6] shadow-xl  library-card">
            <Search className="ml-6 text-[#1E293B]" size={24} />
            <input 
              type="text" 
              placeholder="Search the catalog by title, author, or subject..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-8 pl-4 pr-8 text-xl outline-none placeholder:text-slate-400 font-serif"
            />
            
          </div>
          
          {/* Library Catalog Drawer Results */}
          {searchQuery.trim() && (
            <div className="catalog-drawer absolute top-full left-0 right-0 mt-2 rounded-r-lg rounded-l-sm bg-[#FAF9F6] shadow-2xl z-50 max-h-96 overflow-y-auto  border-slate-200">
              {searchResults.length > 0 ? (
                <div className="p-4 space-y-1">
                  {searchResults.slice(0, 6).map((result, idx) => (
                    <a
                      key={result.id}
                      href={`/content/${result.id}`}
                      className="block p-4 hover:bg-white/70 transition-colors border-b border-slate-200 last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <span className="font-mono text-xs text-[#B45309] font-bold mt-1 shrink-0">
                          {String(idx + 1).padStart(3, '0')}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-[#1E293B] line-clamp-1">{result.title}</div>
                          <div className="text-xs text-slate-600 mt-1 line-clamp-2 font-serif">{result.description}</div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {result.sections?.slice(0, 2).map((section, i) => (
                              <span key={i} className="inline-block text-[10px] bg-[#1E293B] text-[#FAF9F6] px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                                {section}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                  {searchResults.length > 6 && (
                    <div className="text-center py-3 text-xs text-slate-500 font-mono border-t border-slate-200">
                      +{searchResults.length - 6} more catalog entries
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-600 text-sm font-mono">
                  No matches found for "<span className="font-bold">{searchQuery}</span>"
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. Dynamic Browse Collections Section - Library Shelves */}
      <section className="relative px-6 pb-32">
        {/* Header for Discovery */}
        <div className="mx-auto mb-12 max-w-7xl">
          <div className="flex items-end justify-between pb-8">
            <div>
              <h2 
                ref={(el) => (headingRefs.current['collections'] = el)}
                className="text-3xl font-black tracking-tight text-[#1E293B]"
              >
                Collection Shelves
              </h2>
              <PencilStrokeUnderline 
                className="w-64 h-2 mt-1" 
                inView={headingInView['collections']} 
              />
              <p className="mt-3 text-slate-600 font-medium font-serif">Hand-curated resources indexed by subject classification.</p>
            </div>
            <a href="/library" className="text-sm font-bold text-[#B45309] hover:text-[#1E293B] transition uppercase tracking-wider">Complete Index</a>
          </div>
        </div>

        {/* Dynamic Collections - Book Spine Cards */}
        {loading ? (
          <div className="text-center text-slate-500 py-10 font-mono">Retrieving from stacks...</div>
        ) : Object.keys(categoryPostsMap).length > 0 ? (
          <div className="relative overflow-hidden py-10">
            <div className="flex animate-float gap-8 whitespace-nowrap">
              {Object.entries(categoryPostsMap).concat(Object.entries(categoryPostsMap)).map(([sectionName, posts], index) => (
                <a
                  key={`${sectionName}-${index}`}
                  href={`/${sectionName.toLowerCase().replace(/\s+/g, '-')}`}
                  className="book-spine-card group relative w-80 shrink-0 overflow-hidden rounded-r-2xl rounded-l-sm bg-[#FAF9F6] p-6 shadow-lg  transition-all duration-500 hover:shadow-2xl library-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Dewey Decimal Style Number */}
                  <div className="absolute top-4 right-4 font-mono text-xs text-[#B45309] font-bold">
                    {String(index + 100).substring(0, 3)}
                  </div>

                  {/* Category Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#1E293B] group-hover:text-[#B45309] transition-colors">
                      {sectionName}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 font-mono">
                      {posts.length} vol{posts.length !== 1 ? 's' : ''} • Circulating
                    </p>
                  </div>

                  {/* Table of Contents Preview */}
                  <div className="space-y-2 mb-6">
                    {posts.slice(0, 3).map((post, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#B45309]" />
                        <span className="line-clamp-2 flex-1 font-serif">{post.title}</span>
                      </div>
                    ))}
                    {posts.length > 3 && (
                      <div className="text-xs text-slate-400 pl-3.5 font-mono">
                        ...and {posts.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Check Out Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">Browse Shelf</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E293B] text-[#FAF9F6] transition-all group-hover:scale-110 group-hover:bg-[#B45309]">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Fading Edge Masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white to-transparent z-10" />
          </div>
        ) : (
          <div className="text-center text-slate-500 py-10 font-mono">No volumes cataloged yet.</div>
        )}
      </section>

      {/* 5. Gallery Preview Section - Visual Archive */}
      <section className="relative px-6 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Camera className="text-[#B45309]" size={20} />
                <h2 
                  ref={(el) => (headingRefs.current['gallery'] = el)}
                  className="text-3xl font-black tracking-tight text-[#1E293B]"
                >
                  Photographic Archive
                </h2>
              </div>
              <PencilStrokeUnderline 
                className="w-72 h-2 ml-8" 
                inView={headingInView['gallery']} 
              />
              <p className="text-slate-600 font-medium mt-3 font-serif">Visual documentation from institutional activities</p>
            </div>
            <a href="/gallery" className="text-sm font-bold text-[#B45309] hover:text-[#1E293B] transition uppercase tracking-wider">
              Full Archive
            </a>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-10 font-mono">Developing plates...</div>
          ) : galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPhotos.map((photo) => (
                <a
                  key={photo.id}
                  href="/gallery"
                  className="group relative block overflow-hidden rounded-r-xl rounded-l-sm bg-slate-100 shadow-md transition-all hover:shadow-2xl hover:-translate-y-1 h-50 "
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1E293B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[#FAF9F6] text-sm font-medium line-clamp-2 font-serif">{photo.title}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10 font-mono">No photographs on file.</div>
          )}
        </div>
      </section>

      {/* 6. CV Snapshot and Contact - Biographical Entry */}
      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-r-3xl rounded-l-sm  bg-[#FAF9F6] shadow-xl library-card">
            <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B45309] font-mono">Biographical Entry</p>
                <h2 className="text-3xl font-bold leading-tight text-[#1E293B] md:text-4xl font-serif">
                  Dr. Mahesh K. Solanki
                </h2>
                <p className="text-base leading-relaxed text-slate-700 font-serif">
                  An academic chronicle documenting scholarly contributions, institutional leadership, and professional
                  activities in Library and Information Science. This platform serves as a digital repository for research
                  publications and ongoing library initiatives.
                </p>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <div className="rounded-r-xl rounded-l-sm border-l-4 border-[#B45309] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-mono">Classification</p>
                    <p className="mt-1 font-semibold text-[#1E293B] font-serif">University Librarian, GTU</p>
                  </div>
                  <div className="rounded-r-xl rounded-l-sm border-l-4 border-[#B45309] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-mono">Credentials</p>
                    <p className="mt-1 font-semibold text-[#1E293B] font-mono">MLISc, GSLET, Ph.D.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-r-2xl rounded-l-sm border-l-4 border-[#B45309] bg-white p-6 shadow-sm">
                <div className="passport-frame mx-auto mb-5 w-full max-w-40">
                  <div className="passport-photo-placeholder min-h-44">
                   <img src="/Profile.jpeg" alt="Dr. Mahesh K. Solanki" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] font-serif">Contact Information</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <a href="tel:+918401067372" className="flex items-start gap-3 transition-colors hover:text-[#B45309] font-mono">
                    <Phone size={17} className="mt-0.5 text-[#B45309]" />
                    <span>+91 8401067372</span>
                  </a>
                  <a href="mailto:dr.maheshs13@gmail.com" className="flex items-start gap-3 transition-colors hover:text-[#B45309] font-mono">
                    <Mail size={17} className="mt-0.5 text-[#B45309]" />
                    <span>dr.maheshs13@gmail.com</span>
                  </a>
                  <a href="mailto:librarian@gtu.edu.in" className="flex items-start gap-3 transition-colors hover:text-[#B45309] font-mono">
                    <Mail size={17} className="mt-0.5 text-[#B45309]" />
                    <span>librarian@gtu.edu.in</span>
                  </a>
                </div>
                <a
                  href="/profile"
                  className="mt-6 inline-flex items-center justify-center rounded-r-xl rounded-l-sm bg-neutral-300 px-5 py-3 text-sm font-semibold text-[#FAF9F6] transition-colors hover:bg-[#B45309] uppercase tracking-wider border-l-4 border-[#B45309]"
                >
                  Complete Record <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Scroll to Top - Fountain Pen Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1E293B] text-[#FAF9F6] shadow-xl transition-all hover:scale-110 hover:bg-[#B45309] border-2 border-[#B45309]"
          aria-label="Scroll to top"
        >
          <FountainPenIcon className="h-6 w-6" />
        </button>
      )}

      {/* Animation Styles + Library Aesthetic */}
      <style>{`
        @keyframes float {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.14); }
          50% { box-shadow: 0 0 0 8px rgba(180, 83, 9, 0); }
        }

        .animate-float {
          animation: float 40s linear infinite;
        }

        .animate-float:hover {
          animation-play-state: paused;
        }

        /* Library Index Card Aesthetic */
        .library-card {
          position: relative;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 31px,
              rgba(30, 41, 59, 0.08) 31px,
              rgba(30, 41, 59, 0.08) 32px
            ),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%231E293B' fill-opacity='0.02'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          background-color: #FAF9F6;
        }

        /* Pull from Shelf Effect - Book Spine Cards */
        .book-spine-card {
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .book-spine-card:hover {
          transform: perspective(1000px) rotateY(-5deg) translateX(10px);
        }

        /* Catalog Drawer Effect */
        .catalog-drawer {
          animation: drawerSlide 0.3s ease-out;
        }

        @keyframes drawerSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .passport-frame {
          border-radius: 18px;
          border: 2px solid #B45309;
          background: linear-gradient(180deg, #FAF9F6, #f8f5ef);
          padding: 8px;
          animation: pulseBorder 3.2s ease-in-out infinite;
        }

        .passport-photo-placeholder {
          min-height: 210px;
          border-radius: 14px;
          border: 1px dashed #B45309;
          background: linear-gradient(160deg, #FAF9F6, #f2f6fb);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Monospace font for academic precision */
        .font-mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }

        .font-serif {
          font-family: 'Crimson Text', 'Merriweather', Georgia, serif;
        }
      `}</style>
    </div>
  )
}

export default Home