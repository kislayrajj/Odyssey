import { useMemo, useEffect } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import { ProblemTable } from './ProblemTable';
import { clsx } from 'clsx';
import type { Item } from '@/types/models';

interface Props {
  items: Item[];
}

export function CompanyView({ items }: Props) {
  const { activeCompany, setActiveCompany } = useRoadmapStore();

  // Derive companies and their counts from the items array
  const companyData = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      item.companies?.forEach((company) => {
        counts[company] = (counts[company] || 0) + 1;
      });
    });

    // Sort by count descending, then alphabetically
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [items]);

  // Auto-select the first company if none is selected
  useEffect(() => {
    if (!activeCompany && companyData.length > 0) {
      setActiveCompany(companyData[0].name);
    }
  }, [activeCompany, companyData, setActiveCompany]);

  // Filter items for the active company
  const companyItems = useMemo(() => {
    if (!activeCompany) return [];
    return items.filter((item) => item.companies?.includes(activeCompany));
  }, [items, activeCompany]);

  if (companyData.length === 0) {
    return (
      <div className="py-8 text-center text-[13px] italic text-text-faint">
        No company data available for this category.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Company Tabs */}
      <div className="flex flex-wrap gap-1.5 py-2">
        {companyData.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => setActiveCompany(name)}
            className={clsx(
              'rounded-full border px-3 py-1.5 font-sans text-[11.5px] font-semibold transition-colors',
              activeCompany === name
                ? 'border-accent-dim bg-accent-dim text-[#04140a]'
                : 'border-line bg-bg-inset text-text-dim hover:bg-bg-raised hover:text-text-main'
            )}
          >
            {name}
            <span className="ml-1.5 opacity-70">{count}</span>
          </button>
        ))}
      </div>

      {/* Reused Problem Table */}
      <ProblemTable items={companyItems} />
    </div>
  );
}