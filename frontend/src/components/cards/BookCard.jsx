import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

function BookCard({ book }) {
  const tags = Array.isArray(book?.tags) ? book.tags : []
  const category = book?.category || book?.format || 'General'

  return (
    <Card className="flex h-full flex-col">
      <div className="flex-1">
        <div className="mb-4 h-40 rounded-xl bg-(--color-bg)" />
        <Badge>{category}</Badge>
        <h3 className="section-title mt-3 text-lg text-(--color-primary)">{book?.title}</h3>
        <p className="mt-2 text-sm text-(--color-muted)">{book?.description}</p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-(--color-secondary)">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6">
        <Button variant="ghost">View Details</Button>
      </div>
    </Card>
  )
}

export default BookCard
