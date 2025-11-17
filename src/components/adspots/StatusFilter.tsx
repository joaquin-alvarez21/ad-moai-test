'use client';

import { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Componente Client Component para el filtro de status.
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando los props no cambian.
 * 
 * @param value - El status seleccionado actualmente
 * @param onValueChange - Callback cuando cambia el status
 * @param disabled - Si el select está deshabilitado
 */
export const StatusFilter = memo(function StatusFilter({
  value,
  onValueChange,
  disabled,
}: {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Todos los estados" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los estados</SelectItem>
        <SelectItem value="active">Activo</SelectItem>
        <SelectItem value="inactive">Inactivo</SelectItem>
      </SelectContent>
    </Select>
  );
});

