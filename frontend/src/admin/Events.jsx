import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const eventRows = [
  { title: 'Academic Research Colloquium', format: 'Event Notice', section: 'Events & Workshops', status: 'Scheduled' },
  { title: 'Digital Library Skills Workshop', format: 'Event Notice', section: 'Events & Workshops', status: 'Published' },
  { title: 'Academic Writing Clinic', format: 'Event Notice', section: 'Events & Workshops', status: 'Draft' },
]

const eventCategories = ['Conferences', 'Workshops', 'Reports', 'Gallery']

function Events() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Event Publisher</p>
            <h3 className="admin-title mt-3 text-xl">Publish Event Notices</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Show events inside the homepage Events & Workshops section.</p>
          </div>
          <Button className="admin-button">Publish</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Event Title</p>
            <Input className="admin-input mt-2" placeholder="Event title" />
          </div>
          <div>
            <p className="admin-field-label">Date</p>
            <Input className="admin-input mt-2" placeholder="Feb 20, 2026" />
          </div>
          <div>
            <p className="admin-field-label">Format</p>
            <select className="admin-select mt-2">
              <option>Event Notice</option>
              <option>Workshop Notice</option>
              <option>Report</option>
            </select>
          </div>
          <div>
            <p className="admin-field-label">Categories</p>
            <div className="admin-pill-group mt-3">
              {eventCategories.map((category) => (
                <label key={category} className="admin-pill">
                  <input type="checkbox" name="categories" value={category} />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="admin-field-label">Visibility</p>
            <select className="admin-select mt-2">
              <option>Public</option>
              <option>Members</option>
            </select>
          </div>
        </div>
        <label className="admin-dropzone mt-4">
          <input type="file" className="hidden" multiple />
          <p className="admin-field-label">Attachments</p>
          <p className="text-sm text-(--color-muted)">Drop flyers, PDFs, or images.</p>
          <p className="text-xs text-(--color-muted)">Gallery images supported.</p>
        </label>
      </Card>
      <Card className="admin-panel p-8">
        <div className="flex items-center justify-between">
          <h3 className="admin-title text-lg">Event Queue</h3>
          <span className="admin-chip">Events</span>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="admin-table w-full text-left text-sm">
            <thead>
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Section</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-(--color-text)">
              {eventRows.map((event) => (
                <tr key={event.title} className="border-t border-(--color-border)">
                  <td className="py-3">{event.title}</td>
                  <td className="py-3">{event.format}</td>
                  <td className="py-3">{event.section}</td>
                  <td className="py-3">
                    <span className="admin-chip admin-chip-strong">{event.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Events
