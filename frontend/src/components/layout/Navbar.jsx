import { NavLink } from "react-router-dom";
import { Search, Plus, ArrowRight, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useContent } from "../../context/ContentContext";

const NAV_GROUPS = [
  {
    title: "Knowledge Hub",
    links: ["Research Papers", "Library Reports", "Gujarati Content", "Events & Workshops"]
  },
  {
    title: "Activities & Events",
    links: ["Conferences", "Workshops", "Reports", "Gallery"]
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
      <div className="mx-auto flex max-w-350 items-center justify-between px-12 py-10 border-b border-[#B89B5E]/30">
        
        <NavLink to="/" className="group">
          <div className="flex flex-col gap-4">
            <h1 className="text-7xl font-serif italic leading-none tracking-tight">
              Dr. Mahesh
              <span className="ml-3 not-italic font-bold text-[#B89B5E]">
                Solanki
              </span>
            </h1>

            <div className="flex items-center gap-4">
              <span className="h-px w-16 bg-[#B89B5E]/60 group-hover:w-28 transition-all" />
              <h4 className="text-xs uppercase tracking-[0.35em] text-[#F3EBDD]/70">
                Librarian <span className="mx-2 opacity-40">|</span> Gujarat Technological University
              </h4>
            </div>
          </div>
        </NavLink>

        <div className="flex items-center gap-10">
          <NavLink
            to="/all-blogs"
            className="text-sm uppercase tracking-[0.25em] border-b border-transparent hover:border-[#B89B5E] transition"
          >
            View All Blogs
          </NavLink>

          <button 
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-4 bg-[#B89B5E] text-[#1F3A33] px-6 py-3 font-semibold uppercase tracking-widest hover:brightness-110 transition"
          >
            <Search size={20} strokeWidth={2} />
            Search
          </button>
        </div>
      </div>

      {/* Navigation Grid */}
      <nav className="bg-[#F3EBDD] text-[#1F3A33]">
        <div className="mx-auto max-w-350">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-[#1F3A33]/10">

            {NAV_GROUPS.map((group) => (
              <div
                key={group.title}
                className="p-12 hover:bg-[#E6DCCB] transition-colors"
              >
                <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-[#1F3A33]/70 flex items-center gap-2">
                  <Plus size={14} strokeWidth={3} />
                  {group.title}
                </h3>

                <ul className="space-y-5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <NavLink
                        to={`/${slugify(link)}`}
                        className={({ isActive }) =>
                          `group flex items-center justify-between text-lg font-semibold transition-all ${
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
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-gray-200 p-6">
              <Search className="text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search all content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 ml-4 text-lg outline-none placeholder:text-gray-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto p-4">
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
