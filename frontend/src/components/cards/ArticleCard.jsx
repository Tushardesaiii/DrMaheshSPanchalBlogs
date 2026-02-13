import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

function ArticleCard({ article }) {
  const tags = Array.isArray(article?.tags) ? article.tags : []
  const category = article?.category || article?.format || 'General'
  const author = article?.author || 'Admin'

  return (
    <Card className="flex h-full flex-col">
      <div className="flex-1">
        <Badge>{category}</Badge>
        <h3 className="section-title mt-3 text-lg text-(--color-primary)">{article?.title}</h3>
        <p className="mt-2 text-sm text-(--color-muted)">{article?.description}</p>
        <p className="mt-3 text-xs text-(--color-muted)">By {author}</p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-(--color-secondary)">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6">
        <Button variant="ghost">Read Article</Button>
      </div>
    </Card>
  )
}

export default ArticleCard
