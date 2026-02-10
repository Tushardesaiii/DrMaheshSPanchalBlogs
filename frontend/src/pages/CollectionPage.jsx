import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const COLLECTIONS = {
  'literature': {
    title: 'Literature',
    description: 'Curated reading lists, critical summaries, and academic references.',
    tags: ['classics', 'analysis', 'reading'],
  },
  'competitive-exams': {
    title: 'Competitive Exams',
    description: 'Guided prep modules, recommended books, and strategic notes.',
    tags: ['exam', 'practice', 'strategy'],
  },
  'learning-resources': {
    title: 'Learning Resources',
    description: 'Structured modules, notes, and study frameworks.',
    tags: ['modules', 'notes', 'frameworks'],
  },
  'research-papers': {
    title: 'Research Papers',
    description: 'Academic research collections and methodology references.',
    tags: ['journals', 'citations', 'research'],
  },
  'library-reports': {
    title: 'Library Reports',
    description: 'Annual summaries, collection insights, and performance reviews.',
    tags: ['reports', 'archives', 'insights'],
  },
  'gujarati-content': {
    title: 'Gujarati Content',
    description: 'Regional language resources, curated essays, and study guides.',
    tags: ['regional', 'language', 'guides'],
  },
  'scholarships': {
    title: 'Scholarships',
    description: 'Opportunities, application guidance, and academic funding updates.',
    tags: ['funding', 'opportunities', 'students'],
  },
  'events-and-workshops': {
    title: 'Events & Workshops',
    description: 'Academic events, training sessions, and workshop highlights.',
    tags: ['events', 'workshops', 'learning'],
  },
  'conferences': {
    title: 'Conferences',
    description: 'Conference schedules, themes, and participation reports.',
    tags: ['conferences', 'research', 'network'],
  },
  'workshops': {
    title: 'Workshops',
    description: 'Skill-building sessions and training activity briefs.',
    tags: ['skills', 'training', 'sessions'],
  },
  'reports': {
    title: 'Reports',
    description: 'Academic and institutional reporting archive.',
    tags: ['documentation', 'archive', 'insights'],
  },
  'gallery': {
    title: 'Gallery',
    description: 'Visual documentation of academic events and initiatives.',
    tags: ['photos', 'events', 'community'],
  },
  'books': {
    title: 'Books',
    description: 'Digital library catalog for academic and reference books.',
    tags: ['catalog', 'library', 'reading'],
  },
  'pdfs': {
    title: 'PDFs',
    description: 'Downloadable academic material and study packs.',
    tags: ['documents', 'downloads', 'resources'],
  },
  'notes': {
    title: 'Notes',
    description: 'Faculty and student notes organized by curriculum.',
    tags: ['notes', 'curriculum', 'study'],
  },
  'tags-and-filters': {
    title: 'Tags & Filters',
    description: 'Explore resources using curated metadata and filters.',
    tags: ['metadata', 'taxonomy', 'filters'],
  },
  'contact-form': {
    title: 'Contact Form',
    description: 'Reach the academic team for collaborations or inquiries.',
    tags: ['contact', 'inquiries', 'support'],
  },
  'social-links': {
    title: 'Social Links',
    description: 'Official social channels and community updates.',
    tags: ['community', 'updates', 'outreach'],
  },
}

function CollectionPage() {
  const { collection } = useParams()
  const data = COLLECTIONS[collection]

  if (!data) {
    return (
      <Card>
        <h2 className="section-title text-2xl text-(--color-primary)">Section Not Found</h2>
        <p className="mt-2 text-sm text-(--color-muted)">This section is not available yet.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-(--color-accent)">Collection</p>
        <h2 className="section-title text-3xl text-(--color-primary)">{data.title}</h2>
        <p className="mt-2 text-sm text-(--color-muted)">{data.description}</p>
      </header>
      <Card>
        <h3 className="section-title text-lg text-(--color-primary)">Focus Areas</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="section-title text-lg text-(--color-primary)">Preview Collection</h3>
        <p className="mt-2 text-sm text-(--color-muted)">
          Curated resources for this section will appear here once the backend is connected.
        </p>
      </Card>
    </div>
  )
}

export default CollectionPage
