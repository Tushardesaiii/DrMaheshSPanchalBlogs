import { ArrowRight, BookOpenCheck, GraduationCap, LibraryBig } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import BookCard from '../components/cards/BookCard'
import ArticleCard from '../components/cards/ArticleCard'
import CategoryCard from '../components/cards/CategoryCard'
import books from '../data/books'
import articles from '../data/articles'
import categories from '../data/categories'

function Home() {
  return (
    <div className="space-y-16">
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-(--color-accent)">Academic Knowledge Platform</p>
          <h2 className="section-title mt-4 text-4xl text-(--color-primary) md:text-5xl">
            A modern library for structured learning and scholarly growth.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-(--color-muted)">
            Designed for teachers and librarians to present academic work with clarity, authority, and a calm reading-first experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button>
              Explore the Library <ArrowRight className="ml-2" size={16} />
            </Button>
            <Button variant="ghost">Request Access</Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { icon: BookOpenCheck, label: 'Curated Collections', value: '240+' },
              { icon: GraduationCap, label: 'Academic Articles', value: '85+' },
              { icon: LibraryBig, label: 'Events & Forums', value: '32+' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.label} className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-(--color-primary) text-white">
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-(--color-primary)">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-(--color-muted)">{item.label}</p>
                </Card>
              )
            })}
          </div>
        </div>
        <div className="paper-panel flex flex-col justify-between gap-6 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Teacher Identity</p>
            <h3 className="section-title mt-3 text-2xl text-(--color-primary)">Mahesh Sir</h3>
            <p className="mt-3 text-sm text-(--color-muted)">
              Senior Educator · Librarian · Academic Curator
            </p>
          </div>
          <div>
            <p className="text-sm text-(--color-muted)">
              Mission: build a structured, accessible, and inspiring knowledge ecosystem for students and researchers.
            </p>
          </div>
          <Button variant="secondary">View Portfolio</Button>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="section-title text-2xl text-(--color-primary)">Featured Books</h3>
          <Button variant="ghost">Browse Library</Button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="section-title text-2xl text-(--color-primary)">Knowledge Categories</h3>
        <p className="mt-2 text-sm text-(--color-muted)">
          Organized paths to explore structured learning resources and curated research.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="section-title text-2xl text-(--color-primary)">Latest Articles</h3>
          <Button variant="ghost">View All Articles</Button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="paper-panel grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h3 className="section-title text-2xl text-(--color-primary)">A digital library, prepared for future integration</h3>
          <p className="mt-3 text-sm text-(--color-muted)">
            Ready for API-powered content, authenticated user access, and advanced search capabilities.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Button>Schedule a Consultation</Button>
          <Button variant="ghost">Download Prospectus</Button>
        </div>
      </section>
    </div>
  )
}

export default Home
