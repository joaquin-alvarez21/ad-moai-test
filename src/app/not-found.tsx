import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Home } from 'lucide-react';

/**
 * Página 404 (Not Found) para rutas que no existen.
 * 
 * Se muestra automáticamente cuando Next.js no encuentra una ruta coincidente.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <span className="text-3xl font-bold text-muted-foreground">404</span>
          </div>
          <CardTitle className="text-2xl">Página no encontrada</CardTitle>
          <CardDescription>
            La página que estás buscando no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Puedes volver a la página principal o navegar a las siguientes opciones:</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/adspots" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Ir a AdSpots
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/adspots/new">
                Crear nuevo AdSpot
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

