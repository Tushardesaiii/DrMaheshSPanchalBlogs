import Card from '../ui/Card'

function CategoryCard({ category }) {
  return (
    <Card>
      <h3 className="section-title text-lg text-(--color-primary)">{category.title}</h3>
      <p className="mt-2 text-sm text-(--color-muted)">{category.description}</p>
      <p className="mt-4 text-xs text-(--color-secondary)">{category.count} resources</p>
    </Card>
  )
}

export default CategoryCard
