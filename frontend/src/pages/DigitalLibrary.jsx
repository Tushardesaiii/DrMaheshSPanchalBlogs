import { useLocation, useParams } from 'react-router-dom'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import BookCard from '../components/cards/BookCard'
import books from '../data/books'
import { COLLECTIONS_DATA } from '../data/collections'

function DigitalLibrary() {
  const { collection } = useParams()
  const location = useLocation()
  const slug = collection ?? location.pathname.split('/').filter(Boolean).pop()
  const data = COLLECTIONS_DATA[slug]

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
      {slug === 'library' || slug === 'books' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
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
