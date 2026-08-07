import { useEffect, useState } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import { ProblemTable } from './ProblemTable';
import { clsx } from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Item } from '@/types/models';

interface Props {
  companyStats: { name: string; count: number }[];
  itemsByCompany: Map<string, Item[]>;
  completedIds: Set<string>;
  notesMap: Map<string, string>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export function CompanyView({ companyStats, itemsByCompany, completedIds, notesMap, onToggleComplete, onSaveNote }: Props) {
  const { activeCompany, setActiveCompany } = useRoadmapStore();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!activeCompany && companyStats.length > 0) setActiveCompany(companyStats[0].name);
  }, [activeCompany, companyStats, setActiveCompany]);

  if (companyStats.length === 0) return <div className="py-8 text-center text-[13px] italic text-text-faint">No company data matches the current filters.</div>;

  const activeItems = activeCompany ? itemsByCompany.get(activeCompany) || [] : [];
  
  const INITIAL_COUNT = 12;
  const visibleCompanies = isExpanded ? companyStats : companyStats.slice(0, INITIAL_COUNT);
  const hiddenCount = companyStats.length - INITIAL_COUNT;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1.5 py-2">
        {visibleCompanies.map(({ name, count }) => (
          <button 
            key={name} 
            onClick={() => setActiveCompany(name)} 
            className={clsx(
              'rounded-full border px-3 py-1.5 font-sans text-[11.5px] font-semibold transition-colors', 
              activeCompany === name ? 'border-accent-dim bg-accent-dim text-[#04140a]' : 'border-line bg-bg-inset text-text-dim hover:bg-bg-raised hover:text-text-main'
            )}
          >
            {name} <span className="ml-1.5 opacity-70">{count}</span>
          </button>
        ))}
        
        {hiddenCount > 0 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-full border border-dashed border-line bg-bg px-3 py-1.5 font-sans text-[11.5px] font-semibold text-text-faint hover:text-text-main transition-colors"
          >
            {isExpanded ? (
              <>Show less <ChevronUp size={12} /></>
            ) : (
              <>+{hiddenCount} more <ChevronDown size={12} /></>
            )}
          </button>
        )}
      </div>
      
      <ProblemTable 
        items={activeItems} 
        completedIds={completedIds} 
        notesMap={notesMap} 
        onToggleComplete={onToggleComplete} 
        onSaveNote={onSaveNote} 
      />
    </div>
  );
}