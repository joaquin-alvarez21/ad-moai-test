import { adSpotService } from '@/lib/services/adspotService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatPlacement } from '@/lib/helpers/adspotFormatters';

/**
 * Componente Server Component para mostrar métricas de AdSpots.
 * 
 * Muestra:
 * - Número total de AdSpots
 * - Número de activos
 * - Número de expirados por TTL vs desactivados manualmente
 * - Porcentaje de ocupación por placement
 */
export async function AdSpotMetricsCard() {
  const metrics = await adSpotService.getMetrics();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total de AdSpots */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de AdSpots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total}</div>
          <p className="text-xs text-muted-foreground">
            Total de anuncios en el sistema
          </p>
        </CardContent>
      </Card>

      {/* AdSpots activos e inactivos combinados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado de AdSpots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Activos */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">AdSpots Activos</span>
                <div className="text-2xl font-bold">{metrics.active}</div>
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.total > 0
                  ? `${Math.round((metrics.active / metrics.total) * 100)}% del total`
                  : '0% del total'}
              </p>
            </div>

            {/* Separador */}
            <div className="border-t" />

            {/* Inactivos */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Inactivos</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expirados por TTL</span>
                  <Badge variant="secondary">{metrics.inactive.expiredByTTL}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Desactivados manualmente</span>
                  <Badge variant="secondary">{metrics.inactive.deactivatedByUser}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribución por placement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribución por Placement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.placementDistribution.map((item) => (
              <div key={item.placement} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{formatPlacement(item.placement)}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {item.count} {item.count === 1 ? 'anuncio' : 'anuncios'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

