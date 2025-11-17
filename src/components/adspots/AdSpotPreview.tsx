'use client';

import { memo } from 'react';
import type { AdSpot, AdSpotPlacement } from '@/lib/types/adspot';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

/**
 * Componente Client Component para mostrar un preview de cómo se vería un AdSpot
 * en un placement específico dentro de un mock de pantalla móvil.
 * 
 * Simula visualmente cómo aparecería el anuncio en diferentes ubicaciones
 * de la aplicación móvil usando un mock de celular/pantalla.
 * 
 * @param adSpot - El AdSpot a mostrar en el preview
 * @param placement - El placement en el cual mostrar el preview
 */
export const AdSpotPreview = memo(function AdSpotPreview({
  adSpot,
  placement,
}: {
  adSpot: AdSpot;
  placement: AdSpotPlacement;
}) {
  // Estilos y posicionamiento según el placement
  const getPlacementStyles = () => {
    switch (placement) {
      case 'home_screen':
        return {
          container: 'top-4 left-4 right-4',
          card: 'w-full',
        };
      case 'ride_summary':
        return {
          container: 'bottom-20 left-4 right-4',
          card: 'w-full',
        };
      case 'map_view':
        return {
          container: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          card: 'w-64',
        };
      default:
        return {
          container: 'top-4 left-4 right-4',
          card: 'w-full',
        };
    }
  };

  const styles = getPlacementStyles();

  return (
    <div className="relative w-full h-[600px] bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
      {/* Mock de pantalla móvil */}
      <div className="absolute inset-0 flex flex-col">
        {/* Barra de estado (mock) */}
        <div className="h-8 bg-gray-800 dark:bg-gray-900 flex items-center justify-between px-4 text-white text-xs">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2 border border-white rounded-sm" />
            <div className="w-6 h-2 bg-white rounded-sm" />
          </div>
        </div>

        {/* Contenido de la app (mock) */}
        <div className="flex-1 bg-white dark:bg-gray-950 relative overflow-hidden">
          {/* Simulación de contenido de la app según placement */}
          {placement === 'home_screen' && (
            <div className="p-4 space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          )}

          {placement === 'ride_summary' && (
            <div className="p-4 space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          )}

          {placement === 'map_view' && (
            <div className="relative w-full h-full">
              {/* Simulación de mapa */}
              <div className="absolute inset-0 bg-linear-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full" />
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-blue-500 rounded-full" />
                <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </div>
          )}

          {/* AdSpot Preview Card */}
          <div className={`absolute ${styles.container} z-10`}>
            <Card className={`${styles.card} shadow-xl border-2 border-primary/50 bg-white dark:bg-gray-900`}>
              <div className="relative w-full aspect-video overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
                <Image
                  src={adSpot.imageUrl}
                  alt={adSpot.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2">{adSpot.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {placement === 'home_screen' && 'Anuncio en pantalla principal'}
                  {placement === 'ride_summary' && 'Anuncio en resumen de viaje'}
                  {placement === 'map_view' && 'Anuncio en vista de mapa'}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Barra de navegación (mock) */}
        <div className="h-16 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 flex items-center justify-around">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
});

