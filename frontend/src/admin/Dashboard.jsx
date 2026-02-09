import Card from '../components/ui/Card'

const stats = [
  { label: 'Books Managed', value: '240' },
  { label: 'Articles Published', value: '85' },
  { label: 'Events Scheduled', value: '18' },
  { label: 'Categories', value: '12' },
]

function Dashboard() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-muted)">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-(--color-primary)">{stat.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="section-title text-lg text-(--color-primary)">Recent Activity</h3>
        <div className="mt-4 space-y-3 text-sm text-(--color-muted)">
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
    </div>
  )
}

export default Dashboard
