'use client';

import { useOptimistic, useTransition } from 'react';
import { deactivateAdSpotAction } from '@/app/(app)/adspots/actions';
import type { AdSpot } from '@/lib/types/adspot';
import { TableRow } from '@/components/ui/table';
import { AdSpotRowContent } from './AdSpotRowContent';
import { AdSpotRowStatus } from './AdSpotRowStatus';
import { AdSpotRowTTL } from './AdSpotRowTTL';
import { AdSpotRowCreated } from './AdSpotRowCreated';
import { AdSpotRowLifecycleButton } from './AdSpotRowLifecycleButton';
import { AdSpotRowPreviewButton } from './AdSpotRowPreviewButton';
import { AdSpotRowActions } from './AdSpotRowActions';
import { toast } from 'sonner';

/**
 * Componente de fila individual de AdSpot (Client Component).
 * 
 * Este componente coordina los sub-componentes que muestran el contenido
 * de una fila de AdSpot. Usa useOptimistic para manejar actualizaciones
 * optimistas del estado del AdSpot.
 * 
 * Orden de columnas (debe coincidir con AdSpotTableHeader):
 * 1. Imagen, Título, Placement (AdSpotRowContent)
 * 2. Estado (AdSpotRowStatus)
 * 3. TTL (AdSpotRowTTL)
 * 4. Creado (AdSpotRowCreated)
 * 5. Timeline (AdSpotRowLifecycleButton)
 * 6. Preview (AdSpotRowPreviewButton)
 * 7. Acciones (AdSpotRowActions)
 * 
 * La descomposición en componentes más pequeños permite:
 * - Mejor modularización y reutilización
 * - Optimización selectiva con React.memo
 * - Separación de responsabilidades (contenido estático vs interactivo)
 * 
 * @param adSpot - El AdSpot a mostrar
 */
export function AdSpotListItem({ adSpot }: { adSpot: AdSpot }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAdSpot, setOptimisticAdSpot] = useOptimistic(
    adSpot,
    (currentAdSpot, newStatus: 'active' | 'inactive') => {
      return {
        ...currentAdSpot,
        status: newStatus,
        deactivatedAt:
          newStatus === 'inactive'
            ? new Date().toISOString()
            : undefined,
      };
    }
  );

  /**
   * Maneja la desactivación del AdSpot con actualización optimista.
   * 
   * La actualización optimista debe estar dentro de startTransition
   * para que React la maneje correctamente y evite el error de actualización
   * fuera de una transición.
   */
  function handleDeactivate() {
    if (optimisticAdSpot.status === 'inactive') {
      toast.info('Este AdSpot ya está inactivo');
      return;
    }

    // Envolver tanto la actualización optimista como la Server Action en startTransition
    startTransition(async () => {
      // Actualización optimista dentro de la transición
      setOptimisticAdSpot('inactive');

      // Ejecutar la Server Action
      const result = await deactivateAdSpotAction(optimisticAdSpot.id);

      if (result.success) {
        toast.success('Anuncio desactivado', {
          description: `"${optimisticAdSpot.title}" ha sido desactivado correctamente.`,
          duration: 3000,
        });
      } else {
        // Revertir el estado optimista en caso de error
        setOptimisticAdSpot('active');
        const errorMessage = result.error || 'No pudimos desactivar el anuncio. Intenta nuevamente o revisa tu conexión.';
        toast.error('Error al desactivar', {
          description: errorMessage,
          duration: 5000,
        });
      }
    });
  }

  return (
    <TableRow>
      <AdSpotRowContent adSpot={optimisticAdSpot} />
      <AdSpotRowStatus adSpot={optimisticAdSpot} />
      <AdSpotRowTTL adSpot={optimisticAdSpot} />
      <AdSpotRowCreated adSpot={optimisticAdSpot} />
      <AdSpotRowLifecycleButton adSpot={optimisticAdSpot} />
      <AdSpotRowPreviewButton adSpot={optimisticAdSpot} />
      <AdSpotRowActions
        adSpot={optimisticAdSpot}
        onDeactivate={handleDeactivate}
        isPending={isPending}
      />
    </TableRow>
  );
}

