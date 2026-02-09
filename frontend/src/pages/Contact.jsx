import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function Contact() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h2 className="section-title text-3xl text-(--color-primary)">Contact</h2>
        <p className="mt-2 text-sm text-(--color-muted)">Reach the academic team for collaborations or access requests.</p>
        <form className="mt-6 space-y-4">
          <Input placeholder="Full name" />
          <Input placeholder="Email address" />
          <Input placeholder="Institution" />
          <textarea
            className="h-32 w-full rounded-2xl border border-(--color-border) bg-white px-4 py-3 text-sm text-(--color-text) focus:border-(--color-primary) focus:outline-none"
            placeholder="Message"
          />
          <Button type="submit">Send Message</Button>
        </form>
      </div>
      <aside className="space-y-6">
        <div className="paper-panel p-6">
          <h3 className="section-title text-lg text-(--color-primary)">Academic Office</h3>
          <p className="mt-2 text-sm text-(--color-muted)">Library Wing, Academic Center</p>
          <p className="mt-1 text-sm text-(--color-muted)">Mon - Sat · 9:00 AM - 6:00 PM</p>
        </div>
        <div className="paper-panel p-6">
          <h3 className="section-title text-lg text-(--color-primary)">Direct Contacts</h3>
          <p className="mt-2 text-sm text-(--color-muted)">contact@maheshsir.edu</p>
          <p className="mt-1 text-sm text-(--color-muted)">+91 88000 12345</p>
        </div>
      </aside>
    </div>
  )
}

export default Contact
