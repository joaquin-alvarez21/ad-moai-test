'use client';

import { memo } from 'react';
import Image from 'next/image';
import type { AdSpot } from '@/lib/types/adspot';

/**
 * Componente Client Component para mostrar la imagen de un AdSpot.
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando el adSpot no cambia.
 * 
 * @param adSpot - El AdSpot del cual mostrar la imagen
 */
export const AdSpotRowImage = memo(function AdSpotRowImage({
  adSpot,
}: {
  adSpot: AdSpot;
}) {
  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
      <Image
        src={adSpot.imageUrl}
        alt={adSpot.title}
        fill
        className="object-cover"
        sizes="64px"
      />
    </div>
  );
});

