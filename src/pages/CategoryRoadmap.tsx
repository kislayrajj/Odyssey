import { useParams } from 'react-router-dom';
import { useTopics, useItems } from '@/features/roadmap/hooks/useRoadmapData';
import { useCategories } from '@/features/roadmap/hooks/useCategories';
import { RoadmapToolbar } from '@/features/roadmap/components/RoadmapToolbar';
import { TopicModule } from '@/features/roadmap/components/TopicModule';
import { useEffect } from 'react';
import { useRoadmapStore } from '@/features/roadmap/store/roadmapStore';

export function CategoryRoadmap() {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Fetch Data
  const { data: categories } = useCategories();
  const { data: topics, isLoading: topicsLoading } = useTopics(categoryId);
  const { data: items, isLoading: itemsLoading } = useItems(categoryId);
  
  // Reset filters when category changes
  const resetFilters = useRoadmapStore((state) => state.resetFilters);
  useEffect(() => {
    resetFilters();
  }, [categoryId, resetFilters]);

  const isLoading = topicsLoading || itemsLoading;
  const currentCategory = categories?.find(c => c.id === categoryId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-text-faint">
        Loading roadmap data...
      </div>
    );
  }

  if (!topics || !items) {
    return (
      <div className="flex h-full items-center justify-center text-text-faint">
        Failed to load roadmap data.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Category Meta Header */}
      <div className="border-b border-line bg-theory-bg px-6 py-2.5 text-[12px] leading-relaxed text-text-dim">
        {currentCategory?.note ? (
          <p><b>Note:</b> {currentCategory.note}</p>
        ) : (
          <p><b>{currentCategory?.title}</b> roadmap loaded.</p>
        )}
      </div>

      <RoadmapToolbar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          {topics.map((topic) => {
            // Find all items belonging to this topic
            const topicItems = items.filter((item) => item.topicIds.includes(topic.id));
            
            return (
              <TopicModule 
                key={topic.id} 
                topic={topic} 
                items={topicItems} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}