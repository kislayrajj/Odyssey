import React from 'react';
import { DifficultyPill } from '@/components/ui/DifficultyPill';
import { CompanyBadge } from '@/components/ui/CompanyBadge';
import { CheckCircle2, Circle, FileText, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import { useNavigationGuard } from '../hooks/useNavigationGuard';
import { ProblemDetails } from './ProblemDetails';
import { CompanyPopover } from './CompanyPopover';
import type { Item } from '@/types/models';

interface RowProps {
  item: Item;
  isCompleted: boolean;
  noteContent?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export const ProblemRow = React.memo(React.forwardRef<HTMLTableSectionElement, RowProps>(
  ({ item, isCompleted, noteContent, isExpanded, onToggleExpand, onToggleComplete, onSaveNote, ...rest }, ref) => {
    const requireAuth = useRequireAuth();
    const guard = useNavigationGuard();
    
    const recentSet = new Set(item.recentCompanies || []);
    const hasNote = !!noteContent;

    const handleRowClick = () => {
      guard(onToggleExpand);
    };

    const MAX_COMPANIES = 3;
    const displayCompanies = item.companies?.slice(0, MAX_COMPANIES) || [];
    const hiddenCompanies = item.companies?.slice(MAX_COMPANIES) || [];

    return (
      <tbody ref={ref} {...rest}>
        <tr 
          onClick={handleRowClick}
          className={clsx(
            "group border-b border-line-soft hover:bg-bg-inset cursor-pointer transition-colors",
            isExpanded && "bg-bg-inset"
          )}
        >
          {/* FIX: Increased py-3 to py-3.5 for more comfortable desktop spacing */}
          <td className="px-2 py-3.5 align-middle text-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => requireAuth('progress', () => onToggleComplete(item.id, !isCompleted))}
              className="text-text-faint hover:text-accent transition-colors focus:outline-none"
            >
              {isCompleted ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} />}
            </button>
          </td>
          <td className="px-2 py-3.5 text-[13px] align-middle">
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); handleRowClick(); }}
                className="text-text-faint hover:text-text-main transition-colors focus:outline-none"
              >
                <ChevronRight size={16} className={clsx("transition-transform duration-150", { "rotate-90": isExpanded })} />
              </button>
              <div className="flex items-center gap-2">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => e.stopPropagation()}
                  className={clsx("hover:text-accent hover:underline transition-colors", isCompleted ? "text-text-dim line-through" : "text-text-main")}
                >
                  {item.title}
                </a>
                <FileText 
                  size={14} 
                  className={clsx(
                    "transition-opacity duration-200",
                    hasNote ? "text-accent opacity-100" : "text-text-faint opacity-0 group-hover:opacity-50"
                  )} 
                />
              </div>
            </div>
          </td>
          <td className="px-2 py-3.5 align-middle"><DifficultyPill difficulty={item.difficulty} /></td>
          <td className="px-2 py-3.5 align-middle">
            {displayCompanies.length > 0 ? (
              <div className="flex max-w-[340px] flex-wrap items-center gap-1">
                {displayCompanies.map((company) => (
                  <CompanyBadge key={company} name={company} isRecent={recentSet.has(company)} />
                ))}
                {hiddenCompanies.length > 0 && (
                  <CompanyPopover hiddenCount={hiddenCompanies.length} companies={hiddenCompanies} />
                )}
              </div>
            ) : <span className="text-[11.5px] italic text-text-faint">no company data</span>}
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan={4} className="p-0">
              <ProblemDetails 
                itemId={item.id} 
                initialContent={noteContent}
                onSave={(content) => onSaveNote(item.id, content)}
              />
            </td>
          </tr>
        )}
      </tbody>
    );
  }
), (prev, next) => {
  return prev.item.id === next.item.id &&
         prev.isCompleted === next.isCompleted &&
         prev.isExpanded === next.isExpanded &&
         prev.noteContent === next.noteContent;
});