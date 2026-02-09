import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <main className="p-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Admin Console</p>
            <h2 className="section-title mt-2 text-2xl text-(--color-primary)">Academic Knowledge Management</h2>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
