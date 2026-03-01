import { useLocation, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import BookCard from '../components/cards/BookCard'
import ArticleCard from '../components/cards/ArticleCard'
import { COLLECTIONS_DATA } from '../data/collections'
import { useContent } from '../context/ContentContext'
import { getPrimaryMedia } from '../utils/media'
import { FileText, Download, Calendar } from 'lucide-react'

function DigitalLibrary() {
  const { collection } = useParams()
  const location = useLocation()
  const slug = collection ?? location.pathname.split('/').filter(Boolean).pop()
  const data = COLLECTIONS_DATA[slug]
  const { loading, getNormalizedByFormats, getNormalizedBySection, getNormalizedBySections } = useContent()
  const bookSections = ['Books', 'PDFs', 'Notes']
  const articleSections = ['Articles', 'Library Reports']
  const libraryItems = getNormalizedBySections([...bookSections, ...articleSections])
  const sectionFilters = {
    books: 'Books',
    pdfs: 'PDFs',
    notes: 'Notes',
    articles: 'Articles',
  }
  const sectionName = sectionFilters[slug]
  const sectionItems = sectionName ? getNormalizedBySection(sectionName) : []
  const pdfItems = getNormalizedByFormats(['PDF'])
  const articleItems = getNormalizedByFormats(['Article'])

  const pdfDocuments = useMemo(() => {
    if (slug !== 'pdfs') return []
    
    const items = sectionItems.length > 0 ? sectionItems : pdfItems
    return items
      .map((item) => {
        const media = getPrimaryMedia(item?.files)
        const fileSize = media?.size ? (media.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'
        
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.date,
          size: fileSize,
          url: media?.url,
          category: item.category,
        }
      })
      .filter((item) => item.url)
  }, [sectionItems, pdfItems, slug])

  if (!data || data.type !== 'library') {
    return <div className="py-20 text-center font-serif italic">Library collection not found.</div>
  }

  if (slug === 'pdfs') {
    return (
      <div className="space-y-10">
        <div>
          <h2 className="section-title text-3xl text-(--color-primary)">{data.title}</h2>
          <p className="mt-2 text-sm text-(--color-muted)">{data.description}</p>
        </div>

        {loading ? (
          <p className="text-(--color-muted)">Loading PDFs...</p>
        ) : pdfDocuments.length > 0 ? (
          <div className="space-y-4">
            {pdfDocuments.map((pdf) => (
              <Card key={pdf.id} className="group transition-all hover:shadow-lg">
                <div className="flex items-start gap-4 p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-red-100">
                    <FileText size={28} className="text-red-600" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-(--color-primary) group-hover:text-(--color-accent) transition-colors">
                      {pdf.title}
                    </h3>
                    {pdf.description && (
                      <p className="mt-2 text-sm text-(--color-muted) line-clamp-2">{pdf.description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-(--color-muted)">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{pdf.date}</span>
                      </div>
                      <span>•</span>
                      <span>{pdf.size}</span>
                      {pdf.category && (
                        <>
                          <span>•</span>
                          <Badge variant="default" className="text-xs">{pdf.category}</Badge>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(pdf.url, '_blank', 'noopener,noreferrer')}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--color-accent)"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <p className="text-(--color-muted)">No PDF documents found.</p>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="section-title text-3xl text-(--color-primary)">{data.title}</h2>
        <p className="mt-2 text-sm text-(--color-muted)">{data.description}</p>
      </div>
      <div className="paper-panel grid gap-4 p-6 md:grid-cols-[1.2fr_1fr]">
        <Input placeholder="Search the library by title, author, or tag" />
        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
      {slug === 'library' || slug === 'books' || slug === 'notes' || slug === 'articles' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 text-(--color-muted)">Loading library items...</p>
          ) : slug === 'library' ? (
            libraryItems.length > 0 ? (
              libraryItems.map((item) => {
                const isBookSection = item.sections?.some(s => bookSections.includes(s))
                return isBookSection ? (
                  <BookCard key={item.id} book={item} />
                ) : (
                  <ArticleCard key={item.id} article={item} />
                )
              })
            ) : (
              <p className="col-span-3 text-(--color-muted)">No library items found.</p>
            )
          ) : slug === 'articles' ? (
            (sectionItems.length > 0 ? sectionItems : articleItems).length > 0 ? (
              (sectionItems.length > 0 ? sectionItems : articleItems).map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))
            ) : (
              <p className="col-span-3 text-(--color-muted)">No items found for this section.</p>
            )
          ) : sectionItems.length > 0 ? (
            sectionItems.map((item) => {
              const isBookSection = bookSections.includes(sectionName)
              return isBookSection ? (
                <BookCard key={item.id} book={item} />
              ) : (
                <ArticleCard key={item.id} article={item} />
              )
            })
          ) : (
            <p className="col-span-3 text-(--color-muted)">No items found for this section.</p>
          )}
        </div>
      ) : (
        <Card>
          <h3 className="section-title text-lg text-(--color-primary)">Collection coming soon</h3>
          <p className="mt-2 text-sm text-(--color-muted)">
            We are preparing resources for this section. Check back shortly.
          </p>
        </Card>
      )}
    </div>
  )
}

export default DigitalLibrary
