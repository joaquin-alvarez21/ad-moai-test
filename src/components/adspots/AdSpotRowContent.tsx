'use client';

import { memo } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import { TableCell } from '@/components/ui/table';
import { formatPlacement } from '@/lib/helpers/adspotFormatters';
import { AdSpotRowImage } from './AdSpotRowImage';

/**
 * Componente Client Component para mostrar el contenido básico de una fila de AdSpot.
 * 
 * Muestra: Imagen, Título, Placement
 * 
 * Este componente muestra datos formateados y usa React.memo para evitar
 * re-renders innecesarios cuando el adSpot no cambia.
 * 
 * Nota: Aunque muestra datos estáticos, debe ser Client Component porque
 * recibe el optimisticAdSpot que puede cambiar dinámicamente.
 * 
 * @param adSpot - El AdSpot a mostrar
 */
export const AdSpotRowContent = memo(function AdSpotRowContent({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  return (
    <>
      <TableCell>
        <AdSpotRowImage adSpot={adSpot} />
      </TableCell>
      <TableCell className="font-medium">{adSpot.title}</TableCell>
      <TableCell>{formatPlacement(adSpot.placement)}</TableCell>
    </>
  );
});

