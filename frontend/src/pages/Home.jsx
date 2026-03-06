import { useState, useMemo, useEffect } from 'react'
import { Search, ArrowRight, Camera, MapPin, Mail, Phone, UserSquare2 } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { getPrimaryMedia } from '../utils/media'

function Home() {
  const { loading, getNormalizedByFormat, getNormalizedBySection } = useContent()
  const [searchQuery, setSearchQuery] = useState('')
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h3 className="font-semibold uppercase tracking-widest text-xs text-(--color-primary)">Live Updates</h3>
          </div>
          <a href="/all-blogs" className="text-xs font-bold text-(--color-accent) hover:underline">View Archive</a>
        </div>

        {loading ? (
          <div className="text-(--color-muted) text-sm">Loading recent posts...</div>
        ) : recentPosts.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {recentPosts.map((post) => (
              <a 
                key={post.id} 
                href={`/content/${post.id}`}
                className="min-w-75 group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="mb-4 flex justify-between items-start">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                    {post.format || 'ARTICLE'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently Added'}
                  </span>
                </div>
                <h4 className="line-clamp-2 font-medium text-(--color-primary) group-hover:text-(--color-accent)">
                  {post.title}
                </h4>
                <p className="mt-2 text-xs text-gray-500 line-clamp-1">{post.description}</p>
                <div className="mt-4 flex items-center text-xs font-bold text-(--color-accent) opacity-0 group-hover:opacity-100 transition-opacity">
                  READ MORE <ArrowRight size={14} className="ml-1" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-(--color-muted) text-sm">No posts available yet.</div>
        )}
      </section>

      {/* 3. Search Bar with Dynamic Results */}
      <section className="relative mx-auto max-w-4xl px-4">
        <div className="absolute -inset-1 rounded-4xl bg-linear-to-r from-(--color-accent) to-blue-500 opacity-20 blur-xl"></div>
        <div className="relative">
          <div className="flex items-center rounded-2xl bg-white shadow-2xl">
            <Search className="ml-6 text-gray-400" size={24} />
            <input 
              type="text" 
              placeholder="Search the entire archive..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-8 pl-4 pr-8 text-xl outline-none placeholder:text-gray-300"
            />
            <div className="mr-4 hidden sm:block">
              <kbd className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-400">⌘ K</kbd>
            </div>
          </div>
          
          {/* Dynamic Search Results Dropdown */}
          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-100">
              {searchResults.length > 0 ? (
                <div className="p-4 space-y-2">
                  {searchResults.slice(0, 6).map((result) => (
                    <a
                      key={result.id}
                      href={`/content/${result.id}`}
                      className="block p-3 rounded-lg hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-(--color-accent)"
                    >
                      <div className="font-semibold text-sm text-(--color-primary) line-clamp-1">{result.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{result.description}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {result.sections?.slice(0, 2).map((section, idx) => (
                          <span key={idx} className="inline-block text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {section}
                          </span>
                        ))}
                      </div>
                    </a>
                  ))}
                  {searchResults.length > 6 && (
                    <div className="text-center py-2 text-xs text-gray-500 border-t">
                      +{searchResults.length - 6} more results
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. Dynamic Browse Collections Section */}
      <section className="relative px-6 pb-32">
        {/* Header for Discovery */}
        <div className="mx-auto mb-12 max-w-7xl">
          <div className="flex items-end justify-between border-b border-slate-100 pb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">Browse Collections</h2>
              <p className="mt-2 text-slate-500 font-medium">Explore hand-picked resources across all academic departments.</p>
            </div>
            <a href="/library" className="text-sm font-bold text-(--color-accent) hover:text-black transition">View All Folders</a>
          </div>
        </div>

        {/* Dynamic Collections - Floating Cards */}
        {loading ? (
          <div className="text-center text-(--color-muted) py-10">Loading collections...</div>
        ) : Object.keys(categoryPostsMap).length > 0 ? (
          <div className="relative overflow-hidden py-10">
            <div className="flex animate-float gap-8 whitespace-nowrap">
              {Object.entries(categoryPostsMap).concat(Object.entries(categoryPostsMap)).map(([sectionName, posts], index) => (
                <a
                  key={`${sectionName}-${index}`}
                  href={`/${sectionName.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative w-80 shrink-0 overflow-hidden rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:ring-(--color-accent)"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Category Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-(--color-primary) group-hover:text-(--color-accent) transition-colors">
                      {sectionName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {posts.length} item{posts.length !== 1 ? 's' : ''} • Recently updated
                    </p>
                  </div>

                  {/* Recent Posts Preview */}
                  <div className="space-y-3 mb-6">
                    {posts.slice(0, 3).map((post, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-accent)" />
                        <span className="line-clamp-2 flex-1">{post.title}</span>
                      </div>
                    ))}
                    {posts.length > 3 && (
                      <div className="text-xs text-gray-400 pl-3.5">
                        +{posts.length - 3} more...
                      </div>
                    )}
                  </div>

                  {/* Browse Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-400">View Collection</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:scale-110 group-hover:bg-(--color-accent) group-hover:text-white">
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
          <div className="text-center text-(--color-muted) py-10">No collections available yet.</div>
        )}
      </section>

      {/* 5. Gallery Preview Section */}
      <section className="relative px-6 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="text-(--color-accent)" size={20} />
                <h2 className="text-3xl font-black tracking-tight text-slate-900">Visual Archive</h2>
              </div>
              <p className="text-slate-500 font-medium">Moments captured from our academic journey</p>
            </div>
            <a href="/gallery" className="text-sm font-bold text-(--color-accent) hover:text-black transition">
              View All Photos
            </a>
          </div>

          {loading ? (
            <div className="text-center text-(--color-muted) py-10">Loading gallery...</div>
          ) : galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPhotos.map((photo) => (
                <a
                  key={photo.id}
                  href="/gallery"
                  className="group relative block overflow-hidden rounded-2xl bg-slate-100 shadow-md transition-all hover:shadow-2xl hover:-translate-y-1 h-50"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-medium line-clamp-2">{photo.title}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-(--color-muted) py-10">No photos available yet.</div>
          )}
        </div>
      </section>

      {/* 6. CV Snapshot and Contact */}
      <section className="relative px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-[#f8f1e7] shadow-xl">
            <div className="grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-(--color-accent)">CV Section</p>
                <h2 className="text-3xl font-bold leading-tight text-(--color-primary) md:text-4xl">
                  Hello, I'm Dr. Mahesh K. Solanki and this is a snapshot of my academic journey
                </h2>
                <p className="text-base leading-relaxed text-slate-600">
                  This platform shares my academic work, publications, and professional activities. Stay connected
                  for updates on library initiatives and research programs. Thank you for visiting and supporting
                  the culture of reading and research.
                </p>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Current Role</p>
                    <p className="mt-1 font-semibold text-(--color-primary)">University Librarian, GTU</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Academic Credentials</p>
                    <p className="mt-1 font-semibold text-(--color-primary)">MLISc, GSLET, Ph.D.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="passport-frame mx-auto mb-5 w-full max-w-40">
                  <div className="passport-photo-placeholder min-h-44">
                   <img src="/Profile.jpeg" alt="" srcset="" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-(--color-primary)">Reach Out</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <a href="tel:+918401067372" className="flex items-start gap-3 transition-colors hover:text-(--color-primary)">
                    <Phone size={17} className="mt-0.5 text-(--color-accent)" />
                    <span>+91 8401067372</span>
                  </a>
                  <a href="mailto:dr.maheshs13@gmail.com" className="flex items-start gap-3 transition-colors hover:text-(--color-primary)">
                    <Mail size={17} className="mt-0.5 text-(--color-accent)" />
                    <span>dr.maheshs13@gmail.com</span>
                  </a>
                  <a href="mailto:librarian@gtu.edu.in" className="flex items-start gap-3 transition-colors hover:text-(--color-primary)">
                    <Mail size={17} className="mt-0.5 text-(--color-accent)" />
                    <span>librarian@gtu.edu.in</span>
                  </a>
                  
                </div>
                <a
                  href="/profile"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-(--color-accent) px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--color-primary)"
                >
                  Explore Full Profile <ArrowRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212, 165, 116, 0.14); }
          50% { box-shadow: 0 0 0 8px rgba(212, 165, 116, 0); }
        }

        .animate-float {
          animation: float 40s linear infinite;
        }

        .animate-float:hover {
          animation-play-state: paused;
        }

        .passport-frame {
          border-radius: 18px;
          border: 1px solid #e6dccf;
          background: linear-gradient(180deg, #fff, #f8f5ef);
          padding: 8px;
          animation: pulseBorder 3.2s ease-in-out infinite;
        }

        .passport-photo-placeholder {
          min-height: 210px;
          border-radius: 14px;
          border: 1px dashed #d4a574;
          background: linear-gradient(160deg, #fff7ea, #f2f6fb);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Home