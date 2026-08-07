import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoryProgress, toggleItemCompletion, type CategoryProgress } from '@/services/firebase/progress';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useSyncStore } from '@/store/syncStore';

export function useCategoryProgress(categoryId: string | undefined) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['progress', user?.uid, categoryId],
    queryFn: () => getCategoryProgress(user!.uid, categoryId!),
    // If no user, don't fetch. The UI will default to empty progress.
    enabled: !!user?.uid && !!categoryId, 
  });
}

export function useToggleProgress(categoryId: string) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setSyncStatus = useSyncStore((state) => state.setStatus);

  return useMutation({
    mutationFn: async ({ itemId, isCompleted }: { itemId: string; isCompleted: boolean }) => {
      if (!user) throw new Error('Not authenticated');
      setSyncStatus('syncing');
      await toggleItemCompletion(user.uid, categoryId, itemId, isCompleted);
    },
    onMutate: async ({ itemId, isCompleted }) => {
      const queryKey = ['progress', user?.uid, categoryId];
      await queryClient.cancelQueries({ queryKey });
      const previousProgress = queryClient.getQueryData<CategoryProgress>(queryKey);

      queryClient.setQueryData<CategoryProgress>(queryKey, (old) => {
        const currentCompleted = old?.completed || [];
        return {
          completed: isCompleted
            ? [...currentCompleted, itemId]
            : currentCompleted.filter((id) => id !== itemId),
        };
      });
      return { previousProgress };
    },
    onError: (err, variables, context) => {
      setSyncStatus('error');
      if (context?.previousProgress) {
        queryClient.setQueryData(['progress', user?.uid, categoryId], context.previousProgress);
      }
    },
    onSuccess: () => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('online'), 2000);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', user?.uid, categoryId] });
    },
  });
}