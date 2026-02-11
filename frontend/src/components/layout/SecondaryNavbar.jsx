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
    links: ["Contact Form", "Social Links", "Profile"]
  }
];

export default function Navbar() {
  const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-[#facc15] text-black antialiased">
      <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-3">
        
        {/* Unified Brand Section */}
        <NavLink to="/" className="group flex flex-col">
          <h1 className="text-3xl font-serif italic tracking-tighter leading-none">
            Dr. Mahesh <span className="bg-black text-[#facc15] px-1.5 not-italic">Solanki</span>
          </h1>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
            Librarian : Gujarat Technological University
          </h4>
        </NavLink>

        {/* High-Contrast Sticky Nav */}
        <nav className="hidden md:flex items-center">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="group relative">
              <button className="flex items-center gap-1.5 px-5 py-6 text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:bg-black hover:text-[#facc15]">
                {group.title}
                <ChevronDown size={14} strokeWidth={4} className="transition-transform group-hover:rotate-180" />
              </button>

              {/* The "Boxy" Dropdown */}
              <div className="invisible absolute left-0 top-full w-64 pt-0 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                <ul className="border-4 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                  {group.links.map((link) => (
                    <li key={link} className="border-b-2 border-black last:border-0">
                      <NavLink 
                        to={`/${slugify(link)}`}
                        className={({ isActive }) => `
                          group/item flex items-center justify-between p-4 text-xs font-black uppercase tracking-widest transition-all
                          ${isActive 
                            ? 'bg-[#facc15] text-[#facc15]' 
                            : 'text-black hover:bg-[#facc15]'}
                        `}
                      >
                        {link}
                        <ArrowRight size={18} strokeWidth={3} className="opacity-0 -translate-x-3 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
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
          <NavLink to="/all-blogs" className="hidden lg:block text-xs font-black uppercase tracking-[0.2em] border-b-4 border-black pb-0.5  hover:text-[#facc15] transition-all">
            Full Index
          </NavLink>
          
          <button className="group flex h-12 w-12 items-center justify-center border-4 border-black bg-black text-[#facc15] transition-all hover:bg-[#facc15] hover:text-black">
            <Search size={22} strokeWidth={4} />
          </button>
        </div>
      </div>
    </header>
  );
}