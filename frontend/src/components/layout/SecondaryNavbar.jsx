import { NavLink } from "react-router-dom";
import { Search, ChevronDown, ArrowRight } from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Knowledge",
    links: ["Literature", "Competitive Exams", "Learning Resources", "Research Papers", "Scholarships"]
  },
  {
    title: "Activities",
    links: ["Conferences", "Workshops", "Reports", "Gallery"]
  },
  {
    title: "Digital Library",
    links: ["Books", "PDFs", "Articles", "Notes"]
  },
  {
    title: "Connect",
    links: ["Contact Form", "Social Links", "Profile"]
  }
];

export default function SecondaryNavbar() {
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

          <button className="group flex h-10 w-10 md:h-11 md:w-11 items-center justify-center border-2 border-[#B89B5E] bg-[#B89B5E] text-[#1F3A33] rounded transition-all hover:bg-[#1F3A33] hover:text-[#B89B5E]">
            <Search size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </header>
  );
}