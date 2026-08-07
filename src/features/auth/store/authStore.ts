import { create } from 'zustand';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  type User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: true,
  
  setUser: (user) => set({ user, isAuthLoading: false }),
  
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  },
  
  signOut: async () => {
    await firebaseSignOut(auth);
  }
}));