import { useRoadmapStore } from '../store/roadmapStore';
import { DifficultyPill } from '@/components/ui/DifficultyPill';
import { CompanyBadge } from '@/components/ui/CompanyBadge';
import type { Item } from '@/types/models';

interface Props {
  items: Item[];
}

export function ProblemTable({ items }: Props) {
  const { searchQuery, difficultyFilter } = useRoadmapStore();

  // Apply Filters
  const filteredItems = items.filter((item) => {
    if (difficultyFilter !== 'All' && item.difficulty !== difficultyFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesCompany = item.companies?.some((c) => c.toLowerCase().includes(q));
      if (!matchesTitle && !matchesCompany) return false;
    }
    return true;
  });

  if (items.length === 0) {
    return <div className="py-4 text-[12.5px] italic text-text-faint">No problems in this module yet — pure concept study.</div>;
  }

  if (filteredItems.length === 0) {
    return <div className="py-4 text-[12.5px] italic text-text-faint">No problems match the current filters.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="mt-2 w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">
              Problem
            </th>
            <th className="border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">
              Difficulty
            </th>
            <th className="border-b border-line px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-text-faint">
              Companies
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => {
            const recentSet = new Set(item.recentCompanies || []);
            return (
              <tr key={item.id} className="group border-b border-line-soft hover:bg-bg-inset">
                <td className="px-2 py-2 text-[13px] align-middle">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-main hover:text-accent hover:underline"
                  >
                    {item.title}
                  </a>
                  {item.note && <div className="mt-1 text-[11px] text-text-faint">{item.note}</div>}
                </td>
                <td className="px-2 py-2 align-middle">
                  <DifficultyPill difficulty={item.difficulty} />
                </td>
                <td className="px-2 py-2 align-middle">
                  {item.companies && item.companies.length > 0 ? (
                    <div className="flex max-w-[331px] flex-wrap gap-1">
                      {item.companies.map((company) => (
                        <CompanyBadge
                          key={company}
                          name={company}
                          isRecent={recentSet.has(company)}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11.5px] italic text-text-faint">no company data</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}