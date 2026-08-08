import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ProblemRow } from './ProblemRow';
import { MobileProblemCard } from './MobileProblemCard';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Item } from '@/types/models';

interface Props {
  items: Item[];
  completedIds: Set<string>;
  notesMap: Map<string, string>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export function VirtualizedProblemList({ items, completedIds, notesMap, scrollRef, onToggleComplete, onSaveNote }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const containerRef = useRef<HTMLDivElement | HTMLTableElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  const toggleExpand = useCallback((id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    const calculateOffset = () => {
      if (containerRef.current && scrollRef.current) {
        const scrollRect = scrollRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        setOffsetY(containerRect.top - scrollRect.top + scrollRef.current.scrollTop);
      }
    };

    calculateOffset();

    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        calculateOffset();
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [scrollRef, isDesktop, items.length]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => isDesktop ? 45 : 80,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  
  const rawPaddingTop = virtualItems.length > 0 ? virtualItems[0]?.start || 0 : 0;
  const paddingTop = Math.max(0, rawPaddingTop - offsetY);
  
  const paddingBottom = virtualItems.length > 0 ? virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end || 0) : 0;

  if (items.length === 0) {
    return <div className="py-4 text-[12.5px] italic text-text-faint">No problems match the current filters.</div>;
  }

  if (!scrollRef.current) return null;

  if (isDesktop) {
    return (
      <div className="w-full overflow-x-auto">
        <table ref={containerRef as React.RefObject<HTMLTableElement>} className="mt-2 w-full table-fixed border-collapse">
          <thead>
            <tr>
              {/* FIX: Adjusted column widths to match ProblemTable */}
              <th className="w-12 border-b border-line px-2 py-1.5 text-center text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Status</th>
              <th className="w-[55%] border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Problem</th>
              <th className="w-[12%] border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Difficulty</th>
              <th className="w-[33%] border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">Companies</th>
            </tr>
          </thead>
          
          {paddingTop > 0 && <tbody><tr><td colSpan={4} style={{ height: paddingTop }} /></tr></tbody>}
          
          {virtualItems.map((virtualRow) => {
            const item = items[virtualRow.index];
            return (
              <ProblemRow 
                key={item.id} 
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                item={item} 
                isCompleted={completedIds.has(item.id)} 
                noteContent={notesMap.get(item.id)}
                isExpanded={expandedRows.has(item.id)}
                onToggleExpand={() => toggleExpand(item.id)}
                onToggleComplete={onToggleComplete} 
                onSaveNote={onSaveNote}
              />
            );
          })}

          {paddingBottom > 0 && <tbody><tr><td colSpan={4} style={{ height: paddingBottom }} /></tr></tbody>}
        </table>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef as React.RefObject<HTMLDivElement>} 
      className="flex flex-col border-t border-line-soft mt-2 relative w-full" 
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualItems.map((virtualRow) => {
        const item = items[virtualRow.index];
        const adjustedStart = Math.max(0, virtualRow.start - offsetY);
        
        return (
          <div
            key={item.id}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${Math.round(adjustedStart)}px)`,
            }}
          >
            <MobileProblemCard
              item={item}
              isCompleted={completedIds.has(item.id)}
              noteContent={notesMap.get(item.id)}
              isExpanded={expandedRows.has(item.id)}
              onToggleExpand={() => toggleExpand(item.id)}
              onToggleComplete={onToggleComplete}
              onSaveNote={onSaveNote}
            />
          </div>
        );
      })}
    </div>
  );
}