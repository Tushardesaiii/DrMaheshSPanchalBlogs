import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, ImagePlus, Images, Trash2, UploadCloud, XCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const DEFAULT_FORM = {
  name: 'Dr. Mahesh K. Solanki',
  designation: 'University Librarian, Gujarat Technological University',
  bio: 'With over 18 years in Library and Information Science, committed to research support, innovation, and modern digital library services.',
  qualifications: ['MLISc', 'GSLET', 'Ph.D. (LIS)'],
  phone: '+91 8401067372',
  email: 'librarian@gtu.edu.in',
  address: 'Central Library, GTU, Chandkheda, Ahmedabad',
}

const getApiBase = () => import.meta.env.VITE_API_BASE_URL || ''

const isImageFile = (file) => {
  const mimeType = String(file?.type || '').toLowerCase()
  const resourceType = String(file?.resourceType || '').toLowerCase()
  const url = String(file?.url || '').toLowerCase()

  return mimeType.startsWith('image/') || resourceType === 'image' || /\.(jpg|jpeg|png|webp|gif|bmp|svg|tiff)$/.test(url)
}

const normalizeSlide = (slide) => {
  if (!slide?.url) return null
  return {
    name: slide?.name || 'Banner Slide',
    type: slide?.type || 'image/jpeg',
    source: slide?.source || (String(slide?.publicId || '').startsWith('banner/') ? 'banner' : 'content'),
    url: slide.url,
    publicId: slide?.publicId || '',
    resourceType: slide?.resourceType || 'image',
    format: slide?.format || '',
    size: slide?.size || 0,
    width: slide?.width || 0,
    height: slide?.height || 0,
  }
}

const getSlideKey = (slide) => slide?.publicId || slide?.url || ''

