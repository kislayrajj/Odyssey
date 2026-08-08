import { useState, useCallback } from 'react';
import { ProblemRow } from './ProblemRow';
import { MobileProblemCard } from './MobileProblemCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Item } from '@/types/models';

interface TableProps {
  items: Item[];
  completedIds: Set<string>;
  notesMap: Map<string, string>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export function ProblemTable({ items, completedIds, notesMap, onToggleComplete, onSaveNote }: TableProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  if (items.length === 0) {
    return <div className="py-4 text-[12.5px] italic text-text-faint">No problems match the current filters.</div>;
  }

  if (isDesktop) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="mt-2 w-full table-fixed border-collapse">
          <thead>
            <tr>
              {/* FIX: Adjusted column widths to push Difficulty and Companies to the right */}
              <th className="w-12 border-b border-line px-2 py-1.5 text-center text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Status</th>
              <th className="w-[55%] border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Problem</th>
              <th className="w-[12%] border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Difficulty</th>
              <th className="w-[33%] border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Companies</th>
            </tr>
          </thead>
          {items.map((item) => (
            <ProblemRow 
              key={item.id} 
              item={item} 
              isCompleted={completedIds.has(item.id)} 
              noteContent={notesMap.get(item.id)}
              isExpanded={expandedRows.has(item.id)}
              onToggleExpand={() => toggleExpand(item.id)}
              onToggleComplete={onToggleComplete} 
              onSaveNote={onSaveNote}
            />
          ))}
        </table>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-t border-line-soft mt-2">
      {items.map((item) => (
        <MobileProblemCard
          key={item.id}
          item={item}
          isCompleted={completedIds.has(item.id)}
          noteContent={notesMap.get(item.id)}
          isExpanded={expandedRows.has(item.id)}
          onToggleExpand={() => toggleExpand(item.id)}
          onToggleComplete={onToggleComplete}
          onSaveNote={onSaveNote}
        />
      ))}
    </div>
  );
}