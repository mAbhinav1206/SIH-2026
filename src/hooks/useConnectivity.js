import { useState, useEffect, useCallback } from 'react';

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueForSync = useCallback((action) => {
    setQueueCount((c) => c + 1);
    if (navigator.onLine) {
      setTimeout(() => setQueueCount((c) => Math.max(0, c - 1)), 1500);
    }
  }, []);

  return { isOnline, queueCount, queueForSync };
}
