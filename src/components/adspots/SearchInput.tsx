'use client';

import { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

/**
 * Componente Client Component para el input de búsqueda.
 * 
 * Usa React.memo para evitar re-renders innecesarios cuando los props no cambian.
 * 
 * @param value - El valor actual del input
 * @param onChange - Callback cuando cambia el valor
 * @param disabled - Si el input está deshabilitado
 */
export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
        disabled={disabled}
      />
    </div>
  );
});

