import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const sectionRows = [
  { name: 'Literature', placement: 'Browse Collections', status: 'Active' },
  { name: 'Competitive Exams', placement: 'Browse Collections', status: 'Active' },
  { name: 'Learning Resources', placement: 'Browse Collections', status: 'Active' },
  { name: 'Research Papers', placement: 'Live Updates + Collections', status: 'Active' },
  { name: 'Library Reports', placement: 'Collections', status: 'Active' },
  { name: 'Gujarati Content', placement: 'Collections', status: 'Active' },
  { name: 'Scholarships', placement: 'Collections', status: 'Active' },
  { name: 'Events & Workshops', placement: 'Collections', status: 'Active' },
]

function Categories() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Homepage Sections</p>
            <h3 className="admin-title mt-3 text-xl">Route Content to Sections</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Keep homepage sections aligned with published content.</p>
          </div>
          <Button className="admin-button">Add Section</Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Section Name</p>
            <Input className="admin-input mt-2" placeholder="Section title" />
          </div>
          <div>
            <p className="admin-field-label">Homepage Placement</p>
            <select className="admin-select mt-2">
              <option>Browse Collections</option>
              <option>Live Updates</option>
              <option>Both</option>
            </select>
          </div>
        </div>
      </Card>
      <Card className="admin-panel p-8">
        <div className="flex items-center justify-between">
          <h3 className="admin-title text-lg">Section Map</h3>
          <span className="admin-chip">Homepage</span>
        </div>
        <div className="mt-6 space-y-4 text-sm text-(--color-muted)">
          {sectionRows.map((section) => (
            <div key={section.name} className="flex items-center justify-between border-b border-(--color-border) pb-3">
              <div>
                <p className="text-sm font-semibold text-(--color-primary)">{section.name}</p>
                <p className="text-xs text-(--color-muted)">{section.placement}</p>
              </div>
              <span className="admin-chip admin-chip-strong">{section.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Categories
