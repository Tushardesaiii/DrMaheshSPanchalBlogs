import { Mail, MapPin, Award, BookOpen, GraduationCap, Database, Library, Search } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const highlights = [
  {
    title: 'Digital Librarianship',
    description: 'Expert in library automation, networking, and the implementation of N-LIST digital resources.',
    icon: Database,
  },
  {
    title: 'Research Methodology',
    description: 'Published researcher in knowledge management and digital resource access patterns.',
    icon: Search,
  },
  {
    title: 'Academic Archiving',
    description: 'Specializes in building sustainable knowledge repositories and digital archives for higher education.',
    icon: Library,
  },
]

const skills = [
  'Library Automation',
  'Digital Resource Management',
  'Research Methodology',
  'Knowledge Management',
  'E-Resource Consortiums',
  'Academic Writing',
  'Information Literacy',
  'Institutional Repositories',
]

const focusAreas = [
  { label: 'Current Role', value: 'Librarian (Ph.D.)' },
  { label: 'Institution', value: 'Gujarat Technological University' },
  { label: 'Specialization', value: 'Library & Information Science' },
  { label: 'Research Focus', value: 'E-Resource Access & Cloud Computing' },
]

const milestones = [
  { year: '2016', title: 'N-LIST Program Research', detail: 'Published influential research on the awareness and use of N-LIST programs in college libraries.' },
  { year: '2021', title: 'Doctorate Achievement', detail: 'Completed Ph.D. focusing on modernizing library systems and digital accessibility.' },
  { year: '2024', title: 'GTU & GBU Leadership', detail: 'Leading digital library initiatives and automation for premier state universities.' },
]

function Profile() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 py-8">
      {/* Hero Section */}
      <section className="paper-panel p-8 md:p-12 bg-white shadow-sm border border-(--color-border) rounded-xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-(--color-accent)">Academic Profile</p>
            <h1 className="section-title text-4xl font-serif text-(--color-primary) md:text-5xl">Dr. Mahesh Solanki</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-(--color-muted)">
              Librarian and Information Scientist dedicated to the evolution of digital libraries, 
              knowledge management, and enhancing research accessibility through technology.
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-(--color-muted)">
              <span className="inline-flex items-center gap-2"><MapPin size={18} className="text-(--color-accent)" /> Ahmedabad, Gujarat</span>
              <span className="inline-flex items-center gap-2"><GraduationCap size={18} className="text-(--color-accent)" /> Ph.D. in Library Science</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-50">
            <Button className="w-full shadow-lg">Collaborate on Research</Button>
            <Button variant="ghost" className="w-full border border-(--color-border)">View Publications</Button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title} className="p-6 transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-(--color-accent)/10 text-(--color-accent) mb-4">
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-(--color-primary)">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-(--color-muted)">{item.description}</p>
          </Card>
        ))}
      </section>

      {/* Expertise and Facts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-(--color-primary) flex items-center gap-2">
            <BookOpen className="text-(--color-accent)" /> Core Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} className="px-3 py-1 bg-(--color-bg) border border-(--color-border)">{skill}</Badge>
            ))}
          </div>
        </Card>
        
        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-bold text-(--color-primary)">Institutional Background</h2>
          <div className="divide-y divide-(--color-border)">
            {focusAreas.map((item) => (
              <div key={item.label} className="py-3 flex items-center justify-between gap-6">
                <span className="font-semibold text-(--color-primary) text-sm">{item.label}</span>
                <span className="text-right text-sm text-(--color-muted)">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Timeline and Contact */}
      <section className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <Card className="p-8 space-y-8">
          <h2 className="text-2xl font-bold text-(--color-primary)">Professional Milestones</h2>
          <div className="space-y-8 relative before:absolute before:left-0 before:top-2 before:h-[95%] before:w-0.5 before:bg-(--color-border)">
            {milestones.map((item) => (
              <div key={item.year} className="relative pl-8">
                <div className="absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full bg-(--color-accent)" />
                <p className="text-xs font-bold text-(--color-accent) tracking-widest">{item.year}</p>
                <h3 className="text-lg font-bold text-(--color-primary) mt-1">{item.title}</h3>
                <p className="text-sm text-(--color-muted) mt-1">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-(--color-primary) mb-4">Contact & Inquiry</h2>
            <div className="space-y-4 text-sm text-(--color-muted)">
              <a href="mailto:mahesh.solanki@gtu.edu.in" className="flex items-center gap-3 hover:text-(--color-accent) transition-colors">
                <Mail size={18} className="text-(--color-accent)" /> mahesh.solanki@gtu.edu.in
              </a>
              <div className="flex items-center gap-3">
                <Award size={18} className="text-(--color-accent)" /> Available for Seminars & Guest Lectures
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-(--color-border) italic text-xs text-(--color-muted)">
            "The library is not a luxury but one of the necessities of life."
          </div>
        </Card>
      </section>
    </div>
  )
}

export default Profile