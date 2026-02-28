import { NavLink } from 'react-router-dom'
import { LayoutGrid, BookMarked, Image, FileText } from 'lucide-react'

const adminLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutGrid },
  { label: 'Manage Books', to: '/admin/books', icon: BookMarked },
  { label: 'Photos', to: '/admin/photos', icon: Image },
  { label: 'Manage PDFs', to: '/admin/pdfs', icon: FileText },
]

function Sidebar() {
  return (
    <aside className="admin-sidebar sticky top-0 h-screen px-6 py-8">
      <div className="mb-8">
        <p className="admin-kicker">Admin</p>
        <h2 className="admin-title mt-3 text-lg">Library Control</h2>
        <p className="mt-2 text-xs text-(--color-muted)">Precision control across content, catalog, and impact.</p>
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
                `admin-nav-link flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? 'admin-nav-active' : 'text-(--color-muted) hover:text-(--color-primary)'}`
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
