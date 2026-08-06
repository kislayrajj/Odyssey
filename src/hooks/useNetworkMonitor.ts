import { useEffect } from 'react';
import { useSyncStore } from '@/store/syncStore';

export function useNetworkMonitor() {
  const setStatus = useSyncStore((state) => state.setStatus);

  useEffect(() => {
    const handleOnline = () => setStatus('online');
    const handleOffline = () => setStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check just in case it changed between store creation and mount
    if (!navigator.onLine) {
      setStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setStatus]);
}