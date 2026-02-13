import EventCard from '../components/cards/EventCard'
import { useContent } from '../context/ContentContext'

function Events() {
  const { loading, getNormalizedByFormat, getNormalizedBySection } = useContent()
  const eventNotices = getNormalizedByFormat('Event Notice')
  const sectionEvents = getNormalizedBySection('Events & Workshops')
  const events = eventNotices.length > 0 ? eventNotices : sectionEvents

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Calendar</p>
        <h2 className="section-title text-3xl text-(--color-primary)">Events & Workshops</h2>
        <p className="mt-2 text-sm text-(--color-muted)">Upcoming lectures, workshops, and campus programs.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-3 text-(--color-muted)">Loading events...</p>
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p className="col-span-3 text-(--color-muted)">No events found.</p>
        )}
      </div>
    </div>
  )
}

export default Events