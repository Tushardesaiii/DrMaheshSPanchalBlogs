import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import BookCard from '../components/cards/BookCard'
import books from '../data/books'

const tags = ['Catalog', 'Archives', 'Curriculum', 'Publishing']

function DigitalLibrary() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="section-title text-3xl text-(--color-primary)">Digital Library</h2>
        <p className="mt-2 text-sm text-(--color-muted)">Filter and explore the academic book collection.</p>
      </div>
      <div className="paper-panel grid gap-4 p-6 md:grid-cols-[1.2fr_1fr]">
        <Input placeholder="Search books by title, author, or tag" />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

export default DigitalLibrary
