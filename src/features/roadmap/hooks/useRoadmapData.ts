import { useQuery } from '@tanstack/react-query';
import { getTopics, getItems } from '@/services/firebase/roadmap';

export function useTopics(categoryId: string | undefined) {
  return useQuery({
    queryKey: ['topics', categoryId],
    queryFn: () => getTopics(categoryId!),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useItems(categoryId: string | undefined) {
  return useQuery({
    queryKey: ['items', categoryId],
    queryFn: () => getItems(categoryId!),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}