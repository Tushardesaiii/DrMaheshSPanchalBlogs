import ArticleCard from '../components/cards/ArticleCard'
import { useContent } from '../context/ContentContext'

function AllBlogs() {
  const { loading, normalizedContents } = useContent()

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Full Index</p>
        <h2 className="section-title text-3xl text-(--color-primary)">All Posts & Content</h2>
        <p className="mt-2 text-sm text-(--color-muted)">A complete index of all published content from every category.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-3 text-(--color-muted)">Loading content...</p>
        ) : normalizedContents.length > 0 ? (
          normalizedContents.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-3 text-(--color-muted)">No content found.</p>
        )}
      </div>
    </div>
  )
}

export default AllBlogs
