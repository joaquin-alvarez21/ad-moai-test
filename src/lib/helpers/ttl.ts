import type { AdSpot } from '@/lib/types/adspot';

/**
 * Helpers relacionados con el cálculo de TTL (Time To Live) para AdSpots.
 * 
 * Este módulo contiene funciones puras para determinar si un AdSpot
 * está activo considerando su TTL y fecha de creación.
 */

/**
 * Determina si un AdSpot está activo considerando su TTL.
 * 
 * Reglas de negocio:
 * - Si `ttlMinutes` no existe, el ad está activo si `status === "active"`.
 * - Si `ttlMinutes` existe, se calcula si ya expiró:
 *   - `createdAt + ttlMinutes * 60000 < Date.now()`
 * - Si expiró, el ad es inactivo independientemente de `status`.
 * 
 * @param ad - El AdSpot a evaluar
 * @returns `true` si el AdSpot está activo (considerando TTL), `false` en caso contrario
 * 
 * @example
 * ```typescript
 * const ad: AdSpot = {
 *   id: '1',
 *   title: 'Test',
 *   imageUrl: 'https://example.com/image.jpg',
 *   placement: 'home_screen',
 *   status: 'active',
 *   createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // hace 30 minutos
 *   ttlMinutes: 60 // expira en 60 minutos
 * };
 * 
 * isAdSpotActiveByTTL(ad); // true (aún no ha expirado)
 * ```
 */
export function isAdSpotActiveByTTL(ad: AdSpot): boolean {
  // Si el status es inactive, no está activo
  if (ad.status === 'inactive') {
    return false;
  }

  // Si no tiene TTL definido, está activo si el status es active
  if (ad.ttlMinutes === undefined || ad.ttlMinutes === null) {
    return ad.status === 'active';
  }

  // Calcular si el TTL ha expirado
  const createdAt = new Date(ad.createdAt).getTime();
  const expirationTime = createdAt + ad.ttlMinutes * 60000; // convertir minutos a milisegundos
  const now = Date.now();

  // Si ya expiró, está inactivo
  if (now >= expirationTime) {
    return false;
  }

  // Si no ha expirado y el status es active, está activo
  return ad.status === 'active';
}

