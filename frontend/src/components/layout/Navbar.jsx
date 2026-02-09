import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Knowledge Hub', to: '/knowledge-hub' },
  { label: 'Digital Library', to: '/library' },
  { label: 'Articles', to: '/articles' },
  { label: 'Events', to: '/events' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  return (
    <header className="w-full bg-[#FCFCFC] antialiased dark:bg-[#080808]">
      {/* Precision Top Bar */}
      <div className="mx-auto max-w-[1400px] border-x border-black/5 px-8 dark:border-white/5">
        <div className="flex h-20 items-center justify-between border-b border-black/10 dark:border-white/10">
          
          {/* Brand: High-Contrast Serif pairing */}
          <NavLink to="/" className="group flex flex-col leading-none">
            <span className="font-serif text-2xl tracking-tight text-[#1A1A1A] dark:text-[#F0F0F0]">
              MaheshSir <span className="italic text-black/40 dark:text-white/40">Platform</span>
            </span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Structured Archive
            </span>
          </NavLink>

          {/* Desktop Navigation: Geometric Sans */}
          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  relative text-[13px] font-medium tracking-wide transition-colors duration-200
                  ${isActive 
                    ? 'text-black dark:text-white underline decoration-blue-600 decoration-2 underline-offset-[30px]' 
                    : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'}
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA: The "Ghost" Button */}
          <div className="flex items-center">
            <NavLink
              to="/contact"
              className="border border-black px-5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-black hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}