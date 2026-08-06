import { useMemo } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import type { Item } from '@/types/models';

export function useRoadmapProcessor(items: Item[] | undefined) {
  const { searchQuery, difficultyFilter } = useRoadmapStore();

  return useMemo(() => {
    if (!items) return { filteredItems: [], itemsByTopic: new Map(), itemsByCompany: new Map(), companyStats: [] };

    const filteredItems: Item[] = [];
    const itemsByTopic = new Map<string, Item[]>();
    const itemsByCompany = new Map<string, Item[]>();
    const companyCounts = new Map<string, number>();

    const query = searchQuery.toLowerCase().trim();

    for (const item of items) {
      // 1. Apply Filters
      if (difficultyFilter !== 'All' && item.difficulty !== difficultyFilter) continue;
      
      if (query) {
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCompany = item.companies?.some((c) => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany) continue;
      }

      filteredItems.push(item);

      // 2. Group by Topic (O(1) lookup later)
      for (const topicId of item.topicIds) {
        if (!itemsByTopic.has(topicId)) itemsByTopic.set(topicId, []);
        itemsByTopic.get(topicId)!.push(item);
      }

      // 3. Group by Company and Count
      if (item.companies) {
        for (const company of item.companies) {
          if (!itemsByCompany.has(company)) itemsByCompany.set(company, []);
          itemsByCompany.get(company)!.push(item);
          companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
        }
      }
    }

    // 4. Sort Company Stats
    const companyStats = Array.from(companyCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return { filteredItems, itemsByTopic, itemsByCompany, companyStats };
  }, [items, searchQuery, difficultyFilter]);
}