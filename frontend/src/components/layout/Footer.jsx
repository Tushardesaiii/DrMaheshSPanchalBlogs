function Footer() {
  return (
    <footer className="mt-16 border-t border-(--color-border) bg-white">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h3 className="section-title text-lg text-(--color-primary)">Academic Knowledge Platform</h3>
          <p className="mt-3 text-sm text-(--color-muted)">
            A digital library designed for thoughtful learning, curated research, and professional academic growth.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-(--color-primary)">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-(--color-muted)">
            <li>Knowledge Hub</li>
            <li>Digital Library</li>
            <li>Articles</li>
            <li>Events & Activities</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-(--color-primary)">Contact</h4>
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
