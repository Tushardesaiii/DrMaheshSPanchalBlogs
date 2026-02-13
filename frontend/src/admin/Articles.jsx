import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const sections = [
  'Research Papers',
  'Library Reports',
  'Gujarati Content',
  'Events & Workshops',
  'Conferences',
  'Workshops',
  'Reports',
  'Gallery',
  'Books',
  'PDFs',
  'Articles',
  'Notes',
]

const formats = ['Article', 'PDF', 'Report']

const articleRows = [
  { title: 'Designing Academic Knowledge Portals', format: 'Article', section: 'Learning Resources', status: 'Published' },
  { title: 'From Collection to Curriculum', format: 'Report', section: 'Literature', status: 'Scheduled' },
  { title: 'Metadata Practices for Libraries', format: 'PDF', section: 'Library Reports', status: 'Review' },
]

function Articles() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Article Publisher</p>
            <h3 className="admin-title mt-3 text-xl">Publish Articles and PDFs</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Send posts and PDFs directly to the right homepage section.</p>
          </div>
          <Button className="admin-button">Publish</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Title</p>
            <Input className="admin-input mt-2" placeholder="Article title" />
          </div>
          <div>
            <p className="admin-field-label">Format</p>
            <select className="admin-select mt-2">
              {formats.map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>
          </div>
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
            <p className="admin-field-label">Author</p>
            <Input className="admin-input mt-2" placeholder="Author or team" />
          </div>
        </div>
        <label className="admin-dropzone mt-4">
          <input type="file" className="hidden" multiple />
          <p className="admin-field-label">Attachments</p>
          <p className="text-sm text-(--color-muted)">Drop PDFs or click to upload.</p>
          <p className="text-xs text-(--color-muted)">Images, reports, or external links.</p>
        </label>
      </Card>
      <Card className="admin-panel">
        <div className="flex items-center justify-between">
          <h3 className="admin-title text-lg">Publishing Queue</h3>
          <span className="admin-chip">Articles</span>
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
              {articleRows.map((row) => (
                <tr key={row.title} className="border-t border-(--color-border)">
                  <td className="py-3">{row.title}</td>
                  <td className="py-3">{row.format}</td>
                  <td className="py-3">{row.section}</td>
                  <td className="py-3">
                    <span className="admin-chip admin-chip-strong">{row.status}</span>
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

export default Articles
