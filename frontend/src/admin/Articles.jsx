import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Trash2, AlertTriangle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { useContent } from '../context/ContentContext'

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

function Articles() {
  const { normalizedContents, loading, deleteContent } = useContent()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Filter for article-type content
  const articles = normalizedContents.filter(
    (content) => content.format === 'Article' || content.format === 'PDF' || content.format === 'Report'
  )

  const handleDeleteClick = (article) => {
    setSelectedArticle(article)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedArticle) return

    setDeleting(true)
    const toastId = toast.loading('Deleting article...')
    
    try {
      await deleteContent(selectedArticle.id)
      toast.success('Article deleted successfully!', { id: toastId })
      setDeleteModalOpen(false)
      setSelectedArticle(null)
    } catch (error) {
      console.error('Failed to delete article:', error)
      toast.error('Failed to delete article. Please try again.', { id: toastId })
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setSelectedArticle(null)
  }

  return (
    <div className="space-y-8">
      <Card className="admin-panel p-8">
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

      <Card className="admin-panel p-8">
        <div className="flex items-center justify-between">
          <h3 className="admin-title text-lg">Publishing Queue</h3>
          <span className="admin-chip">{articles.length} Articles</span>
        </div>
        
        {loading ? (
          <div className="mt-6 text-center text-sm text-(--color-muted)">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="mt-6 text-center text-sm text-(--color-muted)">No articles found</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="admin-table w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3">Section</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-(--color-text)">
                {articles.map((article) => (
                  <tr key={article.id} className="border-t border-(--color-border)">
                    <td className="py-3 max-w-xs">
                      <div className="truncate font-medium">{article.title}</div>
                      <div className="text-xs text-(--color-muted) mt-1">{article.date}</div>
                    </td>
                    <td className="py-3">
                      <span className="admin-chip">{article.format}</span>
                    </td>
                    <td className="py-3">{article.category}</td>
                    <td className="py-3">{article.author}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteClick(article)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete article"
                      >
                        <Trash2 size={14} />
                        Delete
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
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone."
        onClose={handleDeleteCancel}
      >
        <div className="space-y-4">
          {selectedArticle && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-red-900">{selectedArticle.title}</p>
                  <p className="text-sm text-red-700 mt-1">
                    Format: {selectedArticle.format} • Author: {selectedArticle.author}
                  </p>
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
              {deleting ? 'Deleting...' : 'Delete Article'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Articles
