import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  // FIX: Initialize synchronously with the actual browser state to prevent layout flashing
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false; // Fallback for safety, though Odyssey is a pure SPA
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Ensure state is perfectly synced if it changed between initialization and effect execution
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}