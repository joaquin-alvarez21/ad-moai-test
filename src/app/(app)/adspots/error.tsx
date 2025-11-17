'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

/**
 * Componente de error para la página de AdSpots.
 * 
 * Muestra un mensaje de error usando el componente Alert de shadcn
 * con variant="destructive" para indicar un fallo en la carga de datos.
 * 
 * @param error - El error que ocurrió
 * @param reset - Función para intentar recargar la página
 */
export default function AdSpotsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error para debugging
    console.error('Error en la página de AdSpots:', error);
  }, [error]);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AdSpots</h1>
        <p className="text-muted-foreground">
          Gestiona los anuncios de la aplicación móvil
        </p>
      </div>

      {/* Alert de error */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar AdSpots</AlertTitle>
        <AlertDescription>
          <p className="mb-4">
            Ocurrió un error al intentar cargar los AdSpots. Por favor, intenta
            nuevamente.
          </p>
          {error.message && (
            <p className="text-sm text-muted-foreground mb-4">
              Detalles: {error.message}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="mt-2"
          >
            Intentar nuevamente
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

