'use client';

import { memo } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import { TableCell } from '@/components/ui/table';
import { formatDate } from '@/lib/helpers/adspotFormatters';

/**
 * Componente Client Component para mostrar la fecha de creación de un AdSpot.
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando el adSpot no cambia.
 * 
 * @param adSpot - El AdSpot del cual mostrar la fecha de creación
 */
export const AdSpotRowCreated = memo(function AdSpotRowCreated({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  return (
    <TableCell className="text-muted-foreground">
      {formatDate(adSpot.createdAt)}
    </TableCell>
  );
});

