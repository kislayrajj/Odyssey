import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTopics, useItems } from '@/features/roadmap/hooks/useRoadmapData';
import { useCategories } from '@/features/roadmap/hooks/useCategories';
import { useRoadmapStore } from '@/features/roadmap/store/roadmapStore';
import { useRoadmapProcessor } from '@/features/roadmap/hooks/useRoadmapProcessor';
import { useCategoryProgress, useToggleProgress } from '@/features/roadmap/hooks/useProgress';

import { RoadmapModeBar } from '@/features/roadmap/components/RoadmapModeBar';
import { RoadmapToolbar } from '@/features/roadmap/components/RoadmapToolbar';
import { RoadmapStats } from '@/features/roadmap/components/RoadmapStats';
import { TopicModule } from '@/features/roadmap/components/TopicModule';
import { CompanyView } from '@/features/roadmap/components/CompanyView';

export function CategoryRoadmap() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const { data: categories } = useCategories();
  const { data: topics, isLoading: topicsLoading } = useTopics(categoryId);
  const { data: items, isLoading: itemsLoading } = useItems(categoryId);
  
  // Progress Data (Returns empty if user is not logged in)
  const { data: progressData } = useCategoryProgress(categoryId);
  const { mutateAsync: toggleComplete } = useToggleProgress(categoryId!);
  
  const completedIds = useMemo(() => new Set(progressData?.completed || []), [progressData]);

  const { viewMode, resetFilters } = useRoadmapStore();
  const { filteredItems, itemsByTopic, itemsByCompany, companyStats } = useRoadmapProcessor(items);

  useEffect(() => {
    resetFilters();
  }, [categoryId, resetFilters]);

  const isLoading = topicsLoading || itemsLoading;
  const currentCategory = categories?.find(c => c.id === categoryId);

  if (isLoading) return <div className="flex h-full items-center justify-center text-text-faint">Loading roadmap data...</div>;
  if (!topics || !items) return <div className="flex h-full items-center justify-center text-text-faint">Failed to load roadmap data.</div>;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line bg-theory-bg px-6 py-2.5 text-[12px] leading-relaxed text-text-dim">
        {currentCategory?.note ? <p><b>Note:</b> {currentCategory.note}</p> : <p><b>{currentCategory?.title}</b> roadmap loaded.</p>}
      </div>

      <RoadmapModeBar category={currentCategory} />
      <RoadmapToolbar />
      <RoadmapStats items={filteredItems} completedIds={completedIds} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          {viewMode === 'syllabus' ? (
            topics.map((topic) => (
              <TopicModule 
                key={topic.id} 
                topic={topic} 
                items={itemsByTopic.get(topic.id) || []} 
                completedIds={completedIds}
                onToggleComplete={(itemId, isCompleted) => toggleComplete({ itemId, isCompleted })}
              />
            ))
          ) : (
            <CompanyView 
              companyStats={companyStats} 
              itemsByCompany={itemsByCompany} 
              completedIds={completedIds}
              onToggleComplete={(itemId, isCompleted) => toggleComplete({ itemId, isCompleted })}
            />
          )}
        </div>
      </div>
    </div>
  );
}