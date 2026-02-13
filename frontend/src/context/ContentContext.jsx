import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'

const ContentContext = createContext(null)

const getApiBase = () => import.meta.env.VITE_API_BASE_URL || ''

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const normalizeContent = (content) => {
  const sections = Array.isArray(content?.sections) ? content.sections : []
  const tags = Array.isArray(content?.tags) ? content.tags : []
  return {
    id: content?._id || content?.id,
    title: content?.title || 'Untitled',
    description: content?.description || '',
    category: sections[0] || content?.format || 'General',
    tags,
    author: content?.author || 'Admin',
    format: content?.format || 'Article',
    sections,
    files: Array.isArray(content?.files) ? content.files : [],
    createdAt: content?.createdAt,
    date: formatDate(content?.createdAt) || 'TBA',
    raw: content,
  }
}

export function ContentProvider({ children }) {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const apiBase = getApiBase()

  const request = async (path, options = {}) => {
    const token = localStorage.getItem('accessToken')
    const headers = {
      ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    }

    console.log(`Fetching ${options.method || 'GET'} ${path}`, {
      hasFiles: options.body instanceof FormData,
      token: token ? 'yes' : 'no',
    })

    const response = await fetch(`${apiBase}${path}`, {
      credentials: 'include',
      headers,
      ...options,
    })

    let payload = {}
    try {
      const text = await response.text()
      payload = text ? JSON.parse(text) : {}
    } catch (e) {
      console.error('Failed to parse response:', e)
      payload = { message: 'Invalid server response' }
    }

    console.log(`Response ${response.status}:`, payload)

    if (!response.ok) {
      const message = typeof payload?.message === 'string' 
        ? payload.message 
        : `HTTP ${response.status}: Request failed`
      console.error('API Error:', { status: response.status, message, fullPayload: payload })
      throw new Error(message)
    }

    return payload
  }

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true)
      const data = await request('/api/content')
      setContents(data?.data || [])
    } catch (error) {
      console.error('Failed to fetch contents:', error)
      setContents([])
    } finally {
      setLoading(false)
    }
  }, [])

  const addContent = useCallback(async (formDataPayload) => {
    try {
      const data = await request('/api/content', {
        method: 'POST',
        body: formDataPayload,
      })
      const content = data?.data
      setContents(prev => [content, ...prev])
      return content
    } catch (error) {
      console.error('Failed to add content:', error)
      throw error
    }
  }, [])

  const updateContent = useCallback(async (id, updates) => {
    try {
      const data = await request(`/api/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      const updated = data?.data
      setContents(prev =>
        prev.map(c => c._id === id ? updated : c)
      )
      return updated
    } catch (error) {
      console.error('Failed to update content:', error)
      throw error
    }
  }, [])

  const deleteContent = useCallback(async (id) => {
    try {
      await request(`/api/content/${id}`, { method: 'DELETE' })
      setContents(prev => prev.filter(c => c._id !== id))
    } catch (error) {
      console.error('Failed to delete content:', error)
      throw error
    }
  }, [])

  const getContentBySection = useCallback((sectionName) => {
    return contents.filter(c => c.sections && c.sections.includes(sectionName))
  }, [contents])

  const normalizedContents = useMemo(
    () => contents.map((content) => normalizeContent(content)),
    [contents]
  )

  const getNormalizedBySection = useCallback((sectionName) => {
    return normalizedContents.filter((c) => c.sections.includes(sectionName))
  }, [normalizedContents])

  const getNormalizedByFormat = useCallback((formatName) => {
    return normalizedContents.filter((c) => c.format === formatName)
  }, [normalizedContents])

  const getNormalizedByFormats = useCallback((formatNames) => {
    const formatSet = new Set(formatNames)
    return normalizedContents.filter((c) => formatSet.has(c.format))
  }, [normalizedContents])

  const getNormalizedBySections = useCallback((sectionNames) => {
    const sectionSet = new Set(sectionNames)
    return normalizedContents.filter((c) => c.sections.some((section) => sectionSet.has(section)))
  }, [normalizedContents])

  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  const value = useMemo(() => ({
    contents,
    normalizedContents,
    loading,
    addContent,
    updateContent,
    deleteContent,
    getContentBySection,
    getNormalizedBySection,
    getNormalizedByFormat,
    getNormalizedByFormats,
    getNormalizedBySections,
    fetchContents,
  }), [contents, normalizedContents, loading, addContent, updateContent, deleteContent, getContentBySection, getNormalizedBySection, getNormalizedByFormat, getNormalizedByFormats, getNormalizedBySections, fetchContents])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}
