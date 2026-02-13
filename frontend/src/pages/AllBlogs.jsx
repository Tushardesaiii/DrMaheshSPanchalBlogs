import ArticleCard from '../components/cards/ArticleCard'
import { useContent } from '../context/ContentContext'

function AllBlogs() {
  const { loading, getNormalizedByFormat } = useContent()
  const articles = getNormalizedByFormat('Article')

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Full Index</p>
        <h2 className="section-title text-3xl text-(--color-primary)">All Articles & Essays</h2>
        <p className="mt-2 text-sm text-(--color-muted)">A complete index of published academic writing and knowledge briefs.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-3 text-(--color-muted)">Loading articles...</p>
        ) : articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-3 text-(--color-muted)">No articles found.</p>
        )}
      </div>
    </div>
  )
}

export default AllBlogs
