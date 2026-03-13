import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import PostMediaAttachments from './PostMediaAttachments';
import { ArrowRight, FileText, Calendar, User } from 'lucide-react';

function ArticleCard({ article }) {
  const category = article?.category || article?.format || 'General';
  const author = article?.speaker || article?.author || 'Admin';
  
  const hasImage = article?.files?.some(f => f.type?.includes('image') || f.url?.match(/\.(jpg|jpeg|png|webp)$/i));
  const hasDocs = article?.files?.some(f => f.type?.includes('pdf') || f.url?.includes('.pdf'));
  const firstImage = hasImage ? article.files.find(f => f.type?.includes('image')).url : null;

  return (
    <Link to={`/content/${article?.id}`} className="group block h-auto min-h-104 outline-none sm:h-136 sm:min-h-0">
      {/* CONTAINER: 
        - p-[2px] creates the border width.
        - overflow-hidden clips the rotating gradient.
      */}
      <div className="relative h-full p-0.5 rounded-xl overflow-hidden bg-transparent transition-all duration-300">
        
        {/* ANIMATED LAYER: 
          - Only visible on hover (opacity-0 to opacity-100).
          - Uses a conic-gradient to create the "round" movement effect.
        */}
        <div className="absolute -inset-full bg-[conic-gradient(from_0deg,#064e3b,#10b981,#064e3b)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* INNER CARD: Keeps content safe and static */}
        <Card className="relative z-10 flex h-full flex-col overflow-hidden rounded-[10px] border-none p-0 bg-white shadow-sm">
          
          <div className="p-5 md:p-6 flex-1 flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
            <Badge className="rounded-none bg-[#064e3b] text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                {category}
              </Badge>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar size={12} />
                <span className="text-[10px] font-medium">
                  {article?.eventDate ? new Date(article.eventDate).getFullYear() : '2026'}
                </span>
              </div>
          </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-3 leading-snug line-clamp-2">
              {article?.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-5 font-normal">
              {article?.description}
            </p>

            {/* Image: No hover scale, full color */}
            {hasImage ? (
              <div className="relative h-32 w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50 mb-5 shrink-0">
                <img 
                  src={firstImage} 
                  className="w-full h-full object-cover" 
                  alt={article?.title}
                />
              </div>
            ) : hasDocs ? (
              <div className="mb-5 p-3 bg-emerald-50/30 rounded-lg border border-dashed border-emerald-200 flex items-center gap-3">
                <FileText size={20} className="text-emerald-800" />
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-tight">Technical Documentation</span>
              </div>
            ) : (
              <div className="mb-5 h-32 rounded-lg border border-dashed border-slate-200 bg-slate-50" />
            )}

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] border border-slate-200">
                  {author.charAt(0)}
              </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Archive By</span>
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{author}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 py-2 px-5 rounded-md bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                View Entry
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          <div className="hidden">
             <PostMediaAttachments files={article?.files} title={article?.title} />
        </div>
      </Card>
      </div>
    </Link>
  );
}

export default ArticleCard;