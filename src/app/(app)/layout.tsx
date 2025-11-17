import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { List, Plus } from 'lucide-react';

/**
 * Layout para la aplicación de administración de AdSpots.
 * 
 * Este layout proporciona un shell simple con navegación para las rutas
 * de administración de AdSpots.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/adspots" className="text-lg font-semibold">
                AdSpots Admin
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/adspots" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    Lista
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/adspots/new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Crear
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

