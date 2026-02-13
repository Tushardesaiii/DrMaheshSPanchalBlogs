import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

function EventCard({ event }) {
  const tags = Array.isArray(event?.tags) ? event.tags : []
  const category = event?.category || event?.format || 'Event'
  const date = event?.date || 'TBA'
  const location = event?.location || 'Location TBA'

  return (
    <Card className="flex h-full flex-col">
      <div className="flex-1">
        <Badge>{category}</Badge>
        <h3 className="section-title mt-3 text-lg text-(--color-primary)">{event?.title}</h3>
        <p className="mt-2 text-sm text-(--color-muted)">{event?.description}</p>
        <p className="mt-3 text-xs text-(--color-muted)">{date} · {location}</p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-(--color-secondary)">
            {tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6">
        <Button variant="ghost">View Report</Button>
      </div>
    </Card>
  )
}

export default EventCard
