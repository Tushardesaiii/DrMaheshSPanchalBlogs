import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

function EventCard({ event }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex-1">
        <Badge>{event.category}</Badge>
        <h3 className="section-title mt-3 text-lg text-(--color-primary)">{event.title}</h3>
        <p className="mt-2 text-sm text-(--color-muted)">{event.description}</p>
        <p className="mt-3 text-xs text-(--color-muted)">{event.date} · {event.location}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-(--color-secondary)">
          {event.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Button variant="ghost">View Report</Button>
      </div>
    </Card>
  )
}

export default EventCard
