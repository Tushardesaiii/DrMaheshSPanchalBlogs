import { useLocation, useParams } from 'react-router-dom'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import BookCard from '../components/cards/BookCard'
import { COLLECTIONS_DATA } from '../data/collections'
import { useContent } from '../context/ContentContext'

function DigitalLibrary() {
  const { collection } = useParams()
  const location = useLocation()
  const slug = collection ?? location.pathname.split('/').filter(Boolean).pop()
  const data = COLLECTIONS_DATA[slug]
  const { loading, getNormalizedByFormats, getNormalizedBySection, getNormalizedBySections } = useContent()
  const libraryItems = getNormalizedBySections(['Books', 'PDFs', 'Notes', 'Articles', 'Library Reports'])
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

  if (!data || data.type !== 'library') {
    return <div className="py-20 text-center font-serif italic">Library collection not found.</div>
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
      {slug === 'library' || slug === 'books' || slug === 'pdfs' || slug === 'notes' || slug === 'articles' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 text-(--color-muted)">Loading library items...</p>
          ) : slug === 'library' ? (
            libraryItems.length > 0 ? (
              libraryItems.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p className="col-span-3 text-(--color-muted)">No library items found.</p>
            )
          ) : slug === 'pdfs' ? (
            (sectionItems.length > 0 ? sectionItems : pdfItems).length > 0 ? (
              (sectionItems.length > 0 ? sectionItems : pdfItems).map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p className="col-span-3 text-(--color-muted)">No items found for this section.</p>
            )
          ) : slug === 'articles' ? (
            (sectionItems.length > 0 ? sectionItems : articleItems).length > 0 ? (
              (sectionItems.length > 0 ? sectionItems : articleItems).map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <p className="col-span-3 text-(--color-muted)">No items found for this section.</p>
            )
          ) : sectionItems.length > 0 ? (
            sectionItems.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
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
