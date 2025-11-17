import type { AdSpot } from '@/lib/types/adspot';

/**
 * Helpers para formatear datos de AdSpots para mostrar en la UI.
 * 
 * Estas funciones son puras y pueden usarse tanto en Server Components
 * como en Client Components.
 */

/**
 * Formatea un placement para mostrarlo de forma legible.
 * 
 * @param placement - El placement a formatear (ej: "home_screen")
 * @returns El placement formateado (ej: "Home Screen")
 * 
 * @example
 * ```typescript
 * formatPlacement('home_screen'); // "Home Screen"
 * formatPlacement('ride_summary'); // "Ride Summary"
 * ```
 */
export function formatPlacement(placement: string): string {
  return placement
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Calcula el tiempo restante del TTL o si ya expiró.
 * 
 * @param adSpot - El AdSpot a evaluar
 * @returns Texto con el tiempo restante o "Sin límite" si no tiene TTL
 * 
 * @example
 * ```typescript
 * const adSpot: AdSpot = {
 *   // ... otros campos
 *   createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
 *   ttlMinutes: 60
 * };
 * 
 * getTTLText(adSpot); // "Expira en 30 min"
 * ```
 */
export function getTTLText(adSpot: AdSpot): string {
  if (!adSpot.ttlMinutes) {
    return 'Sin límite';
  }

  const createdAt = new Date(adSpot.createdAt).getTime();
  const expirationTime = createdAt + adSpot.ttlMinutes * 60000;
  const now = Date.now();
  const remainingMs = expirationTime - now;

  if (remainingMs <= 0) {
    return 'Expired';
  }

  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingDays = Math.floor(remainingHours / 24);

  if (remainingDays > 0) {
    return `Expira en ${remainingDays} día${remainingDays > 1 ? 's' : ''}`;
  } else if (remainingHours > 0) {
    return `Expira en ${remainingHours} hora${remainingHours > 1 ? 's' : ''}`;
  } else {
    return `Expira en ${remainingMinutes} min`;
  }
}

/**
 * Formatea una fecha ISO-8601 para mostrarla de forma legible.
 * 
 * @param dateString - Fecha en formato ISO-8601
 * @returns Fecha formateada según la locale española
 * 
 * @example
 * ```typescript
 * formatDate('2024-01-15T10:30:00Z'); // "15 ene 2024, 10:30"
 * ```
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

