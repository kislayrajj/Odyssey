import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTopics, useItems } from '@/features/roadmap/hooks/useRoadmapData';
import { useCategories } from '@/features/roadmap/hooks/useCategories';
import { useRoadmapStore } from '@/features/roadmap/store/roadmapStore';

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
  
  const { viewMode, searchQuery, difficultyFilter, resetFilters } = useRoadmapStore();

  // Reset filters when switching categories
  useEffect(() => {
    resetFilters();
  }, [categoryId, resetFilters]);

  // Derive globally filtered items for the Stats Strip
  const globallyFilteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      if (difficultyFilter !== 'All' && item.difficulty !== difficultyFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCompany = item.companies?.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany) return false;
      }
      return true;
    });
  }, [items, difficultyFilter, searchQuery]);

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

      <RoadmapModeBar />
      <RoadmapToolbar />
      <RoadmapStats items={globallyFilteredItems} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-5xl">
          {viewMode === 'syllabus' ? (
            topics.map((topic) => {
              const topicItems = items.filter((item) => item.topicIds.includes(topic.id));
              return <TopicModule key={topic.id} topic={topic} items={topicItems} />;
            })
          ) : (
            <CompanyView items={items} />
          )}
        </div>
      </div>
    </div>
  );
}