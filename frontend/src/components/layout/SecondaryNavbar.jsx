import { NavLink } from "react-router-dom";
import { Search, ChevronDown, ArrowRight, X } from "lucide-react";
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

export default function SecondaryNavbar() {
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

  const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and");

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#B89B5E] bg-[#1F3A33] text-[#F3EBDD] shadow-md">
      <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-3">

        {/* Brand */}
        <NavLink to="/" className="group flex flex-col">
          <h1 className="text-2xl md:text-3xl font-serif italic tracking-tight leading-none">
            Dr. Mahesh <span className="not-italic font-bold text-[#B89B5E]">Solanki</span>
          </h1>
          <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-[#F3EBDD]/80 group-hover:opacity-100 transition-opacity">
            Librarian : Gujarat Technological University
          </h4>
        </NavLink>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-3 relative">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="group relative">
              {/* Parent Nav Button */}
              <button className="flex items-center gap-1 px-4 py-2 text-[11px] md:text-[12px] font-black uppercase tracking-[0.15em] rounded transition-colors hover:bg-[#B89B5E] hover:text-[#1F3A33]">
                {group.title}
                <ChevronDown size={14} strokeWidth={3} className="transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu */}
              {/* Added 'invisible group-hover:visible' to ensure it doesn't flicker or show light text while hidden */}
              <div className="absolute left-0 top-full w-64 mt-1 rounded-lg overflow-hidden border-2 border-[#B89B5E] 
                              bg-[#F3EBDD] shadow-2xl transform scale-95 opacity-0 pointer-events-none 
                              invisible group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <ul className="flex flex-col bg-[#F3EBDD]">
                  {group.links.map((link) => (
                    <li key={link} className="border-b border-[#B89B5E]/30 last:border-0">
                      <NavLink
                        to={`/${slugify(link)}`}
                        className={({ isActive }) =>
                          `group/item flex items-center justify-between px-4 py-3 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all
                            ${
                              isActive
                                ? "bg-[#1F3A33]! text-[#F3EBDD]!" // Forced Active Colors
                                : "text-[#1F3A33]! bg-transparent hover:bg-[#B89B5E]! hover:text-[#1F3A33]!" // Forced Inactive/Hover Colors
                            }`
                        }
                      >
                        <span>{link}</span>
                        <ArrowRight
                          size={14}
                          strokeWidth={3}
                          className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0"
                        />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/all-blogs"
            className="hidden lg:block text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] border-b-2 border-[#B89B5E] pb-0.5 hover:text-[#B89B5E] transition-colors"
          >
            Full Index
          </NavLink>

          <button 
            onClick={() => setSearchOpen(true)}
            className="group flex h-10 w-10 md:h-11 md:w-11 items-center justify-center border-2 border-[#B89B5E] bg-[#B89B5E] text-[#1F3A33] rounded transition-all hover:bg-[#1F3A33] hover:text-[#B89B5E]"
          >
            <Search size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

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