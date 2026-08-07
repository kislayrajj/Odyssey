import { create } from 'zustand';
import { useAuthStore } from '@/features/auth/store/authStore';

interface EditorState {
  isDirty: boolean;
  saveFn: (() => Promise<void>) | null;
  discardFn: (() => void) | null;
  pendingAction: (() => void) | null;
  routerProceed: (() => void) | null;
  routerReset: (() => void) | null;

  setDirty: (isDirty: boolean, saveFn?: () => Promise<void>, discardFn?: () => void) => void;
  requestNavigation: (action: () => void) => void;
  blockRoute: (proceed: () => void, reset: () => void) => void;
  
  resolveSave: () => Promise<void>;
  resolveDiscard: () => void;
  resolveCancel: () => void;
  reset: () => void; // <-- NEW
}

export const useEditorStore = create<EditorState>((set, get) => {
  
  // EVENT-DRIVEN ARCHITECTURE:
  // Subscribe to Auth state changes. If the user logs out, instantly wipe the editor state.
  // This prevents race conditions where a dirty-state navigation triggers during logout.
  useAuthStore.subscribe((state, prevState) => {
    if (prevState.user && !state.user) {
      get().reset();
    }
  });

  return {
    isDirty: false,
    saveFn: null,
    discardFn: null,
    pendingAction: null,
    routerProceed: null,
    routerReset: null,

    setDirty: (isDirty, saveFn, discardFn) => 
      set({ 
        isDirty, 
        saveFn: saveFn ?? null, 
        discardFn: discardFn ?? null 
      }),

    requestNavigation: (action) => {
      const { isDirty } = get();
      if (isDirty) {
        set({ pendingAction: action });
      } else {
        action();
      }
    },

    blockRoute: (proceed, reset) => {
      set({ routerProceed: proceed, routerReset: reset });
    },

    resolveSave: async () => {
      const { saveFn, pendingAction, routerProceed } = get();
      if (saveFn) await saveFn();
      
      if (pendingAction) pendingAction();
      if (routerProceed) routerProceed();
      
      set({ pendingAction: null, routerProceed: null, routerReset: null, isDirty: false });
    },

    resolveDiscard: () => {
      const { discardFn, pendingAction, routerProceed } = get();
      if (discardFn) discardFn();
      
      if (pendingAction) pendingAction();
      if (routerProceed) routerProceed();
      
      set({ pendingAction: null, routerProceed: null, routerReset: null, isDirty: false });
    },

    resolveCancel: () => {
      const { routerReset } = get();
      if (routerReset) routerReset();
      
      set({ pendingAction: null, routerProceed: null, routerReset: null });
    },

    reset: () => {
      set({
        isDirty: false,
        saveFn: null,
        discardFn: null,
        pendingAction: null,
        routerProceed: null,
        routerReset: null,
      });
    }
  };
});