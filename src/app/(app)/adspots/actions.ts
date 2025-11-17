'use server';

import { revalidatePath } from 'next/cache';
import * as yup from 'yup';
import { adSpotService } from '@/lib/services/adspotService';
import { adSpotCreateSchema } from '@/lib/validators/adspot';
import type { AdSpot, AdSpotCreatePayload } from '@/lib/types/adspot';

/**
 * Tipo de respuesta para Server Actions.
 * 
 * Sigue el patrón de retornar objetos con `success`, `error` y `data`
 * para facilitar el manejo de errores en el cliente.
 */
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Server Action: Crea un nuevo AdSpot.
 * 
 * Flujo:
 * 1. Mapea FormData a un objeto
 * 2. Valida con adSpotCreateSchema
 * 3. Llama a adSpotService.createAdSpot
 * 4. Revalida la ruta /adspots para actualizar la UI
 * 
 * @param formData - FormData del formulario con los campos del AdSpot
 * @returns Resultado de la operación con el AdSpot creado o un error
 * 
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.set('title', 'Promoción Verano');
 * formData.set('imageUrl', 'https://example.com/image.jpg');
 * formData.set('placement', 'home_screen');
 * formData.set('ttlMinutes', '60');
 * 
 * const result = await createAdSpotAction(formData);
 * if (result.success) {
 *   console.log('AdSpot creado:', result.data);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function createAdSpotAction(
  formData: FormData
): Promise<ActionResult<AdSpot>> {
  try {
    // 1. Mapear FormData a un objeto
    const rawData: Record<string, unknown> = {
      title: formData.get('title'),
      imageUrl: formData.get('imageUrl'),
      placement: formData.get('placement'),
    };

    // Manejar ttlMinutes si está presente (opcional)
    const ttlMinutes = formData.get('ttlMinutes');
    if (ttlMinutes && ttlMinutes.toString().trim() !== '') {
      const ttlValue = Number(ttlMinutes);
      if (!isNaN(ttlValue) && ttlValue > 0) {
        rawData.ttlMinutes = ttlValue;
      }
    }

    // 2. Validar con adSpotCreateSchema
    const validatedPayload = await adSpotCreateSchema.validate(rawData, {
      abortEarly: false,
      stripUnknown: true,
    }) as AdSpotCreatePayload;

    // 3. Llamar a adSpotService.createAdSpot
    const newAdSpot = await adSpotService.createAdSpot(validatedPayload);
    
    console.log('[createAdSpotAction] AdSpot creado:', newAdSpot.id);
    console.log('[createAdSpotAction] Verificando store después de crear...');
    const allAfterCreate = await adSpotService.getAllAdSpots();
    console.log('[createAdSpotAction] Total en store después de crear:', allAfterCreate.length);

    // 4. Revalidar la ruta /adspots con diferentes tipos
    revalidatePath('/adspots', 'page');
    revalidatePath('/adspots', 'layout');

    return {
      success: true,
      data: newAdSpot,
    };
  } catch (error) {
    // Manejar errores de validación de yup
    if (error instanceof yup.ValidationError) {
      // Si hay múltiples errores, tomar el primero para mostrar un mensaje más claro
      const firstError = error.errors[0] || 'Por favor, revisa los campos del formulario';
      return {
        success: false,
        error: firstError,
      };
    }

    // Manejar errores de red o conexión
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.',
      };
    }

    // Manejar otros errores del servidor
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Ocurrió un error inesperado al crear el anuncio. Por favor, intenta nuevamente.';

    console.error('Error en createAdSpotAction:', error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Función auxiliar para simular latencia en desarrollo.
 * 
 * Útil para probar actualizaciones optimistas y ver el comportamiento
 * de la UI durante operaciones asíncronas.
 * 
 * @param ms - Milisegundos a esperar
 * @returns Promise que se resuelve después del delay
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Server Action: Desactiva un AdSpot.
 * 
 * Flujo:
 * 1. Simula latencia (solo en desarrollo para probar useOptimistic)
 * 2. Llama a adSpotService.deactivateAdSpot(id)
 * 3. Revalida la ruta /adspots para actualizar la UI
 * 
 * @param id - ID del AdSpot a desactivar
 * @returns Resultado de la operación o un error
 * 
 * @example
 * ```typescript
 * const result = await deactivateAdSpotAction('adspot-123');
 * if (result.success) {
 *   console.log('AdSpot desactivado correctamente');
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function deactivateAdSpotAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    // Validar que el ID no esté vacío
    if (!id || id.trim() === '') {
      return {
        success: false,
        error: 'El ID del AdSpot es requerido',
      };
    }

    // Simular latencia para poder observar la actualización optimista
    // En producción, eliminar o reducir este delay
    await sleep(2000); // 2 segundos de delay

    // 1. Llamar a adSpotService.deactivateAdSpot(id)
    await adSpotService.deactivateAdSpot(id);

    // 2. Revalidar la ruta /adspots
    revalidatePath('/adspots');

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    // Manejar errores de red o conexión
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'No pudimos desactivar el anuncio. Verifica tu conexión a internet e intenta nuevamente.',
      };
    }

    // Manejar errores del servidor
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'No pudimos desactivar el anuncio. Intenta nuevamente o revisa tu conexión.';

    console.error('Error en deactivateAdSpotAction:', error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

