import { NavLink } from 'react-router-dom';
import { Search, ChevronDown, ArrowRight } from 'lucide-react';

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
    links: ["Contact Form", "Social Links"]
  }
];

export default function Navbar() {
  const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#d9f99d] bg-[#0a0a0a] text-white antialiased">
      <div className="mx-auto flex max-w-400 items-center justify-between px-6 py-4">
        
        {/* Compact Logo */}
        <NavLink to="/" className="group flex items-center gap-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
            MAHESH<span className="text-[#d9f99d]">SIR</span>
          </h1>
          <div className="h-4 w-0.5 bg-[#d9f99d] rotate-12 group-hover:rotate-45 transition-transform" />
        </NavLink>

        {/* Minimalist Sticky Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="group relative">
              <button className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-[#d9f99d]">
                {group.title}
                <ChevronDown size={12} className="transition-transform group-hover:rotate-180 text-zinc-600 group-hover:text-[#d9f99d]" />
              </button>

              {/* High-Visibility Hover List */}
              <div className="invisible absolute left-0 top-full w-64 pt-2 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <ul className="border-2 border-[#d9f99d] bg-[#0a0a0a] p-4 shadow-[10px_10px_0px_0px_rgba(217,249,157,0.1)]">
                  {group.links.map((link) => (
                    <li key={link}>
                      <NavLink 
                        to={`/${slugify(link)}`}
                        className={({ isActive }) => `
                          group/item flex items-center justify-between py-2 text-sm font-bold transition-all
                          ${isActive 
                            ? 'text-[#d9f99d] translate-x-2' 
                            : 'text-zinc-100 hover:text-[#d9f99d] hover:translate-x-2'}
                        `}
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#d9f99d] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          {link}
                        </span>
                        <ArrowRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <NavLink to="/all-blogs" className="hidden lg:block text-[10px] font-black uppercase tracking-[0.3em] text-[#d9f99d] hover:brightness-125">
            Full Index
          </NavLink>
          <button className="flex h-10 w-10 items-center justify-center border-2 border-white text-white transition-all hover:bg-[#d9f99d] hover:border-[#d9f99d] hover:text-black">
            <Search size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </header>
  );
}