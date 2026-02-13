import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft, Calendar, User, Download, FileText, Image as ImageIcon, File } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function ContentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const apiBase = import.meta.env.VITE_API_BASE_URL || ''
        const response = await fetch(`${apiBase}/api/content/${id}`)
        
        if (!response.ok) {
          throw new Error('Content not found')
        }
        
        const data = await response.json()
        setContent(data?.data)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchContent()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-(--color-muted)">Loading content...</p>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
        <p className="text-lg text-red-600">Content not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <File size={20} />
    if (mimeType.startsWith('image/')) return <ImageIcon size={20} />
    if (mimeType.includes('pdf')) return <FileText size={20} />
    return <File size={20} />
  }

  const tags = Array.isArray(content.tags) ? content.tags : []
  const sections = Array.isArray(content.sections) ? content.sections : []
  const files = Array.isArray(content.files) ? content.files : []

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-(--color-muted) transition-colors hover:text-(--color-primary)"
      >
        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        Back
      </button>

      {/* Header */}
      <header className="space-y-4 border-b border-(--color-border) pb-8">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <Badge key={section}>{section}</Badge>
          ))}
          <Badge>{content.format}</Badge>
        </div>
        
        <h1 className="section-title text-4xl md:text-5xl text-(--color-primary)">
          {content.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-(--color-muted)">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>By {content.author || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(content.createdAt)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className="space-y-6">
        <Card className="p-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-(--color-text)">
              {content.description}
            </p>
          </div>
        </Card>

        {/* Tags Section */}
        {tags.length > 0 && (
          <Card className="p-6">
            <h3 className="section-title mb-4 text-lg text-(--color-primary)">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-(--color-bg) px-4 py-1 text-sm text-(--color-secondary)"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Files & Media Section */}
        {files.length > 0 && (
          <Card className="p-6">
            <h3 className="section-title mb-4 text-lg text-(--color-primary)">
              Attachments & Media
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-(--color-border) bg-white p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--color-bg) text-(--color-secondary)">
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <p className="font-medium text-(--color-primary)">{file.name}</p>
                      <p className="text-xs text-(--color-muted)">{file.type}</p>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-(--color-accent)"
                  >
                    {file.type?.startsWith('image/') ? 'View' : 'Download'}
                    <Download size={16} />
                  </a>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Image Gallery for Image Files */}
        {files.some(f => f.type?.startsWith('image/')) && (
          <Card className="p-6">
            <h3 className="section-title mb-4 text-lg text-(--color-primary)">Gallery</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {files
                .filter(f => f.type?.startsWith('image/'))
                .map((file, index) => (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl"
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-64 w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-10" />
                  </a>
                ))}
            </div>
          </Card>
        )}

        {/* Metadata Footer */}
        <Card className="p-6">
          <h3 className="section-title mb-4 text-sm text-(--color-muted)">Content Information</h3>
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-bold text-(--color-secondary)">Visibility</dt>
              <dd className="text-(--color-muted)">{content.visibility}</dd>
            </div>
            <div>
              <dt className="font-bold text-(--color-secondary)">Status</dt>
              <dd className="text-(--color-muted)">{content.status}</dd>
            </div>
            <div>
              <dt className="font-bold text-(--color-secondary)">Format</dt>
              <dd className="text-(--color-muted)">{content.format}</dd>
            </div>
            <div>
              <dt className="font-bold text-(--color-secondary)">Published</dt>
              <dd className="text-(--color-muted)">{formatDate(content.createdAt)}</dd>
            </div>
          </dl>
        </Card>
      </article>

      {/* Bottom Navigation */}
      <div className="flex justify-center pt-8">
        <Button onClick={() => navigate(-1)} className="w-full md:w-auto">
          Back to List
        </Button>
      </div>
    </div>
  )
}

export default ContentDetails
