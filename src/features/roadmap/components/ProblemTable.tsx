import React, { useState } from 'react';
import { DifficultyPill } from '@/components/ui/DifficultyPill';
import { CompanyBadge } from '@/components/ui/CompanyBadge';
import { CheckCircle2, Circle, FileText, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import { useNavigationGuard } from '../hooks/useNavigationGuard';
import { ProblemDetails } from './ProblemDetails';
import { MobileProblemCard } from './MobileProblemCard';
import { CompanyPopover } from './CompanyPopover'; // <-- Import Popover
import type { Item } from '@/types/models';

interface RowProps {
  item: Item;
  isCompleted: boolean;
  noteContent?: string;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

const ProblemRow = React.memo(function ProblemRow({ item, isCompleted, noteContent, onToggleComplete, onSaveNote }: RowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const requireAuth = useRequireAuth();
  const guard = useNavigationGuard();

  const recentSet = new Set(item.recentCompanies || []);
  const hasNote = !!noteContent;

  const handleRowClick = () => {
    guard(() => setIsExpanded(!isExpanded));
  };

  const MAX_COMPANIES = 3;
  const displayCompanies = item.companies?.slice(0, MAX_COMPANIES) || [];
  const hiddenCompanies = item.companies?.slice(MAX_COMPANIES) || [];

  return (
    <>
      <tr
        onClick={handleRowClick}
        className={clsx(
          "group border-b border-line-soft hover:bg-bg-inset cursor-pointer transition-colors",
          isExpanded && "bg-bg-inset"
        )}
      >
        <td className="px-2 py-2 align-middle text-center" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => requireAuth('progress', () => onToggleComplete(item.id, !isCompleted))}
            className="text-text-faint hover:text-accent transition-colors focus:outline-none"
          >
            {isCompleted ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} />}
          </button>
        </td>
        <td className="px-2 py-2 text-[13px] align-middle">
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
        <td className="px-2 py-2 align-middle"><DifficultyPill difficulty={item.difficulty} /></td>
        <td className="px-2 py-2 align-middle">
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
    </>
  );
}, (prev, next) => {
  return prev.item.id === next.item.id &&
    prev.isCompleted === next.isCompleted &&
    prev.noteContent === next.noteContent;
});

interface TableProps {
  items: Item[];
  completedIds: Set<string>;
  notesMap: Map<string, string>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export function ProblemTable({ items, completedIds, notesMap, onToggleComplete, onSaveNote }: TableProps) {
  if (items.length === 0) {
    return <div className="py-4 text-[12.5px] italic text-text-faint">No problems match the current filters.</div>;
  }

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto">
        <table className="mt-2 w-full border-collapse">
          <thead>
            <tr>
              <th className="w-10 border-b border-line px-2 py-1.5 text-center text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Status</th>
              <th className="border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Problem</th>
              <th className="border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Difficulty</th>
              <th className="border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Companies</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ProblemRow
                key={item.id}
                item={item}
                isCompleted={completedIds.has(item.id)}
                noteContent={notesMap.get(item.id)}
                onToggleComplete={onToggleComplete}
                onSaveNote={onSaveNote}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col border-t border-line-soft mt-2">
        {items.map((item) => (
          <MobileProblemCard
            key={item.id}
            item={item}
            isCompleted={completedIds.has(item.id)}
            noteContent={notesMap.get(item.id)}
            onToggleComplete={onToggleComplete}
            onSaveNote={onSaveNote}
          />
        ))}
      </div>
    </div>
  );
}