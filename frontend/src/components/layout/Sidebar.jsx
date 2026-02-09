import { NavLink } from 'react-router-dom'
import { LayoutGrid, BookMarked, FileText, CalendarCheck, Tags } from 'lucide-react'

const adminLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutGrid },
  { label: 'Manage Books', to: '/admin/books', icon: BookMarked },
  { label: 'Manage Articles', to: '/admin/articles', icon: FileText },
  { label: 'Manage Events', to: '/admin/events', icon: CalendarCheck },
  { label: 'Manage Categories', to: '/admin/categories', icon: Tags },
]

function Sidebar() {
  return (
    <aside className="h-full border-r border-(--color-border) bg-white px-6 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Admin</p>
        <h2 className="section-title text-lg text-(--color-primary)">Library Control</h2>
      </div>
      <nav className="space-y-3 text-sm">
        {adminLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-(--color-primary) text-white' : 'text-(--color-muted) hover:text-(--color-primary)'}`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
