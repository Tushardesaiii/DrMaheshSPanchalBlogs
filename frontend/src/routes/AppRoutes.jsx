import { Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../admin/AdminLayout'

// Public Pages
import Home from '../pages/Home'
import About from '../pages/About'
import KnowledgeHub from '../pages/KnowledgeHub'
import DigitalLibrary from '../pages/DigitalLibrary'
import Articles from '../pages/Articles'
import ArticleDetails from '../pages/ArticleDetails'
import BookDetails from '../pages/BookDetails'
import Events from '../pages/Events'
import Contact from '../pages/Contact'
import AllBlogs from '../pages/AllBlogs'
import CollectionPage from '../pages/CollectionPage'

// Admin Pages
import Dashboard from '../admin/Dashboard'
import AdminBooks from '../admin/Books'
import AdminArticles from '../admin/Articles'
import AdminEvents from '../admin/Events'
import AdminCategories from '../admin/Categories'

/**
 * AppRoutes Component
 * Handles the routing logic for the entire Academic Knowledge Platform.
 * Structured to support a clean, library-style URL hierarchy.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes under MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        
        {/* Informational Pages */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="contact-form" element={<Contact />} />
        
        {/* Content Feeds */}
        <Route path="all-blogs" element={<AllBlogs />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:id" element={<ArticleDetails />} />
        <Route path="events" element={<Events />} />

        {/* Library & Research Hubs */}
        <Route path="knowledge-hub" element={<KnowledgeHub />} />
        <Route path="library" element={<DigitalLibrary />} />
        <Route path="library/:id" element={<BookDetails />} />

        {/* Dynamic Archive Routing 
          This catches slugs like /literature, /scholarships, etc.
          It is placed last so fixed routes above take priority.
        */}
        <Route path=":collection" element={<CollectionPage />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>

      {/* 404 - Fallback for undefined routes */}
      <Route 
        path="*" 
        element={
          <div className="flex h-screen items-center justify-center font-serif italic text-slate-400">
            404 — This section of the archive is not yet indexed.
          </div>
        } 
      />
    </Routes>
  )
}

export default AppRoutes