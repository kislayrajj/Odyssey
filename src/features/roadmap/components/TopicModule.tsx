import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { ProblemTable } from './ProblemTable';
import type { Topic, Item } from '@/types/models';

interface Props {
  topic: Topic;
  items: Item[];
  completedIds: Set<string>;
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
}

export function TopicModule({ topic, items, completedIds, onToggleComplete }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const completedCount = items.filter(item => completedIds.has(item.id)).length;
  const totalCount = items.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-line bg-bg-raised">
      <div className="flex cursor-pointer select-none items-center gap-3 px-4 py-3.5 hover:bg-bg-inset" onClick={() => setIsOpen(!isOpen)}>
        <div className="w-6 shrink-0 font-sans text-[13px] font-bold text-text-faint">{String(topic.order).padStart(2, '0')}</div>
        <div className={clsx("flex-1 font-sans text-[14.5px] font-semibold transition-colors", isAllCompleted ? "text-text-dim" : "text-text-main")}>{topic.name}</div>
        {topic.type && (
          <div className={clsx('shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider', topic.type === 'theory' ? 'bg-theory-bg text-theory' : 'bg-easy-bg text-accent')}>
            {topic.type}
          </div>
        )}
        <div className="shrink-0 text-[12px] text-text-faint">
          {totalCount > 0 ? <span className={clsx({ 'text-accent': isAllCompleted })}>{completedCount} / {totalCount}</span> : 'concept only'}
        </div>
        <ChevronRight size={16} className={clsx('shrink-0 text-text-faint transition-transform duration-150', { 'rotate-90': isOpen })} />
      </div>
      {isOpen && (
        <div className="border-t border-line-soft px-4 pb-4 pt-2">
          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {topic.subtopics.map((sub) => <span key={sub} className="rounded-full border border-line bg-bg-inset px-2.5 py-1 text-[11.5px] text-text-dim">{sub}</span>)}
            </div>
          )}
          <ProblemTable items={items} completedIds={completedIds} onToggleComplete={onToggleComplete} />
        </div>
      )}
    </div>
  );
}