const dedupeSlides = (slides) => {
  const seen = new Set()
  return slides.filter((slide) => {
    const key = getSlideKey(slide)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function Banner() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [selectedSlides, setSelectedSlides] = useState([])
  const [availablePhotos, setAvailablePhotos] = useState([])
  const [newSlides, setNewSlides] = useState([])
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const apiBase = getApiBase()

  const selectedKeys = useMemo(() => new Set(selectedSlides.map((slide) => getSlideKey(slide)).filter(Boolean)), [selectedSlides])

  useEffect(() => {
    return () => {
      newSlides.forEach((item) => {
        if (item?.previewUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl)
        }
      })
    }
  }, [newSlides])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const [bannerResponse, contentResponse] = await Promise.all([
          fetch(`${apiBase}/api/banner`),
          fetch(`${apiBase}/api/content`),
        ])

        if (!bannerResponse.ok) throw new Error('Failed to load banner settings')

        const bannerPayload = await bannerResponse.json()
        const data = bannerPayload?.data || {}

        let photoPool = []
        if (contentResponse.ok) {
          const contentPayload = await contentResponse.json()
          const allContent = Array.isArray(contentPayload?.data) ? contentPayload.data : []
          photoPool = allContent
            .flatMap((item) => {
              const files = Array.isArray(item?.files) ? item.files : []
              return files
                .filter((file) => isImageFile(file))
                .map((file) => normalizeSlide({
                  ...file,
                  name: file?.name || item?.title || 'Website Photo',
                  source: 'content',
                }))
                .filter(Boolean)
            })
        }

        const normalizedSettingsSlides = dedupeSlides((Array.isArray(data.slides) ? data.slides : []).map(normalizeSlide).filter(Boolean))
        setSelectedSlides(normalizedSettingsSlides)
        setAvailablePhotos(dedupeSlides([...photoPool, ...normalizedSettingsSlides]))

        setForm({
          name: data.name || DEFAULT_FORM.name,
          designation: data.designation || DEFAULT_FORM.designation,
          bio: data.bio || DEFAULT_FORM.bio,
          qualifications: Array.isArray(data.qualifications) && data.qualifications.length > 0 ? data.qualifications : DEFAULT_FORM.qualifications,
          phone: data.phone || DEFAULT_FORM.phone,
          email: data.email || DEFAULT_FORM.email,
          address: data.address || DEFAULT_FORM.address,
        })
      } catch (error) {
        console.error('Fetch banner settings error:', error)
        toast.error(error?.message || 'Failed to load banner settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [apiBase])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleQualificationChange = (index, value) => {
    setForm((prev) => {
      const next = [...prev.qualifications]
      next[index] = value
      return { ...prev, qualifications: next }
    })
  }

  const addQualification = () => {
    setForm((prev) => ({ ...prev, qualifications: [...prev.qualifications, ''] }))
  }

  const removeQualification = (index) => {
    setForm((prev) => ({ ...prev, qualifications: prev.qualifications.filter((_, idx) => idx !== index) }))
  }

  const handleSlideSelection = (event) => {
    const files = Array.from(event.target.files || [])
    const pending = files.map((file, index) => ({
      id: `${Date.now()}-${file.name}-${index}`,
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }))

    setNewSlides((prev) => [...prev, ...pending].slice(0, 15))
    event.target.value = ''
  }

  const removePendingSlide = (index) => {
    setNewSlides((prev) => {
      const next = [...prev]
      const [removed] = next.splice(index, 1)
      if (removed?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(removed.previewUrl)
      }
      return next
    })
  }

  const togglePhotoSelection = (photo) => {
    const key = getSlideKey(photo)
    if (!key) return

    setSelectedSlides((prev) => {
      const exists = prev.some((slide) => getSlideKey(slide) === key)
      if (exists) {
        return prev.filter((slide) => getSlideKey(slide) !== key)
      }
      return dedupeSlides([...prev, photo])
    })
  }

  const removeSelectedSlide = (slide) => {
    const key = getSlideKey(slide)
    setSelectedSlides((prev) => prev.filter((item) => getSlideKey(item) !== key))
  }

  const saveBanner = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      toast.error('Please login as admin to update banner')
      return
    }

    if (!form.name.trim() || !form.designation.trim() || !form.bio.trim()) {
      toast.error('Name, designation, and bio are required')
      return
    }

    setSaving(true)
    const toastId = toast.loading('Saving banner settings...')

    try {
      const payload = new FormData()
      payload.append('name', form.name.trim())
      payload.append('designation', form.designation.trim())
      payload.append('bio', form.bio.trim())
      payload.append('qualifications', JSON.stringify(form.qualifications.map((q) => q.trim()).filter(Boolean)))
      payload.append('phone', form.phone.trim())
      payload.append('email', form.email.trim())
      payload.append('address', form.address.trim())
      payload.append('selectedSlides', JSON.stringify(selectedSlides))

      newSlides.forEach((item) => payload.append('slides', item.file))

      const response = await fetch(`${apiBase}/api/banner`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: payload,
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.message || 'Failed to save banner settings')
      }

      const updated = result?.data
      const nextSlides = dedupeSlides((Array.isArray(updated?.slides) ? updated.slides : []).map(normalizeSlide).filter(Boolean))
      setSelectedSlides(nextSlides)
      setAvailablePhotos((prev) => dedupeSlides([...prev, ...nextSlides]))
      setNewSlides((prev) => {
        prev.forEach((item) => {
          if (item?.previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(item.previewUrl)
          }
        })
        return []
      })

      toast.success('Banner updated successfully', { id: toastId })
    } catch (error) {
      console.error('Save banner error:', error)
      toast.error(error?.message || 'Failed to save banner settings', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="admin-panel p-8">
        <div className="mb-6">
          <p className="admin-kicker">Homepage Hero</p>
          <h3 className="admin-title mt-3 text-2xl">Banner Settings</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Control slideshow images and hero profile details shown on the homepage.</p>
        </div>

        {loading ? (
          <p className="text-sm text-(--color-muted)">Loading banner settings...</p>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="admin-field-label">Name</label>
                <input className="admin-input" value={form.name} onChange={(event) => handleChange('name', event.target.value)} />
              </div>
              <div>
                <label className="admin-field-label">Designation</label>
                <input className="admin-input" value={form.designation} onChange={(event) => handleChange('designation', event.target.value)} />
              </div>
            </div>

            <div>
              <label className="admin-field-label">Bio</label>
              <textarea
                className="admin-textarea w-full"
                rows={4}
                value={form.bio}
                onChange={(event) => handleChange('bio', event.target.value)}
              />
            </div>

            <div>
              <label className="admin-field-label">Qualifications</label>
              <div className="space-y-3">
                {form.qualifications.map((qualification, index) => (
                  <div key={`qualification-${index}`} className="flex items-center gap-3">
                    <input
                      className="admin-input"
                      value={qualification}
                      placeholder="e.g. Ph.D. (LIS)"
                      onChange={(event) => handleQualificationChange(index, event.target.value)}
                    />
                    <button
                      type="button"
                      className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      onClick={() => removeQualification(index)}
                      aria-label="Remove qualification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-3 text-sm font-semibold text-(--color-accent) hover:underline" onClick={addQualification}>
                + Add Qualification
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="admin-field-label">Phone</label>
                <input className="admin-input" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} />
              </div>
              <div>
                <label className="admin-field-label">Email</label>
                <input className="admin-input" value={form.email} onChange={(event) => handleChange('email', event.target.value)} />
              </div>
            </div>

            <div>
              <label className="admin-field-label">Address</label>
              <input className="admin-input" value={form.address} onChange={(event) => handleChange('address', event.target.value)} />
            </div>
          </div>
        )}
      </Card>

      <Card className="admin-panel p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Slideshow</p>
            <h3 className="admin-title mt-3 text-2xl">Hero Slides</h3>
            <p className="mt-2 text-sm text-(--color-muted)">See selected slides, check/uncheck website photos, and upload new images.</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="admin-button"
            onClick={() => setShowPhotoPicker((prev) => !prev)}
          >
            <Images size={16} />
            {showPhotoPicker ? 'Hide Website Photos' : 'Choose From Website Photos'}
          </Button>
        </div>

        {showPhotoPicker && (
          <div className="mb-6 rounded-xl border border-(--color-border) bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="admin-field-label">Available Website Photos ({availablePhotos.length})</p>
              <p className="text-xs text-(--color-muted)">Click cards to check/uncheck for banner</p>
            </div>

            {availablePhotos.length === 0 ? (
              <p className="text-sm text-(--color-muted)">No website photos found yet. Upload in Photos section first.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {availablePhotos.map((photo) => {
                  const key = getSlideKey(photo)
                  const checked = selectedKeys.has(key)

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePhotoSelection(photo)}
                      className={`group relative overflow-hidden rounded-lg border text-left transition-all ${
                        checked
                          ? 'border-emerald-400 ring-2 ring-emerald-200'
                          : 'border-(--color-border) hover:border-(--color-accent)'
                      }`}
                    >
                      <img src={photo.url} alt={photo.name || 'Website photo'} className="h-32 w-full object-cover" loading="lazy" />
                      <div className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 shadow">
                        {checked ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-slate-400" />}
                      </div>
                      <div className="px-2 py-1.5 text-xs text-(--color-primary) line-clamp-1">{photo.name || 'Website Photo'}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <label className="admin-dropzone">
          <input type="file" className="hidden" multiple accept="image/*" onChange={handleSlideSelection} />
          <UploadCloud size={30} className="mb-2 text-(--color-accent)" />
          <p className="text-sm font-semibold text-(--color-primary)">Click to select banner images</p>
          <p className="text-xs text-(--color-muted)">JPG, PNG, WebP supported. Up to 15 files.</p>
        </label>

        <div className="mt-6 space-y-6">
          <div>
            <p className="admin-field-label mb-3">Currently Selected Slides ({selectedSlides.length})</p>
            {selectedSlides.length === 0 ? (
              <p className="text-sm text-(--color-muted)">No selected slides yet. Choose website photos or upload new ones.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {selectedSlides.map((slide) => (
                  <div key={getSlideKey(slide)} className="group relative overflow-hidden rounded-lg border border-(--color-border)">
                    <img src={slide.url} alt={slide.name || 'Banner slide'} className="h-40 w-full object-cover" loading="lazy" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1.5 text-xs text-white">
                      <p className="line-clamp-1">{slide.name || 'Slide image'}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/85">{slide.source === 'banner' ? 'Uploaded' : 'Website Photo'}</p>
                    </div>
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removeSelectedSlide(slide)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="admin-field-label mb-3">New Slides ({newSlides.length})</p>
            {newSlides.length === 0 ? (
              <p className="text-sm text-(--color-muted)">No new slides selected.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {newSlides.map((preview, index) => (
                  <div key={preview.id} className="group relative overflow-hidden rounded-lg border border-(--color-border)">
                    <img src={preview.previewUrl} alt={preview.name} className="h-40 w-full object-cover" loading="lazy" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1 text-xs text-white line-clamp-1">{preview.name}</div>
                    <button
                      type="button"
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => removePendingSlide(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button className="admin-button" onClick={saveBanner} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Banner Settings'}
          </Button>
          <div className="inline-flex items-center gap-2 rounded-lg border border-(--color-border) px-3 py-2 text-sm text-(--color-muted)">
            <ImagePlus size={14} />
            Slideshow updates are visible on the homepage instantly.
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Banner
