import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const articleRows = [
  { title: 'Designing Academic Knowledge Portals', category: 'Knowledge Design', author: 'Editorial Board', status: 'Published' },
  { title: 'From Collection to Curriculum', category: 'Curriculum', author: 'Research Team', status: 'Scheduled' },
  { title: 'Metadata Practices for Libraries', category: 'Library Science', author: 'Editorial Board', status: 'In review' },
]

const articleControls = [
  { label: 'Auto-schedule releases', helper: 'Even cadence across weeks', enabled: true },
  { label: 'Highlight editor picks', helper: 'Homepage spotlight', enabled: true },
  { label: 'Require peer review', helper: 'Gate before publish', enabled: false },
  { label: 'Comment moderation', helper: 'Approval required', enabled: true },
]

function Articles() {
  return (
    <div className="space-y-8">
      <Card className="admin-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Publishing Controls</p>
            <h3 className="admin-title mt-3 text-xl">Manage Articles</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Shape editorial impact with precise scheduling and visibility rules.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="admin-button">Add Article</Button>
            <Button variant="ghost" className="admin-button">Create Policy</Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Drafts</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">6</p>
            <p className="mt-1 text-xs text-(--color-muted)">Awaiting editorial pass</p>
          </div>
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Scheduled</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">4</p>
            <p className="mt-1 text-xs text-(--color-muted)">Next 10 days</p>
          </div>
          <div className="admin-panel-subtle p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">Flagged</p>
            <p className="mt-2 text-2xl font-semibold text-(--color-primary)">2</p>
            <p className="mt-1 text-xs text-(--color-muted)">Needs review</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {articleControls.map((control) => (
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
          <h3 className="admin-title text-lg">Editorial Queue</h3>
          <span className="admin-chip">Review now</span>
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
              {articleRows.map((row) => (
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
        <h3 className="admin-title text-lg">Draft Editor</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Placeholder for editor integration with rich text tools.</p>
        <div className="admin-panel-subtle mt-4 p-4 text-sm text-(--color-muted)">Begin drafting the next academic article here.</div>
      </Card>
    </div>
  )
}

export default Articles
