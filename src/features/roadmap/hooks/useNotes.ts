import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoryNotes, updateNote } from '@/services/firebase/notes';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useSyncStore } from '@/store/syncStore';
import type { UserNote } from '@/types/models';

export function useCategoryNotes(categoryId: string | undefined) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['notes', user?.uid, categoryId],
    queryFn: () => getCategoryNotes(user!.uid, categoryId!),
    enabled: !!user?.uid && !!categoryId,
  });
}

export function useUpdateNote(categoryId: string) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setSyncStatus = useSyncStore((state) => state.setStatus);

  return useMutation({
    mutationFn: async ({ itemId, content }: { itemId: string; content: string }) => {
      if (!user) throw new Error('Not authenticated');
      setSyncStatus('syncing');
      await updateNote(user.uid, categoryId, itemId, content);
    },
    onMutate: async ({ itemId, content }) => {
      const queryKey = ['notes', user?.uid, categoryId];
      await queryClient.cancelQueries({ queryKey });
      const previousNotes = queryClient.getQueryData<UserNote[]>(queryKey);

      queryClient.setQueryData<UserNote[]>(queryKey, (old = []) => {
        const filtered = old.filter(n => n.itemId !== itemId);
        if (!content.trim()) return filtered;
        return [...filtered, { itemId, content, updatedAt: new Date().toISOString() }];
      });

      return { previousNotes };
    },
    onError: (_err, _variables, context) => {
      setSyncStatus('error');
      if (context?.previousNotes) {
        queryClient.setQueryData(['notes', user?.uid, categoryId], context.previousNotes);
      }
    },
    onSuccess: () => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('online'), 2000);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', user?.uid, categoryId] });
    },
  });
}