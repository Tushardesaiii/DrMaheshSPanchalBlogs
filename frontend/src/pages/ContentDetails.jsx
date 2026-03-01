import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft, Calendar, User, Download, FileText, Image as ImageIcon, File, X, ExternalLink, ZoomIn, Lock, Globe, Tag } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

function ContentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [imageIndex, setImageIndex] = useState(0)

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
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcf9]">
        <p className="text-lg text-[#666666]">Loading article...</p>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#fcfcf9]">
        <p className="text-lg text-red-600">Article not found</p>
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
    if (file.resourceType) {
      if (file.resourceType === 'image') return 'image'
      if (file.resourceType === 'video') return 'video'
      if (file.resourceType === 'raw') {
        const format = file.format?.toLowerCase() || ''
        if (format === 'pdf') return 'pdf'
        if (['xlsx', 'xls', 'csv'].includes(format)) return 'excel'
        if (['docx', 'doc'].includes(format)) return 'word'
        return 'document'
      }
    }
    
    const mimeType = file.type?.toLowerCase() || ''
    const url = file.url?.toLowerCase() || ''
    const fileName = file.name?.toLowerCase() || ''
    
    if (mimeType.startsWith('image/') || url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      return 'image'
    }
    if (mimeType.includes('pdf') || fileName.endsWith('.pdf') || url.includes('.pdf')) {
      return 'pdf'
    }
    if (mimeType.includes('sheet') || mimeType.includes('excel') || fileName.match(/\.(xlsx?|csv)$/)) {
      return 'excel'
    }
    if (mimeType.includes('document') || mimeType.includes('word') || fileName.match(/\.docx?$/)) {
      return 'word'
    }
    if (mimeType.startsWith('video/') || url.match(/\.(mp4|webm|ogg|mov)$/)) {
      return 'video'
    }
    return 'document'
  }

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = file.name || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
      window.open(file.url, '_blank')
    }
  }

  const openFullscreen = (file, index) => {
    setFullscreenImage(file)
    setImageIndex(index)
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
  }

  const tags = Array.isArray(content.tags) ? content.tags : []
  const sections = Array.isArray(content.sections) ? content.sections : []
  const files = Array.isArray(content.files) ? content.files : []
  
  const imageFiles = files.filter(f => getFileType(f) === 'image')
  const pdfFiles = files.filter(f => getFileType(f) === 'pdf')
  const documentFiles = files.filter(f => !['image', 'pdf', 'video'].includes(getFileType(f)))

  return (
    <div className="min-h-screen bg-[#fcfcf9]">
      {/* Fullscreen Image Modal - LinkedIn/Substack style */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
          >
            <X size={24} />
          </button>
          <img
            src={fullscreenImage.url}
            alt={fullscreenImage.name}
            className="max-w-4xl max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">{/*Main content width*/}


        {/* Breadcrumb & Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#666666] hover:text-[#1a1a1a] transition-all mb-8 hover:-translate-x-1"
        >
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {/* Article Header - LinkedIn/Substack Style */}
        <header className="mb-12 border-b border-gray-200 pb-8 space-y-6">
          {/* Title */}
          <h1 className="font-serif text-5xl leading-tight tracking-tight text-[#1a1a1a] md:text-6xl wrap-break-word">
            {content.title}
          </h1>

          {/* Metadata Bar - Author, Date, Status */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {/* Author Card */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-[#1a1a1a] font-bold text-sm">
                  {(content.author || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a1a]">{content.author || 'Admin'}</p>
                  <div className="flex items-center gap-2 text-xs text-[#666666]">
                    <Calendar size={12} />
                    <span>{formatDate(content.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            {content.status && (
              <Badge className="capitalize">
                {content.status}
              </Badge>
            )}
          </div>

          {/* Sections/Category Pills */}
          {sections.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <span
                  key={section}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-[#666666]"
                >
                  <Tag size={12} />
                  {section}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Adaptive Grid Layout - 2/3 main + 1/3 sidebar for desktop */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Description / Lead Paragraph */}
            {content.description && (
              <div className="premium-card border border-(--color-border)">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-(--color-border)">
                  <FileText size={18} className="text-(--color-accent)" />
                  <h3 className="section-title text-lg text-(--color-primary)">Content</h3>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p 
                    className="font-serif text-lg leading-relaxed text-[#1a1a1a]" 
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  >
                    {content.description}
                  </p>
                </div>
              </div>
            )}

            {/* Adaptive Media Grid - LinkedIn/Substack style */}
            {imageFiles.length > 0 && (
              <div className="space-y-0">
                {/* Single Image - Full Width Hero */}
                {imageFiles.length === 1 && (
                  <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img
                        src={imageFiles[0].url}
                        alt={imageFiles[0].name}
                        className="w-full max-h-150 object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => openFullscreen(imageFiles[0], 0)}
                      />
                      {/* Glassmorphism Overlay - Hidden by default, shown on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openFullscreen(imageFiles[0], 0)
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 backdrop-blur text-[#1a1a1a] font-semibold hover:bg-white transition-colors shadow-lg"
                        >
                          <ZoomIn size={18} />
                          Zoom
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(imageFiles[0])
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 backdrop-blur text-[#1a1a1a] font-semibold hover:bg-white transition-colors shadow-lg"
                        >
                          <Download size={18} />
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm px-4 py-3 border-t border-gray-200">
                      <p className="text-sm text-[#666666] font-medium truncate">{imageFiles[0].name}</p>
                    </div>
                  </div>
                )}

                {/* 2 Images - Split Grid */}
                {imageFiles.length === 2 && (
                  <div className="grid grid-cols-2 gap-0">
                    {imageFiles.map((file, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden bg-gray-50 border border-gray-200 border-l-0 border-t-0"
                        style={{
                          borderLeft: i % 2 === 0 ? undefined : '1px solid #e5e7eb',
                          borderTop: i < 2 ? undefined : '1px solid #e5e7eb',
                        }}
                      >
                        <div className="relative overflow-hidden pb-[100%]">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => openFullscreen(file, i)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openFullscreen(file, i)
                              }}
                              className="p-2 rounded-full bg-white/90 backdrop-blur text-[#1a1a1a] hover:bg-white transition-colors shadow-lg"
                            >
                              <ZoomIn size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(file)
                              }}
                              className="p-2 rounded-full bg-white/90 backdrop-blur text-[#1a1a1a] hover:bg-white transition-colors shadow-lg"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3-4+ Images - Masonry/Grid */}
                {imageFiles.length >= 3 && (
                  <div className="grid grid-cols-2 gap-0">
                    {imageFiles.map((file, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden bg-gray-50 border border-gray-200 border-l-0 border-t-0"
                        style={{
                          borderLeft: i % 2 === 0 ? undefined : '1px solid #e5e7eb',
                          borderTop: i < 2 ? undefined : '1px solid #e5e7eb',
                          gridColumn: i === 0 && imageFiles.length >= 3 ? 'span 1' : undefined,
                          gridRow: i === 0 && imageFiles.length >= 3 ? 'span 2' : undefined,
                        }}
                      >
                        <div className="relative overflow-hidden pb-[100%] h-full">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => openFullscreen(file, i)}
                          />
                          {/* +N indicator for overflow images */}
                          {i === 3 && imageFiles.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-3xl font-bold">+{imageFiles.length - 4}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openFullscreen(file, i)
                              }}
                              className="p-2 rounded-full bg-white/90 backdrop-blur text-[#1a1a1a] hover:bg-white transition-colors shadow-lg"
                            >
                              <ZoomIn size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(file)
                              }}
                              className="p-2 rounded-full bg-white/90 backdrop-blur text-[#1a1a1a] hover:bg-white transition-colors shadow-lg"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* PDF/Document File Cards - File Card Layout */}
            {pdfFiles.length > 0 && (
              <div className="space-y-4">
                {pdfFiles.map((file, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg hover:border-red-300 transition-all"
                  >
                    {/* File Icon - Left */}
                    <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                      <FileText className="h-8 w-8 text-red-500" strokeWidth={1.5} />
                    </div>

                    {/* File Info - Center */}
                    <div className="grow min-w-0">
                      <h4 className="text-sm font-bold text-[#1a1a1a] truncate">{file.name}</h4>
                      <p className="text-xs text-[#666666] space-x-2">
                        <span>PDF Document</span>
                        {file.size && <span>• {(file.size / 1024 / 1024).toFixed(2)} MB</span>}
                      </p>
                    </div>

                    {/* Action Buttons - Right */}
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg"
                      >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Open</span>
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-red-500 px-3 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-50"
                      >
                        <Download size={14} />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Secondary Metadata & Catalog (Sticky) */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Sticky Container */}
            <div className="sticky top-8 space-y-6">
              {/* Category/Format Card */}
              {content.format && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-3">Format</h3>
                  <p className="text-lg font-semibold text-[#1a1a1a]">{content.format}</p>
                </div>
              )}

              {/* Visibility Card */}
              {content.visibility && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {content.visibility === 'public' ? (
                      <Globe size={16} className="text-[#666666]" />
                    ) : (
                      <Lock size={16} className="text-[#666666]" />
                    )}
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Access</h3>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a] capitalize">{content.visibility}</p>
                </div>
              )}

              {/* Event Date Card */}
              {content.eventDate && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={16} className="text-[#666666]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Event Date</h3>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{formatDate(content.eventDate)}</p>
                  {content.eventTime && (content.eventTime.start || content.eventTime.end) && (
                    <p className="text-xs text-[#666666] mt-2">
                      {content.eventTime.start && content.eventTime.start}
                      {content.eventTime.start && content.eventTime.end && ' - '}
                      {content.eventTime.end && content.eventTime.end}
                    </p>
                  )}
                </div>
              )}

              {/* Location Card */}
              {content.location && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#666666]">📍</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Location</h3>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{content.location}</p>
                </div>
              )}

              {/* Speaker Card */}
              {content.speaker && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <User size={16} className="text-[#666666]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666]">Speaker/Author</h3>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{content.speaker}</p>
                </div>
              )}

              {/* External URL Card */}
              {content.externalUrl && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <ExternalLink size={16} className="text-[#666666]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666]">External Link</h3>
                  </div>
                  <a 
                    href={content.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    Visit Resource →
                  </a>
                </div>
              )}

              {/* Featured Badge */}
              {content.featured && (
                <div className="rounded-lg border-2 border-amber-300 bg-linear-to-br from-amber-50 to-amber-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">⭐</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">Featured Content</h3>
                  </div>
                  <p className="text-xs text-amber-700">This content is featured on the homepage</p>
                </div>
              )}

              {/* Tags/Categories Sidebar */}
              {tags.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-[#666666]"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Card */}
              {content.status && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-3">Status</h3>
                  <Badge className="capitalize">{content.status}</Badge>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ContentDetails
