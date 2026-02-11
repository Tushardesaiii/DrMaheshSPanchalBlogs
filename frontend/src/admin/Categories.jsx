import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const taxonomyRows = [
  { name: 'Research Methods', status: 'Active', rule: 'Core topic' },
  { name: 'Library Science', status: 'Active', rule: 'Mandatory tag' },
  { name: 'Teaching Practice', status: 'Active', rule: 'High visibility' },
  { name: 'Academic Writing', status: 'Paused', rule: 'Review labeling' },
]

const taxonomyControls = [
  { label: 'Auto-tag new uploads', helper: 'Smart tag suggestions', enabled: true },
  { label: 'Lock core categories', helper: 'Prevent deletion', enabled: true },
  { label: 'Expose filter bar', helper: 'Site-wide filters', enabled: false },
  { label: 'Require taxonomy review', helper: 'Weekly audit', enabled: true },
]

function Categories() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Taxonomy Control</p>
            <h3 className="admin-title mt-3 text-xl">Manage Categories</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Shape discovery by governing tags, labels, and hierarchy.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="admin-button">Add Category</Button>
            <Button variant="ghost" className="admin-button">Run Audit</Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {taxonomyControls.map((control) => (
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
          <h3 className="admin-title text-lg">Taxonomy Matrix</h3>
          <span className="admin-chip">Live filters</span>
        </div>
        <div className="mt-6 space-y-4 text-sm text-(--color-muted)">
          {taxonomyRows.map((category) => (
            <div key={category.name} className="flex items-center justify-between border-b border-(--color-border) pb-3">
              <div>
                <p className="text-sm font-semibold text-(--color-primary)">{category.name}</p>
                <p className="text-xs text-(--color-muted)">{category.rule}</p>
              </div>
              <span className="admin-chip admin-chip-strong">{category.status}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="admin-panel">
        <h3 className="admin-title text-lg">Category Form</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Placeholder fields for future form integration.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input className="admin-input" placeholder="Category name" />
          <Input className="admin-input" placeholder="Category description" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <select className="admin-select">
            <option>Visibility: Public</option>
            <option>Visibility: Internal</option>
          </select>
          <select className="admin-select">
            <option>Priority: Core</option>
            <option>Priority: Secondary</option>
          </select>
        </div>
      </Card>
    </div>
  )
}

export default Categories
