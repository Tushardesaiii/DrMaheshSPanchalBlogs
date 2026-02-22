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

  const getFileType = (file) => {
    const mimeType = file.type?.toLowerCase() || ''
    const url = file.url?.toLowerCase() || ''
    
    if (mimeType.startsWith('image/') || url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      return 'image'
    }
    if (mimeType.includes('pdf') || url.includes('.pdf') || url.includes('/pdf/') || url.includes('application/pdf')) {
      return 'pdf'
    }
    if (mimeType.startsWith('video/') || url.match(/\.(mp4|webm|ogg|mov)$/)) {
      return 'video'
    }
    return 'document'
  }

  const getCloudinaryThumbnail = (url, fileType) => {
    if (!url || !url.includes('cloudinary.com')) {
      return url
    }
    
    try {
      // For PDFs on Cloudinary, generate thumbnail
      if (fileType === 'pdf') {
        // Replace /upload/ with /upload/w_800,h_600,c_fit,f_jpg,pg_1/
        return url.replace('/upload/', '/upload/w_800,h_600,c_fit,f_jpg,pg_1/')
      }
      // For images, optimize
      if (fileType === 'image') {
        return url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/')
      }
      return url
    } catch (e) {
      return url
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} />
      case 'pdf': return <FileText size={20} />
      case 'video': return <FileText size={20} />
      default: return <File size={20} />
    }
  }

  const tags = Array.isArray(content.tags) ? content.tags : []
  const sections = Array.isArray(content.sections) ? content.sections : []
  const files = Array.isArray(content.files) ? content.files : []
  
  const imageFiles = files.filter(f => getFileType(f) === 'image')
  const pdfFiles = files.filter(f => getFileType(f) === 'pdf')
  const videoFiles = files.filter(f => getFileType(f) === 'video')
  const documentFiles = files.filter(f => getFileType(f) === 'document')

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

        {/* Image Gallery - LinkedIn Style */}
        {imageFiles.length > 0 && (
          <div className="space-y-2">
            {imageFiles.length === 1 ? (
              <div className="overflow-hidden rounded-xl border border-(--color-border) bg-slate-50">
                <img
                  src={getCloudinaryThumbnail(imageFiles[0].url, 'image')}
                  alt={imageFiles[0].name}
                  className="w-full max-h-[600px] object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = imageFiles[0].url
                  }}
                />
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 border-t border-(--color-border)">
                  <p className="text-xs text-(--color-muted) truncate">{imageFiles[0].name}</p>
                </div>
              </div>
            ) : imageFiles.length === 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {imageFiles.map((file, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-(--color-border)">
                    <div className="bg-slate-50">
                      <img
                        src={getCloudinaryThumbnail(file.url, 'image')}
                        alt={file.name}
                        className="w-full h-80 object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = file.url
                        }}
                      />
                    </div>
                    <div className="bg-white px-3 py-2">
                      <p className="text-xs text-(--color-muted) truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : imageFiles.length === 3 ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="row-span-2 overflow-hidden rounded-xl border border-(--color-border)">
                  <div className="bg-slate-50">
                    <img
                      src={getCloudinaryThumbnail(imageFiles[0].url, 'image')}
                      alt={imageFiles[0].name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = imageFiles[0].url
                      }}
                    />
                  </div>
                  <div className="bg-white px-3 py-2">
                    <p className="text-xs text-(--color-muted) truncate">{imageFiles[0].name}</p>
                  </div>
                </div>
                {imageFiles.slice(1).map((file, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-(--color-border)">
                    <div className="bg-slate-50">
                      <img
                        src={getCloudinaryThumbnail(file.url, 'image')}
                        alt={file.name}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = file.url
                        }}
                      />
                    </div>
                    <div className="bg-white px-3 py-2">
                      <p className="text-xs text-(--color-muted) truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {imageFiles.slice(0, 4).map((file, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-xl border border-(--color-border)"
                  >
                    <div className="bg-slate-50">
                      <img
                        src={getCloudinaryThumbnail(file.url, 'image')}
                        alt={file.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = file.url
                        }}
                      />
                    </div>
                    {index === 3 && imageFiles.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">+{imageFiles.length - 4}</span>
                      </div>
                    )}
                    <div className="bg-white px-3 py-2">
                      <p className="text-xs text-(--color-muted) truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PDF Previews - LinkedIn Style */}
        {pdfFiles.length > 0 && (
          <div className="space-y-4">
            {pdfFiles.map((file, index) => {
              const thumbnailUrl = getCloudinaryThumbnail(file.url, 'pdf')
              return (
                <Card key={index} className="p-0 overflow-hidden group">
                  {/* PDF Thumbnail Preview */}
                  <div className="relative bg-slate-50">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={`${file.name} preview`}
                        className="w-full h-96 object-contain bg-gradient-to-br from-slate-50 to-slate-100"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'flex'
                        }}
                      />
                      {/* Fallback if thumbnail fails */}
                      <div className="hidden w-full h-96 items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-red-500 text-white shadow-xl">
                          <FileText size={48} strokeWidth={2} />
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white rounded-full p-4 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                          <FileText size={32} className="text-red-500" />
                        </div>
                      </div>
                    </a>
                  </div>
                  
                  {/* PDF Info Footer */}
                  <div className="bg-white border-t border-(--color-border) p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-(--color-primary) truncate">{file.name}</p>
                        <p className="text-xs text-(--color-muted)">PDF Document</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg"
                        >
                          <FileText size={14} />
                          Open
                        </a>
                        <a
                          href={file.url}
                          download
                          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-red-500 px-3 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-50"
                        >
                          <Download size={14} />
                          Save
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Video Players */}
        {videoFiles.length > 0 && (
          <div className="space-y-4">
            {videoFiles.map((file, index) => (
              <Card key={index} className="p-0 overflow-hidden">
                <video
                  controls
                  className="w-full max-h-[600px] bg-black"
                  preload="metadata"
                  poster={file.url.replace('/upload/', '/upload/w_800,f_jpg,so_0/')}
                >
                  <source src={file.url} type={file.type || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
                <div className="bg-white border-t border-(--color-border) px-4 py-2">
                  <p className="text-sm text-(--color-primary) truncate">{file.name}</p>
                  <p className="text-xs text-(--color-muted)">Video</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Other Documents */}
        {documentFiles.length > 0 && (
          <div className="space-y-3">
            {documentFiles.map((file, index) => (
              <Card
                key={index}
                className="p-0 overflow-hidden group hover:shadow-lg transition-all"
              >
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="block"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center min-h-[200px] relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-xl group-hover:scale-110 transition-transform">
                      {getFileIcon('document')}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity" />
                  </div>
                  <div className="bg-white border-t border-(--color-border) p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-(--color-primary) truncate">{file.name}</p>
                        <p className="text-xs text-(--color-muted)">{file.type || 'Document'}</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors group-hover:bg-blue-700 flex-shrink-0">
                        <Download size={14} />
                        Download
                      </div>
                    </div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
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
