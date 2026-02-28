import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useContent } from '../context/ContentContext'
import { getPrimaryMedia, getPreviewUrl } from '../utils/media'
import { Upload, Trash2, X, Image as ImageIcon } from 'lucide-react'

function Photos() {
  const { contents, addContent, deleteContent, loading } = useContent()
  const [fileInputs, setFileInputs] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const photos = useMemo(() => {
    const galleryItems = contents.filter((item) => {
      const inGallery = Array.isArray(item.sections) && item.sections.includes('Gallery')
      return inGallery
    })

    return galleryItems
      .map((item) => {
        const media = getPrimaryMedia(item?.files)
        const previewUrl = media ? getPreviewUrl(media) : ''
        return {
          id: item._id,
          title: item.title,
          uploadedAt: item.createdAt,
          media,
          previewUrl,
        }
      })
      .filter((item) => item.media?.type === 'image')
  }, [contents])

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files || [])
    const newPhotos = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      file,
    }))
    setFileInputs((prev) => [...prev, ...newPhotos])
    setErrorMessage('')
  }

  const removeFromUpload = (id) => {
    setFileInputs((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const clearUploads = () => {
    fileInputs.forEach((item) => {
      if (item.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(item.previewUrl)
      }
    })
    setFileInputs([])
  }

  const handleUpload = async () => {
    if (fileInputs.length === 0) return

    setUploading(true)
    setErrorMessage('')
    try {
      await Promise.all(
        fileInputs.map((photo) => {
          const payload = new FormData()
          payload.append('title', photo.name.replace(/\.[^/.]+$/, ''))
          payload.append('description', `Gallery image: ${photo.name}`)
          payload.append('format', 'Event Notice')
          payload.append('sections', JSON.stringify(['Gallery']))
          payload.append('visibility', 'Public')
          payload.append('status', 'Published')
          payload.append('tags', JSON.stringify([]))
          payload.append('files', photo.file)
          return addContent(payload)
        })
      )
      clearUploads()
    } catch (error) {
      console.error('Photo upload error:', error)
      setErrorMessage(error?.message || 'Failed to upload one or more photos')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (id) => {
    try {
      await deleteContent(id)
    } catch (error) {
      console.error('Delete photo error:', error)
      setErrorMessage(error?.message || 'Failed to delete photo')
    }
  }

  return (
    <div className="space-y-8">
      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">Gallery Manager</p>
          <h3 className="admin-title mt-3 text-2xl">Upload Photos</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Photos are stored in Gallery and shown on /gallery.</p>
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
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload size={32} className="mb-2 text-(--color-accent)" />
          <p className="text-sm font-semibold text-(--color-primary)">Drop photos here or click to upload</p>
          <p className="text-xs text-(--color-muted)">JPG, PNG, WebP supported.</p>
        </label>

        {fileInputs.length > 0 && (
          <div className="mt-6">
            <p className="admin-field-label mb-4">Ready to Upload ({fileInputs.length})</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {fileInputs.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg border border-(--color-border)">
                  <img src={photo.previewUrl} alt={photo.name} className="h-44 w-full object-cover" />
                  <button
                    onClick={() => removeFromUpload(photo.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={14} />
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
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="admin-kicker">Photo Gallery</p>
            <h3 className="admin-title mt-3 text-2xl">Uploaded Photos ({photos.length})</h3>
            <p className="mt-2 text-sm text-(--color-muted)">Gallery preview grid with quick fullscreen view.</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">No photos uploaded yet</p>
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>div]:mb-4">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative break-inside-avoid overflow-hidden rounded-xl border border-(--color-border) bg-white">
                <img
                  src={photo.previewUrl}
                  alt={photo.title}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(event) => {
                    if (photo.media?.url && event.currentTarget.src !== photo.media.url) {
                      event.currentTarget.src = photo.media.url
                    }
                  }}
                />

                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all group-hover:bg-black/55" />

                <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                  <div className="rounded-lg bg-white/95 p-3 backdrop-blur">
                    <p className="truncate text-sm font-semibold text-(--color-primary)">{photo.title}</p>
                    <p className="text-xs text-(--color-muted)">{new Date(photo.uploadedAt).toLocaleDateString()}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setPreviewImage(photo)}
                        className="rounded-md bg-(--color-primary) px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="rounded-md bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewImage(null)}>
          <button onClick={() => setPreviewImage(null)} className="absolute right-6 top-6 text-white hover:text-gray-300">
            <X size={28} />
          </button>
          <div className="max-h-[90vh] max-w-6xl overflow-hidden rounded-xl bg-white" onClick={(event) => event.stopPropagation()}>
            <img
              src={previewImage.previewUrl || previewImage.media?.url}
              alt={previewImage.title}
              className="max-h-[82vh] w-full object-contain"
            />
            <div className="flex items-center justify-between border-t border-(--color-border) px-4 py-3">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-(--color-accent)" />
                <p className="text-sm font-semibold text-(--color-primary)">{previewImage.title}</p>
              </div>
              <p className="text-xs text-(--color-muted)">{new Date(previewImage.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Photos
