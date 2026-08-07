import { useState } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import { useNavigationGuard } from '../hooks/useNavigationGuard';
import { RoadmapInfoModal } from './RoadmapInfoModal';
import { Info } from 'lucide-react';
import { clsx } from 'clsx';
import type { Category } from '@/types/models';

interface Props {
  category?: Category;
}

export function RoadmapModeBar({ category }: Props) {
  const { viewMode, setViewMode } = useRoadmapStore();
  const guard = useNavigationGuard();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const primaryTitle = category?.uiConfig?.primaryViewTitle || 'Roadmap';
  const primarySubtitle = category?.uiConfig?.primaryViewSubtitle || 'start → end';

  return (
    <>
      <div className="flex items-center justify-between border-b border-line bg-bg-inset px-6">
        <div className="flex">
          <button
            onClick={() => guard(() => setViewMode('syllabus'))}
            className={clsx(
              'mr-6 border-b-2 pb-3 pt-3 font-sans text-[12.5px] font-semibold tracking-wide transition-colors',
              viewMode === 'syllabus' ? 'border-accent text-text-main' : 'border-transparent text-text-faint hover:text-text-dim'
            )}
          >
            {primaryTitle}
            <span className="ml-1.5 font-mono text-[11px] font-normal text-text-faint">{primarySubtitle}</span>
          </button>
          
          <button
            onClick={() => guard(() => setViewMode('company'))}
            className={clsx(
              'mr-6 border-b-2 pb-3 pt-3 font-sans text-[12.5px] font-semibold tracking-wide transition-colors',
              viewMode === 'company' ? 'border-accent text-text-main' : 'border-transparent text-text-faint hover:text-text-dim'
            )}
          >
            By Company
          </button>
        </div>

        {category && (
          <button 
            onClick={() => setIsInfoOpen(true)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-text-faint hover:text-text-main transition-colors"
          >
            <Info size={14} />
            <span className="hidden sm:inline-block">About</span>
          </button>
        )}
      </div>

      {category && (
        <RoadmapInfoModal 
          category={category} 
          isOpen={isInfoOpen} 
          onClose={() => setIsInfoOpen(false)} 
        />
      )}
    </>
  );
}