'use client';

import { useEffect, useState } from 'react';

/**
 * Hook personalizado para mostrar un countdown en tiempo real.
 * 
 * Calcula el tiempo restante hasta una fecha objetivo y actualiza
 * cada segundo para mostrar un countdown en tiempo real.
 * 
 * @param targetDate - Fecha objetivo en milisegundos (timestamp)
 * @returns Objeto con el tiempo restante formateado y si ya expiró
 * 
 * @example
 * ```tsx
 * const expirationTime = new Date(adSpot.createdAt).getTime() + (adSpot.ttlMinutes * 60000);
 * const { timeRemaining, isExpired } = useCountdown(expirationTime);
 * 
 * if (isExpired) {
 *   return <span>Expired</span>;
 * }
 * return <span>Expira en {timeRemaining}</span>;
 * ```
 */
export function useCountdown(targetDate: number | null) {
  const [timeRemaining, setTimeRemaining] = useState<string>(() => {
    if (targetDate === null) return '';
    return '';
  });
  const [isExpired, setIsExpired] = useState<boolean>(() => {
    if (targetDate === null) return false;
    return Date.now() >= targetDate;
  });

  useEffect(() => {
    if (targetDate === null) {
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeRemaining('00:00');
        setIsExpired(true);
        return;
      }

      setIsExpired(false);

      // Calcular días, horas, minutos y segundos
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Formatear según el tiempo restante
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    // Actualizar inmediatamente
    updateCountdown();

    // Actualizar cada segundo
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeRemaining, isExpired };
}

