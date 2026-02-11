import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'

function AdminLayout() {
  return (
    <div className="admin-shell min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="p-10">
          <div className="admin-panel mb-8 flex flex-wrap items-center justify-between gap-6 p-6">
            <div>
              <p className="admin-kicker">Admin Console</p>
              <h2 className="admin-title mt-3 text-2xl">Academic Knowledge Control Center</h2>
              <p className="mt-2 text-sm text-(--color-muted)">Orchestrate content, publishing flow, and on-site impact.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="admin-chip">Live Site</span>
              <span className="admin-chip admin-chip-strong">Sync Ready</span>
              <button className="admin-button rounded-full border border-(--color-border) px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                Preview Impact
              </button>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
