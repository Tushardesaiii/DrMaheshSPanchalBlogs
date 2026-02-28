import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-shell min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="p-10">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Header */}
            <div className="border-b border-(--color-border) pb-6">
              <div className="flex items-center justify-between gap-4">
                {/* Left Side: Brand & Title */}
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--color-accent) leading-none">Admin</p>
                  </div>
                  <div className="h-4 w-px bg-(--color-border) hidden sm:block" />
                  <h2 className="text-lg font-semibold tracking-tight text-(--color-primary) whitespace-nowrap">
                    Academic Knowledge Management
                  </h2>
                </div>

                {/* Right Side: Compact Identity & Actions */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 text-right">
                    <div className="hidden md:block">
                      <p className="text-sm font-medium leading-none text-(--color-primary)">
                        {user?.name || 'Admin User'}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-(--color-muted)">
                        {user?.role || 'admin'}
                      </p>
                    </div>
                    
                    {/* Simple Avatar Circle */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-(--color-border) bg-surface-subtle text-[10px] font-bold text-(--color-accent)">
                      {(user?.name || 'A').charAt(0)}
                    </div>
                  </div>

                  <div className="h-8 w-px bg-(--color-border)" />

                  <Button
                    variant="ghost"
                    className="h-8 px-3 text-xs font-medium text-(--color-muted) hover:text-red-600 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
