import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'

function AdminLayout() {
  return (
    <div className="admin-shell min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="p-10">
        <div className='pb-8 border-b border-(--color-border)'>
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
