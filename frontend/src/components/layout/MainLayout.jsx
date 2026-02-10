import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import SecondaryNavbar from './SecondaryNavbar'
import Footer from './Footer'

function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      {isHome ? <Navbar /> : <SecondaryNavbar />}
      <main className="container-shell py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout