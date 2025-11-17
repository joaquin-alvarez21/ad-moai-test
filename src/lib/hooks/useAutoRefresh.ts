'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook personalizado para auto-refresh de la página cada cierto intervalo.
 * 
 * Útil para mantener los datos actualizados automáticamente, especialmente
 * para estados que cambian con el tiempo (como TTL de AdSpots).
 * 
 * @param intervalSeconds - Intervalo en segundos para el refresh (default: 60)
 * 
 * @example
 * ```tsx
 * // Refresh cada 60 segundos
 * useAutoRefresh(60);
 * 
 * // Refresh cada 30 segundos
 * useAutoRefresh(30);
 * ```
 */
export function useAutoRefresh(intervalSeconds: number = 60) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [router, intervalSeconds]);
}

