const getFileType = (file) => {
  const mimeType = file?.type?.toLowerCase() || ''
  const url = file?.url?.toLowerCase() || ''
  const fileName = file?.name?.toLowerCase() || ''
  const format = file?.format?.toLowerCase() || ''
  const resourceType = file?.resourceType?.toLowerCase() || ''

  // Cloudinary raw uploads can lose useful MIME info in delivery URLs.
  if (resourceType === 'raw') {
    if (format === 'pdf' || fileName.endsWith('.pdf')) {
      return 'pdf'
    }
    return 'document'
  }

  if (mimeType.startsWith('image/') || url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/) || fileName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return 'image'
  }
  if (mimeType.includes('pdf') || format === 'pdf' || fileName.endsWith('.pdf') || url.includes('.pdf') || url.includes('/pdf/') || url.includes('application/pdf')) {
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

  const isSignedUrl = /\/s--[^/]+--\//.test(url)
  if (isSignedUrl) {
    return url
  }

  if (fileType === 'pdf') {
    return url.replace('/upload/', '/upload/w_800,h_600,c_fit,f_jpg,pg_1/')
  }

  if (fileType === 'image') {
    return url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/')
  }

  return url
}

const getPrimaryMedia = (files = []) => {
  if (!Array.isArray(files) || files.length === 0) return null

  const imageFile = files.find((file) => getFileType(file) === 'image')
  if (imageFile) return { ...imageFile, type: 'image' }

  const pdfFile = files.find((file) => getFileType(file) === 'pdf')
  if (pdfFile) return { ...pdfFile, type: 'pdf' }

  const videoFile = files.find((file) => getFileType(file) === 'video')
  if (videoFile) return { ...videoFile, type: 'video' }

  return { ...files[0], type: getFileType(files[0]) }
}

const getPreviewUrl = (file) => {
  if (!file?.url) return ''
  const fileType = file?.type || getFileType(file)
  return getCloudinaryThumbnail(file.url, fileType)
}

export { getFileType, getCloudinaryThumbnail, getPrimaryMedia, getPreviewUrl }
