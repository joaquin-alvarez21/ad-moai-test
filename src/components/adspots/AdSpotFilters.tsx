'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { PlacementFilters } from './PlacementFilters';
import { SearchInput } from './SearchInput';
import { StatusFilter } from './StatusFilter';
import { ClearFiltersButton } from './ClearFiltersButton';

/**
 * Componente de filtros para AdSpots (Client Component).
 * 
 * Permite filtrar por placement (chips), búsqueda de texto y opcionalmente por status.
 * Los filtros se sincronizan con los query params de la URL usando useRouter y useSearchParams.
 * 
 * La descomposición en componentes más pequeños permite:
 * - Mejor modularización y reutilización
 * - Optimización selectiva con React.memo
 * - Separación de responsabilidades (cada filtro es independiente)
 * 
 * Estrategia: Actualizar searchParams de la URL para mantener el estado en la URL
 * y permitir compartir enlaces con filtros aplicados.
 * 
 * @example
 * ```tsx
 * <AdSpotFilters />
 * ```
 */
export function AdSpotFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const placement = searchParams.get('placement') || '';
  const status = searchParams.get('status') || 'all';

  /**
   * Actualiza los query params de la URL con los nuevos filtros.
   */
  const updateFilters = useCallback(
    (newPlacement: string, newSearch: string, newStatus: string) => {
      const params = new URLSearchParams();
      
      if (newPlacement && newPlacement !== 'all') {
        params.set('placement', newPlacement);
      }
      
      if (newSearch.trim()) {
        params.set('search', newSearch.trim());
      }

      if (newStatus && newStatus !== 'all') {
        params.set('status', newStatus);
      }
      
      const queryString = params.toString();
      router.push(`/adspots${queryString ? `?${queryString}` : ''}`);
    },
    [router]
  );

  /**
   * Maneja el cambio de placement mediante chips.
   */
  const handlePlacementChange = useCallback(
    (value: string) => {
      const placementValue = value === '' ? 'all' : value;
      updateFilters(placementValue, search, status);
    },
    [search, status, updateFilters]
  );

  /**
   * Maneja el cambio de búsqueda.
   */
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      updateFilters(placement || 'all', value, status);
    },
    [placement, status, updateFilters]
  );

  /**
   * Maneja el cambio de status.
   */
  const handleStatusChange = useCallback(
    (value: string) => {
      updateFilters(placement || 'all', search, value);
    },
    [placement, search, updateFilters]
  );

  /**
   * Limpia todos los filtros.
   */
  const handleClearFilters = useCallback(() => {
    setSearch('');
    router.push('/adspots');
  }, [router]);

  // Consideramos que hay filtros si hay un placement específico, búsqueda o status diferente de 'all'
  const hasFilters =
    (placement && placement !== 'all') ||
    search.trim() ||
    (status && status !== 'all');

  return (
    <div className="flex flex-col gap-4">
      <PlacementFilters value={placement} onValueChange={handlePlacementChange} />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={handleSearchChange} />
          <StatusFilter value={status} onValueChange={handleStatusChange} />
        </div>

        {hasFilters && <ClearFiltersButton onClick={handleClearFilters} />}
      </div>
    </div>
  );
}

