import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card'

function CategoryCard({ category }) {
  return (
    <Card className="p-6 hover:border-(--color-accent)">
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 rounded-2xl bg-linear-to-br from-[rgba(212,165,116,0.15)] to-[rgba(168,125,79,0.1)]">
          <span className="text-2xl">{category.icon || '📚'}</span>
        </div>
        <ArrowRight size={20} className="text-(--color-accent)" />
      </div>
      <h3 className="section-title text-xl text-(--color-primary) mb-2">{category.title}</h3>
      <p className="text-sm text-(--color-muted) line-clamp-2 mb-4">{category.description}</p>
      <div className="flex items-end justify-between pt-4 border-t border-(--color-border)">
        <p className="text-sm font-semibold text-[#d4a574]">{category.count || 0} resources</p>
        <span className="text-xs text-(--color-muted)">Explore →</span>
      </div>
    </Card>
  )
}

export default CategoryCard
