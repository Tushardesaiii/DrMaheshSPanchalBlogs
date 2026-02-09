import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, ChevronDown, Zap } from 'lucide-react';

const NAV_GROUPS = [
  {
    title: "Knowledge",
    links: ["Literature", "Competitive Exams", "Learning Resources", "Research Papers", "Library Reports", "Scholarships"]
  },
  {
    title: "Activities",
    links: ["Conferences", "Workshops", "Reports", "Gallery"]
  },
  {
    title: "Library",
    links: ["Books", "PDFs", "Articles", "Notes", "Tags & Filters"]
  },
  {
    title: "Connect",
    links: ["Contact Form", "Social Links"]
  }
];

export default function SecondaryNavbar() {
  const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white/95 backdrop-blur-md antialiased dark:border-cyan-400 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-400 items-center justify-between px-6 py-4">
        
        {/* Compact Brand */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="bg-black p-1 dark:bg-cyan-400">
            <Zap size={20} className="text-white dark:text-slate-950" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white">
            MAHESH<span className="text-cyan-500 dark:text-cyan-400">SIR</span>
          </h1>
        </NavLink>

        {/* Hover-Triggered Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="group relative px-4 py-2">
              <button className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-black dark:text-slate-400 dark:group-hover:text-cyan-400 transition-colors">
                {group.title}
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </button>

              {/* The "More Good" Hover List */}
              <div className="invisible absolute left-0 top-full pt-4 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <ul className="w-64 border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-cyan-400 dark:bg-slate-900 dark:shadow-[8px_8px_0px_0px_rgba(34,211,238,0.3)]">
                  {group.links.map((link) => (
                    <li key={link}>
                      <NavLink 
                        to={`/${slugify(link)}`}
                        className={({ isActive }) => `
                          block py-2 text-sm font-bold transition-all
                          ${isActive 
                            ? 'text-cyan-600' 
                            : 'text-slate-700 hover:text-black hover:translate-x-1 dark:text-slate-300 dark:hover:text-cyan-400'}
                        `}
                      >
                        {link}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <NavLink to="/all-blogs" className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black dark:hover:text-white">
            All Content
          </NavLink>
          <button className="flex h-10 w-10 items-center justify-center border-2 border-black bg-black text-white transition-all hover:bg-cyan-500 hover:border-cyan-500 dark:border-cyan-400 dark:bg-transparent dark:text-cyan-400 dark:hover:bg-cyan-400 dark:hover:text-slate-950">
            <Search size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </header>
  );
}