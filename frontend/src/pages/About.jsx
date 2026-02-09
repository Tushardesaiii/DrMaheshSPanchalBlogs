import Card from '../components/ui/Card'

function About() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="section-title text-3xl text-(--color-primary)">About the Knowledge Platform</h2>
        <p className="mt-4 max-w-3xl text-sm text-(--color-muted)">
          This platform presents academic knowledge in a structured, library-inspired environment. It is curated for teachers,
          librarians, and students seeking clarity, credibility, and long-form learning experiences.
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Academic Integrity', text: 'Every resource is curated and reviewed for professional quality.' },
          { title: 'Structured Knowledge', text: 'Collections are designed for guided exploration and curriculum alignment.' },
          { title: 'Future-ready', text: 'Prepared for API integrations, permissions, and institutional collaboration.' },
        ].map((item) => (
          <Card key={item.title}>
            <h3 className="section-title text-lg text-(--color-primary)">{item.title}</h3>
            <p className="mt-2 text-sm text-(--color-muted)">{item.text}</p>
          </Card>
        ))}
      </section>
    </div>
  )
}

export default About
