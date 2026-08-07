import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserItemData, updateUserItemData } from '@/services/firebase/itemData';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useSyncStore } from '@/store/syncStore';
import type { UserItemData } from '@/types/models';

export function useItemData(itemId: string, isExpanded: boolean) {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['itemData', user?.uid, itemId],
    queryFn: () => getUserItemData(user!.uid, itemId),
    // Only fetch if the user is logged in AND the row is expanded
    enabled: !!user?.uid && isExpanded,
  });
}

export function useUpdateItemData(itemId: string) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setSyncStatus = useSyncStore((state) => state.setStatus);

  return useMutation({
    mutationFn: async (data: Partial<UserItemData>) => {
      if (!user) throw new Error('Not authenticated');
      setSyncStatus('syncing');
      await updateUserItemData(user.uid, itemId, data);
    },
    onSuccess: () => {
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('online'), 2000);
      queryClient.invalidateQueries({ queryKey: ['itemData', user?.uid, itemId] });
    },
    onError: () => setSyncStatus('error'),
  });
}