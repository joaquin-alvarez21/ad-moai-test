'use client';

import { memo } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import { isAdSpotActiveByTTL } from '@/lib/helpers/ttl';
import { PowerOff } from 'lucide-react';

/**
 * Componente Client Component para las acciones de una fila de AdSpot.
 * 
 * Recibe el handler de desactivación como prop para mantener la lógica
 * de useOptimistic en el componente padre (AdSpotListItem).
 * 
 * Usa React.memo para evitar re-renders innecesarios.
 * 
 * @param adSpot - El AdSpot para el cual mostrar las acciones
 * @param onDeactivate - Handler para desactivar el AdSpot
 * @param isPending - Si la acción está en progreso
 */
export const AdSpotRowActions = memo(function AdSpotRowActions({
  adSpot,
  onDeactivate,
  isPending,
}: {
  adSpot: AdSpot;
  onDeactivate: () => void;
  isPending: boolean;
}) {
  const isActive = isAdSpotActiveByTTL(adSpot);

  if (!isActive) {
    return <TableCell />;
  }

  return (
    <TableCell>
      <Button
        variant="outline"
        size="sm"
        onClick={onDeactivate}
        disabled={isPending}
        className="gap-2"
      >
        <PowerOff className="h-4 w-4" />
        {isPending ? 'Desactivando...' : 'Desactivar'}
      </Button>
    </TableCell>
  );
});

