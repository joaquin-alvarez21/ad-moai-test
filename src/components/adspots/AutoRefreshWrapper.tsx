'use client';

import { useAutoRefresh } from '@/lib/hooks/useAutoRefresh';

/**
 * Componente wrapper que implementa auto-refresh automático de la página.
 * 
 * Este componente debe envolver el contenido de una página que necesita
 * actualizarse automáticamente cada cierto intervalo (por defecto 60 segundos).
 * 
 * Usa `router.refresh()` para refrescar los datos del servidor sin recargar
 * completamente la página, manteniendo el estado del cliente.
 * 
 * @param children - Contenido a envolver
 * @param intervalSeconds - Intervalo en segundos para el refresh (default: 60)
 * 
 * @example
 * ```tsx
 * // En un Server Component
 * export default function MyPage() {
 *   return (
 *     <AutoRefreshWrapper>
 *       <MyContent />
 *     </AutoRefreshWrapper>
 *   );
 * }
 * ```
 */
export function AutoRefreshWrapper({
  children,
  intervalSeconds = 60,
}: {
  children: React.ReactNode;
  intervalSeconds?: number;
}) {
  // Hook que maneja el auto-refresh cada X segundos
  useAutoRefresh(intervalSeconds);

  return <>{children}</>;
}

