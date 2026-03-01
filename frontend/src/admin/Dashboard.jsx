
import { useState } from 'react'
import toast from 'react-hot-toast'
import PostForm from '../components/admin/PostForm'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { useContent } from '../context/ContentContext'
import { Trash2, AlertTriangle } from 'lucide-react'

function Dashboard() {
  const { contents, addContent, deleteContent, loading } = useContent()
  const [error, setError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  const handleDeleteClick = (post) => {
    setSelectedPost(post)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return

    setDeleting(true)
    const toastId = toast.loading('Deleting post...')
    
    try {
      await deleteContent(selectedPost._id)
      toast.success('Post deleted successfully!', { id: toastId })
      setDeleteModalOpen(false)
      setSelectedPost(null)
    } catch (error) {
      console.error('Failed to delete post:', error)
      toast.error('Failed to delete post. Please try again.', { id: toastId })
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setSelectedPost(null)
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
                      <button 
                        onClick={() => handleDeleteClick(post)}
                        className="rounded p-2 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete post"
                      >
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        onClose={handleDeleteCancel}
      >
        <div className="space-y-4">
          {selectedPost && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-900">{selectedPost.title}</p>
                  <p className="text-sm text-red-700 mt-1">
                    Category: {selectedPost.sections?.[0] || selectedPost.format || 'N/A'}
                  </p>
                  {selectedPost.description && (
                    <p className="text-sm text-red-600 mt-2 line-clamp-2">{selectedPost.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleDeleteCancel}
              disabled={deleting}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Post'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard
