import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const sections = [
  'Literature',
  'Competitive Exams',
  'Learning Resources',
  'Research Papers',
  'Library Reports',
  'Gujarati Content',
  'Scholarships',
  'Events & Workshops',
]

const formats = ['Article', 'PDF', 'Report', 'Guide', 'Collection', 'Event Notice']

const queueRows = [
  { title: 'New research paper added to Gujarat History', format: 'PDF', section: 'Research Papers', status: 'Scheduled', date: 'Feb 12' },
  { title: 'Scholarship timeline 2026', format: 'Report', section: 'Scholarships', status: 'Review', date: 'Feb 13' },
  { title: 'Learning Resources: Study plan', format: 'Guide', section: 'Learning Resources', status: 'Draft', date: 'Feb 16' },
]

function Dashboard() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="admin-kicker">Publish Center</p>
            <h3 className="admin-title mt-3 text-2xl">Publish Posts, PDFs, and Reports</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Route each piece to the correct section on the homepage.</p>
          </div>
          <span className="admin-chip admin-chip-strong">Live Routing</span>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="admin-field-label">Title</p>
                <Input className="admin-input mt-2" placeholder="Content title" />
              </div>
              <div>
                <p className="admin-field-label">Format</p>
                <select className="admin-select mt-2">
                  {formats.map((format) => (
                    <option key={format}>{format}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="admin-field-label">Categories</p>
                <div className="admin-pill-group mt-3">
                  {sections.map((section) => (
                    <label key={section} className="admin-pill">
                      <input type="checkbox" name="categories" value={section} />
                      <span>{section}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="admin-field-label">Visibility</p>
                <select className="admin-select mt-2">
                  <option>Public</option>
                  <option>Members</option>
                  <option>Internal</option>
                </select>
              </div>
            </div>
            <div>
              <p className="admin-field-label">Summary</p>
              <textarea className="admin-textarea mt-2" rows="4" placeholder="Short description for cards and previews." />
            </div>
            <label className="admin-dropzone">
              <input type="file" className="hidden" multiple />
              <p className="admin-field-label">Attachments</p>
              <p className="text-sm text-(--color-muted)">Drop files here or click to upload.</p>
              <p className="text-xs text-(--color-muted)">PDF, DOCX, images, or external links.</p>
            </label>
          </div>
          <div className="admin-panel-subtle p-4">
            <p className="admin-kicker">Homepage Sections</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sections.map((section) => (
                <span key={section} className="admin-chip">
                  {section}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm text-(--color-muted)">
              <div className="flex items-center justify-between">
                <span>Placement</span>
                <span className="text-(--color-primary)">Home collections</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Card style</span>
                <span className="text-(--color-primary)">Latest updates</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Highlight</span>
                <span className="text-(--color-primary)">Editor pick</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="admin-button">Publish Now</Button>
          <Button variant="ghost" className="admin-button">Save Draft</Button>
          <Button variant="ghost" className="admin-button">Schedule</Button>
        </div>
      </Card>
      <Card className="admin-panel">
        <div className="flex items-center justify-between">
          <div>
            <p className="admin-kicker">Content Queue</p>
            <h3 className="admin-title mt-3 text-xl">Publishing Pipeline</h3>
          </div>
          <span className="admin-chip">Today</span>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="admin-table w-full text-left text-sm">
            <thead>
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Section</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="text-(--color-text)">
              {queueRows.map((row) => (
                <tr key={row.title} className="border-t border-(--color-border)">
                  <td className="py-3">{row.title}</td>
                  <td className="py-3">{row.format}</td>
                  <td className="py-3">{row.section}</td>
                  <td className="py-3">
                    <span className="admin-chip admin-chip-strong">{row.status}</span>
                  </td>
                  <td className="py-3">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
