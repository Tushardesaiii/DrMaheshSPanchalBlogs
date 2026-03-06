import { Mail, MapPin, Phone, UserSquare2, ExternalLink, GraduationCap, Award, BookOpen } from 'lucide-react';

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100">
      {/* Hero Banner - Using a more standard height and refined gradient */}
      <section className="relative h-80 w-full overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvZz48L3N2Zz4=')]" />
        </div>
        <div className="absolute bottom-0 h-24 w-full bg-linear-to-t from-[#f8fafc] to-transparent" />
      </section>

      {/* Main Container */}
      <main className="relative mx-auto -mt-40 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        
        {/* Profile Header Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              
              {/* Photo Section */}
              <div className="relative group">
                <div className="h-44 w-44 overflow-hidden rounded-2xl bg-linear-to-tr from-slate-200 to-slate-50 p-1 shadow-inner">
                  <div className="flex   items-center justify-center rounded-[calc(1rem-2px)] bg-white">
                 <img src="/Profile.jpeg" alt="Profile Picture"  />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white shadow-lg" title="Currently Active">
                  <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                </div>
              </div>

              {/* Identity Section */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-center justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                      Dr. Mahesh K. Solanki
                    </h1>
                    <p className="mt-2 text-lg font-medium text-indigo-600">University Librarian</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-3 text-slate-500 md:justify-start">
                      <span className="flex items-center gap-1.5 text-sm">
                        <MapPin size={16} className="text-slate-400" />
                        Ahmedabad, Gujarat
                      </span>
                      <span className="hidden h-4 w-px bg-slate-200 sm:block" />
                      <span className="flex items-center gap-1.5 text-sm">
                        <BookOpen size={16} className="text-slate-400" />
                        GTU Central Library
                      </span>
                    </div>
                  </div>
                  <a
                    href="mailto:librarian@gtu.edu.in"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-6 py-3 text-sm font-semibold  text-black transition-all hover:bg-slate-300 hover:shadow-lg active:scale-95"
                  >
                    Contact Me
                  </a>
                </div>

                {/* Quick Metrics */}
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-50 pt-8 sm:grid-cols-3">
                  <Stat label="Experience" value="18+ Years" />
                  <Stat label="Education" value="Ph.D. (LIS)" />
                  <Stat label="University" value="GTU" className="col-span-2 sm:col-span-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 border-t border-slate-100 lg:grid-cols-12">
            
            {/* Left Column: Biography & Career */}
            <div className="space-y-10 p-6 sm:p-10 lg:col-span-8">
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 uppercase tracking-wider">
                  About
                </h2>
                <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-slate-600">
                  <p>
                    Welcome to my official professional space. As the <strong>University Librarian</strong> at 
                    Gujarat Technological University, I specialize in the intersection of traditional academic 
                    excellence and modern digital infrastructure.
                  </p>
                  <p>
                    My work focuses on developing robust e-resource ecosystems and fostering a culture of 
                    innovation in research. I am dedicated to bridging the gap between information 
                    accessibility and academic research needs.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-6 text-lg font-bold text-slate-900 uppercase tracking-wider">Professional Journey</h2>
                <div className="space-y-8">
                  <TimelineItem 
                    title="University Librarian"
                    subtitle="Gujarat Technological University (GTU)"
                    description="Leading digital transformation in library services, managing institutional repositories, and implementing advanced knowledge management systems."
                    isLatest
                  />
                  <TimelineItem 
                    title="Expertise in Library Science"
                    subtitle="18+ Years of Service"
                    description="Continuous contribution to academic libraries, information systems development, and mentoring research scholars across various domains."
                  />
                </div>
              </section>

              <section>
                <h2 className="mb-6 text-lg font-bold text-slate-900 uppercase tracking-wider">Academic Foundations</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <EducationCard 
                    title="Ph.D. in LIS"
                    icon={<Award className="text-indigo-500" />}
                    desc="Doctoral research in modern library systems"
                  />
                  <EducationCard 
                    title="GSLET"
                    icon={<GraduationCap className="text-emerald-500" />}
                    desc="State Eligibility for Lectureship"
                  />
                </div>
              </section>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6 bg-slate-50/50 p-6 sm:p-10 lg:col-span-4 border-l border-slate-100">
              
              {/* Specialized Contact Card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="mb-4 font-bold text-slate-900">Direct Contact</h3>
                <div className="space-y-4">
                  <ContactLink icon={<Phone size={16} />} label="+91 8401067372" href="tel:+918401067372" />
                  <ContactLink icon={<Mail size={16} />} label="librarian@gtu.edu.in" href="mailto:librarian@gtu.edu.in" />
                  <div className="flex gap-3 text-sm text-slate-600">
                    <div className="mt-1 text-slate-400"><MapPin size={16} /></div>
                    <p>Central Library, GTU, Chandkheda, Ahmedabad - 382424</p>
                  </div>
                </div>
              </div>

              {/* Expertise Cloud */}
              <div>
                <h3 className="mb-4 font-bold text-slate-900">Core Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Library Automation', 'E-Resources', 'Research Support', 
                    'Information Literacy', 'Knowledge Management', 'Academic Leadership'
                  ].map((skill) => (
                    <span key={skill} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:border-indigo-200 hover:text-indigo-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mission Statement */}
              <div className="rounded-2xl bg-linear-to-br from-slate-700 to-slate-800 p-6 text-white shadow-lg shadow-green-200">
                <h3 className="mb-2 font-bold flex items-center gap-2">
                  Our Mission
                </h3>
                <p className="text-sm leading-relaxed text-indigo-50">
                  "Strengthening academic excellence through modern library practices and supporting research scholars with quality e-resources."
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Sub-components
function Stat({ label, value, className = "" }) {
  return (
    <div className={`text-center md:text-left ${className}`}>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function TimelineItem({ title, subtitle, description, isLatest }) {
  return (
    <div className="relative pl-8 before:absolute before:left-2.75 before:top-2 before:h-full before:w-0.5 before:bg-slate-100 last:before:hidden">
      <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border-4 border-white shadow-sm ${isLatest ? 'bg-indigo-600' : 'bg-slate-300'}`} />
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm font-semibold text-indigo-600">{subtitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function EducationCard({ title, icon, desc }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-hover hover:bg-white hover:shadow-md">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function ContactLink({ icon, label, href }) {
  return (
    <a href={href} className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-indigo-600 group">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500">
        {icon}
      </div>
      <span className="truncate">{label}</span>
      <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}  