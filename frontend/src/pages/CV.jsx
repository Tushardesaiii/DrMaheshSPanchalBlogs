import { useEffect, useState } from 'react'
import { Download, FileText, ExternalLink } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const getApiBase = () => import.meta.env.VITE_API_BASE_URL || ''

function CVPage() {
  const [cv, setCv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const apiBase = getApiBase()

  useEffect(() => {
    const fetchCv = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiBase}/api/cv`)
        if (!response.ok) {
          throw new Error('Failed to load CV')
        }

        const payload = await response.json()
        setCv(payload?.data || null)
      } catch (error) {
        console.error('Fetch public CV error:', error)
        setErrorMessage(error?.message || 'Failed to load CV')
      } finally {
        setLoading(false)
      }
    }

    fetchCv()
  }, [apiBase])

  const openCv = () => {
    if (cv?.url) {
      window.open(cv.url, '_blank', 'noopener,noreferrer')
    }
  }

  const isPdf = String(cv?.format || '').toLowerCase() === 'pdf' || String(cv?.mimeType || '').toLowerCase().includes('pdf')

  return (
    <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-4xl border border-[#d8c8a5] bg-[linear-gradient(135deg,#1F3A33_0%,#24443b_55%,#f6f1e7_55%,#f6f1e7_100%)] shadow-[0_24px_60px_rgba(31,58,51,0.18)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="px-6 py-12 text-[#F3EBDD] sm:px-10 sm:py-14 lg:px-12 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#B89B5E]">Curriculum Vitae</p>
            <h1 className="mt-4 text-4xl font-serif italic leading-tight sm:text-5xl lg:text-6xl">CV</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#F3EBDD]/85 sm:text-base">
              Open the current CV published from the admin dashboard. When a new file is uploaded, this page automatically reflects the latest version.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={openCv} disabled={!cv?.url} className="bg-[#B89B5E] text-[#1F3A33] hover:brightness-110 disabled:opacity-50">
                <Download size={16} />
                Open CV
              </Button>
              <a
                href={cv?.url || '#'}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  if (!cv?.url) event.preventDefault()
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-[#B89B5E]/60 px-4 py-2.5 text-sm font-semibold text-[#F3EBDD] transition-colors hover:bg-[#B89B5E]/10"
              >
                <ExternalLink size={16} />
                View in new tab
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B89B5E]">Status</p>
                <p className="mt-2 text-sm text-[#F3EBDD]">{loading ? 'Loading...' : cv?.title ? 'Available' : 'Not uploaded'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B89B5E]">File</p>
                <p className="mt-2 truncate text-sm text-[#F3EBDD]">{cv?.name || 'No file selected'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B89B5E]">Type</p>
                <p className="mt-2 text-sm text-[#F3EBDD]">{isPdf ? 'PDF preview supported' : 'Download or open file'}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-8 rounded-xl border border-red-300 bg-red-50/95 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}
          </section>

          <section className="bg-[#f6f1e7] px-6 py-12 text-[#1F3A33] sm:px-10 lg:px-12 lg:py-16">
            <Card className="h-full border-[#d8c8a5] bg-white p-6 shadow-none sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#B89B5E]">Preview</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#1F3A33]">Current CV</h2>

              {loading ? (
                <div className="mt-8 rounded-2xl border border-dashed border-[#d8c8a5] py-16 text-center text-sm text-slate-500">
                  Loading CV...
                </div>
              ) : cv?.url ? (
                <div className="mt-8 space-y-4">
                  <div className="rounded-2xl border border-[#d8c8a5] bg-[#faf7f0] p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F3A33] text-[#F3EBDD]">
                        <FileText size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-[#1F3A33]">{cv.title || cv.name}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {cv.name}
                          {cv.uploadedAt ? ` • ${new Date(cv.uploadedAt).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isPdf ? (
                    <iframe
                      title="CV preview"
                      src={cv.url}
                      className="h-128 w-full rounded-2xl border border-[#d8c8a5] bg-white"
                    />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#d8c8a5] bg-white px-5 py-16 text-center">
                      <p className="text-sm text-slate-600">This CV is stored as a document file. Use the buttons to open or download it.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-dashed border-[#d8c8a5] py-16 text-center text-sm text-slate-500">
                  CV not uploaded yet.
                </div>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default CVPage