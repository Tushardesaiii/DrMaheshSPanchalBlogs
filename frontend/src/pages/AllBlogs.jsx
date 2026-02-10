import ArticleCard from '../components/cards/ArticleCard'
import articles from '../data/articles'

function AllBlogs() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Full Index</p>
        <h2 className="section-title text-3xl text-(--color-primary)">All Articles & Essays</h2>
        <p className="mt-2 text-sm text-(--color-muted)">A complete index of published academic writing and knowledge briefs.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

export default AllBlogs
