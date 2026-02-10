import { Mail, Phone, MapPin, Clock, Send, Landmark, Quote, FileText } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function Contact() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-11">
      {/* 1. Header: The Library Archive Style */}
      <header className="mb-20 space-y-4 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
          Inquiries & Correspondence
        </p>
        <h1 className="text-5xl md:text-7xl font-serif italic font-extrabold tracking-tight text-slate-900 leading-none">
          Contact the <span className="text-slate-400">Archive.</span>
        </h1>
        <div className="mx-auto h-px w-24 bg-slate-200 mt-8" />
      </header>

      <div className="grid gap-20 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* 2. Structured Form Section */}
        <section className="space-y-10">
          <div className="space-y-2">
            <h3 className="text-lg font-serif italic font-bold text-slate-900">Formal Inquiry</h3>
            <p className="text-sm text-slate-500 font-medium">Please provide your institutional credentials for archive access requests.</p>
          </div>

          <form className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-slate-900 transition-colors">Full Name</label>
                  <Input placeholder="Enter your name" className="border-x-0 border-t-0 border-b-slate-200 rounded-none bg-transparent px-1 focus:border-b-slate-900 transition-all placeholder:text-slate-200" />
                </div>
                <div className="group space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-slate-900 transition-colors">Institutional Email</label>
                  <Input placeholder="name@university.edu" className="border-x-0 border-t-0 border-b-slate-200 rounded-none bg-transparent px-1 focus:border-b-slate-900 transition-all placeholder:text-slate-200" />
                </div>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-slate-900 transition-colors">Department / Affiliation</label>
                <Input placeholder="e.g. Department of Sanskrit, GU" className="border-x-0 border-t-0 border-b-slate-200 rounded-none bg-transparent px-1 focus:border-b-slate-900 transition-all placeholder:text-slate-200" />
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 group-focus-within:text-slate-900 transition-colors">Nature of Message</label>
                <textarea
                  className="min-h-49 w-full border-x-0 border-t-0 border-b-slate-200 bg-transparent px-1 py-3 text-sm text-slate-900 focus:border-b-slate-900 focus:outline-none transition-all placeholder:text-slate-200 resize-none"
                  placeholder="State the purpose of your communication..."
                />
              </div>
            </div>

            <Button type="submit" className="h-14 w-full bg-slate-900 text-white rounded-none hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-[0.3em]">
              Dispatch Formal Request
            </Button>
          </form>
        </section>

        {/* 3. The "Library Office" Sidebar */}
        <aside className="space-y-12">
          
          {/* Office Information */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-3 text-slate-900">
               <Landmark size={20} strokeWidth={1.5} />
               <h3 className="text-sm font-black uppercase tracking-widest">Office of Archive</h3>
            </div>
            <div className="space-y-4 border-l border-slate-100 pl-6 ml-2">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physical Address</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    Gujarat Technological University, <br />
                    Central Library, <br />
                    Nr. Visat Three Roads, <br />
                    Chandkheda, Ahmedabad - 382424
                  </p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Library Hours</p>
                  <p className="text-sm font-medium text-slate-600">Mon — Sat / 09:00 — 18:00 IST</p>
               </div>
            </div>
          </div>

          {/* Correspondence Channels */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900">
               <Mail size={20} strokeWidth={1.5} />
               <h3 className="text-sm font-black uppercase tracking-widest">Correspondence</h3>
            </div>
            <div className="space-y-4 border-l border-slate-100 pl-6 ml-2 text-sm font-medium">
               <a href="mailto:admin@maheshsir.edu" className="block text-slate-600 hover:text-slate-900 transition-colors underline decoration-slate-200 underline-offset-4">Dr mahesh solanaki</a>
               <p className="text-slate-600">+91 88000 12345</p>
            </div>
          </div>

          {/* Note from Librarian */}
          <div className="bg-slate-50 p-8 rounded-none border-l-2 border-slate-200">
             <Quote className="text-slate-200 mb-4" size={24} />
             <p className="text-xs font-serif italic text-slate-500 leading-relaxed">
               "Our digital repository is a growing ecosystem. We welcome academic contributions that preserve the cultural and historical legacy of our region."
             </p>
             <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">— Dr Mahesh Solanki</p>
          </div>

        </aside>
      </div>
    </div>
  )
}

export default Contact