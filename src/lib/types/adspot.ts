/**
 * Tipos e interfaces relacionados con el dominio AdSpot.
 * 
 * Este módulo define la estructura de datos y los tipos necesarios
 * para trabajar con AdSpots en la aplicación.
 */

/**
 * Placement válido para un AdSpot.
 */
export type AdSpotPlacement = 'home_screen' | 'ride_summary' | 'map_view';

/**
 * Estado de un AdSpot.
 */
export type AdSpotStatus = 'active' | 'inactive';

/**
 * Representa un AdSpot en el sistema.
 * 
 * Un AdSpot es un anuncio que puede mostrarse en diferentes ubicaciones
 * de la aplicación móvil. Puede tener un TTL (Time To Live) que determina
 * su expiración automática.
 * 
 * @property id - Identificador único del AdSpot
 * @property title - Título del anuncio
 * @property imageUrl - URL de la imagen del anuncio
 * @property placement - Ubicación donde se mostrará el anuncio
 * @property status - Estado actual del anuncio (active/inactive)
 * @property createdAt - Fecha de creación en formato ISO-8601
 * @property deactivatedAt - Fecha de desactivación en formato ISO-8601 (opcional)
 * @property ttlMinutes - Tiempo de vida en minutos desde la creación (opcional)
 */
export interface AdSpot {
  id: string;
  title: string;
  imageUrl: string;
  placement: AdSpotPlacement;
  status: AdSpotStatus;
  createdAt: string; // ISO-8601
  deactivatedAt?: string; // ISO-8601
  ttlMinutes?: number; // opcional; si se define, auto-expira después de creación
}

/**
 * Payload para crear un nuevo AdSpot.
 * 
 * No incluye campos generados automáticamente como `id`, `createdAt` o `deactivatedAt`.
 * El `status` por defecto será "active" según las reglas de negocio.
 */
export interface AdSpotCreatePayload {
  title: string;
  imageUrl: string;
  placement: AdSpotPlacement;
  ttlMinutes?: number;
}

/**
 * Payload para actualizar el estado de un AdSpot.
 * 
 * Se utiliza para activar o desactivar un AdSpot.
 * Si se desactiva, se puede establecer `deactivatedAt` automáticamente.
 */
export interface AdSpotUpdateStatusPayload {
  id: string;
  status: AdSpotStatus;
}

/**
 * Filtros para buscar y filtrar AdSpots.
 * 
 * Permite filtrar por placement, búsqueda de texto (en título)
 * y opcionalmente por status.
 * 
 * @property placement - Filtrar por ubicación específica (opcional)
 * @property search - Texto de búsqueda para filtrar por título (opcional)
 * @property status - Filtrar por estado específico (opcional)
 */
export interface AdSpotFilter {
  placement?: AdSpotPlacement;
  search?: string;
  status?: AdSpotStatus;
}

