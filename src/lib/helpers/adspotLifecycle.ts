import type { AdSpot } from '@/lib/types/adspot';

/**
 * Razón por la cual un AdSpot está inactivo.
 */
export type AdSpotInactiveReason = 'expired_by_ttl' | 'deactivated_by_user' | null;

/**
 * Información sobre el estado final y la razón de inactividad de un AdSpot.
 */
export interface AdSpotFinalStatus {
  isActive: boolean;
  reason: AdSpotInactiveReason;
}

/**
 * Calcula el estado final de un AdSpot y la razón por la cual está inactivo (si aplica).
 * 
 * Reglas:
 * - Si tiene `deactivatedAt` y el TTL no ha expirado (o no existe TTL), fue desactivado manualmente
 * - Si tiene `deactivatedAt` pero el TTL ya expiró antes de la desactivación, fue expirado por TTL
 * - Si no tiene `deactivatedAt` pero el TTL expiró, fue expirado por TTL
 * - Si está activo, no hay razón
 * 
 * @param adSpot - El AdSpot a evaluar
 * @returns Objeto con el estado final y la razón de inactividad
 */
export function calculateAdSpotFinalStatus(adSpot: AdSpot): AdSpotFinalStatus {
  const now = Date.now();
  const createdAt = new Date(adSpot.createdAt).getTime();
  
  // Calcular si el TTL ha expirado
  let ttlExpired = false;
  let expirationTime: number | null = null;
  
  if (adSpot.ttlMinutes !== undefined && adSpot.ttlMinutes !== null) {
    expirationTime = createdAt + adSpot.ttlMinutes * 60000;
    ttlExpired = now >= expirationTime;
  }
  
  // Si tiene deactivatedAt, verificar si fue manual o por TTL
  if (adSpot.deactivatedAt) {
    const deactivatedAt = new Date(adSpot.deactivatedAt).getTime();
    
    // Si el TTL existe, verificar si el deactivatedAt calza con el tiempo de expiración
    if (expirationTime !== null) {
      // Si el deactivatedAt es aproximadamente igual al expirationTime (con margen de 1 minuto),
      // fue expirado por TTL, no manualmente
      const timeDiff = Math.abs(deactivatedAt - expirationTime);
      const oneMinute = 60000;
      
      if (timeDiff <= oneMinute && deactivatedAt >= expirationTime) {
        // El deactivatedAt calza con el expirationTime, fue por TTL
        return {
          isActive: false,
          reason: 'expired_by_ttl',
        };
      }
    }
    
    // Si no hay TTL o el deactivatedAt no calza con el expirationTime, fue manual
    return {
      isActive: false,
      reason: 'deactivated_by_user',
    };
  }
  
  // Si no tiene deactivatedAt pero el TTL expiró, fue por TTL
  if (ttlExpired) {
    return {
      isActive: false,
      reason: 'expired_by_ttl',
    };
  }
  
  // Si el status es inactive pero no hay deactivatedAt ni TTL expirado, asumir manual
  if (adSpot.status === 'inactive') {
    return {
      isActive: false,
      reason: 'deactivated_by_user',
    };
  }
  
  // Está activo
  return {
    isActive: true,
    reason: null,
  };
}

/**
 * Calcula la fecha de expiración basada en createdAt y ttlMinutes.
 * 
 * @param adSpot - El AdSpot
 * @returns Fecha de expiración en milisegundos o null si no hay TTL
 */
export function getExpirationTime(adSpot: AdSpot): number | null {
  if (adSpot.ttlMinutes === undefined || adSpot.ttlMinutes === null) {
    return null;
  }
  
  const createdAt = new Date(adSpot.createdAt).getTime();
  return createdAt + adSpot.ttlMinutes * 60000;
}

/**
 * Formatea un mensaje de razón de inactividad para mostrar al usuario.
 * 
 * @param reason - La razón de inactividad
 * @returns Mensaje formateado
 */
export function formatInactiveReason(reason: AdSpotInactiveReason): string {
  switch (reason) {
    case 'expired_by_ttl':
      return 'Expirado por TTL';
    case 'deactivated_by_user':
      return 'Desactivado manualmente';
    default:
      return 'Activo';
  }
}

