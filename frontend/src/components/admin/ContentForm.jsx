import { useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

const SECTIONS = [
  'Literature',
  'Competitive Exams',
  'Learning Resources',
  'Research Papers',
  'Library Reports',
  'Gujarati Content',
  'Scholarships',
  'Events & Workshops',
]

const FORMATS = ['Article', 'PDF', 'Report', 'Guide', 'Collection', 'Event Notice']

function ContentForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      format: 'Article',
      sections: [],
      visibility: 'Public',
      files: [],
    }
  )
  const [fileInputs, setFileInputs] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSection = (section) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section],
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
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Validate inputs
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required')
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('format', formData.format)
      formDataToSend.append('sections', JSON.stringify(formData.sections))
      formDataToSend.append('visibility', formData.visibility)
      formDataToSend.append('status', 'Published')
      formDataToSend.append('tags', JSON.stringify([]))

      fileInputs.forEach((file) => {
        formDataToSend.append('files', file)
      })

      console.log('Submitting form with', fileInputs.length, 'files')
      await onSubmit(formDataToSend)
      
      // Success!
      setSuccessMessage(`✅ "${formData.title}" published successfully!`)
      setFormData({
        title: '',
        description: '',
        format: 'Article',
        sections: [],
        visibility: 'Public',
        files: [],
      })
      setFileInputs([])
      
      // Clear success message after 4 seconds
      setTimeout(() => setSuccessMessage(''), 4000)
    } catch (error) {
      console.error('Submit error:', error)
      const errorMsg = error?.message || 'Failed to publish content'
      setErrorMessage(`❌ ${errorMsg}`)
      console.error('Full error details:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="admin-panel">
      <div>
        <p className="admin-kicker">Unified Content Publisher</p>
        <h3 className="admin-title mt-3 text-2xl">Create & Publish Content</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Route content to multiple sections at once.</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {/* Title & Format */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Title</p>
            <Input
              className="admin-input mt-2"
              placeholder="Content title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <p className="admin-field-label">Format</p>
            <select
              className="admin-select mt-2 w-full"
              value={formData.format}
              onChange={(e) => handleChange('format', e.target.value)}
            >
              {FORMATS.map((format) => (
                <option key={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="admin-field-label">Description</p>
          <textarea
            className="admin-textarea mt-2 w-full"
            rows="4"
            placeholder="Short description for cards and previews."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
        </div>

        {/* Sections */}
        <div>
          <p className="admin-field-label">Route to Sections</p>
          <div className="admin-pill-group mt-3">
            {SECTIONS.map((section) => (
              <label key={section} className="admin-pill">
                <input
                  type="checkbox"
                  checked={formData.sections.includes(section)}
                  onChange={() => toggleSection(section)}
                />
                <span>{section}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Visibility</p>
            <select
              className="admin-select mt-2 w-full"
              value={formData.visibility}
              onChange={(e) => handleChange('visibility', e.target.value)}
            >
              <option>Public</option>
              <option>Members</option>
              <option>Internal</option>
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <p className="admin-field-label">Attachments (Optional)</p>
          <label className="admin-dropzone mt-2">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-sm text-(--color-muted)">Drop files here or click to upload.</p>
            <p className="text-xs text-(--color-muted)">PDF, DOCX, images, or external links.</p>
          </label>
        </div>

        {/* File Preview */}
        {fileInputs.length > 0 && (
          <div>
            <p className="admin-field-label text-xs">Files to upload ({fileInputs.length})</p>
            <div className="mt-2 space-y-2">
              {fileInputs.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-(--color-border) bg-white px-3 py-2 text-sm"
                >
                  <span className="text-(--color-primary)">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button type="submit" className="admin-button" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Now'}
          </Button>
          <Button type="button" variant="ghost" className="admin-button">
            Save Draft
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ContentForm
