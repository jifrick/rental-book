import { useState, useEffect } from 'react';

/**
 * Custom hook that updates every intervalMs (default 30s) to trigger live duration updates
 */
export function useLiveTimer(intervalMs: number = 30000) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
