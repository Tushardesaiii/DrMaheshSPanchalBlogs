import { useState } from 'react'
import ContentForm from '../components/admin/ContentForm'
import Card from '../components/ui/Card'
import { useContent } from '../context/ContentContext'

function Dashboard() {
  const { contents, addContent, loading } = useContent()
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  const handleAddContent = async (formData) => {
    setError('')
    try {
      console.log('Dashboard: Adding content...')
      await addContent(formData)
      console.log('Dashboard: Content added successfully')
    } catch (error) {
      console.error('Dashboard error:', error)
      const msg = error?.message || 'Failed to add content'
      setError(msg)
      throw error
    }
  }

  const filteredContents = filter === 'all'
    ? contents
    : contents.filter(c => c.status.toLowerCase() === filter.toLowerCase())

  return (
    <div className="space-y-8">
      <ContentForm onSubmit={handleAddContent} />

      <Card className="admin-panel">
        <div className="flex items-center justify-between">
          <div>
            <p className="admin-kicker">Content Queue</p>
            <h3 className="admin-title mt-3 text-xl">Publishing Pipeline</h3>
          </div>
          <div className="flex gap-2">
            {['all', 'published', 'scheduled', 'draft'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`admin-chip ${filter === status ? 'admin-chip-strong' : ''}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="text-sm text-(--color-muted)">Loading content...</p>
          ) : filteredContents.length === 0 ? (
            <p className="text-sm text-(--color-muted)">No content found.</p>
          ) : (
            <table className="admin-table w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3">Sections</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-(--color-text)">
                {filteredContents.map((content) => (
                  <tr key={content._id} className="border-t border-(--color-border)">
                    <td className="py-3 max-w-xs truncate">{content.title}</td>
                    <td className="py-3">{content.format}</td>
                    <td className="py-3 text-xs">
                      {content.sections && content.sections.slice(0, 2).map(s => (
                        <span key={s} className="admin-chip admin-chip-strong mr-1">{s}</span>
                      ))}
                      {content.sections && content.sections.length > 2 && (
                        <span className="text-(--color-muted)">+{content.sections.length - 2}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="admin-chip admin-chip-strong">{content.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
