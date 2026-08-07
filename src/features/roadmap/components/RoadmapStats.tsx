import type { Item } from '@/types/models';

interface Props {
  items: Item[];
  completedIds: Set<string>; // <-- This was missing
}

export function RoadmapStats({ items, completedIds }: Props) {
  const total = items.length || 1;
  const completed = items.filter(i => completedIds.has(i.id)).length;
  const progressPercent = Math.round((completed / total) * 100) || 0;

  const easy = items.filter((i) => i.difficulty === 'Easy').length;
  const medium = items.filter((i) => i.difficulty === 'Medium').length;
  const hard = items.filter((i) => i.difficulty === 'Hard').length;

  return (
    <div className="flex flex-wrap items-center gap-5 border-b border-line-soft bg-bg px-6 py-2.5 text-[12px] text-text-faint">
      <div className="flex items-center gap-2">
        <b className="font-semibold text-text-main">{progressPercent}%</b> completed
      </div>
      
      <div className="flex h-1.5 w-32 overflow-hidden rounded-full bg-line-soft">
        <div className="bg-accent transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="h-3 w-px bg-line" /> {/* Divider */}

      <div><b className="font-semibold text-text-main">{items.length}</b> shown</div>
      
      <div className="flex gap-3.5">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-easy" /> {easy}</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-medium" /> {medium}</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-hard" /> {hard}</span>
      </div>
    </div>
  );
}