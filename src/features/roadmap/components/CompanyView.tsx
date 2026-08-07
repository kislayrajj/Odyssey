import { useEffect } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import { ProblemTable } from './ProblemTable';
import { clsx } from 'clsx';
import type { Item } from '@/types/models';

interface Props {
  companyStats: { name: string; count: number }[];
  itemsByCompany: Map<string, Item[]>;
  completedIds: Set<string>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
}

export function CompanyView({ companyStats, itemsByCompany, completedIds, onToggleComplete }: Props) {
  const { activeCompany, setActiveCompany } = useRoadmapStore();

  useEffect(() => {
    if (!activeCompany && companyStats.length > 0) setActiveCompany(companyStats[0].name);
  }, [activeCompany, companyStats, setActiveCompany]);

  if (companyStats.length === 0) return <div className="py-8 text-center text-[13px] italic text-text-faint">No company data matches the current filters.</div>;

  const activeItems = activeCompany ? itemsByCompany.get(activeCompany) || [] : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5 py-2">
        {companyStats.map(({ name, count }) => (
          <button key={name} onClick={() => setActiveCompany(name)} className={clsx('rounded-full border px-3 py-1.5 font-sans text-[11.5px] font-semibold transition-colors', activeCompany === name ? 'border-accent-dim bg-accent-dim text-[#04140a]' : 'border-line bg-bg-inset text-text-dim hover:bg-bg-raised hover:text-text-main')}>
            {name} <span className="ml-1.5 opacity-70">{count}</span>
          </button>
        ))}
      </div>
      <ProblemTable items={activeItems} completedIds={completedIds} onToggleComplete={onToggleComplete} />
    </div>
  );
}