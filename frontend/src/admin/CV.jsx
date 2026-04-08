import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FileText, Upload, X, Download, Trash2 } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const getApiBase = () => import.meta.env.VITE_API_BASE_URL || ''

function CV() {
  const [currentCv, setCurrentCv] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const apiBase = getApiBase()

  useEffect(() => {
    const fetchCv = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiBase}/api/cv`)
        if (!response.ok) {
          throw new Error('Failed to load CV settings')
        }

        const payload = await response.json()
        setCurrentCv(payload?.data || null)
      } catch (error) {
        console.error('Fetch CV error:', error)
        toast.error(error?.message || 'Failed to load CV settings')
      } finally {
        setLoading(false)
      }
    }

    fetchCv()
  }, [apiBase])

  useEffect(() => {
    return () => {
      if (pendingFile?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(pendingFile.previewUrl)
      }
    }
  }, [pendingFile])

  const handleSelectFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (pendingFile?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(pendingFile.previewUrl)
    }

    setPendingFile({
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      previewUrl: URL.createObjectURL(file),
    })
    setErrorMessage('')
    event.target.value = ''
  }

  const clearPendingFile = () => {
    setPendingFile((prev) => {
      if (prev?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(prev.previewUrl)
      }
      return null
    })
  }

  const handleUpload = async () => {
    if (!pendingFile?.file) return

    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast.error('Please login as admin to update CV')
      return
    }

    setSaving(true)
    setErrorMessage('')
    const toastId = toast.loading('Saving CV...')

    try {
      const payload = new FormData()
      payload.append('title', pendingFile.file.name.replace(/\.[^/.]+$/, ''))
      payload.append('cvFile', pendingFile.file)

      const response = await fetch(`${apiBase}/api/cv`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: payload,
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.message || 'Failed to save CV')
      }

      setCurrentCv(result?.data || null)
      clearPendingFile()
      toast.success('CV updated successfully', { id: toastId })
    } catch (error) {
      console.error('Save CV error:', error)
      setErrorMessage(error?.message || 'Failed to upload CV')
      toast.error(error?.message || 'Failed to upload CV', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const handleOpen = () => {
    if (currentCv?.url) {
      window.open(currentCv.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleDeleteLocal = () => {
    clearPendingFile()
  }

  return (
    <div className="space-y-8">
      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">Profile Document</p>
          <h3 className="admin-title mt-3 text-2xl">CV Upload</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Upload a single CV file and publish it through the public CV menu item.</p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border-2 border-dashed border-(--color-border) py-12 text-center">
            <p className="text-(--color-muted)">Loading CV...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-(--color-border) bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <FileText size={22} className="text-(--color-primary)" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--color-primary)">{currentCv?.title || 'No CV uploaded yet'}</p>
                    <p className="text-xs text-(--color-muted)">
                      {currentCv ? `${currentCv.name || 'Current CV file'}${currentCv.uploadedAt ? ` • ${new Date(currentCv.uploadedAt).toLocaleDateString()}` : ''}` : 'Add a CV to make it available in the public menu.'}
                    </p>
                  </div>
                </div>

                {currentCv?.url && (
                  <button
                    type="button"
                    onClick={handleOpen}
                    className="inline-flex items-center gap-2 rounded-lg border border-(--color-border) px-3 py-2 text-sm font-semibold text-(--color-primary) transition-colors hover:border-(--color-accent) hover:text-(--color-accent)"
                  >
                    <Download size={15} />
                    Open CV
                  </button>
                )}
              </div>
            </div>

            <label className="admin-dropzone">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.rtf,.txt,.odt"
                onChange={handleSelectFile}
              />
              <Upload size={32} className="mb-2 text-(--color-accent)" />
              <p className="text-sm font-semibold text-(--color-primary)">Click to select a CV file</p>
              <p className="text-xs text-(--color-muted)">PDF, DOC, DOCX, RTF, TXT, and ODT supported.</p>
            </label>

            {pendingFile && (
              <div className="rounded-xl border border-(--color-border) bg-white p-4">
                <p className="admin-field-label mb-3">Selected File</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <FileText size={18} className="text-(--color-primary)" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-(--color-primary)">{pendingFile.name}</p>
                      <p className="text-xs text-(--color-muted)">{pendingFile.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteLocal}
                    className="rounded-full p-2 text-(--color-muted) transition-colors hover:bg-slate-100 hover:text-red-600"
                    aria-label="Remove selected CV"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button className="admin-button" onClick={handleUpload} disabled={saving || loading || !pendingFile}>
                {saving ? 'Uploading...' : 'Upload CV'}
              </Button>
              <div className="inline-flex items-center gap-2 rounded-lg border border-(--color-border) px-3 py-2 text-sm text-(--color-muted)">
                <Trash2 size={14} />
                Uploading a new CV replaces the previous public file.
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default CV