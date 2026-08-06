import { create } from 'zustand';

export type SyncState = 'online' | 'offline' | 'syncing' | 'synced' | 'error';

interface SyncStore {
  status: SyncState;
  setStatus: (status: SyncState) => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  status: navigator.onLine ? 'online' : 'offline',
  setStatus: (status) => set({ status }),
}));