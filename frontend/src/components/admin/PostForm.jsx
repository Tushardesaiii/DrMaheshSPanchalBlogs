import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { FiLink } from 'react-icons/fi'

const CATEGORIES = [
  'Research Papers',
  'Library Reports',
  'Gujarati Content',
  'Events & Workshops',
  'Achievements & Awards',
  'Appreciation Letters',
  'Certificates',
  'Social Activities',
  'Conferences',
  'Workshops',
  'Reports',
  'Articles',
  'Notes',
]

const RECOGNITION_TYPES = ['Achievement Award', 'Appreciation Letter', 'Certificate', 'Social Activity', 'Other']
const AWARD_LEVELS = ['State Level', 'National Level', 'International Level']

const RESOURCE_FIELDS = [
  {
    key: 'youtube',
    label: 'YouTube Link',
    Icon: FaYoutube,
    placeholder: 'https://www.youtube.com/watch?v=...',
    iconClass: 'text-red-600',
    iconWrapClass: 'bg-red-100 ring-red-200',
  },
  {
    key: 'instagram',
    label: 'Instagram Link',
    Icon: FaInstagram,
    placeholder: 'https://www.instagram.com/...',
    iconClass: 'text-fuchsia-600',
    iconWrapClass: 'bg-pink-100 ring-pink-200',
  },
  {
    key: 'facebook',
    label: 'Facebook Link',
    Icon: FaFacebook,
    placeholder: 'https://www.facebook.com/...',
    iconClass: 'text-blue-600',
    iconWrapClass: 'bg-blue-100 ring-blue-200',
  },
  {
    key: 'other',
    label: 'Other Link',
    Icon: FiLink,
    placeholder: 'https://example.com/resource',
    iconClass: 'text-emerald-600',
    iconWrapClass: 'bg-emerald-100 ring-emerald-200',
  },
]

const createDefaultFormData = () => ({
  title: '',
  description: '',
  categories: [],
  visibility: 'Public',
  eventDate: '',
  location: '',
  eventTimeStart: '',
  eventTimeEnd: '',
  speaker: '',
  recognitionType: '',
  awardLevel: '',
  issuingOrganization: '',
  resourceLinks: {
    youtube: '',
    instagram: '',
    facebook: '',
    other: '',
  },
  featured: false,
})

const isValidHttpUrl = (value) => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const getResourceFormState = (resourceLinks = [], externalUrl = '') => {
  const next = {
    youtube: '',
    instagram: '',
    facebook: '',
    other: externalUrl || '',
  }

  resourceLinks.forEach((item) => {
    const platform = String(item?.platform || '').toLowerCase()
    const url = String(item?.url || '').trim()
    if (!url) return

    if (platform === 'youtube' || platform === 'instagram' || platform === 'facebook') {
      next[platform] = url
      return
    }

    if (!next.other) {
      next.other = url
    }
  })

  return next
}

const mapContentToFormData = (content) => {
  const defaults = createDefaultFormData()
  if (!content) return defaults

  return {
    ...defaults,
    title: content.title || '',
    description: content.description || '',
    categories: Array.isArray(content.sections) ? content.sections : [],
    visibility: content.visibility || 'Public',
    eventDate: content.eventDate ? new Date(content.eventDate).toISOString().slice(0, 10) : '',
    location: content.location || '',
    eventTimeStart: content.eventTime?.start || '',
    eventTimeEnd: content.eventTime?.end || '',
    speaker: content.speaker || '',
    recognitionType: content.recognitionType || '',
    awardLevel: content.awardLevel || '',
    issuingOrganization: content.issuingOrganization || '',
    featured: Boolean(content.featured),
    resourceLinks: getResourceFormState(content.resourceLinks, content.externalUrl),
  }
}

