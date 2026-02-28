import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useContent } from '../context/ContentContext'
import { getPrimaryMedia } from '../utils/media'
import { Upload, Trash2, X, FileText, Download } from 'lucide-react'

function PDFs() {
  const { contents, addContent, deleteContent, loading } = useContent()
  const [fileInputs, setFileInputs] = useState([])
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const pdfs = useMemo(() => {
    const pdfItems = contents.filter((item) => {
      const inPDFs = Array.isArray(item.sections) && item.sections.includes('PDFs')
      return inPDFs
    })

    return pdfItems.map((item) => {
      const media = getPrimaryMedia(item?.files)
      const fileSize = media?.size ? (media.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'
      
      return {
        id: item._id,
        title: item.title,
        description: item.description,
        uploadedAt: item.createdAt,
        size: fileSize,
        media,
        url: media?.url,
      }
    }).filter((item) => item.media?.type === 'pdf' || item.media?.type === 'document')
  }, [contents])

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || [])
    const newPdfs = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      file,
    }))
    setFileInputs((prev) => [...prev, ...newPdfs])
    setErrorMessage('')
  }

  const removeFromUpload = (id) => {
    setFileInputs((prev) => prev.filter((item) => item.id !== id))
  }

  const clearUploads = () => {
    setFileInputs([])
  }

  const handleUpload = async () => {
    if (fileInputs.length === 0) return

    setUploading(true)
    setErrorMessage('')
    try {
      await Promise.all(
        fileInputs.map((pdf) => {
          const payload = new FormData()
          payload.append('title', pdf.name.replace(/\.[^/.]+$/, ''))
          payload.append('description', `PDF document: ${pdf.name}`)
          payload.append('format', 'PDF')
          payload.append('sections', JSON.stringify(['PDFs']))
          payload.append('visibility', 'Public')
          payload.append('status', 'Published')
          payload.append('tags', JSON.stringify([]))
          payload.append('files', pdf.file)
          return addContent(payload)
        })
      )
      clearUploads()
    } catch (error) {
      console.error('PDF upload error:', error)
      setErrorMessage(error?.message || 'Failed to upload one or more PDFs')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePdf = async (id) => {
    try {
      await deleteContent(id)
    } catch (error) {
      console.error('Delete PDF error:', error)
      setErrorMessage(error?.message || 'Failed to delete PDF')
    }
  }

  const handleDownload = (url, title) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-8">
      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">PDF Manager</p>
          <h3 className="admin-title mt-3 text-2xl">Upload PDFs</h3>
          <p className="mt-2 text-sm text-(--color-muted)">PDFs are stored in PDFs section and shown on /pdfs.</p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <label className="admin-dropzone">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload size={32} className="mb-2 text-(--color-accent)" />
          <p className="text-sm font-semibold text-(--color-primary)">Drop files here or click to upload</p>
          <p className="text-xs text-(--color-muted)">PDF, DOC, DOCX supported.</p>
        </label>

        {fileInputs.length > 0 && (
          <div className="mt-6">
            <p className="admin-field-label mb-4">Ready to Upload ({fileInputs.length})</p>
            <div className="space-y-3">
              {fileInputs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="flex items-center justify-between rounded-lg border border-(--color-border) bg-white p-4"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                      <FileText size={20} className="text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-(--color-primary)">{pdf.name}</p>
                      <p className="text-xs text-(--color-muted)">{pdf.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromUpload(pdf.id)}
                    className="shrink-0 p-1 text-(--color-muted) transition-colors hover:text-red-600"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="admin-button" onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload All'}
              </Button>
              <Button variant="ghost" className="admin-button" onClick={clearUploads}>
                Clear
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">Document Library</p>
          <h3 className="admin-title mt-3 text-2xl">Uploaded PDFs ({pdfs.length})</h3>
          <p className="mt-2 text-sm text-(--color-muted)">PDF document list with download and delete options.</p>
        </div>

        {loading ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">Loading PDFs...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">No PDFs uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="group flex items-center justify-between rounded-lg border border-(--color-border) bg-white p-4 transition-all hover:shadow-lg"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 transition-colors group-hover:bg-red-100">
                    <FileText size={24} className="text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-(--color-primary)">{pdf.title}</p>
                    <p className="text-xs text-(--color-muted)">
                      {pdf.size} • {new Date(pdf.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleDownload(pdf.url, pdf.title)}
                    className="p-2 text-(--color-muted) transition-colors hover:text-(--color-accent)"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePdf(pdf.id)}
                    className="p-2 text-(--color-muted) transition-colors hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default PDFs
