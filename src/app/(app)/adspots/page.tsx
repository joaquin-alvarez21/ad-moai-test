import { unstable_noStore } from 'next/cache';
import { adSpotService } from '@/lib/services/adspotService';
import { AdSpotFilters } from '@/components/adspots/AdSpotFilters';
import { AdSpotList } from '@/components/adspots/AdSpotList';
import { AdSpotMetricsCard } from '@/components/adspots/AdSpotMetricsCard';
import { AutoRefreshWrapper } from '@/components/adspots/AutoRefreshWrapper';
import {
  filterAdSpotsByPlacement,
  filterAdSpotsBySearch,
} from '@/lib/helpers/adspotFilters';
import type { AdSpotPlacement } from '@/lib/types/adspot';

/**
 * Página de lista de AdSpots (Server Component).
 * 
 * Esta página muestra todos los AdSpots (activos e inactivos) filtrados según los parámetros
 * de búsqueda de la URL. Es un Server Component que se renderiza en el servidor.
 * 
 * Query params soportados:
 * - `placement`: Filtrar por placement específico
 * - `search`: Buscar por texto en el título
 * - `status`: Filtrar por estado (active/inactive)
 * 
 * @param searchParams - Parámetros de búsqueda de la URL
 */
export default async function AdSpotsPage({
  searchParams,
}: {
  searchParams: Promise<{
    placement?: string;
    search?: string;
    status?: string;
  }>;
}) {
  // Deshabilitar el cache para esta página y asegurar datos frescos
  unstable_noStore();
  
  // Resolver los searchParams (en Next.js 15+ son una Promise)
  const params = await searchParams;

  // Obtener todos los AdSpots (activos e inactivos)
  let adSpots = await adSpotService.getAllAdSpots();

  // Aplicar filtro por placement si se proporciona
  if (params.placement) {
    // Validar que el placement sea uno de los valores válidos
    const validPlacements: AdSpotPlacement[] = [
      'home_screen',
      'ride_summary',
      'map_view',
    ];
    if (validPlacements.includes(params.placement as AdSpotPlacement)) {
      adSpots = filterAdSpotsByPlacement(
        adSpots,
        params.placement as AdSpotPlacement
      );
    }
  }

  // Aplicar filtro por búsqueda si se proporciona
  if (params.search && params.search.trim()) {
    adSpots = filterAdSpotsBySearch(adSpots, params.search.trim());
  }

  // Aplicar filtro por status si se proporciona
  if (params.status && (params.status === 'active' || params.status === 'inactive')) {
    adSpots = adSpots.filter((ad) => ad.status === params.status);
  }

  return (
    <AutoRefreshWrapper intervalSeconds={60}>
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AdSpots</h1>
          <p className="text-muted-foreground">
            Gestiona los anuncios de la aplicación móvil
          </p>
        </div>

        {/* Dashboard de métricas */}
        <AdSpotMetricsCard />

        {/* Controles de filtro */}
        <AdSpotFilters />

        {/* Lista de AdSpots */}
        <AdSpotList adSpots={adSpots} />
      </div>
    </AutoRefreshWrapper>
  );
}

