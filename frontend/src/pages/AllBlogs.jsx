import ArticleCard from '../components/cards/ArticleCard'
import { useContent } from '../context/ContentContext'
import { getFileType } from '../utils/media'

function AllBlogs() {
  const { loading, normalizedContents } = useContent()
  const visibleContents = normalizedContents.filter((item) => {
    const files = Array.isArray(item?.files) ? item.files : []
    if (files.length === 0) return true

    // Hide gallery-like entries that only contain images.
    const hasOnlyImages = files.every((file) => getFileType(file) === 'image')
    return !hasOnlyImages
  })

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Full Index</p>
        <h2 className="section-title text-3xl text-(--color-primary)">All Posts & Content</h2>
        <p className="mt-2 text-sm text-(--color-muted)">A complete index of all published content from every category.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-3 text-(--color-muted)">Loading content...</p>
        ) : visibleContents.length > 0 ? (
          visibleContents.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p className="col-span-3 text-(--color-muted)">No content found.</p>
        )}
      </div>
    </div>
  )
}

export default AllBlogs
