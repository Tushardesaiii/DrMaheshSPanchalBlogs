import { useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

const CATEGORIES = [
  'Books',
  'Collections',
  'Educational Materials',
  'Research Collections',
  'Special Collections',
]

const FORMATS = ['Collection', 'PDF', 'Guide', 'Report']

function BookForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    format: 'Collection',
    category: '',
    visibility: 'Public',
  })
  const [fileInputs, setFileInputs] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    setFileInputs(files)
  }

  const removeFile = (index) => {
    setFileInputs(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    const toastId = toast.loading('Publishing book...')

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required')
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('author', formData.author)
      formDataToSend.append('format', formData.format)
      formDataToSend.append('sections', JSON.stringify([formData.category || 'Books']))
      formDataToSend.append('visibility', formData.visibility)
      formDataToSend.append('status', 'Published')
      formDataToSend.append('contentType', 'book')
      formDataToSend.append('tags', JSON.stringify([]))

      fileInputs.forEach((file) => {
        formDataToSend.append('files', file)
      })

      await onSubmit(formDataToSend)
      
      toast.success(`"${formData.title}" published successfully!`, { id: toastId })
      
      setFormData({
        title: '',
        description: '',
        author: '',
        format: 'Collection',
        category: '',
        visibility: 'Public',
      })
      setFileInputs([])
    } catch (error) {
      const errorMsg = error?.message || 'Failed to publish book'
      toast.error(errorMsg, { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="admin-panel p-8">
      <div>
        <p className="admin-kicker">Book Publisher</p>
        <h3 className="admin-title mt-3 text-2xl">Publish Book or Collection</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Add books, e-books, and collections to your library.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Book Title</p>
            <Input
              className="admin-input mt-2"
              placeholder="Enter book title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <p className="admin-field-label">Author</p>
            <Input
              className="admin-input mt-2"
              placeholder="Author name"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Format</p>
            <select
              className="admin-select mt-2"
              value={formData.format}
              onChange={(e) => handleChange('format', e.target.value)}
            >
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="admin-field-label">Category</p>
            <select
              className="admin-select mt-2"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="admin-field-label">Book Description / Synopsis</p>
          <textarea
            className="admin-input mt-2 min-h-48 resize-y w-full"
            placeholder="Write a detailed book description, synopsis, key features, or any relevant information...\n\nInclude details about the content, target audience, and what makes this book valuable."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={8}
          />
          <p className="mt-1.5 text-xs text-(--color-muted)">
            {formData.description.length} characters • You can resize this field by dragging the bottom-right corner
          </p>
        </div>

        <div>
          <p className="admin-field-label">Visibility</p>
          <select
            className="admin-select mt-2"
            value={formData.visibility}
            onChange={(e) => handleChange('visibility', e.target.value)}
          >
            <option value="Public">Public</option>
            <option value="Members">Members</option>
            <option value="Internal">Internal</option>
          </select>
        </div>

        <label className="admin-dropzone">
          <input type="file" className="hidden" onChange={handleFileChange} multiple accept="image/*,.pdf,.doc,.docx" />
          <p className="admin-field-label">Book Cover & Files (Optional)</p>
          <p className="text-sm text-(--color-muted)">Drop cover image, PDFs, or documents here.</p>
          <p className="text-xs text-(--color-muted)">Supports images, PDFs, Word documents</p>
        </label>

        {fileInputs.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-(--color-primary)">Selected Files ({fileInputs.length})</p>
            {fileInputs.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-(--admin-surface) p-3 text-sm">
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-(--color-muted)">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="ml-4 rounded px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          className="admin-button w-full"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Publishing...' : 'Publish Book'}
        </Button>
      </form>
    </Card>
  )
}

export default BookForm
