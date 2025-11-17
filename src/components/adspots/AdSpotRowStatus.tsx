'use client';

import { memo } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { isAdSpotActiveByTTL } from '@/lib/helpers/ttl';

/**
 * Componente Client Component para mostrar el estado de un AdSpot.
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando el adSpot no cambia.
 * 
 * @param adSpot - El AdSpot del cual mostrar el estado
 */
export const AdSpotRowStatus = memo(function AdSpotRowStatus({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  const isActive = isAdSpotActiveByTTL(adSpot);

  return (
    <TableCell>
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    </TableCell>
  );
});

