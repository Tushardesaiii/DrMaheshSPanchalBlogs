import ArticleCard from '../components/cards/ArticleCard'
import Badge from '../components/ui/Badge'
import { useContent } from '../context/ContentContext'

const tags = ['UX', 'Metadata', 'Pedagogy', 'Research', 'Library']

function Articles() {
  const { loading, getNormalizedByFormat } = useContent()
  const articles = getNormalizedByFormat('Article')

  return (
    <div className="grid gap-10 lg:grid-cols-[1.8fr_0.8fr]">
      <div>
        <h2 className="section-title text-3xl text-(--color-primary)">Articles & Editorial</h2>
        <p className="mt-2 text-sm text-(--color-muted)">Long-form academic insights with a reading-first layout.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {loading ? (
            <p className="col-span-2 text-(--color-muted)">Loading articles...</p>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <p className="col-span-2 text-(--color-muted)">No articles found.</p>
          )}
        </div>
      </div>
      <aside className="space-y-6">
        <div className="paper-panel p-6">
          <h3 className="section-title text-lg text-(--color-primary)">Categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-(--color-muted)">
            <li>Knowledge Design</li>
            <li>Learning Strategy</li>
            <li>Library Practice</li>
            <li>Academic Writing</li>
          </ul>
        </div>
        <div className="paper-panel p-6">
          <h3 className="section-title text-lg text-(--color-primary)">Tags</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Articles
