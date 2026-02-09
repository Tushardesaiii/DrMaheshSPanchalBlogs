import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import CategoryCard from '../components/cards/CategoryCard'
import categories from '../data/categories'

const filters = ['Research', 'Teaching', 'Library', 'Writing', 'Leadership']

function KnowledgeHub() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="section-title text-3xl text-(--color-primary)">Knowledge Hub</h2>
        <p className="mt-2 text-sm text-(--color-muted)">Navigate curated knowledge collections, tags, and learning paths.</p>
      </div>
      <div className="paper-panel flex flex-col gap-4 p-6 md:flex-row md:items-center">
        <Input placeholder="Search resources, authors, or tags" />
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge key={filter}>{filter}</Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      <section className="paper-panel p-6">
        <h3 className="section-title text-xl text-(--color-primary)">Structured Learning Paths</h3>
        <p className="mt-3 text-sm text-(--color-muted)">
          Each category contains recommended books, research articles, and curated reading lists designed for semester planning.
        </p>
      </section>
    </div>
  )
}

export default KnowledgeHub
