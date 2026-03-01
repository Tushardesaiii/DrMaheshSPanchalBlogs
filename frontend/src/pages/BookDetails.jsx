import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { ArrowLeft, BookOpen, Share2, Download, ExternalLink, FileText, Eye } from 'lucide-react'

function BookDetails() {
  // Mock data - in real app, this would come from props/context
  const book = {
    title: 'Pedagogy of Structured Learning',
    author: 'Dr. A. Sen',
    category: 'Education Strategy',
    publishDate: 'March 2025',
    tags: ['curriculum', 'methodology', 'research'],
    summary: 'A structured roadmap for teachers and librarians to support semester planning, evidence-based pedagogy, and purposeful academic delivery.',
    description: 'This comprehensive guide combines learning science with practical pedagogical frameworks. It serves as both a research resource and an implementation manual for educational institutions.',
    highlights: [
      'Learning outcomes mapped to academic standards.',
      'Resource curation strategy for digital libraries.',
      'Assessment-ready frameworks for educators.',
      'Case studies from leading academic institutions.',
      'Adaptable models for different learning contexts.'
    ],
    media: {
      url: 'https://example.com/book.pdf',
      type: 'pdf',
      fileName: 'Pedagogy_of_Structured_Learning.pdf',
      fileSize: '5.8 MB',
      pages: '324'
    },
    relatedReads: [
      { title: 'Contemporary Curriculum Design', author: 'Dr. B. Kumar', date: 'Feb 2025' },
      { title: 'Digital Transformation in Education', author: 'Prof. C. Singh', date: 'Jan 2025' },
      { title: 'Evidence-Based Instruction Methods', author: 'Dr. A. Patel', date: 'Dec 2024' }
    ]
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb / Back Navigation */}
      <nav className="mb-8">
        <Button variant="ghost" className="group flex items-center gap-2 text-sm text-(--color-muted) hover:text-(--color-primary)">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Library
        </Button>
      </nav>

      <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
        <article className="space-y-10">
          {/* Header Section */}
          <header className="space-y-6 border-b border-(--color-border) pb-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-(--color-accent)"></span>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-(--color-accent)">Book</p>
            </div>
            
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-(--color-primary) md:text-5xl">
              {book.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-(--color-accent)/10 flex items-center justify-center text-(--color-accent) font-bold">AS</div>
                <div>
                  <p className="text-sm font-semibold text-(--color-primary)">{book.author}</p>
                  <p className="text-xs text-(--color-muted)">{book.category} · Published {book.publishDate}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {book.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-wider">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* Summary / Abstract */}
          <section className="relative border-l-4 border-(--color-accent) bg-(--color-accent)/5 p-8 italic">
            <p className="text-lg leading-relaxed text-(--color-primary)/80">
              "{book.summary}"
            </p>
          </section>

          {/* Premium Media Display Section */}
          <section className="space-y-4">
            <div className="relative group overflow-hidden rounded-2xl bg-linear-to-br from-[#f0e8df] to-[#e8dfd5] shadow-lg">
              {/* Media Container */}
              <div className="relative bg-white/50 backdrop-blur-sm">
                <div className="aspect-video bg-linear-to-br from-[#d4a574]/20 to-[#a87d4f]/20 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4a574] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#a87d4f] rounded-full blur-3xl"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-linear-to-br from-[rgba(212,165,116,0.2)] to-[rgba(212,165,116,0.1)]">
                      <FileText className="w-12 h-12 text-(--color-accent)" strokeWidth={1.5} />
                    </div>
                    <h3 className="section-title text-2xl mb-2 text-(--color-primary)">Book Preview</h3>
                    <p className="text-sm text-(--color-muted) mb-6">{book.media.fileName}</p>
                    <div className="flex items-center justify-center gap-3 mb-6 text-xs text-(--color-muted) font-medium">
                      <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-(--color-border)">PDF</span>
                      <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-(--color-border)">{book.media.fileSize}</span>
                      <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-(--color-border)">{book.media.pages} Pages</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#d4a574] to-[#a87d4f] text-white font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <Eye size={18} />
                        Read Book
                      </button>
                      <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-(--color-accent) text-(--color-primary) font-semibold hover:bg-(--color-accent) hover:text-white transition-all duration-300 group/btn">
                        <Download size={18} className="group-hover/btn:scale-110 transition-transform" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-(--color-accent) transition-colors duration-300 pointer-events-none"></div>
            </div>

            {/* Info Bar Below Media */}
            <div className="grid grid-cols-3 gap-4">
              <div className="premium-card p-4 text-center">
                <p className="text-xs text-(--color-muted) mb-2">Format</p>
                <p className="font-semibold text-(--color-primary)">PDF</p>
              </div>
              <div className="premium-card p-4 text-center">
                <p className="text-xs text-(--color-muted) mb-2">Size</p>
                <p className="font-semibold text-(--color-primary)">{book.media.fileSize}</p>
              </div>
              <div className="premium-card p-4 text-center">
                <p className="text-xs text-(--color-muted) mb-2">Pages</p>
                <p className="font-semibold text-(--color-primary)">{book.media.pages}</p>
              </div>
            </div>
          </section>

          {/* Book Description */}
          <section className="premium-card border border-(--color-border)">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-(--color-border)">
              <BookOpen size={18} className="text-(--color-accent)" />
              <h3 className="section-title text-2xl text-(--color-primary)">About This Book</h3>
            </div>
            <div className="prose prose-slate max-w-none text-(--color-primary)/90">
              <p 
                className="leading-7 font-serif text-lg"
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              >
                {book.description}
              </p>
            </div>
          </section>

          {/* Preview Highlights */}
          <section className="premium-card border border-(--color-border)">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-(--color-border)">
              <FileText size={18} className="text-(--color-accent)" />
              <h3 className="section-title text-2xl text-(--color-primary)">What You'll Find Inside</h3>
            </div>
            <ul className="space-y-4">
              {book.highlights.map((highlight, i) => (
                <li key={i} className="flex gap-3 text-base text-(--color-primary)/80">
                  <span className="font-bold text-(--color-accent) shrink-0 text-lg">✓</span>
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="paper-panel sticky top-8 space-y-6 border border-(--color-border) p-8 shadow-sm">
            <div className="flex items-center gap-2 border-b border-(--color-border) pb-4">
              <BookOpen size={18} className="text-(--color-accent)" />
              <h3 className="font-serif text-xl font-medium text-(--color-primary)">Related Books</h3>
            </div>
            
            <ul className="space-y-6">
              {book.relatedReads.map((res, i) => (
                <li key={i} className="group cursor-pointer">
                  <p className="text-sm font-medium transition-colors group-hover:text-(--color-accent)">{res.title}</p>
                  <p className="text-xs text-(--color-muted)">By {res.author}</p>
                  <p className="text-xs text-(--color-muted)">{res.date}</p>
                </li>
              ))}
            </ul>

            <div className="pt-4 space-y-3">
              <Button className="w-full justify-center gap-2" variant="outline">
                <Share2 size={16} />
                Share Book
              </Button>
              <Button className="w-full justify-center gap-2">
                Add to Collection
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BookDetails
