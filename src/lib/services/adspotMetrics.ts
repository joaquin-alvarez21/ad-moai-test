import type { AdSpot, AdSpotPlacement } from '@/lib/types/adspot';
import { isAdSpotActiveByTTL } from '@/lib/helpers/ttl';
import { calculateAdSpotFinalStatus } from '@/lib/helpers/adspotLifecycle';

/**
 * Métricas calculadas para AdSpots.
 */
export interface AdSpotMetrics {
  total: number;
  active: number;
  inactive: {
    expiredByTTL: number;
    deactivatedByUser: number;
  };
  placementDistribution: {
    placement: AdSpotPlacement;
    count: number;
    percentage: number;
  }[];
}

/**
 * Calcula métricas a partir de una lista de AdSpots.
 * 
 * Métricas calculadas:
 * - Total de AdSpots
 * - Número de activos
 * - Número de expirados por TTL vs desactivados manualmente
 * - Porcentaje de ocupación por placement
 * 
 * @param adSpots - Lista de AdSpots para calcular métricas
 * @returns Objeto con las métricas calculadas
 */
export function calculateAdSpotMetrics(adSpots: AdSpot[]): AdSpotMetrics {
  const total = adSpots.length;
  
  // Contar activos
  const active = adSpots.filter((ad) => isAdSpotActiveByTTL(ad)).length;
  
  // Contar inactivos por razón
  let expiredByTTL = 0;
  let deactivatedByUser = 0;
  
  adSpots.forEach((ad) => {
    const finalStatus = calculateAdSpotFinalStatus(ad);
    if (!finalStatus.isActive) {
      if (finalStatus.reason === 'expired_by_ttl') {
        expiredByTTL++;
      } else if (finalStatus.reason === 'deactivated_by_user') {
        deactivatedByUser++;
      }
    }
  });
  
  // Calcular distribución por placement
  const placementCounts: Record<AdSpotPlacement, number> = {
    home_screen: 0,
    ride_summary: 0,
    map_view: 0,
  };
  
  adSpots.forEach((ad) => {
    placementCounts[ad.placement]++;
  });
  
  const placementDistribution: AdSpotMetrics['placementDistribution'] = (
    ['home_screen', 'ride_summary', 'map_view'] as AdSpotPlacement[]
  ).map((placement) => ({
    placement,
    count: placementCounts[placement],
    percentage: total > 0 ? Math.round((placementCounts[placement] / total) * 100) : 0,
  }));
  
  return {
    total,
    active,
    inactive: {
      expiredByTTL,
      deactivatedByUser,
    },
    placementDistribution,
  };
}

