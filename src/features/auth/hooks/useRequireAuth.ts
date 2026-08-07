import { useAuthStore } from '../store/authStore';
import { useAuthModalStore, type AuthContext } from '../store/authModalStore';

export function useRequireAuth() {
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthModalStore((state) => state.openModal);

  // Returns a function that intercepts protected actions
  const requireAuth = (context: AuthContext, action: () => Promise<void>) => {
    if (user) {
      // User is logged in, execute immediately
      return action();
    } else {
      // Guest user, capture intent and open modal
      openModal(context, action);
    }
  };

  return requireAuth;
}