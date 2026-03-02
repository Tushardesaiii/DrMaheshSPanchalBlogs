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
              <p className="mt-3 text-sm font-medium text-red-400" role="alert">
                 Please select at least one category
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="admin-section">
          
          
          <div className="admin-form-group">
            <label htmlFor="description" className="admin-field-label">
              Article Description / Full Content *
            </label>
            <p className="admin-helper-text mb-3">
              Write your full article content here.
            </p>
            <textarea
              id="description"
              className="admin-textarea w-full"
              aria-label="Article content"
              aria-required="true"
            placeholder="Write your article description or full content here.
You can write detailed content, paragraphs, and include all the information you want to share."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
            rows={8}
          />
          <p className="admin-helper-text mt-2">
            {formData.description.length} characters • found 
          </p>
        </div>
        </div>

        {/* Additional Details Section */}
        <div className="admin-section">
          
          
        <div className="grid gap-6 md:grid-cols-2">
          <div className="admin-form-group">
            <label htmlFor="eventDate" className="admin-field-label border-3 p-3 rounded-md md">Event/Publication Date</label>
            <input
              id="eventDate"
              type="date"
              className="admin-input"
              aria-label="Event or publication date"
              value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
            />
                </div>
          <div className='pb-4'>
            <p className="admin-field-label">Location (Optional)</p>
            <Input
              id="location"
              className="admin-input"
              placeholder="e.g., Conference Hall, Online"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              aria-label="Event location"
            />
            <p className="admin-helper-text">Physical location or virtual platform</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="admin-form-group">
            <label htmlFor="startTime" className="admin-field-label border-3 p-3 rounded-md md">Start Time</label>
            <input
              id="startTime"
              type="time"
              className="admin-input"
              value={formData.eventTimeStart}
              onChange={(e) => handleChange('eventTimeStart', e.target.value)}
              aria-label="Event start time"
            />
          </div>
          <div class="admin-form-group">
            <label htmlFor="endTime" className="admin-field-label border-3 p-3 rounded-md md">End Time</label>
            <input
              id="endTime"
              type="time"
              className="admin-input"
              value={formData.eventTimeEnd}
              onChange={(e) => handleChange('eventTimeEnd', e.target.value)}
              aria-label="Event end time"
            />
          </div>
        </div>

        <div className="grid pt-2 gap-6 md:grid-cols-2">
          <div className="admin-form-group">
            <label htmlFor="speaker" className="admin-field-label">Speaker/Author</label>
            <Input
              id="speaker"
              className="admin-input"
              placeholder="e.g., Dr. John Doe"
              value={formData.speaker}
              onChange={(e) => handleChange('speaker', e.target.value)}
              aria-label="Speaker or author name"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="externalUrl" className="admin-field-label">External URL</label>
            <Input
              id="externalUrl"
              type="url"
              className="admin-input"
              placeholder="https://example.com"
              value={formData.externalUrl}
              onChange={(e) => handleChange('externalUrl', e.target.value)}
              aria-label="External URL link"
            />
            <p className="admin-helper-text text-black/50">Link to event registration, resources, or related content</p>
          </div>
        </div>
        </div>

        {/* Settings Section */}
        <div className="admin-section">
          <h3 className="admin-section-title pb-3">
            
            Publishing Settings
          </h3>
          
        <div className="grid gap-6 md:grid-cols-2">
          <div className="admin-form-group">
            <label htmlFor="visibility" className="admin-field-label">Visibility</label>
            <select
              id="visibility"
              className="admin-select"
              value={formData.visibility}
              onChange={(e) => handleChange('visibility', e.target.value)}
              aria-label="Content visibility level"
            >
              <option value="Public">Public</option>
              <option value="Members">Members</option>
              <option value="Internal">Internal</option>
            </select>
           
          </div>
          <div className="admin-form-group">
            <label className="admin-field-label">Featured Content</label>
            <label className="mt-3 flex items-center gap-3 rounded-lg border-2 border-(--color-border) bg-white px-5 py-4 cursor-pointer hover:bg-gray-50 hover:border-(--color-accent) transition-all duration-200">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                aria-label="Mark content as featured"
              />
              <span className="text-sm font-medium text-(--color-primary)">Highlight as featured content</span>
            </label>
            <p className="admin-helper-text mt-2">Featured content appears prominently on the homepage</p>
          </div>
        </div>
        </div>

        {/* File Upload Section */}
        <div className="admin-section">
          <h3 className="admin-section-title">
            <span>📎</span>
            Attachments & Media
          </h3>
          
          <div className="admin-form-group">
            <label className="admin-field-label">Upload Files (Optional)</label>
            <p className="admin-helper-text mb-4">
              Add images, PDFs, or documents to enhance your article. Maximum 10 files.
            </p>
            <label className="admin-dropzone" aria-label="File upload area">
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                multiple 
                accept="image/*,.pdf,.doc,.docx"
                aria-label="Upload files"
              />
              <p className="text-base font-semibold text-(--color-primary)"> Drop files here or click to browse</p>
              <p className="text-sm text-(--color-muted) mt-2">Supports: Images (JPG, PNG), PDFs, Word documents</p>
            </label>
          </div>

        {fileInputs.length > 0 && (
          <div className="space-y-3 mt-6">
            <p className="text-sm font-semibold text-(--color-primary)">Selected Files ({fileInputs.length})</p>
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
                  Remove
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
            aria-label={submitting ? 'Publishing article' : 'Publish article'}
          >
            {submitting ? ' Publishing...' : ' Publish Article'}
          </Button>
          <p className="text-center text-sm text-(--color-muted) mt-4">
            Your article will be published immediately and visible based on the visibility setting.
          </p>
        </div>
      </form>
    </Card>
  )
}

export default PostForm
