import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function BookDetails() {
  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <article className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Book Details</p>
          <h2 className="section-title mt-3 text-3xl text-(--color-primary)">Pedagogy of Structured Learning</h2>
          <p className="mt-2 text-sm text-(--color-muted)">By Dr. A. Sen · Education Strategy</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['curriculum', 'methodology', 'research'].map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </header>
        <section className="paper-panel p-6">
          <p className="text-sm text-(--color-muted)">
            A structured roadmap for teachers and librarians to support semester planning, evidence-based pedagogy, and
            purposeful academic delivery.
          </p>
        </section>
        <section className="space-y-4">
          <h3 className="section-title text-xl text-(--color-primary)">Preview Highlights</h3>
          <ul className="list-disc pl-6 text-sm text-(--color-muted)">
            <li>Learning outcomes mapped to academic standards.</li>
            <li>Resource curation strategy for digital libraries.</li>
            <li>Assessment-ready frameworks for educators.</li>
          </ul>
        </section>
      </article>
      <aside className="space-y-6">
        <div className="paper-panel p-6">
          <h3 className="section-title text-lg text-(--color-primary)">Availability</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Available in the Digital Library</p>
          <Button className="mt-4">Request Access</Button>
        </div>
      </aside>
    </div>
  )
}

export default BookDetails
