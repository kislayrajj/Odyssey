import { useRoadmapStore } from '../store/roadmapStore';
import { clsx } from 'clsx';

export function RoadmapModeBar() {
  const { viewMode, setViewMode } = useRoadmapStore();

  return (
    <div className="flex border-b border-line bg-bg-inset px-6">
      <button
        onClick={() => setViewMode('syllabus')}
        className={clsx(
          'mr-6 border-b-2 pb-3 pt-3 font-sans text-[12.5px] font-semibold tracking-wide transition-colors',
          viewMode === 'syllabus' ? 'border-accent text-text-main' : 'border-transparent text-text-faint hover:text-text-dim'
        )}
      >
        Syllabus Roadmap
        <span className="ml-1.5 font-mono text-[11px] font-normal text-text-faint">start &rarr; end</span>
      </button>
      <button
        onClick={() => setViewMode('company')}
        className={clsx(
          'mr-6 border-b-2 pb-3 pt-3 font-sans text-[12.5px] font-semibold tracking-wide transition-colors',
          viewMode === 'company' ? 'border-accent text-text-main' : 'border-transparent text-text-faint hover:text-text-dim'
        )}
      >
        By Company
      </button>
    </div>
  );
}