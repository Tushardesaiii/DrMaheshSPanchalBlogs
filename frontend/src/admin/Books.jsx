import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

function Books() {
  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="section-title text-lg text-(--color-primary)">Manage Books</h3>
          <Button>Add Book</Button>
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
              {['Pedagogy of Structured Learning', 'Digital Archives and Library Futures', 'Scholarly Communication Systems'].map(
                (title) => (
                  <tr key={title} className="border-t border-(--color-border)">
                    <td className="py-3">{title}</td>
                    <td className="py-3">Library Science</td>
                    <td className="py-3">Editorial Team</td>
                    <td className="py-3 text-(--color-secondary)">Active</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h3 className="section-title text-lg text-(--color-primary)">Upload Cover</h3>
        <p className="mt-2 text-sm text-(--color-muted)">Upload UI placeholder for future integration.</p>
        <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed border-(--color-border) py-10 text-sm text-(--color-muted)">
          Drag and drop book cover here
        </div>
      </Card>
    </div>
  )
}

export default Books
