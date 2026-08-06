import { useRoadmapStore } from '../store/roadmapStore';

export function RoadmapToolbar() {
  const { searchQuery, setSearchQuery, difficultyFilter, setDifficultyFilter } = useRoadmapStore();

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line bg-bg px-6 py-3">
      <input
        type="text"
        placeholder="Search problems or companies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="min-w-[200px] flex-1 rounded-md border border-line bg-bg-inset px-3 py-2 font-mono text-[13px] text-text-main placeholder:text-text-faint focus:border-accent-dim focus:outline-none"
      />
      
      <select
        value={difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value as any)}
        className="rounded-md border border-line bg-bg-inset px-3 py-2 font-mono text-[12.5px] text-text-dim focus:outline-none"
      >
        <option value="All">All difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
}