import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ProblemTable } from './ProblemTable';
import { VirtualizedProblemList } from './VirtualizedProblemList'; // <-- Import
import React from 'react';
import type { Topic, Item } from '@/types/models';

// Configurable threshold for performance tuning
export const VIRTUALIZATION_THRESHOLD = 300;

interface Props {
  topic: Topic;
  items: Item[];
  isOpen: boolean;
  onToggle: () => void;
  completedIds: Set<string>;
  notesMap: Map<string, string>;
  scrollRef: React.RefObject<HTMLDivElement | null>; // <-- NEW
  onToggleComplete: (itemId: string, isCompleted: boolean) => Promise<void>;
  onSaveNote: (itemId: string, content: string) => Promise<void>;
}

export const TopicModule = React.memo(function TopicModule({ 
  topic, items, isOpen, onToggle, completedIds, notesMap, scrollRef, onToggleComplete, onSaveNote 
}: Props) {
  
  const completedCount = items.filter(item => completedIds.has(item.id)).length;
  const totalCount = items.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;
  
  const isMassiveList = totalCount >= VIRTUALIZATION_THRESHOLD;

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-line bg-bg-raised">
      <div 
        className="flex cursor-pointer select-none items-center gap-3 px-4 py-3.5 hover:bg-bg-inset transition-colors" 
        onClick={onToggle}
      >
        <div className="w-6 shrink-0 font-sans text-[13px] font-bold text-text-faint">
          {String(topic.order).padStart(2, '0')}
        </div>
        <div className={clsx("flex-1 font-sans text-[14.5px] font-semibold transition-colors", isAllCompleted ? "text-text-dim" : "text-text-main")}>
          {topic.name}
        </div>
        
        {topic.type && (
          <div className={clsx('shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider', topic.type === 'theory' ? 'bg-theory-bg text-theory' : 'bg-easy-bg text-accent')}>
            {topic.type}
          </div>
        )}

        <div className="shrink-0 text-[12px] text-text-faint">
          {totalCount > 0 ? <span className={clsx({ 'text-accent': isAllCompleted })}>{completedCount} / {totalCount}</span> : 'concept only'}
        </div>
        <ChevronRight size={16} className={clsx('shrink-0 text-text-faint transition-transform duration-200', { 'rotate-90': isOpen })} />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-line-soft px-0 md:px-4 pb-4 pt-2">
              {topic.subtopics && topic.subtopics.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5 px-4 md:px-0">
                  {topic.subtopics.map((sub) => (
                    <span key={sub} className="rounded-full border border-line bg-bg-inset px-2.5 py-1 text-[11.5px] text-text-dim">
                      {sub}
                    </span>
                  ))}
                </div>
              )}
              
              {/* DYNAMIC VIRTUALIZATION */}
              {isMassiveList ? (
                <VirtualizedProblemList 
                  items={items} 
                  completedIds={completedIds} 
                  notesMap={notesMap} 
                  scrollRef={scrollRef}
                  onToggleComplete={onToggleComplete} 
                  onSaveNote={onSaveNote} 
                />
              ) : (
                <ProblemTable 
                  items={items} 
                  completedIds={completedIds} 
                  notesMap={notesMap} 
                  onToggleComplete={onToggleComplete} 
                  onSaveNote={onSaveNote} 
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}, (prev, next) => {
  return prev.isOpen === next.isOpen &&
         prev.items === next.items &&
         prev.completedIds === next.completedIds &&
         prev.notesMap === next.notesMap;
});