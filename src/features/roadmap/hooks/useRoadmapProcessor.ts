import { useMemo, useDeferredValue } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import type { Item } from '@/types/models';

export function useRoadmapProcessor(items: Item[] | undefined) {
  const { searchQuery, difficultyFilter } = useRoadmapStore();
  
  // PERFORMANCE: Defer the search query. The input stays at 60fps, 
  // while the heavy filtering happens in the background.
  const deferredQuery = useDeferredValue(searchQuery);

  return useMemo(() => {
    if (!items) return { filteredItems: [], itemsByTopic: new Map(), itemsByCompany: new Map(), companyStats: [] };

    const filteredItems: Item[] = [];
    const itemsByTopic = new Map<string, Item[]>();
    const itemsByCompany = new Map<string, Item[]>();
    const companyCounts = new Map<string, number>();

    const query = deferredQuery.toLowerCase().trim();

    for (const item of items) {
      if (difficultyFilter !== 'All' && item.difficulty !== difficultyFilter) continue;
      
      if (query) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCompany = item.companies?.some((c) => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany) continue;
      }

      filteredItems.push(item);

      for (const topicId of item.topicIds) {
        if (!itemsByTopic.has(topicId)) itemsByTopic.set(topicId, []);
        itemsByTopic.get(topicId)!.push(item);
      }

      if (item.companies) {
        for (const company of item.companies) {
          if (!itemsByCompany.has(company)) itemsByCompany.set(company, []);
          itemsByCompany.get(company)!.push(item);
          companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
        }
      }
    }

    const companyStats = Array.from(companyCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { filteredItems, itemsByTopic, itemsByCompany, companyStats };
  }, [items, deferredQuery, difficultyFilter]);
}