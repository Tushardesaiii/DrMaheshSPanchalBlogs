import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function Events() {
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="section-title text-lg text-(--color-primary)">Manage Events</h3>
          <Button>Create Event</Button>
        </div>
        <div className="mt-6 space-y-4 text-sm text-(--color-muted)">
          <div className="flex items-center justify-between border-b border-(--color-border) pb-3">
            <span>Academic Research Colloquium</span>
            <span className="text-(--color-secondary)">Scheduled</span>
          </div>
          <div className="flex items-center justify-between border-b border-(--color-border) pb-3">
            <span>Digital Library Skills Workshop</span>
            <span className="text-(--color-secondary)">Scheduled</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Academic Writing Clinic</span>
            <span className="text-(--color-secondary)">Planned</span>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="section-title text-lg text-(--color-primary)">Event Media</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Upload UI placeholder for event gallery assets.</p>
        <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed border-(--color-border) py-10 text-sm text-(--color-muted)">
          Upload images, brochures, and reports
        </div>
      </Card>
    </div>
  )
}

export default Events
