import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

function MainLayout() {
  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      <Navbar />
      <main className="container-shell py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
