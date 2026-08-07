import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useBlocker } from 'react-router-dom';
import { useTopics, useItems } from '@/features/roadmap/hooks/useRoadmapData';
import { useCategories } from '@/features/roadmap/hooks/useCategories';
import { useRoadmapStore } from '@/features/roadmap/store/roadmapStore';
import { useRoadmapProcessor } from '@/features/roadmap/hooks/useRoadmapProcessor';
import { useCategoryProgress, useToggleProgress } from '@/features/roadmap/hooks/useProgress';
import { useCategoryNotes, useUpdateNote } from '@/features/roadmap/hooks/useNotes';
import { useEditorStore } from '@/features/roadmap/store/editorStore';
import type { UserNote } from '@/types/models';

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
  
  const { data: progressData } = useCategoryProgress(categoryId);
  const { mutateAsync: toggleComplete } = useToggleProgress(categoryId!);
  
  const { data: notesData } = useCategoryNotes(categoryId);
  const { mutateAsync: saveNote } = useUpdateNote(categoryId!);
  
  const completedIds = useMemo(() => new Set(progressData?.completed || []), [progressData]);
  const notesMap = useMemo(() => {
    const map = new Map<string, string>();
    notesData?.forEach((note: UserNote) => map.set(note.itemId, note.content));
    return map;
  }, [notesData]);

  const { viewMode, resetFilters } = useRoadmapStore();
  const { filteredItems, itemsByTopic, itemsByCompany, companyStats } = useRoadmapProcessor(items);

  // --- ROUTE BLOCKER LOGIC ---
  const isDirty = useEditorStore((state) => state.isDirty);
  const blockRoute = useEditorStore((state) => state.blockRoute);
  
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => 
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      blockRoute(() => blocker.proceed(), () => blocker.reset());
    }
  }, [blocker.state, blockRoute, blocker]);

  // --- ACCORDION LOGIC ---
  const currentCategory = categories?.find(c => c.id === categoryId);
  const isAccordionMode = currentCategory?.uiConfig?.accordionMode ?? false;
  
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Reset state when category changes
  useEffect(() => {
    resetFilters();
    setExpandedTopics(new Set());
  }, [categoryId, resetFilters]);

  const handleToggleTopic = useCallback((topicId: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        if (isAccordionMode) next.clear(); // Close others if accordion mode
        next.add(topicId);
      }
      return next;
    });
  }, [isAccordionMode]);

  const isLoading = topicsLoading || itemsLoading;

  if (isLoading) return <div className="flex h-full items-center justify-center text-text-faint">Loading roadmap data...</div>;
  if (!topics || !items) return <div className="flex h-full items-center justify-center text-text-faint">Failed to load roadmap data.</div>;

  return (
    <div className="flex h-full flex-col">
      <RoadmapModeBar category={currentCategory} />
      <RoadmapToolbar />
      <RoadmapStats items={filteredItems} completedIds={completedIds} />

      <div className="flex-1 overflow-y-auto p-0 md:p-6">
        <div className="mx-auto max-w-5xl">
          {viewMode === 'syllabus' ? (
            <div className="p-4 md:p-0">
              {topics.map((topic) => (
                <TopicModule 
                  key={topic.id} 
                  topic={topic} 
                  items={itemsByTopic.get(topic.id) || []} 
                  isOpen={expandedTopics.has(topic.id)}
                  onToggle={() => handleToggleTopic(topic.id)}
                  completedIds={completedIds}
                  notesMap={notesMap}
                  // FIX: Wrap in arrow functions to match expected arguments
                  onToggleComplete={(itemId, isCompleted) => toggleComplete({ itemId, isCompleted })}
                  onSaveNote={(itemId, content) => saveNote({ itemId, content })}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 md:p-0">
              <CompanyView 
                companyStats={companyStats} 
                itemsByCompany={itemsByCompany} 
                completedIds={completedIds}
                notesMap={notesMap}
                // FIX: Wrap in arrow functions to match expected arguments
                onToggleComplete={(itemId, isCompleted) => toggleComplete({ itemId, isCompleted })}
                onSaveNote={(itemId, content) => saveNote({ itemId, content })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}