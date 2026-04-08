import { NavLink } from "react-router-dom";
import { Search, Plus, ArrowRight, X, Menu } from "lucide-react";
import { useState, useMemo } from "react";
import { useContent } from "../../context/ContentContext";

const NAV_GROUPS = [
  {
    title: "Knowledge Hub",
    links: ["Research Papers", "Library Reports", "Gujarati Content", "Events & Workshops"]
  },
  {
    title: "Recognition",
    links: ["Achievements & Awards", "Appreciation Letters", "Certificates"]
  },
  {
    title: "Activities & Events",
    links: ["Conferences", "Workshops", "Reports", "Gallery", "Social Activities"]
  },
  {
    title: "Digital Library",
    links: ["Books", "PDFs", "Articles", "Notes"]
  },
  {
    title: "Collaboration",
    links: ["Contact Form", "Social Links", "Profile"]
  }
];

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { normalizedContents } = useContent();

  // Search functionality - search across title, description, and sections
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase()
    return normalizedContents.filter((item) => {
      const title = item.title?.toLowerCase() || ''
      const description = item.description?.toLowerCase() || ''
      const sections = (item.sections || []).map((s) => s.toLowerCase()).join(' ')
      
      return title.includes(query) || description.includes(query) || sections.includes(query)
    })
  }, [searchQuery, normalizedContents])

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and");

  return (
    <header className="w-full bg-[#1F3A33] text-[#F3EBDD]">
      
      {/* Brand Section */}
      <div className="mx-auto flex max-w-350 flex-col items-start justify-between gap-5 border-b border-[#B89B5E]/30 px-4 py-6 sm:px-6 md:flex-row md:items-center md:px-12 md:py-10">
        
        <NavLink to="/" className="group">
          <div className="flex flex-col gap-3 md:gap-4">
            <h1 className="text-4xl font-serif italic leading-none tracking-tight sm:text-5xl md:text-7xl">
              Dr. Mahesh
              <span className="ml-3 not-italic font-bold text-[#B89B5E]">
                Solanki
              </span>
            </h1>

            <div className="flex items-center gap-3 md:gap-4">
              <span className="h-px w-16 bg-[#B89B5E]/60 group-hover:w-28 transition-all" />
              <h4 className="text-[10px] uppercase tracking-[0.18em] text-[#F3EBDD]/70 sm:text-xs md:tracking-[0.35em]">
                Librarian <span className="mx-2 opacity-40">|</span> Gujarat Technological University
              </h4>
            </div>
          </div>
        </NavLink>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-6 md:gap-10">
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded border border-[#B89B5E] text-[#B89B5E] transition hover:bg-[#B89B5E] hover:text-[#1F3A33] md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <NavLink
            to="/cv"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 whitespace-nowrap border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition sm:px-4 sm:text-sm ${
                isActive
                  ? 'border-[#B89B5E] bg-[#B89B5E] text-[#1F3A33]'
                  : 'border-[#B89B5E] text-[#B89B5E] hover:bg-[#B89B5E] hover:text-[#1F3A33]'
              }`
            }
          >
            CV
          </NavLink>

          <NavLink
            to="/all-blogs"
            className="text-[11px] uppercase tracking-[0.18em] border-b border-transparent hover:border-[#B89B5E] transition sm:text-sm sm:tracking-[0.25em]"
          >
            View All Blogs
          </NavLink>

          <button 
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 bg-[#B89B5E] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1F3A33] transition hover:brightness-110 sm:gap-3 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            <Search size={16} strokeWidth={2} className="sm:h-5 sm:w-5" />
            Search
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="border-b border-[#B89B5E]/30 bg-[#24443b] px-4 py-4 md:hidden">
          <div className="grid grid-cols-1 gap-3">
            {NAV_GROUPS.map((group) => (
              <div key={`mobile-${group.title}`} className="rounded-lg border border-[#B89B5E]/25 bg-[#1f3a33] px-3 py-3">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#B89B5E]">{group.title}</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {group.links.map((link) => (
                    <NavLink
                      key={`mobile-${group.title}-${link}`}
                      to={`/${slugify(link)}`}
                      onClick={() => setMobileNavOpen(false)}
                      className={({ isActive }) =>
                        `rounded px-2.5 py-2 text-sm font-semibold transition-colors ${
                          isActive ? 'bg-[#B89B5E] text-[#1F3A33]' : 'text-[#F3EBDD] hover:bg-[#B89B5E]/20'
                        }`
                      }
                    >
                      {link}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Grid */}
      <nav className="hidden bg-[#F3EBDD] text-[#1F3A33] md:block">
        <div className="mx-auto max-w-350">
          <div className="grid grid-cols-1 divide-y divide-[#1F3A33]/10 md:grid-cols-5 md:divide-y-0 md:divide-x">

            {NAV_GROUPS.map((group) => (
              <div
                key={group.title}
                className="p-5 transition-colors hover:bg-[#E6DCCB] sm:p-7 md:p-9"
              >
                <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#1F3A33]/70 sm:mb-6 sm:text-xs sm:tracking-[0.3em]">
                  <Plus size={14} strokeWidth={3} />
                  {group.title}
                </h3>

                <ul className="space-y-3 sm:space-y-4">
                  {group.links.map((link) => (
                    <li key={link}>
                      <NavLink
                        to={`/${slugify(link)}`}
                        className={({ isActive }) =>
                          `group flex items-center justify-between text-base font-semibold transition-all sm:text-lg ${
                            isActive
                              ? "text-[#B89B5E]"
                              : "hover:translate-x-2"
                          }`
                        }
                      >
                        {link}
                        <ArrowRight
                          size={18}
                          strokeWidth={2}
                          className="opacity-0 group-hover:opacity-100 transition"
                        />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-3 pt-14 sm:px-4 sm:pt-20"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-gray-200 p-4 sm:p-6">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search all content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="ml-3 flex-1 text-base outline-none text-black placeholder:text-gray-400 sm:ml-4 sm:text-lg"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-[70vh] overflow-y-auto p-3 sm:max-h-96 sm:p-4">
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.slice(0, 8).map((result) => (
                      <NavLink
                        key={result.id}
                        to={`/content/${result.id}`}
                        onClick={() => {
                          setSearchOpen(false)
                          setSearchQuery('')
                        }}
                        className="block p-4 rounded-lg hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-[#B89B5E]"
                      >
                        <div className="font-semibold text-[#1F3A33] line-clamp-1">{result.title}</div>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-1">{result.description}</div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {result.sections?.slice(0, 2).map((section, idx) => (
                            <span key={idx} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {section}
                            </span>
                          ))}
                        </div>
                      </NavLink>
                    ))}
                    {searchResults.length > 8 && (
                      <div className="text-center py-3 text-sm text-gray-500 border-t">
                        +{searchResults.length - 8} more results
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )
              ) : (
                <div className="py-12 text-center text-gray-400">
                  Start typing to search all content...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
