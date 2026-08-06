import type { Item } from '@/types/models';

interface Props {
  items: Item[];
}

export function RoadmapStats({ items }: Props) {
  const easy = items.filter((i) => i.difficulty === 'Easy').length;
  const medium = items.filter((i) => i.difficulty === 'Medium').length;
  const hard = items.filter((i) => i.difficulty === 'Hard').length;
  const total = items.length || 1; // Prevent division by zero

  return (
    <div className="flex flex-wrap items-center gap-5 border-b border-line-soft bg-bg px-6 py-2.5 text-[12px] text-text-faint">
      <div>
        <b className="font-semibold text-text-main">{items.length}</b> shown
      </div>
      
      <div className="flex h-1.5 w-40 overflow-hidden rounded-full bg-line-soft">
        <div className="bg-easy" style={{ width: `${(easy / total) * 100}%` }} />
        <div className="bg-medium" style={{ width: `${(medium / total) * 100}%` }} />
        <div className="bg-hard" style={{ width: `${(hard / total) * 100}%` }} />
      </div>
      
      <div className="flex gap-3.5">
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-sm bg-easy" /> {easy} easy
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-sm bg-medium" /> {medium} medium
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-sm bg-hard" /> {hard} hard
        </span>
      </div>
    </div>
  );
}