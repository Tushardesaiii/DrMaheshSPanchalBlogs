import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function Categories() {
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="section-title text-lg text-(--color-primary)">Manage Categories</h3>
          <Button>Add Category</Button>
        </div>
        <div className="mt-6 space-y-4 text-sm text-(--color-muted)">
          {['Research Methods', 'Library Science', 'Teaching Practice', 'Academic Writing'].map((category) => (
            <div key={category} className="flex items-center justify-between border-b border-(--color-border) pb-3">
              <span>{category}</span>
              <span className="text-(--color-secondary)">Active</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="section-title text-lg text-(--color-primary)">Category Form</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Placeholder fields for future form integration.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm"
            placeholder="Category name"
          />
          <input
            className="w-full rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm"
            placeholder="Category description"
          />
        </div>
      </Card>
    </div>
  )
}

export default Categories
