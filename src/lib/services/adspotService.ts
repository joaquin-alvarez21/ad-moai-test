import type {
  AdSpot,
  AdSpotCreatePayload,
  AdSpotFilter,
  AdSpotStatus,
} from '@/lib/types/adspot';
import { adSpotStore } from '@/lib/api/memoryStore';
import { isAdSpotActiveByTTL } from '@/lib/helpers/ttl';
import {
  filterAdSpotsByPlacement,
  filterAdSpotsBySearch,
} from '@/lib/helpers/adspotFilters';
import {
  calculateAdSpotMetrics,
  type AdSpotMetrics,
} from './adspotMetrics';

/**
 * Servicio de dominio para AdSpots.
 * 
 * Este servicio proporciona una capa de abstracción sobre el acceso a datos
 * de AdSpots. Puede usar fetch contra la API REST o acceder directamente
 * al memoryStore si se ejecuta en el servidor.
 * 
 * Estrategia:
 * - Si se ejecuta en el servidor (Server Components, Server Actions): usa memoryStore directamente
 * - Si se ejecuta en el cliente: usa fetch contra /api/adspots
 */
class AdSpotService {
  /**
   * Determina si el código se está ejecutando en el servidor.
   * 
   * @returns `true` si está en el servidor, `false` si está en el cliente
   */
  private isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  /**
   * Obtiene la URL base de la API.
   * 
   * @returns URL base para las peticiones API
   */
  private getApiBaseUrl(): string {
    if (this.isServerSide()) {
      // En el servidor, usar localhost o la URL absoluta
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return `${baseUrl}/api`;
    }
    // En el cliente, usar ruta relativa
    return '/api';
  }

  /**
   * Obtiene todos los AdSpots.
   * 
   * @returns Promise que resuelve con un array de todos los AdSpots
   * @throws Error si falla la petición o el acceso a datos
   */
  async getAllAdSpots(): Promise<AdSpot[]> {
    if (this.isServerSide()) {
      // En el servidor, acceder directamente al store
      return adSpotStore.getAll();
    }

    // En el cliente, usar fetch
    const response = await fetch(`${this.getApiBaseUrl()}/adspots`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener AdSpots: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data as AdSpot[];
  }

  /**
   * Obtiene AdSpots activos filtrados.
   * 
   * Aplica la lógica de TTL (Time To Live) para determinar si un AdSpot
   * está realmente activo, y luego aplica los filtros de placement y búsqueda.
   * 
   * Reglas:
   * - Solo retorna AdSpots que pasan `isAdSpotActiveByTTL` (elegibles)
   * - Aplica filtro por placement si se proporciona
   * - Aplica filtro por búsqueda de texto si se proporciona
   * 
   * @param filter - Filtros a aplicar (placement, search)
   * @returns Promise que resuelve con un array de AdSpots activos filtrados
   */
  async getActiveAdSpotsFiltered(filter: AdSpotFilter): Promise<AdSpot[]> {
    // Obtener todos los AdSpots
    let adSpots = await this.getAllAdSpots();

    // Filtrar solo los que están activos según TTL (elegibles)
    adSpots = adSpots.filter((ad) => isAdSpotActiveByTTL(ad));

    // Aplicar filtro por placement si se proporciona
    if (filter.placement) {
      adSpots = filterAdSpotsByPlacement(adSpots, filter.placement);
    }

    // Aplicar filtro por búsqueda si se proporciona
    if (filter.search) {
      adSpots = filterAdSpotsBySearch(adSpots, filter.search);
    }

    return adSpots;
  }

  /**
   * Crea un nuevo AdSpot.
   * 
   * @param payload - Datos para crear el AdSpot
   * @returns Promise que resuelve con el AdSpot creado
   * @throws Error si falla la validación o la creación
   */
  async createAdSpot(payload: AdSpotCreatePayload): Promise<AdSpot> {
    if (this.isServerSide()) {
      // En el servidor, acceder directamente al store
      return adSpotStore.create(payload);
    }

    // En el cliente, usar fetch
    const response = await fetch(`${this.getApiBaseUrl()}/adspots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(
        error.details
          ? `Error de validación: ${error.details.join(', ')}`
          : `Error al crear AdSpot: ${error.error || response.statusText}`
      );
    }

    const result = await response.json();
    return result.data as AdSpot;
  }

  /**
   * Desactiva un AdSpot.
   * 
   * @param id - ID del AdSpot a desactivar
   * @returns Promise que resuelve cuando se completa la desactivación
   * @throws Error si el AdSpot no existe o falla la operación
   */
  async deactivateAdSpot(id: string): Promise<void> {
    if (this.isServerSide()) {
      // En el servidor, acceder directamente al store
      const updated = adSpotStore.updateStatus(id, 'inactive');
      if (!updated) {
        throw new Error(`AdSpot con id ${id} no encontrado`);
      }
      return;
    }

    // En el cliente, usar fetch
    const response = await fetch(`${this.getApiBaseUrl()}/adspots/${id}/deactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`AdSpot con id ${id} no encontrado`);
      }
      throw new Error(`Error al desactivar AdSpot: ${response.statusText}`);
    }
  }

  /**
   * Alterna el estado de un AdSpot entre activo e inactivo.
   * 
   * Si el AdSpot está activo, lo desactiva. Si está inactivo, lo activa.
   * 
   * @param id - ID del AdSpot a alternar
   * @param currentStatus - Estado actual del AdSpot
   * @returns Promise que resuelve con el AdSpot actualizado
   * @throws Error si el AdSpot no existe o falla la operación
   */
  async toggleAdSpot(
    id: string,
    currentStatus: 'active' | 'inactive'
  ): Promise<AdSpot> {
    const newStatus: AdSpotStatus = currentStatus === 'active' ? 'inactive' : 'active';

    if (this.isServerSide()) {
      // En el servidor, acceder directamente al store
      const updated = adSpotStore.updateStatus(id, newStatus);
      if (!updated) {
        throw new Error(`AdSpot con id ${id} no encontrado`);
      }
      return updated;
    }

    // En el cliente, usar PATCH para actualizar el status
    const response = await fetch(`${this.getApiBaseUrl()}/adspots/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`AdSpot con id ${id} no encontrado`);
      }
      throw new Error(`Error al alternar estado del AdSpot: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data as AdSpot;
  }

  /**
   * Calcula métricas a partir de todos los AdSpots.
   * 
   * @returns Promise que resuelve con las métricas calculadas
   */
  async getMetrics(): Promise<AdSpotMetrics> {
    const allAdSpots = await this.getAllAdSpots();
    return calculateAdSpotMetrics(allAdSpots);
  }
}

// Exportar una instancia singleton del servicio
export const adSpotService = new AdSpotService();

