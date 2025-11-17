'use client';

import { memo } from 'react';
import type { AdSpot } from '@/lib/types/adspot';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdSpotLifecycleTimeline } from './AdSpotLifecycleTimeline';

/**
 * Componente Client Component para mostrar un modal con el timeline del ciclo de vida de un AdSpot.
 * 
 * @param adSpot - El AdSpot del cual mostrar el timeline
 * @param open - Si el modal está abierto
 * @param onOpenChange - Callback cuando cambia el estado de apertura
 */
export const AdSpotLifecycleModal = memo(function AdSpotLifecycleModal({
  adSpot,
  open,
  onOpenChange,
}: {
  adSpot: AdSpot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ciclo de vida: {adSpot.title}</DialogTitle>
          <DialogDescription>
            Timeline visual del ciclo de vida del AdSpot
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AdSpotLifecycleTimeline adSpot={adSpot} />
        </div>
      </DialogContent>
    </Dialog>
  );
});

