import { create } from 'zustand';

// Strongly typed contexts for extensible messaging
export type AuthContext = 'progress' | 'notes' | 'bookmarks' | 'attachments' | 'general';

interface AuthModalState {
  isOpen: boolean;
  context: AuthContext;
  queuedAction?: () => Promise<void>;
  openModal: (context: AuthContext, action?: () => Promise<void>) => void;
  closeModal: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  context: 'general',
  queuedAction: undefined,
  
  openModal: (context, action) => set({ 
    isOpen: true, 
    context, 
    queuedAction: action 
  }),
  
  closeModal: () => set({ 
    isOpen: false, 
    queuedAction: undefined 
  }),
}));