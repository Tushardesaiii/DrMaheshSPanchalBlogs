import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const bookRows = [
  { title: 'Pedagogy of Structured Learning', category: 'Library Science', author: 'Editorial Team', status: 'Active' },
  { title: 'Digital Archives and Library Futures', category: 'Digital Studies', author: 'Research Team', status: 'Review' },
  { title: 'Scholarly Communication Systems', category: 'Knowledge Systems', author: 'Editorial Team', status: 'Active' },
]

const bookControls = [
  { label: 'Public catalog visibility', helper: 'Expose to search results', enabled: true },
  { label: 'Featured shelf rotation', helper: 'Auto rotate weekly', enabled: false },
  { label: 'Download permissions', helper: 'Require approval', enabled: true },
  { label: 'Citation quality check', helper: 'Auto validate metadata', enabled: true },
]

function Books() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Inventory Controls</p>
            <h3 className="admin-title mt-3 text-xl">Manage Books</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Balance visibility, access rights, and catalog quality.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="admin-button">Add Book</Button>
            <Button variant="ghost" className="admin-button">Adjust Access</Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Active Titles</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">240</p>
            <p className="mt-1 text-xs text-(--color-muted)">98% indexed</p>
          </div>
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Restricted</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">18</p>
            <p className="mt-1 text-xs text-(--color-muted)">Approval required</p>
          </div>
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">New Intake</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">7</p>
            <p className="mt-1 text-xs text-(--color-muted)">Awaiting metadata</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {bookControls.map((control) => (
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
          <h3 className="admin-title text-lg">Catalog Overview</h3>
          <span className="admin-chip">Audit ready</span>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="admin-table w-full text-left text-sm">
            <thead>
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-(--color-text)">
              {bookRows.map((row) => (
                <tr key={row.title} className="border-t border-(--color-border)">
                  <td className="py-3">{row.title}</td>
                  <td className="py-3">{row.category}</td>
                  <td className="py-3">{row.author}</td>
                  <td className="py-3">
                    <span className="admin-chip admin-chip-strong">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card className="admin-panel">
        <h3 className="admin-title text-lg">Upload Cover</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Upload UI placeholder for future integration.</p>
        <div className="admin-panel-subtle mt-4 flex items-center justify-center py-10 text-sm text-(--color-muted)">
          Drag and drop book cover here
        </div>
      </Card>
    </div>
  )
}

export default Books
