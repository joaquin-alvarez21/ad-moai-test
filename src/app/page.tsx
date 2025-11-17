import { redirect } from 'next/navigation';

/**
 * Página raíz que redirige automáticamente a la lista de AdSpots.
 * 
 * No se implementa una landing page específica ya que la funcionalidad
 * principal de la aplicación es la gestión de AdSpots.
 */
export default function HomePage() {
  redirect('/adspots');
}

