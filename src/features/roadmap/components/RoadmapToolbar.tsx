import { useEffect, useState } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import { X, Lightbulb } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

export function RoadmapToolbar() {
  const { 
    searchQuery, setSearchQuery, 
    difficultyFilter, setDifficultyFilter, 
    hasSeenSearchPerformanceTip, markSearchPerformanceTipSeen 
  } = useRoadmapStore();
  
  const [showTempTip, setShowTempTip] = useState(false);

  // FIX: Trigger exactly once when the toolbar mounts, regardless of view or topic.
  useEffect(() => {
    if (!hasSeenSearchPerformanceTip) {
      setShowTempTip(true);
      markSearchPerformanceTipSeen(); // Latch it immediately
      
      const timer = setTimeout(() => setShowTempTip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenSearchPerformanceTip, markSearchPerformanceTipSeen]);

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line bg-bg px-6 py-3">
      <div className="relative flex-1 min-w-[200px] flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search problems or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-line bg-bg-inset px-3 py-2 pr-8 font-mono text-[13px] text-text-main placeholder:text-text-faint focus:border-accent-dim focus:outline-none"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-main transition-colors focus:outline-none"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <Tooltip 
          forceOpen={showTempTip}
          content={
            <>
              <b className="text-text-main block mb-1">Tip</b>
              Use the search bar to find problems for the best performance. Browser Ctrl/Cmd + F may not find every problem.
            </>
          }
        >
          <button className="text-theory hover:text-theory/80 transition-colors focus:outline-none p-1">
            <Lightbulb size={16} />
          </button>
        </Tooltip>
      </div>
      
      <select
        value={difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value as any)}
        className="rounded-md border border-line bg-bg-inset px-3 py-2 font-mono text-[12.5px] text-text-dim focus:outline-none cursor-pointer"
      >
        <option value="All">All difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
}