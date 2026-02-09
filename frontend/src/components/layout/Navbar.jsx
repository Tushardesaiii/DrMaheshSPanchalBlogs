import { NavLink } from 'react-router-dom';
import { Search, Plus, ArrowRight } from 'lucide-react';

const NAV_GROUPS = [
  {
    title: "Knowledge Hub",
    links: ["Literature", "Competitive Exams", "Learning Resources", "Research Papers", "Library Reports", "Gujarati Content", "Scholarships", "Events & Workshops"]
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
    links: ["Contact Form", "Social Links"]
  }
];

export default function Navbar() {
  const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');

  return (
    <header className="w-full bg-[#0a0a0a] text-white antialiased">
      {/* Brand Section */}
      <div className="mx-auto flex max-w-400 items-center justify-between px-10 py-14">
        <NavLink to="/" className="group">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            MAHESH<span className="text-[#d9f99d]">SIR</span>
          </h1>
          <div className="h-1.5 w-24 bg-[#d9f99d] mt-2 group-hover:w-full transition-all duration-500"></div>
        </NavLink>

        <div className="flex items-center gap-12">
          <NavLink to="/all-blogs" className="text-sm font-black uppercase tracking-[0.3em] text-[#d9f99d] hover:brightness-125">
            View All Blogs
          </NavLink>
          <button className="group flex items-center gap-4 border-2 border-white px-8 py-4 transition-all hover:bg-white hover:text-black">
            <Search size={20} strokeWidth={3} />
            <span className="text-sm font-black uppercase tracking-widest">Search</span>
          </button>
        </div>
      </div>

      {/* High-Visibility Navigation Grid */}
      <nav className="border-y-2 border-zinc-800">
        <div className="mx-auto max-w-400">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-zinc-800">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="p-10 transition-colors hover:bg-[#111]">
                <h3 className="mb-10 flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-zinc-500">
                  <Plus size={14} className="text-[#d9f99d]" />
                  {group.title}
                </h3>
                
                <ul className="space-y-5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <NavLink 
                        to={`/${slugify(link)}`}
                        className={({ isActive }) => `
                          group flex items-center justify-between text-lg font-bold transition-all
                          ${isActive 
                            ? 'text-[#d9f99d] translate-x-2' 
                            : 'text-zinc-100 hover:text-[#d9f99d] hover:translate-x-2'}
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#d9f99d] scale-0 group-hover:scale-100 transition-transform" />
                          {link}
                        </span>
                        <ArrowRight size={18} className="opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
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