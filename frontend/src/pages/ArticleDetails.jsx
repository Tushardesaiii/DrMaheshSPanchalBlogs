import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function ArticleDetails() {
  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <article className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Editorial</p>
          <h2 className="section-title mt-3 text-3xl text-(--color-primary)">Designing Academic Knowledge Portals</h2>
          <p className="mt-2 text-sm text-(--color-muted)">By Editorial Board · January 2026</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['ux', 'content', 'library'].map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </header>
        <section className="paper-panel p-6">
          <p className="text-sm text-(--color-muted)">
            This article outlines the principles of building academic knowledge portals that prioritize readability, structure,
            and trust. The focus is on clear hierarchy, curated resources, and consistent editorial tone.
          </p>
        </section>
        <section className="space-y-4">
          <h3 className="section-title text-xl text-(--color-primary)">Key Takeaways</h3>
          <ul className="list-disc pl-6 text-sm text-(--color-muted)">
            <li>Content-first layout maintains focus and academic clarity.</li>
            <li>Navigation must highlight categories, not trends.</li>
            <li>Structured metadata ensures future API integration.</li>
          </ul>
        </section>
      </article>
      <aside className="space-y-6">
        <div className="paper-panel p-6">
          <h3 className="section-title text-lg text-(--color-primary)">Related Resources</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Metadata Practices for Libraries</p>
          <p className="mt-1 text-sm text-(--color-muted)">From Collection to Curriculum</p>
          <Button className="mt-4" variant="ghost">Return to Articles</Button>
        </div>
      </aside>
    </div>
  )
}

export default ArticleDetails
