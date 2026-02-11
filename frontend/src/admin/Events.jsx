import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const eventRows = [
  { title: 'Academic Research Colloquium', status: 'Scheduled', note: 'Keynote approved' },
  { title: 'Digital Library Skills Workshop', status: 'Scheduled', note: 'Registration open' },
  { title: 'Academic Writing Clinic', status: 'Planned', note: 'Awaiting venue' },
]

const eventControls = [
  { label: 'Enable RSVP forms', helper: 'Collect attendee info', enabled: true },
  { label: 'Public calendar visibility', helper: 'Show on homepage', enabled: true },
  { label: 'Auto-reminder emails', helper: '48 hours before', enabled: false },
  { label: 'Speaker approval gate', helper: 'Admin review', enabled: true },
]

function Events() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Programming Controls</p>
            <h3 className="admin-title mt-3 text-xl">Manage Events</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Control event visibility, approvals, and audience engagement.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="admin-button">Create Event</Button>
            <Button variant="ghost" className="admin-button">Adjust Visibility</Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Scheduled</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">12</p>
            <p className="mt-1 text-xs text-(--color-muted)">Next 30 days</p>
          </div>
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">4</p>
            <p className="mt-1 text-xs text-(--color-muted)">Awaiting approval</p>
          </div>
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Highlights</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">3</p>
            <p className="mt-1 text-xs text-(--color-muted)">Featured on homepage</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {eventControls.map((control) => (
            <div key={control.label} className="flex items-center justify-between gap-4 rounded-xl border border-(--color-border) bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-(--color-primary)">{control.label}</p>
                <p className="text-xs text-(--color-muted)">{control.helper}</p>
              </div>
              <input type="checkbox" className="admin-toggle" defaultChecked={control.enabled} />
            </div>
          ))}
        </div>
      </Card>
      <Card className="admin-panel">
        <div className="flex items-center justify-between">
          <h3 className="admin-title text-lg">Event Calendar</h3>
          <span className="admin-chip">Review queue</span>
        </div>
        <div className="mt-6 space-y-4 text-sm text-(--color-muted)">
          {eventRows.map((event) => (
            <div key={event.title} className="flex items-center justify-between border-b border-(--color-border) pb-3">
              <div>
                <p className="text-sm font-semibold text-(--color-primary)">{event.title}</p>
                <p className="text-xs text-(--color-muted)">{event.note}</p>
              </div>
              <span className="admin-chip admin-chip-strong">{event.status}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="admin-panel">
        <h3 className="admin-title text-lg">Event Media</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Upload UI placeholder for event gallery assets.</p>
        <div className="admin-panel-subtle mt-4 flex items-center justify-center py-10 text-sm text-(--color-muted)">
          Upload images, brochures, and reports
        </div>
      </Card>
    </div>
  )
}

export default Events
