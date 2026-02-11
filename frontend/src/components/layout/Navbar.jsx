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
    <header className="w-full h-fit  bg-[#facc15] text-black antialiased">
      {/* Brand Section */}
      <div className="mx-auto flex max-w-350 items-center justify-between px-10  py-6 border-b-4 border-black">
       <NavLink to="/" className="group inline-block">
  <div className="flex flex-col gap-2">
    <h1 className="text-7xl  font-serif italic tracking-tighter leading-none">
      Dr. Mahesh<span className="bg-black text-[#facc15] px-3 ml-2 not-italic">Solanki</span>
    </h1>
    
    <div className="flex items-center gap-4">
      <span className="h-0.5 w-12 bg-black transition-all group-hover:w-20" />
      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/80">
        Librarian <span className="mx-2 opacity-30">|</span> Gujarat Technological University
      </h4>
    </div>
  </div>
  
  {/* Animated Underline */}

</NavLink>

        <div className="flex items-center gap-10">
          <NavLink to="/all-blogs" className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:border-b-2 hover:border-[#facc15] hover:text-[#facc15] transition-colors">
            View All Blogs
          </NavLink>
          <button className="group flex items-center gap-4 bg-black text-[#facc15] px-8 py-4 transition-all hover:ring-4 hover:ring-black hover:bg-transparent hover:text-black">
            <Search size={22} strokeWidth={3} />
            <span className="text-sm font-black uppercase tracking-widest">Search</span>
          </button>
        </div>
      </div>

      {/* High-Visibility Navigation Grid */}
      <nav className="bg-white">
        <div className="mx-auto max-w-350">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black border-x-4 border-black border-b-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="p-10 transition-colors hover:bg-[#fef9c3]">
                <h3 className="mb-8 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] bg-black text-white p-2 w-fit">
                  <Plus size={14} strokeWidth={4} />
                  {group.title}
                </h3>
                
                <ul className="space-y-4">
                  {group.links.map((link) => (
                    <li key={link}>
                      <NavLink 
                        to={`/${slugify(link)}`}
                        className={({ isActive }) => `
                          group flex items-center justify-between text-lg font-extrabold transition-all
                          ${isActive 
                            ? 'bg-black text-[#facc15] px-3 py-1 -translate-x-2' 
                            : 'text-black hover:bg-[#facc15] hover:px-3 hover:py-1'}
                        `}
                      >
                        <span className="flex items-center gap-2">
                          {link}
                        </span>
                        <ArrowRight size={20} strokeWidth={3} className="opacity-0 group-hover:opacity-100 transition-opacity" />
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