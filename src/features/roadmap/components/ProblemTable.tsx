import { DifficultyPill } from '@/components/ui/DifficultyPill';
import { CompanyBadge } from '@/components/ui/CompanyBadge';
import { CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import type { Item } from '@/types/models';

interface Props {
  items: Item[];
  completedIds: Set<string>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
}

export function ProblemTable({ items, completedIds, onToggleComplete }: Props) {
  const requireAuth = useRequireAuth();

  if (items.length === 0) {
    return <div className="py-4 text-[12.5px] italic text-text-faint">No problems match the current filters.</div>;
  }

  return (
    <div className="overflow-x-auto">
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
          {items.map((item) => {
            const isCompleted = completedIds.has(item.id);
            const recentSet = new Set(item.recentCompanies || []);
            
            return (
              <tr key={item.id} className="group border-b border-line-soft hover:bg-bg-inset">
                <td className="px-2 py-2 align-middle text-center">
                  <button
                    // Intercept the click with requireAuth!
                    onClick={() => requireAuth('progress', () => onToggleComplete(item.id, !isCompleted))}
                    className="text-text-faint hover:text-accent transition-colors focus:outline-none"
                  >
                    {isCompleted ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} />}
                  </button>
                </td>
                <td className="px-2 py-2 text-[13px] align-middle">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className={clsx("hover:text-accent hover:underline transition-colors", isCompleted ? "text-text-dim line-through" : "text-text-main")}>
                    {item.title}
                  </a>
                  {item.note && <div className="mt-1 text-[11px] text-text-faint">{item.note}</div>}
                </td>
                <td className="px-2 py-2 align-middle"><DifficultyPill difficulty={item.difficulty} /></td>
                <td className="px-2 py-2 align-middle">
                  {item.companies && item.companies.length > 0 ? (
                    <div className="flex max-w-85 flex-wrap gap-1">
                      {item.companies.map((company) => (
                        <CompanyBadge key={company} name={company} isRecent={recentSet.has(company)} />
                      ))}
                    </div>
                  ) : <span className="text-[11.5px] italic text-text-faint">no company data</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}