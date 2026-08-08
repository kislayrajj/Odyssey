import React from 'react';
import { DifficultyPill } from '@/components/ui/DifficultyPill';
import { CheckCircle2, Circle, FileText, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import { useNavigationGuard } from '../hooks/useNavigationGuard';
import { ProblemDetails } from './ProblemDetails';
import type { Item } from '@/types/models';

interface Props {
  item: Item;
  isCompleted: boolean;
  noteContent?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export const MobileProblemCard = React.memo(function MobileProblemCard({ 
  item, isCompleted, noteContent, isExpanded, onToggleExpand, onToggleComplete, onSaveNote 
}: Props) {
  const requireAuth = useRequireAuth();
  const guard = useNavigationGuard();
  const hasNote = !!noteContent;

  const handleCardClick = () => {
    guard(onToggleExpand);
  };

  const MAX_MOBILE_COMPANIES = 2;
  const displayCompanies = item.companies?.slice(0, MAX_MOBILE_COMPANIES) || [];
  const hiddenCount = (item.companies?.length || 0) - MAX_MOBILE_COMPANIES;

  return (
    <div className="flex flex-col border-b border-line-soft bg-bg last:border-none">
      <div 
        onClick={handleCardClick}
        className={clsx(
          "flex items-start gap-3 p-4 transition-colors active:bg-bg-inset cursor-pointer",
          isExpanded && "bg-bg-inset"
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            requireAuth('progress', () => onToggleComplete(item.id, !isCompleted));
          }}
          className="mt-0.5 shrink-0 text-text-faint hover:text-accent focus:outline-none"
        >
          {isCompleted ? <CheckCircle2 size={20} className="text-accent" /> : <Circle size={20} />}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                "font-sans text-[14px] font-medium leading-snug transition-colors", 
                isCompleted ? "text-text-dim line-through" : "text-text-main"
              )}
            >
              {item.title}
            </a>
            <ChevronDown 
              size={16} 
              className={clsx("shrink-0 text-text-faint transition-transform duration-200", isExpanded && "rotate-180")} 
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <DifficultyPill difficulty={item.difficulty} />
            
            {displayCompanies.length > 0 && (
              <div className="flex items-center gap-1">
                {displayCompanies.map(c => (
                  <span key={c} className="rounded border border-line bg-bg-inset px-1.5 py-0.5 text-[9px] font-semibold text-text-dim uppercase tracking-wider">
                    {c.slice(0, 3)}
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className="text-[10px] font-medium text-text-faint">+{hiddenCount}</span>
                )}
              </div>
            )}

            {hasNote && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-accent ml-auto">
                <FileText size={12} /> Note
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-line-soft bg-bg-raised p-0 cursor-default" onClick={(e) => e.stopPropagation()}>
          {item.companies && item.companies.length > 0 && (
            <div className="flex overflow-x-auto px-4 pt-4 pb-1 gap-1.5 scrollbar-hide">
              {item.companies.map(c => (
                <span key={c} className="shrink-0 rounded border border-line bg-bg-inset px-2 py-1 text-[10px] font-semibold text-text-dim uppercase tracking-wider">
                  {c}
                </span>
              ))}
            </div>
          )}
          <ProblemDetails 
            itemId={item.id} 
            initialContent={noteContent}
            onSave={(content) => onSaveNote(item.id, content)}
          />
        </div>
      )}
    </div>
  );
}, (prev, next) => {
  return prev.item.id === next.item.id &&
         prev.isCompleted === next.isCompleted &&
         prev.isExpanded === next.isExpanded &&
         prev.noteContent === next.noteContent;
});