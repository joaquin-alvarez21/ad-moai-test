'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

/**
 * Componente Client Component para el botón de limpiar filtros.
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando los props no cambian.
 * 
 * @param onClick - Callback cuando se hace click en el botón
 * @param disabled - Si el botón está deshabilitado
 */
export const ClearFiltersButton = memo(function ClearFiltersButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="sm:w-auto"
    >
      <X className="mr-2 h-4 w-4" />
      Limpiar filtros
    </Button>
  );
});

