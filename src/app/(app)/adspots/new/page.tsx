import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AdSpotForm } from '@/components/adspots/AdSpotForm';
import { ArrowLeft } from 'lucide-react';

/**
 * Página de creación de AdSpots.
 * 
 * Server Component que renderiza un formulario para crear nuevos AdSpots.
 * 
 * @returns La página de creación con el formulario
 */
export default function NewAdSpotPage() {
  return (
    <div className="space-y-6">
      {/* Botón para volver a la lista */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/adspots" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Link>
      </Button>

      {/* Card con el formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Crear nuevo AdSpot</CardTitle>
          <CardDescription>
            Completa el formulario para crear un nuevo anuncio. Los campos
            marcados con <span className="text-destructive">*</span> son
            obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdSpotForm />
        </CardContent>
      </Card>
    </div>
  );
}

