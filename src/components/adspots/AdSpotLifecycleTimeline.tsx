'use client';

import { memo, useState, useEffect } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import {
  calculateAdSpotFinalStatus,
  getExpirationTime,
  formatInactiveReason,
} from '@/lib/helpers/adspotLifecycle';
import { formatDate } from '@/lib/helpers/adspotFormatters';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';

/**
 * Componente Client Component para mostrar el timeline del ciclo de vida de un AdSpot.
 * 
 * Muestra los eventos clave:
 * - createdAt
 * - ttlMinutes (si existe) → "expires at ..."
 * - deactivatedAt (si existe) → "manually deactivated at ..."
 * - Estado final calculado
 * 
 * @param adSpot - El AdSpot del cual mostrar el timeline
 */
export const AdSpotLifecycleTimeline = memo(function AdSpotLifecycleTimeline({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  const finalStatus = calculateAdSpotFinalStatus(adSpot);
  const expirationTime = getExpirationTime(adSpot);
  const deactivatedAt = adSpot.deactivatedAt
    ? new Date(adSpot.deactivatedAt)
    : null;
  
  // Calcular si el TTL expiró usando useState para evitar llamadas impuras durante render
  const [isExpired, setIsExpired] = useState<boolean>(() => {
    if (expirationTime === null) return false;
    return Date.now() >= expirationTime;
  });

  // Actualizar el estado de expiración periódicamente si hay TTL
  useEffect(() => {
    if (expirationTime === null) return;
    
    const checkExpiration = () => {
      setIsExpired(Date.now() >= expirationTime);
    };
    
    // Verificar inmediatamente
    checkExpiration();
    
    // Verificar cada minuto
    const interval = setInterval(checkExpiration, 60000);
    
    return () => clearInterval(interval);
  }, [expirationTime]);

  return (
    <div className="space-y-4">
      {/* Timeline visual */}
      <div className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {/* Evento: Created */}
          <div className="relative flex items-start gap-4">
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Creado</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(adSpot.createdAt)}
              </p>
            </div>
          </div>

          {/* Evento: Expiration (si existe TTL) */}
          {expirationTime && (
            <div className="relative flex items-start gap-4">
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                  isExpired
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-orange-500 text-white'
                }`}
              >
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">
                  {isExpired ? 'Expiró' : 'Expira'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(new Date(expirationTime).toISOString())}
                </p>
              </div>
            </div>
          )}

          {/* Evento: Deactivated (si existe) */}
          {deactivatedAt && (
            <div className="relative flex items-start gap-4">
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                <XCircle className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Desactivado manualmente</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(adSpot.deactivatedAt!)}
                </p>
              </div>
            </div>
          )}

          {/* Estado final */}
          <div className="relative flex items-start gap-4">
            <div
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                finalStatus.isActive
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {finalStatus.isActive ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Estado final</p>
                <Badge
                  variant={finalStatus.isActive ? 'default' : 'secondary'}
                >
                  {finalStatus.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              {!finalStatus.isActive && finalStatus.reason && (
                <p className="text-sm text-muted-foreground">
                  {formatInactiveReason(finalStatus.reason)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

