'use client';

import { memo } from 'react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';

/**
 * Componente Client Component para los filtros de placement (chips).
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando los props no cambian.
 * 
 * @param value - El placement seleccionado actualmente
 * @param onValueChange - Callback cuando cambia el placement
 */
export const PlacementFilters = memo(function PlacementFilters({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Placement</label>
      <ToggleGroup
        type="single"
        value={value || undefined}
        onValueChange={onValueChange}
        className="flex flex-wrap gap-2"
      >
        <ToggleGroupItem value="home_screen" aria-label="Home Screen">
          Home Screen
        </ToggleGroupItem>
        <ToggleGroupItem value="ride_summary" aria-label="Ride Summary">
          Ride Summary
        </ToggleGroupItem>
        <ToggleGroupItem value="map_view" aria-label="Map View">
          Map View
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
});

