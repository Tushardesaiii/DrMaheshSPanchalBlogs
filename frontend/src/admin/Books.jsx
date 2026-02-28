
import { useState } from 'react'
import BookForm from '../components/admin/BookForm'
import Card from '../components/ui/Card'
import { useContent } from '../context/ContentContext'
import { Trash2 } from 'lucide-react'
import { getPrimaryMedia, getPreviewUrl } from '../utils/media'

function Books() {
  const { contents, addContent, loading } = useContent()
  const [error, setError] = useState('')

  // Filter for books only
  const books = contents.filter((item) => {
    const hasBookSection = Array.isArray(item.sections) && item.sections.some((section) => ['Books', 'Collections', 'Educational Materials', 'Research Collections', 'Special Collections'].includes(section))
    return item.format === 'Collection' || hasBookSection
  })

  const handleAddContent = async (formData) => {
    setError('')
    try {
      await addContent(formData)
    } catch (error) {
      console.error('Books error:', error)
      const msg = error?.message || 'Failed to publish book'
      setError(msg)
      throw error
    }
  }

  return (
    <div className="space-y-8">
      {/* Book Addition Form */}
      <BookForm onSubmit={handleAddContent} />

      {/* Books Grid */}
      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">Book Management</p>
          <h3 className="admin-title mt-3 text-2xl">Published Books Grid</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Books appear on /books page in complete grid layout</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-(--color-muted)">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">No books published yet. Use the form above to publish your first book.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const media = getPrimaryMedia(book?.files)
              const previewUrl = media ? getPreviewUrl(media) : ''
              const isImage = media?.type === 'image'

              return (
              <div key={book._id} className="rounded-lg border border-(--color-border) bg-white p-4 hover:shadow-lg transition-shadow">
                {previewUrl && isImage ? (
                  <img
                    src={previewUrl}
                    alt={book.title}
                    className="mb-3 aspect-video w-full rounded-lg object-cover"
                    loading="lazy"
                    onError={(event) => {
                      if (media?.url && event.currentTarget.src !== media.url) {
                        event.currentTarget.src = media.url
                        return
                      }
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="mb-3 flex aspect-video w-full items-center justify-center rounded-lg bg-linear-to-br from-[#d4a574]/20 to-[#a87d4f]/20">
                    <span className="text-(--color-accent) text-sm font-semibold">{media?.type === 'pdf' ? 'PDF Attached' : 'Book Cover'}</span>
                  </div>
                )}
                <h4 className="font-semibold text-(--color-primary) line-clamp-2">{book.title}</h4>
                <p className="mt-2 text-xs text-(--color-muted) line-clamp-1">by {book.author || 'Unknown Author'}</p>
                <p className="mt-1 text-xs text-(--color-muted) line-clamp-2">{book.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-(--color-muted)">{book.status}</span>
                  <span className="text-(--color-accent)">{book.format}</span>
                </div>
              </div>
            )})}
          </div>
        )}
      </Card>

      {/* Books History Table */}
      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">Library History</p>
          <h3 className="admin-title mt-3 text-2xl">All Published Books</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Complete history and details of all books in your library</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-(--color-muted)">Loading library history...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">No books in library yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-(--color-border)">
                  <th className="pb-3 font-semibold text-(--color-primary)">Title</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Author</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Format</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Status</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Category</th>
                  <th className="pb-3 font-semibold text-(--color-primary)">Actions</th>
                </tr>
              </thead>
              <tbody className="text-(--color-text)">
                {books.map((book) => (
                  <tr key={book._id} className="border-b border-(--color-border) hover:bg-(--admin-surface)">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{book.title}</p>
                        <p className="text-xs text-(--color-muted) mt-1 line-clamp-1">{book.description}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{book.author || '-'}</td>
                    <td className="py-4 text-sm">{book.format}</td>
                    <td className="py-4">
                      <span className="inline-block rounded-full bg-(--admin-surface) px-3 py-1 text-xs font-semibold text-(--color-accent)">
                        {book.status || 'Published'}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{book.sections?.[0] || '-'}</td>
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

export default Books
