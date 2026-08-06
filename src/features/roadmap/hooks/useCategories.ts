import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/firebase/categories';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    // Categories rarely change, cache them for 24 hours to save Firestore reads
    staleTime: 1000 * 60 * 60 * 24, 
  });
}