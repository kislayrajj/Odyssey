import { useMemo, useDeferredValue } from 'react';
import { useRoadmapStore } from '../store/roadmapStore';
import type { Item } from '@/types/models';

export function useRoadmapProcessor(items: Item[] | undefined) {
  const { searchQuery, difficultyFilter } = useRoadmapStore();
  const deferredQuery = useDeferredValue(searchQuery);

  return useMemo(() => {
    if (!items) {
      return { 
        filteredItems: [], 
        itemsByTopic: new Map(), 
        itemsByCompany: new Map(), 
        allCompanyStats: [],
        filteredCompanyCounts: new Map() // <-- NEW
      };
    }

    const filteredItems: Item[] = [];
    const itemsByTopic = new Map<string, Item[]>();
    const itemsByCompany = new Map<string, Item[]>();
    
    // 1. Compute stable company stats (Structure & Ordering)
    const allCompanyCounts = new Map<string, number>();
    for (const item of items) {
      if (item.companies) {
        for (const company of item.companies) {
          allCompanyCounts.set(company, (allCompanyCounts.get(company) || 0) + 1);
        }
      }
    }
    const allCompanyStats = Array.from(allCompanyCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    // 2. Filter Items
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
        }
      }
    }

    // 3. Compute dynamic counts based ONLY on filtered items
    const filteredCompanyCounts = new Map<string, number>();
    for (const item of filteredItems) {
      if (item.companies) {
        for (const company of item.companies) {
          filteredCompanyCounts.set(company, (filteredCompanyCounts.get(company) || 0) + 1);
        }
      }
    }

    return { 
      filteredItems, 
      itemsByTopic, 
      itemsByCompany, 
      allCompanyStats, 
      filteredCompanyCounts // <-- NEW
    };
  }, [items, deferredQuery, difficultyFilter]);
}