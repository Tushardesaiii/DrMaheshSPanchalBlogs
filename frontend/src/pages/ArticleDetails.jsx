import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { ArrowLeft, BookOpen, Share2, Download, ExternalLink, FileText, Eye } from 'lucide-react'

function ArticleDetails() {
  // Mock data - in real app, this would come from props/context
  const article = {
    title: 'Designing Academic Knowledge Portals',
    author: 'Editorial Board',
    date: 'January 2026',
    readTime: '8 min',
    tags: ['UX Design', 'Content Strategy', 'Digital Library'],
    category: 'Editorial',
    summary: '"This article outlines the principles of building academic knowledge portals that prioritize readability, structure, and trust. The focus is on clear hierarchy, curated resources, and consistent editorial tone."',
    content: 'To build a successful portal, we must treat information architecture as the foundation of user trust. The following pillars guide our current methodology:',
    keyPoints: [
      { title: 'Content-first layout', desc: 'Maintaining focus and academic clarity by removing unnecessary visual noise.' },
      { title: 'Navigation', desc: 'Highlighting evergreen categories rather than fleeting design trends.' },
      { title: 'Metadata', desc: 'Ensuring structured data is ready for future API and AI integrations.' }
    ],
    media: {
      url: 'https://example.com/article.pdf',
      type: 'pdf',
      fileName: 'Designing_Academic_Knowledge_Portals.pdf',
      fileSize: '2.4 MB'
    },
    relatedReads: [
      { title: "Metadata Practices for Libraries", date: "Dec 2025" },
      { title: "From Collection to Curriculum", date: "Nov 2025" },
      { title: "The Future of Open Access", date: "Oct 2025" }
    ]
  }

  return (
    <div className="bg-[#fcfcf9]">
      <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Breadcrumb / Back Navigation */}
      <nav className="mb-8">
        <Button variant="ghost" className="group flex items-center gap-2 text-sm text-(--color-muted) hover:text-(--color-primary)">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Articles
        </Button>
      </nav>

      <div className="grid gap-20 lg:grid-cols-[2fr_1fr]">
        <article className="space-y-14">
          {/* Header Section */}
          <header className="space-y-6 border-b border-(--color-border) pb-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-(--color-accent)"></span>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-(--color-accent)">Editorial</p>
            </div>
            
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-(--color-primary) md:text-5xl">
              Designing Academic Knowledge Portals
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-(--color-accent)/10 flex items-center justify-center text-(--color-accent) font-bold">EB</div>
                <div>
                  <p className="text-sm font-semibold text-(--color-primary)">Editorial Board</p>
                  <p className="text-xs text-(--color-muted)">Published January 2026 · 8 min read</p>
                </div>
              </div>
              <div className="flex gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-[10px] uppercase tracking-wider">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </header>

          {/* Abstract / Summary */}
          <section className="relative border-l-4 border-(--color-accent) bg-linear-to-r from-[#f5f1ed] to-transparent p-8 lg:p-10 rounded-r-2xl italic">
            <p className="text-lg lg:text-xl leading-8 text-(--color-primary) font-serif">
              {article.summary}
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
                    <h3 className="section-title text-2xl mb-2 text-(--color-primary)">Content Document</h3>
                    <p className="text-sm text-(--color-muted) mb-6">{article.media.fileName}</p>
                    <div className="flex items-center justify-center gap-3 mb-6 text-xs text-(--color-muted) font-medium">
                      <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-(--color-border)">PDF</span>
                      <span className="px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-(--color-border)">{article.media.fileSize}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#d4a574] to-[#a87d4f] text-white font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <Eye size={18} />
                        View Document
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
              <div className="premium-card p-6 text-center rounded-xl border-2 border-(--color-border) hover:shadow-md transition-all">
                <p className="text-xs text-(--color-muted) mb-3 font-bold uppercase tracking-wider">Format</p>
                <p className="font-semibold text-(--color-primary) text-lg">PDF</p>
              </div>
              <div className="premium-card p-6 text-center rounded-xl border-2 border-(--color-border) hover:shadow-md transition-all">
                <p className="text-xs text-(--color-muted) mb-3 font-bold uppercase tracking-wider">Size</p>
                <p className="font-semibold text-(--color-primary) text-lg">2.4 MB</p>
              </div>
              <div className="premium-card p-6 text-center rounded-xl border-2 border-(--color-border) hover:shadow-md transition-all">
                <p className="text-xs text-(--color-muted) mb-3 font-bold uppercase tracking-wider">Pages</p>
                <p className="font-semibold text-(--color-primary) text-lg">12</p>
              </div>
            </div>
          </section>

          {/* Main Content Area */}
          <section className="bg-white rounded-2xl border-2 border-(--color-border) shadow-sm hover:shadow-md transition-shadow p-8 lg:p-12">
            <div className="flex items-start gap-4 mb-12 pb-8 border-b-2 border-(--color-border)">
              <div className="p-2.5 rounded-lg bg-(--color-accent)/10 shrink-0 mt-1">
                <FileText size={28} className="text-(--color-accent)" />
              </div>
              <div>
                <h3 className="section-title text-3xl font-semibold text-(--color-primary)">Key Takeaways</h3>
                <p className="text-sm text-(--color-muted) mt-2">Core insights and actionable takeaways from this article</p>
              </div>
            </div>
            <div className="prose prose-slate max-w-none space-y-8 text-(--color-primary)/90">
              <p 
                className="leading-8 font-serif text-lg lg:text-xl text-(--color-primary)"
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              >
                {article.content}
              </p>
              <ul className="space-y-6 text-base leading-8 mt-10 pt-10 border-t-2 border-(--color-border)">
                {article.keyPoints.map((point, i) => (
                  <li key={i} className="flex gap-5 items-start">
                    <span className="text-(--color-accent) font-bold text-2xl leading-none mt-1 shrink-0">✓</span>
                    <div className="flex-1">
                      <strong className="text-(--color-primary) text-lg block mb-2">{point.title}</strong>
                      <span className="text-(--color-muted) leading-relaxed">{point.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="paper-panel sticky top-10 space-y-7 border-2 border-(--color-border) p-8 lg:p-10 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 border-b-2 border-(--color-border) pb-6">
              <div className="p-2 rounded-lg bg-(--color-accent)/10">
                <BookOpen size={20} className="text-(--color-accent)" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-(--color-primary)">Further Reading</h3>
                <p className="text-xs text-(--color-muted) mt-1">Related articles & resources</p>
              </div>
            </div>
            
            <ul className="space-y-6">
              {article.relatedReads.map((res, i) => (
                <li key={i} className="group cursor-pointer">
                  <p className="text-sm font-semibold text-(--color-primary) group-hover:text-(--color-accent) transition-colors line-clamp-2">{res.title}</p>
                  <p className="text-xs text-(--color-muted) mt-2 flex items-center gap-1">
                    <span>📅</span> {res.date}
                  </p>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t-2 border-(--color-border)">
              <Button className="w-full justify-center gap-2" variant="outline">
                <Share2 size={16} />
                Share Article
              </Button>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </div>
  )
}

export default ArticleDetails