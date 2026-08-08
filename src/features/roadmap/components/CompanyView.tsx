import { useEffect, useState } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import { VirtualizedProblemList } from './VirtualizedProblemList';
import { clsx } from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Item } from '@/types/models';

interface Props {
  allCompanyStats: { name: string; count: number }[];
  filteredCompanyCounts: Map<string, number>;
  itemsByCompany: Map<string, Item[]>;
  completedIds: Set<string>;
  notesMap: Map<string, string>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export function CompanyView({ 
  allCompanyStats, filteredCompanyCounts, itemsByCompany, completedIds, notesMap, scrollRef, onToggleComplete, onSaveNote 
}: Props) {
  const { activeCompany, setActiveCompany } = useRoadmapStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!activeCompany && allCompanyStats.length > 0) setActiveCompany(allCompanyStats[0].name);
  }, [activeCompany, allCompanyStats, setActiveCompany]);

  if (allCompanyStats.length === 0) return <div className="py-8 text-center text-[13px] italic text-text-faint">No company data available.</div>;

  const activeItems = activeCompany ? itemsByCompany.get(activeCompany) || [] : [];
  
  const INITIAL_COUNT = 12;
  const visibleCompanies = isExpanded ? allCompanyStats : allCompanyStats.slice(0, INITIAL_COUNT);
  const hiddenCount = allCompanyStats.length - INITIAL_COUNT;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1.5 py-2">
        {visibleCompanies.map(({ name }) => {
          const currentCount = filteredCompanyCounts.get(name) || 0;
          const isActive = activeCompany === name;
          const isZero = currentCount === 0;

          return (
            <button 
              key={name} 
              onClick={() => setActiveCompany(name)} 
              className={clsx(
                'rounded-full border px-3 py-1.5 font-sans text-[11.5px] font-semibold transition-colors', 
                isActive ? 'border-accent-dim bg-accent-dim text-[#04140a]' : isZero ? 'border-line-soft bg-bg text-text-faint opacity-60 hover:opacity-100 hover:bg-bg-inset' : 'border-line bg-bg-inset text-text-dim hover:bg-bg-raised hover:text-text-main'
              )}
            >
              {name} <span className={clsx("ml-1.5", isActive ? "opacity-70" : "opacity-50")}>{currentCount}</span>
            </button>
          );
        })}
        
        {hiddenCount > 0 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-full border border-dashed border-line bg-bg px-3 py-1.5 font-sans text-[11.5px] font-semibold text-text-faint hover:text-text-main transition-colors"
          >
            {isExpanded ? <>Show less <ChevronUp size={12} /></> : <>+{hiddenCount} more <ChevronDown size={12} /></>}
          </button>
        )}
      </div>
      
      <VirtualizedProblemList 
        items={activeItems} 
        completedIds={completedIds} 
        notesMap={notesMap} 
        scrollRef={scrollRef}
        onToggleComplete={onToggleComplete} 
        onSaveNote={onSaveNote} 
      />
    </div>
  );
}