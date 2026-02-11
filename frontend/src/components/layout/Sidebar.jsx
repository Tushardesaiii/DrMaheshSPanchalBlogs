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
      <div className="mt-10 space-y-4 text-xs text-(--color-muted)">
        <div className="admin-panel-subtle p-4">
          <p className="admin-kicker">Control Layers</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
            <span className="admin-chip">Visibility</span>
            <span className="admin-chip">Moderation</span>
            <span className="admin-chip">Policy</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Last audit</span>
          <span className="text-(--color-primary)">3 days ago</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
