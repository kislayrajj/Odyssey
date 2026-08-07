import { X, BookOpen, CheckCircle2, FileText } from 'lucide-react';
import type { Category } from '@/types/models';

interface Props {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export function RoadmapInfoModal({ category, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-line bg-bg-raised p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-text-faint hover:text-text-main transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theory-bg text-theory">
            <BookOpen size={20} />
          </div>
          <h2 className="font-sans text-lg font-bold text-text-main">About this Roadmap</h2>
        </div>
        
        <div className="mb-6 text-[13.5px] leading-relaxed text-text-main">
          {category.note ? (
            <p>{category.note}</p>
          ) : (
            <p>Welcome to the {category.title} roadmap.</p>
          )}
        </div>

        <div className="mb-6 rounded-lg border border-line-soft bg-bg-inset p-4">
          <h3 className="mb-3 font-sans text-[12px] font-bold uppercase tracking-wider text-text-dim">How to use</h3>
          <ul className="flex flex-col gap-3 text-[13px] text-text-dim">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
              <span>Click the circle next to any problem to mark it as completed and track your progress.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <FileText size={16} className="mt-0.5 shrink-0 text-theory" />
              <span>Expand a row to access your personal workspace. Write Markdown notes and save solution links.</span>
            </li>
          </ul>
        </div>

        {(category.companyDataAsOf || category.companyDataSource) && (
          <div className="border-t border-line-soft pt-4 text-[11px] text-text-faint opacity-70">
            {category.companyDataAsOf && <p className="mb-1">Data snapshot: {category.companyDataAsOf}</p>}
            {category.companyDataSource && <p className="truncate" title={category.companyDataSource}>Source: {category.companyDataSource}</p>}
          </div>
        )}
      </div>
    </div>
  );
}