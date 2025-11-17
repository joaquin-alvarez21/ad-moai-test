import * as yup from 'yup';
import type { AdSpotCreatePayload, AdSpotPlacement } from '@/lib/types/adspot';

/**
 * Validadores para AdSpots usando yup.
 * 
 * Este módulo contiene los schemas de validación para crear y actualizar AdSpots.
 */

/**
 * Valores válidos para el placement de un AdSpot.
 */
const VALID_PLACEMENTS: AdSpotPlacement[] = ['home_screen', 'ride_summary', 'map_view'];

/**
 * Schema de validación para crear un nuevo AdSpot.
 * 
 * Reglas de validación:
 * - `title`: Requerido, debe ser una cadena no vacía
 * - `imageUrl`: Requerido, debe ser una URL válida
 * - `placement`: Requerido, debe ser uno de los valores válidos del enum
 * - `ttlMinutes`: Opcional, si se proporciona debe ser un número positivo
 * 
 * @example
 * ```typescript
 * const payload = {
 *   title: 'Promoción Verano',
 *   imageUrl: 'https://example.com/image.jpg',
 *   placement: 'home_screen',
 *   ttlMinutes: 60
 * };
 * 
 * await adSpotCreateSchema.validate(payload);
 * ```
 */
export const adSpotCreateSchema = yup.object<AdSpotCreatePayload>({
  title: yup
    .string()
    .required('Por favor, ingresa un título para el anuncio')
    .trim()
    .min(1, 'El título no puede estar vacío. Escribe al menos un carácter')
    .max(100, 'El título es demasiado largo. Usa máximo 100 caracteres'),

  imageUrl: yup
    .string()
    .required('Por favor, ingresa la URL de la imagen del anuncio')
    .url('La URL ingresada no es válida. Debe comenzar con http:// o https://')
    .trim()
    .test(
      'image-format',
      'La URL debe apuntar a una imagen válida (jpg, png, gif, webp)',
      (value) => {
        if (!value) return true; // Ya se valida con required
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
        return imageExtensions.test(value) || value.includes('images.unsplash.com') || value.includes('picsum.photos');
      }
    ),

  placement: yup
    .string<AdSpotPlacement>()
    .required('Por favor, selecciona dónde se mostrará el anuncio')
    .oneOf(
      VALID_PLACEMENTS,
      `Por favor, selecciona una ubicación válida: ${VALID_PLACEMENTS.map((p) => {
        const names: Record<AdSpotPlacement, string> = {
          home_screen: 'Pantalla Principal',
          ride_summary: 'Resumen de Viaje',
          map_view: 'Vista de Mapa',
        };
        return names[p];
      }).join(', ')}`
    ),

  ttlMinutes: yup
    .number()
    .optional()
    .nullable()
    .transform((value, originalValue) => {
      // Si el valor original es una cadena vacía, retornar undefined
      if (originalValue === '' || originalValue === null || originalValue === undefined) {
        return undefined;
      }
      return value;
    })
    .positive('El tiempo de vida debe ser mayor a 0. Ingresa un número positivo')
    .integer('El tiempo de vida debe ser un número entero. No se permiten decimales')
    .max(525600, 'El tiempo de vida no puede ser mayor a 1 año (525,600 minutos)'),
});

/**
 * Tipo inferido del schema de validación para crear AdSpot.
 * 
 * Útil para tipar formularios o payloads que pasan la validación.
 */
export type AdSpotCreateSchemaType = yup.InferType<typeof adSpotCreateSchema>;

