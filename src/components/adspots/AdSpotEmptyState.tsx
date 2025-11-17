import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Componente Server Component para mostrar el estado vacío cuando no hay AdSpots.
 * 
 * Este componente es puro y no requiere interactividad, por lo que
 * puede ser un Server Component.
 */
export function AdSpotEmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No hay AdSpots</CardTitle>
        <CardDescription>
          No se encontraron AdSpots con los filtros aplicados.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

