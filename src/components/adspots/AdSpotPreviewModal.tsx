'use client';

import { memo, useState } from 'react';
import type { AdSpot, AdSpotPlacement } from '@/lib/types/adspot';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdSpotPreview } from './AdSpotPreview';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatPlacement } from '@/lib/helpers/adspotFormatters';

/**
 * Componente Client Component para mostrar un modal con el preview de un AdSpot.
 * 
 * Permite ver cómo se vería el AdSpot en diferentes placements y cambiar
 * dinámicamente entre ellos sin cerrar el modal.
 * 
 * @param adSpot - El AdSpot del cual mostrar el preview
 * @param open - Si el modal está abierto
 * @param onOpenChange - Callback cuando cambia el estado de apertura
 */
export const AdSpotPreviewModal = memo(function AdSpotPreviewModal({
  adSpot,
  open,
  onOpenChange,
}: {
  adSpot: AdSpot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedPlacement, setSelectedPlacement] = useState<AdSpotPlacement>(
    adSpot.placement
  );

  const placements: AdSpotPlacement[] = ['home_screen', 'ride_summary', 'map_view'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {adSpot.title}</DialogTitle>
          <DialogDescription>
            Visualiza cómo se vería este anuncio en diferentes ubicaciones de la aplicación
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selector de placement */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Seleccionar placement:</label>
            <ToggleGroup
              type="single"
              value={selectedPlacement}
              onValueChange={(value) => {
                if (value) {
                  setSelectedPlacement(value as AdSpotPlacement);
                }
              }}
              className="justify-start"
            >
              {placements.map((placement) => (
                <ToggleGroupItem
                  key={placement}
                  value={placement}
                  aria-label={`Ver preview en ${formatPlacement(placement)}`}
                >
                  {formatPlacement(placement)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Preview del AdSpot */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <AdSpotPreview adSpot={adSpot} placement={selectedPlacement} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

