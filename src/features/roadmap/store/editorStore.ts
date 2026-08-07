import { create } from 'zustand';

interface EditorState {
  isDirty: boolean;
  
  // Callbacks provided by the currently active editor
  saveFn: (() => Promise<void>) | null;
  discardFn: (() => void) | null;
  
  // The action the user was trying to take (State Navigation)
  pendingAction: (() => void) | null;
  
  // React Router blocker callbacks (Route Navigation)
  routerProceed: (() => void) | null;
  routerReset: (() => void) | null;

  // Actions
  setDirty: (isDirty: boolean, saveFn?: () => Promise<void>, discardFn?: () => void) => void;
  requestNavigation: (action: () => void) => void;
  blockRoute: (proceed: () => void, reset: () => void) => void;
  
  // Modal Resolutions
  resolveSave: () => Promise<void>;
  resolveDiscard: () => void;
  resolveCancel: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  isDirty: false,
  saveFn: null,
  discardFn: null,
  pendingAction: null,
  routerProceed: null,
  routerReset: null,

  // Remove the default `= null` and use `?? null` when setting state
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
  }
}));