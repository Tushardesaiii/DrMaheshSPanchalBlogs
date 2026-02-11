import Card from '../components/ui/Card'

const stats = [
  { label: 'Books Managed', value: '240', detail: '12 pending reviews' },
  { label: 'Articles Published', value: '85', detail: '6 drafts in queue' },
  { label: 'Events Scheduled', value: '18', detail: '4 awaiting approval' },
  { label: 'Categories', value: '12', detail: '2 taxonomy requests' },
]

const controls = [
  { label: 'Homepage spotlight', helper: 'Pin editor picks', enabled: true },
  { label: 'Library visibility', helper: 'Public catalog access', enabled: true },
  { label: 'Event registrations', helper: 'Allow RSVP forms', enabled: false },
  { label: 'Comment moderation', helper: 'Require approval', enabled: true },
  { label: 'Search indexing', helper: 'Update nightly crawl', enabled: true },
  { label: 'Hero banner rotation', helper: 'Weekly rotation', enabled: false },
]

const signals = [
  { title: 'Publishing velocity', value: '1.8x', status: 'On track' },
  { title: 'Engagement pulse', value: '72%', status: 'Stable' },
  { title: 'Content freshness', value: '4.2 days', status: 'Needs lift' },
]

function Dashboard() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="admin-panel">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="admin-kicker">Control Overview</p>
              <h3 className="admin-title mt-3 text-2xl">Site Control Matrix</h3>
              <p className="mt-2 text-sm text-(--color-muted)">Tune how every collection, spotlight, and workflow behaves.</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="admin-chip">System Ready</span>
              <span className="admin-chip admin-chip-strong">Impact High</span>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="admin-stat">
                <p className="text-[11px] uppercase tracking-[0.3em] text-(--color-muted)">{stat.label}</p>
                <p className="admin-stat-value mt-3">{stat.value}</p>
                <p className="mt-2 text-xs text-(--color-muted)">{stat.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="admin-panel-subtle p-4">
              <p className="admin-kicker">Publishing Command</p>
              <ul className="mt-4 space-y-2 text-sm text-(--color-muted)">
                <li className="flex items-center justify-between">
                  <span>Editorial queue</span>
                  <span className="text-(--color-primary)">14 items</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Scheduled drops</span>
                  <span className="text-(--color-primary)">6 this week</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Quality gate checks</span>
                  <span className="text-(--color-primary)">92% pass</span>
                </li>
              </ul>
            </div>
            <div className="admin-panel-subtle p-4">
              <p className="admin-kicker">Impact Levers</p>
              <ul className="mt-4 space-y-2 text-sm text-(--color-muted)">
                <li className="flex items-center justify-between">
                  <span>Homepage emphasis</span>
                  <span className="admin-chip admin-chip-strong">High</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Collection priority</span>
                  <span className="admin-chip">Medium</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Event visibility</span>
                  <span className="admin-chip">Focused</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
        <Card className="admin-panel">
          <div className="flex items-start justify-between">
            <div>
              <p className="admin-kicker">System Controls</p>
              <h3 className="admin-title mt-3 text-xl">Toggle Impact</h3>
              <p className="mt-2 text-sm text-(--color-muted)">Apply global behaviors down to small interactions.</p>
            </div>
            <span className="admin-chip">Live</span>
          </div>
          <div className="mt-6 space-y-4">
            {controls.map((control) => (
              <div key={control.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-(--color-primary)">{control.label}</p>
                  <p className="text-xs text-(--color-muted)">{control.helper}</p>
                </div>
                <input type="checkbox" className="admin-toggle" defaultChecked={control.enabled} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="admin-panel">
          <div className="flex items-center justify-between">
            <div>
              <p className="admin-kicker">Recent Activity</p>
              <h3 className="admin-title mt-3 text-xl">Latest Admin Actions</h3>
            </div>
            <button className="admin-button rounded-full border border-(--color-border) px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
              Review Log
            </button>
          </div>
          <div className="mt-6 space-y-4 text-sm text-(--color-muted)">
            <div className="flex items-center justify-between">
              <span>New book added: Digital Archives and Library Futures</span>
              <span>2 days ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Event updated: Academic Research Colloquium</span>
              <span>1 week ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Article published: Designing Academic Knowledge Portals</span>
              <span>2 weeks ago</span>
            </div>
          </div>
        </Card>
        <Card className="admin-panel">
          <div>
            <p className="admin-kicker">Signal Board</p>
            <h3 className="admin-title mt-3 text-xl">Moderation Signals</h3>
          </div>
          <div className="mt-6 space-y-4">
            {signals.map((signal) => (
              <div key={signal.title} className="admin-panel-subtle p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-(--color-primary)">{signal.title}</p>
                  <span className="admin-chip admin-chip-strong">{signal.status}</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-(--color-primary)">{signal.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
