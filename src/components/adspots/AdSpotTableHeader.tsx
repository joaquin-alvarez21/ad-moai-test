import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Componente Server Component para el header de la tabla de AdSpots.
 * 
 * Este componente es puro y no requiere interactividad, por lo que
 * puede ser un Server Component.
 */
export function AdSpotTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Imagen</TableHead>
        <TableHead>Título</TableHead>
        <TableHead>Placement</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead>TTL</TableHead>
        <TableHead>Creado</TableHead>
        <TableHead>Timeline</TableHead>
        <TableHead>Preview</TableHead>
        <TableHead>Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}

