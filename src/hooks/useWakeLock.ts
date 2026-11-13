import { useState, useEffect, useCallback, useRef } from 'react';

interface WakeLockSentinel extends EventTarget {
  released: boolean;
  type: string;
  release: () => Promise<void>;
  onrelease: ((this: WakeLockSentinel, ev: Event) => void) | null;
}

export function useWakeLock() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  const requestLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      setIsSupported(false);
      return false;
    }

    try {
      const navWithWakeLock = navigator as unknown as {
        wakeLock: { request: (type: string) => Promise<WakeLockSentinel> };
      };
      
      const sentinel = await navWithWakeLock.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      setIsActive(true);
      setErrorMsg(null);

      sentinel.addEventListener('release', () => {
        sentinelRef.current = null;
        setIsActive(false);
      });

      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'WakeLock request failed';
      setErrorMsg(msg);
      setIsActive(false);
      return false;
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (sentinelRef.current) {
      try {
        await sentinelRef.current.release();
      } catch {
        // ignore
      }
      sentinelRef.current = null;
      setIsActive(false);
    }
  }, []);

  const toggleWakeLock = useCallback(async () => {
    if (isActive) {
      await releaseLock();
    } else {
      await requestLock();
    }
  }, [isActive, releaseLock, requestLock]);

  useEffect(() => {
    const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
    setIsSupported(supported);

    if (supported) {
      // Auto acquire wake lock on mount for user safety
      requestLock();

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && !sentinelRef.current) {
          requestLock();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        releaseLock();
      };
    }
  }, [requestLock, releaseLock]);

  return {
    isSupported,
    isActive,
    errorMsg,
    requestLock,
    releaseLock,
    toggleWakeLock
  };
}
