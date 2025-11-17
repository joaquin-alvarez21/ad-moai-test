import type {
  AdSpot,
  AdSpotCreatePayload,
  AdSpotStatus,
} from '@/lib/types/adspot';
import { getMockAdSpots } from './mockData';

/**
 * Store in-memory para AdSpots.
 * 
 * Este módulo proporciona un almacenamiento temporal en memoria para AdSpots.
 * Los datos se pierden al reiniciar el servidor (no hay persistencia).
 * 
 * Útil para desarrollo y testing cuando no hay backend disponible.
 * 
 * NOTA: En desarrollo, Next.js puede recargar módulos con hot reloading,
 * lo que puede causar que se cree una nueva instancia. Para evitar esto,
 * mantenemos el array de datos fuera de la clase usando una variable
 * del módulo que persiste entre recargas.
 */

// Variable del módulo para mantener los datos persistentes
// Esto asegura que los datos persistan incluso si la clase se reinstancia
let storeData: AdSpot[] | null = null;

function getStoreData(): AdSpot[] {
  if (storeData === null) {
    storeData = getMockAdSpots();
  }
  return storeData;
}

class AdSpotMemoryStore {
  private get adSpots(): AdSpot[] {
    return getStoreData();
  }

  /**
   * Obtiene todos los AdSpots almacenados.
   * 
   * @returns Array con todos los AdSpots
   */
  getAll(): AdSpot[] {
    return [...this.adSpots]; // Retornar copia para evitar mutaciones externas
  }

  /**
   * Obtiene un AdSpot por su ID.
   * 
   * @param id - ID del AdSpot a buscar
   * @returns El AdSpot encontrado o `undefined` si no existe
   */
  getById(id: string): AdSpot | undefined {
    return this.adSpots.find((ad) => ad.id === id);
  }

  /**
   * Crea un nuevo AdSpot.
   * 
   * Genera automáticamente:
   * - `id`: UUID v4
   * - `status`: "active" (por defecto según reglas de negocio)
   * - `createdAt`: Fecha actual en formato ISO-8601
   * 
   * @param payload - Datos para crear el AdSpot
   * @returns El AdSpot creado
   * @throws Error si el payload es inválido
   */
  create(payload: AdSpotCreatePayload): AdSpot {
    const now = new Date().toISOString();

    const newAdSpot: AdSpot = {
      id: this.generateId(),
      title: payload.title,
      imageUrl: payload.imageUrl,
      placement: payload.placement,
      status: 'active', // Por defecto activo según reglas de negocio
      createdAt: now,
      ttlMinutes: payload.ttlMinutes,
    };

    // Obtener referencia al array y mutarlo directamente
    const data = getStoreData();
    data.push(newAdSpot);
    console.log(`[AdSpotMemoryStore] AdSpot creado: ${newAdSpot.id}. Total: ${data.length}`);
    return newAdSpot;
  }

  /**
   * Actualiza el estado de un AdSpot.
   * 
   * Si el status se cambia a "inactive", se establece automáticamente
   * `deactivatedAt` a la fecha actual. Si se cambia a "active", se elimina
   * `deactivatedAt`.
   * 
   * @param id - ID del AdSpot a actualizar
   * @param status - Nuevo estado del AdSpot
   * @param deactivatedAt - Fecha de desactivación (opcional, se establece automáticamente si status es "inactive")
   * @returns El AdSpot actualizado o `undefined` si no existe
   */
  updateStatus(
    id: string,
    status: AdSpotStatus,
    deactivatedAt?: string
  ): AdSpot | undefined {
    const adSpot = this.adSpots.find((ad) => ad.id === id);

    if (!adSpot) {
      return undefined;
    }

    const now = new Date().toISOString();

    // Actualizar status y deactivatedAt según corresponda
    adSpot.status = status;
    if (status === 'inactive') {
      adSpot.deactivatedAt = deactivatedAt || now;
    } else {
      // Si se reactiva, eliminar deactivatedAt
      delete adSpot.deactivatedAt;
    }

    return adSpot;
  }

  /**
   * Genera un ID único para un nuevo AdSpot.
   * 
   * Usa una implementación simple basada en timestamp y random.
   * En producción, se recomendaría usar una librería como `uuid`.
   * 
   * @returns ID único generado
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `${timestamp}-${random}`;
  }
}

// Exportar una instancia singleton del store
export const adSpotStore = new AdSpotMemoryStore();

