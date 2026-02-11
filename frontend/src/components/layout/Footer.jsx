import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-11 border-t border-(--color-border) bg-white">
      <div className="container-shell  grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h3 className="section-title text-lg text-(--color-primary)"></h3>
          <p className="mt-12 text-sm text-(--color-muted)">
            A digital Resource designed for thoughtful learning, curated research, and professional academic growth.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-(--color-primary) pt-4">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-(--color-muted)">
            <li>
              <NavLink to="/knowledge-hub" className="hover:text-(--color-primary)">Knowledge Hub</NavLink>
            </li>
            <li>
              <NavLink to="/library" className="hover:text-(--color-primary)">Digital Library</NavLink>
            </li>
            <li>
              <NavLink to="/articles" className="hover:text-(--color-primary)">Articles</NavLink>
            </li>
            <li>
              <NavLink to="/activities-and-events" className="hover:text-(--color-primary)">Events & Activities</NavLink>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-(--color-primary) pt-4">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-(--color-muted)">
            <li>contact@maheshsir.edu</li>
            <li>Library Wing, Academic Center</li>
            <li>Mon - Sat · 9:00 AM - 6:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-(--color-border) py-4 text-center text-xs text-(--color-muted)">
        Built for academic excellence · 2026
      </div>
    </footer>
  )
}

export default Footer
