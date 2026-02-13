import { NavLink } from 'react-router-dom';
import { Search, Plus, ArrowRight } from 'lucide-react';

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
  const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');

  return (
    <header className="w-full bg-gradient-to-b from-[#0F172A] to-[#111827] text-[#F5EFE6] antialiased">

  {/* Brand Section */}
  <div className="mx-auto flex max-w-[1400px] items-center justify-between px-12 py-10 border-b border-[#C2A878]/30">
    
    <NavLink to="/" className="group inline-block">
      <div className="flex flex-col gap-4">
        
        <h1 className="text-7xl font-serif italic tracking-tight leading-none">
          Dr. Mahesh
          <span className="ml-3 not-italic font-bold text-[#C2A878]">
            Solanki
          </span>
        </h1>

        <div className="flex items-center gap-4">
          <span className="h-[1px] w-16 bg-[#C2A878]/60 transition-all group-hover:w-28" />
          <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#F5EFE6]/70">
            Librarian <span className="mx-2 opacity-40">|</span> Gujarat Technological University
          </h4>
        </div>

      </div>
    </NavLink>

    <div className="flex items-center gap-10">
      <NavLink
        to="/all-blogs"
        className="text-sm font-semibold uppercase tracking-[0.25em] border-b border-transparent hover:border-[#C2A878] transition-colors"
      >
        View All Blogs
      </NavLink>

      <button className="group flex items-center gap-4 bg-[#C2A878] text-[#0F172A] px-7 py-3 font-semibold uppercase tracking-widest hover:brightness-110 transition-all">
        <Search size={20} strokeWidth={2} />
        Search
      </button>
    </div>
  </div>

  {/* Navigation Grid */}
  <nav className="bg-[#F5EFE6] text-[#0F172A]">
    <div className="mx-auto max-w-[1400px]">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-[#0F172A]/10">
        
        {NAV_GROUPS.map((group) => (
          <div
            key={group.title}
            className="p-12 hover:bg-[#E9DFC8] transition-colors"
          >
            <h3 className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-[#0F172A]/70">
              {group.title}
            </h3>

            <ul className="space-y-5">
              {group.links.map((link) => (
                <li key={link}>
                  <NavLink
                    to={`/${slugify(link)}`}
                    className={({ isActive }) => `
                      group flex items-center justify-between text-lg font-semibold transition-all
                      ${isActive
                        ? 'text-[#C2A878]'
                        : 'hover:translate-x-2'}
                    `}
                  >
                    {link}
                    <ArrowRight
                      size={18}
                      strokeWidth={2}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
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