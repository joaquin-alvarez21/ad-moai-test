import type { AdSpot } from '@/lib/types/adspot';
import { Table, TableBody } from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdSpotListItem } from './AdSpotListItem';
import { AdSpotTableHeader } from './AdSpotTableHeader';
import { AdSpotEmptyState } from './AdSpotEmptyState';

/**
 * Componente Server Component que muestra una lista de AdSpots en formato tabla.
 * 
 * Este componente solo recibe props y delega el renderizado de cada fila
 * al componente AdSpotListItem (Client Component) que maneja la interactividad.
 * 
 * La descomposición en componentes más pequeños permite:
 * - Mejor modularización y reutilización
 * - Separación de responsabilidades (header, empty state, lista)
 * - Optimización del bundle (componentes más pequeños)
 * 
 * @param adSpots - Array de AdSpots a mostrar
 */
export function AdSpotList({ adSpots }: { adSpots: AdSpot[] }) {
  if (adSpots.length === 0) {
    return <AdSpotEmptyState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de AdSpots</CardTitle>
        <CardDescription>
          {adSpots.length}{' '}
          {adSpots.length === 1 ? 'AdSpot encontrado' : 'AdSpots encontrados'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <AdSpotTableHeader />
          <TableBody>
            {adSpots.map((adSpot) => (
              <AdSpotListItem key={adSpot.id} adSpot={adSpot} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

