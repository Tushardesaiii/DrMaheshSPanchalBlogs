
import { useState } from 'react'
import PostForm from '../components/admin/PostForm'
import Card from '../components/ui/Card'
import { useContent } from '../context/ContentContext'
import { Trash2 } from 'lucide-react'
function Dashboard() {
  const { contents, addContent, loading } = useContent()
  const [error, setError] = useState('')

  // Filter for posts/articles (not books)
  const posts = contents.filter((item) => {
    const hasBookSection = Array.isArray(item.sections) && item.sections.some((section) => ['Books', 'Collections', 'Educational Materials', 'Research Collections', 'Special Collections'].includes(section))
    return item.format !== 'Collection' && !hasBookSection
  })


  const handleAddContent = async (formData) => {
    setError('')
    try {
      await addContent(formData)
    } catch (error) {
      console.error('Dashboard error:', error)
      const msg = error?.message || 'Failed to publish post'
      setError(msg)
      throw error
    }
  }

  return (
    <div className="space-y-8">
      {/* Posts Form */}
      <PostForm onSubmit={handleAddContent} />

      {/* Posts History */}
      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">Articles & Posts</p>
          <h3 className="admin-title mt-3 text-2xl">Published Posts History</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Posts appear on article pages and search results</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-(--color-muted)">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">No posts published yet. Use the form above to publish your first article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-(--color-border)">
                  <th className="pb-3 font-semibold text-(--color-primary)">Title</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Category</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Status</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Visibility</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Actions</th>
                </tr>
              </thead>
              <tbody className="text-(--color-text)">
                {posts.map((post) => (
                  <tr key={post._id} className="border-b border-(--color-border) hover:bg-(--admin-surface)">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-(--color-muted) mt-1 line-clamp-1">{post.description}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{post.sections?.[0] || post.format || '-'}</td>
                    <td className="py-4">
                      <span className="inline-block rounded-full bg-(--admin-surface) px-3 py-1 text-xs font-semibold text-(--color-accent)">
                        {post.status || 'Published'}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{post.visibility || 'Public'}</td>
                    <td className="py-4">
                      <button className="rounded p-2 text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Dashboard
