import { useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

const SECTIONS = [
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

const FORMATS = ['Article', 'PDF', 'Report', 'Guide', 'Collection', 'Event Notice']

const getFormatFromSections = (sections) => {
  if (!Array.isArray(sections) || sections.length === 0) return 'Article'

  const sectionSet = new Set(sections)
  if (sectionSet.has('Conferences') || sectionSet.has('Workshops') || sectionSet.has('Events & Workshops') || sectionSet.has('Gallery')) {
    return 'Event Notice'
  }
  if (sectionSet.has('Reports') || sectionSet.has('Library Reports')) {
    return 'Report'
  }
  if (sectionSet.has('PDFs')) {
    return 'PDF'
  }
  if (sectionSet.has('Books')) {
    return 'Collection'
  }
  if (sectionSet.has('Notes')) {
    return 'Guide'
  }
  if (sectionSet.has('Articles') || sectionSet.has('Research Papers') || sectionSet.has('Gujarati Content')) {
    return 'Article'
  }
  return 'Article'
}

function ContentForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      sections: [],
      visibility: 'Public',
      files: [],
      eventDate: '',
      location: '',
      eventTimeStart: '',
      eventTimeEnd: '',
      speaker: '',
      externalUrl: '',
      featured: false,
    }
  )
  const [fileInputs, setFileInputs] = useState([])
  const [submitting, setSubmitting] = useState(false)

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

    const toastId = toast.loading('Publishing content...')

    try {
      // Validate inputs
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required')
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('format', getFormatFromSections(formData.sections))
      formDataToSend.append('sections', JSON.stringify(formData.sections))
      formDataToSend.append('visibility', formData.visibility)
      formDataToSend.append('status', 'Published')
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

      console.log('Submitting form with', fileInputs.length, 'files')
      await onSubmit(formDataToSend)
      
      // Success!
      toast.success(`"${formData.title}" published successfully!`, { id: toastId })
      
      setFormData({
        title: '',
        description: '',
        sections: [],
        visibility: 'Public',
        files: [],
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
      console.error('Submit error:', error)
      const errorMsg = error?.message || 'Failed to publish content'
      toast.error(errorMsg, { id: toastId })
      console.error('Full error details:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="admin-panel p-8">
      <div>
        <p className="admin-kicker">Unified Content Publisher</p>
        <h3 className="admin-title mt-3 text-2xl">Create & Publish Content</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Route content to multiple sections at once.</p>
      </div>

      <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
        {/* Title */}
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
        </div>

        {/* Description */}
        <div>
          <p className="admin-field-label">Content Description</p>
          <textarea
            className="admin-textarea mt-2 w-full resize-y overflow-y-auto"
            rows="8"
            style={{ minHeight: '200px' }}
            placeholder="Write a detailed description for your content...

You can include multiple paragraphs, key points, and all the relevant information here. This will be displayed on cards and preview pages."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
          <p className="mt-1.5 text-xs text-(--color-muted)">
            {formData.description.length} characters • You can resize this field vertically by dragging the bottom-right corner
          </p>
        </div>

        {/* Event Date */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Event/Publication Date</p>
            <Input
              type="date"
              className="admin-input mt-2"
              value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
            />
            <p className="mt-1 text-xs text-(--color-muted)">Optional: For events, workshops, or dated content</p>
          </div>
          <div>
            <p className="admin-field-label">Location (Optional)</p>
            <Input
              className="admin-input mt-2"
              placeholder="e.g., Conference Hall, Online, Mumbai"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
            <p className="mt-1 text-xs text-(--color-muted)">Physical location or virtual platform</p>
          </div>
        </div>

        {/* Event Time */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Start Time (Optional)</p>
            <Input
              type="time"
              className="admin-input mt-2"
              value={formData.eventTimeStart}
              onChange={(e) => handleChange('eventTimeStart', e.target.value)}
            />
          </div>
          <div>
            <p className="admin-field-label">End Time (Optional)</p>
            <Input
              type="time"
              className="admin-input mt-2"
              value={formData.eventTimeEnd}
              onChange={(e) => handleChange('eventTimeEnd', e.target.value)}
            />
          </div>
        </div>

        {/* Speaker/Author and External URL */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="admin-field-label">Speaker/Author (Optional)</p>
            <Input
              className="admin-input mt-2"
              placeholder="e.g., Dr. John Doe"
              value={formData.speaker}
              onChange={(e) => handleChange('speaker', e.target.value)}
            />
            <p className="mt-1 text-xs text-(--color-muted)">Event speaker or content author</p>
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
            <p className="mt-1 text-xs text-(--color-muted)">Link to external resource or registration</p>
          </div>
        </div>

        {/* Sections */}
        <div>
          <p className="admin-field-label">Route to Sections</p>
          <div className="admin-pill-group mt-4">
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
          <div>
            <p className="admin-field-label">Featured Content</p>
            <label className="mt-2 flex items-center gap-3 rounded-lg border border-(--color-border) bg-white px-4 py-3 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-(--color-primary)">Mark as featured content</span>
            </label>
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
            <div className="mt-4 space-y-3">
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
        <div className="flex flex-wrap gap-4 border-t border-(--color-border) pt-8 mt-8">
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
