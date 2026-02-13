import { Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from '../components/layout/MainLayout'
import AdminLayout from '../admin/AdminLayout'
import Login from '../admin/Login'
import ProtectedRoute from './ProtectedRoute'

// Public Pages
import Home from '../pages/Home'
import About from '../pages/About'
import Profile from '../pages/Profile'
import KnowledgeHub from '../pages/KnowledgeHub'
import DigitalLibrary from '../pages/DigitalLibrary'
import Articles from '../pages/Articles'
import ArticleDetails from '../pages/ArticleDetails'
import BookDetails from '../pages/BookDetails'
import ContentDetails from '../pages/ContentDetails'
import Events from '../pages/Events'
import Contact from '../pages/Contact'
import AllBlogs from '../pages/AllBlogs'
import CollectionPage from '../pages/CollectionPage'
import ActivityPage from '../pages/ActivityPage'

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
        <Route path="profile" element={<Profile />} />
        <Route path="contact" element={<Contact />} />
        <Route path="contact-form" element={<Contact />} />
        
        {/* Content Feeds */}
        <Route path="all-blogs" element={<AllBlogs />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:id" element={<ArticleDetails />} />
        <Route path="content/:id" element={<ContentDetails />} />
        <Route path="events" element={<Events />} />

        {/* Library & Research Hubs */}
        <Route path="knowledge-hub" element={<KnowledgeHub />} />
        <Route path="library" element={<DigitalLibrary />} />
        <Route path="library/:id" element={<BookDetails />} />
        <Route path="books" element={<DigitalLibrary />} />
        <Route path="pdfs" element={<DigitalLibrary />} />
        <Route path="notes" element={<DigitalLibrary />} />
        <Route path="tags-and-filters" element={<DigitalLibrary />} />

        {/* Activities & Events */}
        <Route path="activities-and-events" element={<ActivityPage />} />
        <Route path="conferences" element={<ActivityPage />} />
        <Route path="workshops" element={<ActivityPage />} />
        <Route path="reports" element={<ActivityPage />} />
        <Route path="gallery" element={<ActivityPage />} />

        
        <Route path=":collection" element={<CollectionPage />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Admin Panel Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
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