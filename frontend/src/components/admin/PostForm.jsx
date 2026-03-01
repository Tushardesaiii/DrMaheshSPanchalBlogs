import { useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

const CATEGORIES = [
  'Research Papers',
  'Library Reports',
  'Gujarati Content',
  'Events & Workshops',
  'Activities & Events',
  'Conferences',
  'Workshops',
  'Reports',
  'Articles',
  'Notes',
]

function PostForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],
    visibility: 'Public',
    eventDate: '',
    location: '',
    eventTimeStart: '',
    eventTimeEnd: '',
    speaker: '',
    externalUrl: '',
    featured: false,
  })
  const [fileInputs, setFileInputs] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
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

    const toastId = toast.loading('Publishing article...')

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required')
      }

      if (formData.categories.length === 0) {
        throw new Error('Please select at least one category')
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('format', 'Article')
      formDataToSend.append('sections', JSON.stringify(formData.categories))
      formDataToSend.append('visibility', formData.visibility)
      formDataToSend.append('status', 'Published')
      formDataToSend.append('contentType', 'post')
      formDataToSend.append('tags', JSON.stringify([]))

      // Append new fields if they have values
      if (formData.eventDate) formDataToSend.append('eventDate', formData.eventDate)
      if (formData.location) formDataToSend.append('location', formData.location)
      if (formData.eventTimeStart) formDataToSend.append('eventTimeStart', formData.eventTimeStart)
      if (formData.eventTimeEnd) formDataToSend.append('eventTimeEnd', formData.eventTimeEnd)
      if (formData.speaker) formDataToSend.append('speaker', formData.speaker)
      if (formData.externalUrl) formDataToSend.append('externalUrl', formData.externalUrl)
      formDataToSend.append('featured', formData.featured)

      fileInputs.forEach((file) => {
        formDataToSend.append('files', file)
      })

      await onSubmit(formDataToSend)
      
      toast.success(`"${formData.title}" published successfully!`, { id: toastId })
      
      setFormData({
        title: '',
        description: '',
        categories: [],
        visibility: 'Public',
        eventDate: '',
        location: '',
        eventTimeStart: '',
        eventTimeEnd: '',
        speaker: '',
        externalUrl: '',
        featured: false,
      })
      setFileInputs([])
    } catch (error) {
      const errorMsg = error?.message || 'Failed to publish post'
      toast.error(errorMsg, { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="admin-panel p-8">
      <div>
        <p className="admin-kicker">Article Publisher</p>
        <h3 className="admin-title mt-3 text-2xl">Publish Article or Post</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Share your articles, research, and content.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Basic Information Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">
            <span>📝</span>
            Basic Information
          </h3>
          
          <div className="admin-form-group">
            <label htmlFor="title" className="admin-field-label">
              Article Title *
            </label>
            <Input
              id="title"
              className="admin-input"
              placeholder="Enter a clear, descriptive title for your article"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              aria-required="true"
              aria-label="Article title"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">
            <span>🏷️</span>
            Categories & Sections
          </h3>
          
          <div className="admin-form-group">
            <label className="admin-field-label">
              Select Categories
              {formData.categories.length > 0 && (
                <span className="ml-2 text-sm font-semibold text-(--color-accent)">
                  ({formData.categories.length} selected)
                </span>
              )}
            </label>
            <p className="admin-helper-text">
              Choose one or more categories where this article will appear. This helps readers find your content.
            </p>
            <div className="admin-pill-group mt-4" role="group" aria-label="Category selection">
            {CATEGORIES.map((category) => (
              <label key={category} className="admin-pill">
                <input 
                  type="checkbox" 
                  checked={formData.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
            {formData.categories.length === 0 && (
              <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                ⚠️ Please select at least one category
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">
            <span>✍️</span>
            Article Content
          </h3>
          
          <div className="admin-form-group">
            <label htmlFor="description" className="admin-field-label">
              Article Description / Full Content *
            </label>
            <p className="admin-helper-text mb-3">
              Write your full article content here. Use proper paragraph breaks and spacing for better readability.
            </p>
            <textarea
              id="description"
              className="admin-textarea w-full"
              aria-label="Article content"
              aria-required="true"
            placeholder="Write your article description or full content here...\n\nYou can write detailed content, paragraphs, and include all the information you want to share."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={8}
          />
          <p className="mt-1.5 text-xs text-(--color-muted)">
            {formData.description.length} characters • You can resize this field by dragging the bottom-right corner
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Event/Publication Date</p>
            <input
              type="date"
              className="admin-input mt-2"
              value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
            />
            <p className="mt-1 text-xs text-(--color-muted)">Optional: For events or dated content</p>
          </div>
          <div>
            <p className="admin-field-label">Location (Optional)</p>
            <Input
              className="admin-input mt-2"
              placeholder="e.g., Conference Hall, Online"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Start Time (Optional)</p>
            <input
              type="time"
              className="admin-input mt-2"
              value={formData.eventTimeStart}
              onChange={(e) => handleChange('eventTimeStart', e.target.value)}
            />
          </div>
          <div>
            <p className="admin-field-label">End Time (Optional)</p>
            <input
              type="time"
              className="admin-input mt-2"
              value={formData.eventTimeEnd}
              onChange={(e) => handleChange('eventTimeEnd', e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Speaker/Author (Optional)</p>
            <Input
              className="admin-input mt-2"
              placeholder="e.g., Dr. John Doe"
              value={formData.speaker}
              onChange={(e) => handleChange('speaker', e.target.value)}
            />
          </div>
          <div>
            <p className="admin-field-label">External URL (Optional)</p>
            <Input
              type="url"
              className="admin-input mt-2"
              placeholder="https://example.com"
              value={formData.externalUrl}
              onChange={(e) => handleChange('externalUrl', e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
          <div>
            <p className="admin-field-label">Featured Content</p>
            <label className="mt-2 flex items-center gap-3 rounded-lg border border-(--color-border) bg-white px-4 py-3 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-(--color-primary)">Mark as featured</span>
            </label>
          </div>
        </div>

        <label className="admin-dropzone">
          <input type="file" className="hidden" onChange={handleFileChange} multiple accept="image/*,.pdf,.doc,.docx" />
          <p className="admin-field-label">Attachments (Optional)</p>
          <p className="text-sm text-(--color-muted)">Drop images, PDFs, or documents here.</p>
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
          {submitting ? 'Publishing...' : 'Publish Article'}
        </Button>
      </form>
    </Card>
  )
}

export default PostForm
