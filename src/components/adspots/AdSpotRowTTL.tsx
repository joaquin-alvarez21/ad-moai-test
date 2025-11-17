'use client';

import { memo } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import { TableCell } from '@/components/ui/table';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { Badge } from '@/components/ui/badge';

/**
 * Componente Client Component para mostrar el TTL de un AdSpot con countdown en tiempo real.
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando el adSpot no cambia.
 * Muestra un countdown que se actualiza cada segundo si el AdSpot tiene TTL.
 * 
 * @param adSpot - El AdSpot del cual mostrar el TTL
 */
export const AdSpotRowTTL = memo(function AdSpotRowTTL({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  // Calcular la fecha de expiración si hay TTL
  const expirationTime =
    adSpot.ttlMinutes !== undefined && adSpot.ttlMinutes !== null
      ? new Date(adSpot.createdAt).getTime() + adSpot.ttlMinutes * 60000
      : null;

  const { timeRemaining, isExpired } = useCountdown(expirationTime);

  // Si no hay TTL, mostrar "Sin límite"
  if (expirationTime === null) {
    return <TableCell className="text-sm">Sin límite</TableCell>;
  }

  // Si expiró, mostrar badge rojo
  if (isExpired) {
    return (
      <TableCell className="text-sm">
        <Badge variant="destructive" className="text-xs">
          Expirado
        </Badge>
      </TableCell>
    );
  }

  // Mostrar countdown en tiempo real
  return (
    <TableCell className="text-sm">
      <span className="font-mono text-xs">
        Expira en {timeRemaining}
      </span>
    </TableCell>
  );
});

