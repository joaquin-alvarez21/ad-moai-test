import type { AdSpot, AdSpotPlacement } from '@/lib/types/adspot';

/**
 * Helpers para filtrar arrays de AdSpots.
 * 
 * Este módulo contiene funciones puras para filtrar AdSpots
 * según diferentes criterios (placement, búsqueda de texto, etc.).
 */

/**
 * Filtra AdSpots por placement.
 * 
 * @param adspots - Array de AdSpots a filtrar
 * @param placement - Placement por el cual filtrar
 * @returns Array de AdSpots que coinciden con el placement especificado
 * 
 * @example
 * ```typescript
 * const adspots: AdSpot[] = [
 *   { id: '1', placement: 'home_screen', ... },
 *   { id: '2', placement: 'ride_summary', ... },
 * ];
 * 
 * filterAdSpotsByPlacement(adspots, 'home_screen');
 * // Retorna solo el AdSpot con id '1'
 * ```
 */
export function filterAdSpotsByPlacement(
  adspots: AdSpot[],
  placement: AdSpotPlacement
): AdSpot[] {
  return adspots.filter((ad) => ad.placement === placement);
}

/**
 * Filtra AdSpots por búsqueda de texto en el título.
 * 
 * La búsqueda es case-insensitive y busca coincidencias parciales.
 * 
 * @param adspots - Array de AdSpots a filtrar
 * @param search - Texto de búsqueda
 * @returns Array de AdSpots cuyos títulos contienen el texto de búsqueda
 * 
 * @example
 * ```typescript
 * const adspots: AdSpot[] = [
 *   { id: '1', title: 'Promoción Verano', ... },
 *   { id: '2', title: 'Oferta Especial', ... },
 * ];
 * 
 * filterAdSpotsBySearch(adspots, 'verano');
 * // Retorna solo el AdSpot con id '1'
 * ```
 */
export function filterAdSpotsBySearch(
  adspots: AdSpot[],
  search: string
): AdSpot[] {
  if (!search || search.trim() === '') {
    return adspots;
  }

  const searchLower = search.toLowerCase().trim();

  return adspots.filter((ad) =>
    ad.title.toLowerCase().includes(searchLower)
  );
}

