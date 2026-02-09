import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function Articles() {
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="section-title text-lg text-(--color-primary)">Manage Articles</h3>
          <Button>Add Article</Button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-(--color-muted)">
              <tr>
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Author</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-(--color-text)">
              {['Designing Academic Knowledge Portals', 'From Collection to Curriculum', 'Metadata Practices for Libraries'].map(
                (title) => (
                  <tr key={title} className="border-t border-(--color-border)">
                    <td className="py-3">{title}</td>
                    <td className="py-3">Knowledge Design</td>
                    <td className="py-3">Editorial Board</td>
                    <td className="py-3 text-(--color-secondary)">Published</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h3 className="section-title text-lg text-(--color-primary)">Draft Editor</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Placeholder for editor integration with rich text tools.</p>
        <div className="mt-4 rounded-xl border border-(--color-border) bg-(--color-bg) p-4 text-sm text-(--color-muted)">
          Begin drafting the next academic article here.
        </div>
      </Card>
    </div>
  )
}

export default Articles
