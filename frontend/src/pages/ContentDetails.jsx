import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft, Calendar, User, Download, FileText, Image as ImageIcon, File, X, ExternalLink, ZoomIn } from 'lucide-react'
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
    // First check if we have resourceType from backend
    if (file.resourceType) {
      if (file.resourceType === 'image') return 'image'
      if (file.resourceType === 'video') return 'video'
      if (file.resourceType === 'raw') {
        // Further categorize raw files
        const format = file.format?.toLowerCase() || ''
        if (format === 'pdf') return 'pdf'
        if (['xlsx', 'xls', 'csv'].includes(format)) return 'excel'
        if (['docx', 'doc'].includes(format)) return 'word'
        return 'document'
      }
    }
    
    // Fallback to MIME type and URL checking
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

  const getCloudinaryThumbnail = (url, fileType, file = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
      return url
    }
    
    try {
      // For PDFs, don't try to generate thumbnails from raw files
      // This causes 401 errors as raw files don't support image transformations
      if (fileType === 'pdf') {
        // Return original URL - we'll show an icon instead
        return url
      }
      
      // For images, optimize and resize
      if (fileType === 'image') {
        return url.replace('/upload/', '/upload/w_1200,h_1200,c_limit,q_auto,f_auto/')
      }
      
      // For other file types, return as-is
      return url
    } catch (e) {
      console.error('Error generating thumbnail:', e)
      return url
    }
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
      // Fallback: open in new tab
      window.open(file.url, '_blank')
    }
  }

  const openFullscreen = (file) => {
    setFullscreenImage(file)
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} />
      case 'pdf': return <FileText size={20} />
      case 'video': return <FileText size={20} />
      case 'excel': return <File size={20} />
      case 'word': return <File size={20} />
      default: return <File size={20} />
    }
  }

  const tags = Array.isArray(content.tags) ? content.tags : []
  const sections = Array.isArray(content.sections) ? content.sections : []
  const files = Array.isArray(content.files) ? content.files : []
  
  const imageFiles = files.filter(f => getFileType(f) === 'image')
  const pdfFiles = files.filter(f => getFileType(f) === 'pdf')
  const videoFiles = files.filter(f => getFileType(f) === 'video')
  const excelFiles = files.filter(f => getFileType(f) === 'excel')
  const wordFiles = files.filter(f => getFileType(f) === 'word')
  const documentFiles = files.filter(f => {
    const type = getFileType(f)
    return !['image', 'pdf', 'video', 'excel', 'word'].includes(type)
  })

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={32} />
          </button>
          <img
            src={fullscreenImage.url}
            alt={fullscreenImage.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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

        {/* Image Gallery - LinkedIn Style with Fullscreen Support */}
        {imageFiles.length > 0 && (
          <div className="space-y-2">
            {imageFiles.length === 1 ? (
              <div className="overflow-hidden rounded-xl border border-(--color-border) bg-slate-50 group relative">
                <img
                  src={getCloudinaryThumbnail(imageFiles[0].url, 'image', imageFiles[0])}
                  alt={imageFiles[0].name}
                  className="w-full max-h-[600px] object-contain cursor-pointer"
                  onClick={() => openFullscreen(imageFiles[0])}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = imageFiles[0].url
                  }}
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => openFullscreen(imageFiles[0])}
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <ZoomIn size={20} />
                  </button>
                  <button
                    onClick={() => handleDownload(imageFiles[0])}
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <Download size={20} />
                  </button>
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 border-t border-(--color-border)">
                  <p className="text-xs text-(--color-muted) truncate">{imageFiles[0].name}</p>
                </div>
              </div>
            ) : imageFiles.length === 2 ? (
              <div className="grid grid-cols-2 gap-2">
                {imageFiles.map((file, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-(--color-border) group relative">
                    <div className="bg-slate-50">
                      <img
                        src={getCloudinaryThumbnail(file.url, 'image', file)}
                        alt={file.name}
                        className="w-full h-80 object-cover cursor-pointer"
                        onClick={() => openFullscreen(file)}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = file.url
                        }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => openFullscreen(file)}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                    <div className="bg-white px-3 py-2">
                      <p className="text-xs text-(--color-muted) truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : imageFiles.length === 3 ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="row-span-2 overflow-hidden rounded-xl border border-(--color-border) group relative">
                  <div className="bg-slate-50">
                    <img
                      src={getCloudinaryThumbnail(imageFiles[0].url, 'image', imageFiles[0])}
                      alt={imageFiles[0].name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => openFullscreen(imageFiles[0])}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = imageFiles[0].url
                      }}
                    />
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                      onClick={() => openFullscreen(imageFiles[0])}
                      className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                      <ZoomIn size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(imageFiles[0])}
                      className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="bg-white px-3 py-2">
                    <p className="text-xs text-(--color-muted) truncate">{imageFiles[0].name}</p>
                  </div>
                </div>
                {imageFiles.slice(1).map((file, index) => (
                  <div key={index} className="overflow-hidden rounded-xl border border-(--color-border) group relative">
                    <div className="bg-slate-50">
                      <img
                        src={getCloudinaryThumbnail(file.url, 'image', file)}
                        alt={file.name}
                        className="w-full h-40 object-cover cursor-pointer"
                        onClick={() => openFullscreen(file)}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = file.url
                        }}
                      />
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => openFullscreen(file)}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                      >
                        <Download size={16} />
                      </button>
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
                    className="relative overflow-hidden rounded-xl border border-(--color-border) group"
                  >
                    <div className="bg-slate-50">
                      <img
                        src={getCloudinaryThumbnail(file.url, 'image', file)}
                        alt={file.name}
                        className="w-full h-64 object-cover cursor-pointer"
                        onClick={() => openFullscreen(file)}
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
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => openFullscreen(file)}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                      >
                        <ZoomIn size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                    <div className="bg-white px-3 py-2">
                      <p className="text-xs text-(--color-muted) truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PDF Previews - Enhanced with Icon Display */}
        {pdfFiles.length > 0 && (
          <div className="space-y-4">
            {pdfFiles.map((file, index) => {
              return (
                <Card key={index} className="p-0 overflow-hidden group">
                  {/* PDF Icon Display */}
                  <div className="relative bg-gradient-to-br from-red-50 to-orange-50 cursor-pointer" onClick={() => window.open(file.url, '_blank')}>
                    <div className="w-full h-96 flex items-center justify-center">
                      <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-red-500 text-white shadow-2xl group-hover:scale-110 transition-transform">
                        <FileText size={64} strokeWidth={2} />
                      </div>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                      <div className="bg-white rounded-full p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={32} className="text-red-500" />
                      </div>
                    </div>
                  </div>
                  
                  {/* PDF Info Footer */}
                  <div className="bg-white border-t border-(--color-border) p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-sm font-medium text-(--color-primary) truncate">{file.name}</p>
                        <p className="text-xs text-(--color-muted)">PDF Document {file.size ? `• ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => window.open(file.url, '_blank')}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-red-600 hover:shadow-lg"
                        >
                          <ExternalLink size={14} />
                          Open
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-red-500 px-3 py-2 text-xs font-bold text-red-500 transition-all hover:bg-red-50"
                        >
                          <Download size={14} />
                          Save
                        </button>
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
                >
                  <source src={file.url} type={file.type || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
                <div className="bg-white border-t border-(--color-border) px-4 py-2">
                  <p className="text-sm text-(--color-primary) truncate">{file.name}</p>
                  <p className="text-xs text-(--color-muted)">Video {file.size ? `• ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Excel Files */}
        {excelFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="section-title text-lg text-(--color-primary)">Spreadsheets</h3>
            {excelFiles.map((file, index) => (
              <Card
                key={index}
                className="p-0 overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex items-center justify-center min-h-[200px] relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-green-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                    <File size={40} strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity" />
                </div>
                <div className="bg-white border-t border-(--color-border) p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-(--color-primary) truncate">{file.name}</p>
                      <p className="text-xs text-(--color-muted)">Excel Spreadsheet {file.size ? `• ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-green-700"
                      >
                        <ExternalLink size={14} />
                        Open
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-green-600 px-3 py-2 text-xs font-bold text-green-600 transition-all hover:bg-green-50"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Word Documents */}
        {wordFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="section-title text-lg text-(--color-primary)">Word Documents</h3>
            {wordFiles.map((file, index) => (
              <Card
                key={index}
                className="p-0 overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center min-h-[200px] relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                    <FileText size={40} strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity" />
                </div>
                <div className="bg-white border-t border-(--color-border) p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-(--color-primary) truncate">{file.name}</p>
                      <p className="text-xs text-(--color-muted)">Word Document {file.size ? `• ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                      >
                        <ExternalLink size={14} />
                        Open
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-blue-600 px-3 py-2 text-xs font-bold text-blue-600 transition-all hover:bg-blue-50"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Other Documents */}
        {documentFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="section-title text-lg text-(--color-primary)">Other Files</h3>
            {documentFiles.map((file, index) => (
              <Card
                key={index}
                className="p-0 overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 flex items-center justify-center min-h-[200px] relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500 text-white shadow-xl group-hover:scale-110 transition-transform">
                    {getFileIcon('document')}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-opacity" />
                </div>
                <div className="bg-white border-t border-(--color-border) p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-(--color-primary) truncate">{file.name}</p>
                      <p className="text-xs text-(--color-muted)">{file.type || 'Document'} {file.size ? `• ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-700"
                      >
                        <ExternalLink size={14} />
                        Open
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-purple-600 px-3 py-2 text-xs font-bold text-purple-600 transition-all hover:bg-purple-50"
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
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
