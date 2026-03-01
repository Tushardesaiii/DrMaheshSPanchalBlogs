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

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Basic Information Section */}
        <div className="admin-section">
          
          
        <div className="grid gap-6 md:grid-cols-2">
          <div className="admin-form-group">
            <label htmlFor="title" className="admin-field-label">Book Title *</label>
            <Input
              id="title"
              className="admin-input"
              placeholder="Enter book title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              aria-required="true"
              aria-label="Book title"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="author" className="admin-field-label">Author Name *</label>
            <Input
              id="author"
              className="admin-input"
              placeholder="e.g., Dr. John Doe"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              aria-label="Author name"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="admin-form-group">
            <label htmlFor="format" className="admin-field-label">Format</label>
            <select
              id="format"
              className="admin-select"
              value={formData.format}
              onChange={(e) => handleChange('format', e.target.value)}
              aria-label="Book format"
            >
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label htmlFor="category" className="admin-field-label">Category</label>
            <select
              id="category"
              className="admin-select"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              aria-label="Book category"
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
        </div>

        {/* Content Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">
            <span></span>
            Book Description
          </h3>
          
          <div className="admin-form-group">
            <label htmlFor="description" className="admin-field-label">Book Description / Synopsis </label>
            <p className="admin-helper-text mb-3">
              Provide a detailed description, synopsis, key features, and what makes this book valuable.
            </p>
            <textarea
              id="description"
              className="admin-textarea w-full"
            placeholder="Write a detailed book description, synopsis, key features, or any relevant information...\n\nInclude details about the content, target audience, and what makes this book valuable."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            aria-required="true"
            aria-label="Book description"
            rows={8}
          />
          <p className="admin-helper-text mt-2">
            {formData.description.length} characters • Drag from the bottom-right corner to resize
          </p>
        </div>
        </div>

        {/* Settings Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">
            
            Publishing Settings
          </h3>
          
          <div className="admin-form-group">
            <label htmlFor="visibility" className="admin-field-label">Visibility</label>
            <select
              id="visibility"
              className="admin-select"
            value={formData.visibility}
            onChange={(e) => handleChange('visibility', e.target.value)}
              aria-label="Content visibility"
            >
              <option value="Public">Public</option>
              <option value="Members">Members</option>
              <option value="Internal">Internal</option>
            </select>
            <p className="admin-helper-text mt-2">Control who can view this book</p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">
            <span>📎</span>
            Book Cover & Files
          </h3>
          
          <div className="admin-form-group">
            <label className="admin-field-label">Upload Files (Optional)</label>
            <p className="admin-helper-text mb-4">
              Add book cover image, PDF files, or supporting documents.
            </p>
            <label className="admin-dropzone" aria-label="File upload area">
              <input type="file" className="hidden" onChange={handleFileChange} multiple accept="image/*,.pdf,.doc,.docx" />
              <p className="text-base font-semibold text-(--color-primary)">Drop files here or click to browse</p>
              <p className="text-sm text-(--color-muted) mt-2">Supports: Images (JPG, PNG), PDFs, Word documents</p>
            </label>
          </div>

        {fileInputs.length > 0 && (
          <div className="space-y-3 mt-6">
            <p className="text-sm font-semibold text-(--color-primary)">📂 Selected Files ({fileInputs.length})</p>
            {fileInputs.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl border-2 border-(--color-border) bg-white p-4 text-sm hover:border-(--color-accent) transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-(--color-primary)">{file.name}</p>
                  <p className="text-xs text-(--color-muted) mt-1">
                    Size: {(file.size / 1024 / 1024).toFixed(2)} MB • Type: {file.type || 'Unknown'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="ml-4 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all"
                  aria-label={`Remove ${file.name}`}
                >
                  ✖ Remove
                </button>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t-2 border-(--color-border)">
          <Button
            className="admin-button w-full py-4 text-base font-bold"
            type="submit"
            disabled={submitting}
            aria-label={submitting ? 'Publishing book' : 'Publish book'}
          >
            {submitting ? '⏳ Publishing...' : '🚀 Publish Book'}
          </Button>
          <p className="text-center text-sm text-(--color-muted) mt-4">
            Your book will be published immediately and visible in the library.
          </p>
        </div>
      </form>
    </Card>
  )
}

export default BookForm
