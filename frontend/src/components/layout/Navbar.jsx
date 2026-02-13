import { NavLink } from "react-router-dom";
import { Search, Plus, ArrowRight } from "lucide-react";

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
    links: ["Books", "PDFs", "Articles", "Notes", "Tags & Filters"]
  },
  {
    title: "Collaboration",
    links: ["Contact Form", "Social Links", "Profile"]
  }
];

export default function Navbar() {
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

          <button className="flex items-center gap-4 bg-[#B89B5E] text-[#1F3A33] px-6 py-3 font-semibold uppercase tracking-widest hover:brightness-110 transition">
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
    </header>
  );
}