function PostForm({
  onSubmit,
  mode = 'create',
  initialValues = null,
  onCancel,
}) {
  const [formData, setFormData] = useState(createDefaultFormData)
  const [fileInputs, setFileInputs] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (mode === 'edit') {
      setFormData(mapContentToFormData(initialValues))
      setFileInputs([])
      return
    }

    setFormData(createDefaultFormData())
    setFileInputs([])
  }, [mode, initialValues])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    setFileInputs((prev) => [...prev, ...files].slice(0, 10))
    event.target.value = ''
  }

  const removeFile = (index) => {
    setFileInputs((prev) => prev.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setFormData(createDefaultFormData())
    setFileInputs([])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    const actionText = mode === 'edit' ? 'Updating post...' : 'Publishing article...'
    const toastId = toast.loading(actionText)

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required')
      }

      if (formData.categories.length === 0) {
        throw new Error('Please select at least one category')
      }

      const resourceLinks = Object.entries(formData.resourceLinks)
        .map(([platform, url]) => ({
          platform,
          url: String(url || '').trim(),
        }))
        .filter((item) => item.url.length > 0)

      const invalidResourceLink = resourceLinks.find((item) => !isValidHttpUrl(item.url))
      if (invalidResourceLink) {
        throw new Error(`Please enter a valid URL for ${invalidResourceLink.platform}`)
      }

      if (formData.recognitionType === 'Achievement Award' && !formData.awardLevel) {
        throw new Error('Please select award level for achievement award')
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('format', 'Article')
      formDataToSend.append('sections', JSON.stringify(formData.categories))
      formDataToSend.append('visibility', formData.visibility)
      formDataToSend.append('status', 'Published')
      formDataToSend.append('tags', JSON.stringify([]))

      if (formData.eventDate) formDataToSend.append('eventDate', formData.eventDate)
      if (formData.location) formDataToSend.append('location', formData.location)
      if (formData.eventTimeStart) formDataToSend.append('eventTimeStart', formData.eventTimeStart)
      if (formData.eventTimeEnd) formDataToSend.append('eventTimeEnd', formData.eventTimeEnd)
      if (formData.speaker) formDataToSend.append('speaker', formData.speaker)
      if (formData.recognitionType) formDataToSend.append('recognitionType', formData.recognitionType)
      if (formData.awardLevel) formDataToSend.append('awardLevel', formData.awardLevel)
      if (formData.issuingOrganization) formDataToSend.append('issuingOrganization', formData.issuingOrganization)
      if (resourceLinks.length > 0) {
        formDataToSend.append('resourceLinks', JSON.stringify(resourceLinks))
      }
      if (formData.resourceLinks.other) {
        formDataToSend.append('externalUrl', formData.resourceLinks.other.trim())
      }
      formDataToSend.append('featured', formData.featured)

      fileInputs.forEach((file) => {
        formDataToSend.append('files', file)
      })

      await onSubmit(formDataToSend)

      toast.success(mode === 'edit' ? 'Post updated successfully!' : `"${formData.title}" published successfully!`, { id: toastId })

      if (mode === 'create') {
        resetForm()
      }
    } catch (error) {
      const errorMsg = error?.message || (mode === 'edit' ? 'Failed to update post' : 'Failed to publish post')
      toast.error(errorMsg, { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  const submitText = submitting
    ? mode === 'edit'
      ? 'Updating...'
      : 'Publishing...'
    : mode === 'edit'
      ? 'Update Article'
      : 'Publish Article'

  return (
    <Card className="admin-panel p-8">
      <div>
        <p className="admin-kicker">{mode === 'edit' ? 'Article Editor' : 'Article Publisher'}</p>
        <h3 className="admin-title mt-3 text-2xl">{mode === 'edit' ? 'Edit Article or Post' : 'Publish Article or Post'}</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Share your articles, research, and content.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="admin-section">
          <div className="admin-form-group">
            <label htmlFor="title" className="admin-field-label">Article Title *</label>
            <Input
              id="title"
              className="admin-input"
              placeholder="Enter a clear, descriptive title for your article"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-form-group">
            <label className="admin-field-label">
              Select Categories
              {formData.categories.length > 0 && (
                <span className="ml-2 text-sm font-semibold text-(--color-accent)">({formData.categories.length} selected)</span>
              )}
            </label>
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
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-form-group">
            <label htmlFor="description" className="admin-field-label">Article Description / Full Content *</label>
            <textarea
              id="description"
              className="admin-textarea w-full"
              placeholder="Write your article description or full content here."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              rows={8}
            />
          </div>
        </div>

        <div className="admin-section space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="admin-form-group">
              <label htmlFor="eventDate" className="admin-field-label">Event/Publication Date</label>
              <input
                id="eventDate"
                type="date"
                className="admin-input"
                value={formData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="location" className="admin-field-label">Location (Optional)</label>
              <Input
                id="location"
                className="admin-input"
                placeholder="e.g., Conference Hall, Online"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="admin-form-group">
              <label htmlFor="startTime" className="admin-field-label">Start Time</label>
              <input
                id="startTime"
                type="time"
                className="admin-input"
                value={formData.eventTimeStart}
                onChange={(e) => handleChange('eventTimeStart', e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="endTime" className="admin-field-label">End Time</label>
              <input
                id="endTime"
                type="time"
                className="admin-input"
                value={formData.eventTimeEnd}
                onChange={(e) => handleChange('eventTimeEnd', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="speaker" className="admin-field-label">Speaker/Author</label>
            <Input
              id="speaker"
              className="admin-input"
              placeholder="e.g., Dr. John Doe"
              value={formData.speaker}
              onChange={(e) => handleChange('speaker', e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-(--color-border) bg-white/70 p-4">
            <p className="admin-field-label">Recognition & Social Categorization</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="admin-form-group">
                <label htmlFor="recognitionType" className="admin-field-label">Type</label>
                <select
                  id="recognitionType"
                  className="admin-select"
                  value={formData.recognitionType}
                  onChange={(event) => {
                    const nextType = event.target.value
                    handleChange('recognitionType', nextType)
                    if (nextType !== 'Achievement Award') {
                      handleChange('awardLevel', '')
                    }
                  }}
                >
                  <option value="">Select Type</option>
                  {RECOGNITION_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="awardLevel" className="admin-field-label">Award Level</label>
                <select
                  id="awardLevel"
                  className="admin-select"
                  value={formData.awardLevel}
                  onChange={(event) => handleChange('awardLevel', event.target.value)}
                  disabled={formData.recognitionType !== 'Achievement Award'}
                >
                  <option value="">Select Level</option>
                  {AWARD_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="issuingOrganization" className="admin-field-label">Organization</label>
                <Input
                  id="issuingOrganization"
                  className="admin-input"
                  placeholder="e.g., GTU / State Council"
                  value={formData.issuingOrganization}
                  onChange={(event) => handleChange('issuingOrganization', event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-field-label">Platform Links</label>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {RESOURCE_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className="admin-form-group">
                  <label htmlFor={`resource-${key}`} className="admin-field-label flex items-center gap-2.5">
                    {label}
                  </label>
                  <Input
                    id={`resource-${key}`}
                    type="url"
                    className="admin-input"
                    placeholder={placeholder}
                    value={formData.resourceLinks[key]}
                    onChange={(event) =>
                      handleChange('resourceLinks', {
                        ...formData.resourceLinks,
                        [key]: event.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="admin-form-group">
              <label htmlFor="visibility" className="admin-field-label">Visibility</label>
              <select
                id="visibility"
                className="admin-select"
                value={formData.visibility}
                onChange={(e) => handleChange('visibility', e.target.value)}
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
                  className="h-5 w-5 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-(--color-primary)">Highlight as featured content</span>
              </label>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <h3 className="admin-section-title">Attachments & Media</h3>
          <div className="admin-form-group">
            <label className="admin-field-label">
              Upload Files {mode === 'edit' ? '(Optional, replaces existing attachments)' : '(Optional)'}
            </label>
            <label className="admin-dropzone" aria-label="File upload area">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
                accept="image/*,.pdf,.doc,.docx"
              />
              <p className="text-base font-semibold text-(--color-primary)">Drop files here or click to browse</p>
            </label>
          </div>

          {fileInputs.length > 0 && (
            <div className="space-y-3 mt-6">
              <p className="text-sm font-semibold text-(--color-primary)">Selected Files ({fileInputs.length})</p>
              {fileInputs.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="flex items-center justify-between rounded-xl border-2 border-(--color-border) bg-white p-4 text-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-(--color-primary)">{file.name}</p>
                    <p className="text-xs text-(--color-muted) mt-1">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="ml-4 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t-2 border-(--color-border)">
          <div className="flex flex-wrap items-center gap-3">
            <Button className="admin-button px-8 py-3 text-base font-bold" type="submit" disabled={submitting}>
              {submitText}
            </Button>
            {mode === 'edit' && onCancel && (
              <Button type="button" variant="ghost" className="admin-button" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  )
}

export default PostForm
