import { Routes, Route } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import Home from '../pages/Home'
import About from '../pages/About'
import KnowledgeHub from '../pages/KnowledgeHub'
import DigitalLibrary from '../pages/DigitalLibrary'
import Articles from '../pages/Articles'
import ArticleDetails from '../pages/ArticleDetails'
import BookDetails from '../pages/BookDetails'
import Events from '../pages/Events'
import Contact from '../pages/Contact'
import AdminLayout from '../admin/AdminLayout'
import Dashboard from '../admin/Dashboard'
import AdminBooks from '../admin/Books'
import AdminArticles from '../admin/Articles'
import AdminEvents from '../admin/Events'
import AdminCategories from '../admin/Categories'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="knowledge-hub" element={<KnowledgeHub />} />
        <Route path="library" element={<DigitalLibrary />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:id" element={<ArticleDetails />} />
        <Route path="library/:id" element={<BookDetails />} />
        <Route path="events" element={<Events />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
