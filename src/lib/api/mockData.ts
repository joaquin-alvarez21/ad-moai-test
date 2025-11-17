import type { AdSpot } from '@/lib/types/adspot';

/**
 * Datos mock para AdSpots.
 * 
 * Este módulo contiene datos de ejemplo para desarrollo y visualización.
 * Los datos se inicializan con fechas relativas al momento actual para
 * poder probar diferentes escenarios (activos, expirados, con/sin TTL).
 * 
 * @returns Array de AdSpots de ejemplo
 */
export function getMockAdSpots(): AdSpot[] {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return [
    {
      id: 'mock-1',
      title: 'Promoción Verano 2024',
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      placement: 'home_screen',
      status: 'active',
      createdAt: oneHourAgo.toISOString(),
      ttlMinutes: 120, // Expira en 2 horas desde la creación
    },
    {
      id: 'mock-2',
      title: 'Oferta Especial de Fin de Semana',
      imageUrl: 'https://picsum.photos/400/300?random=2',
      placement: 'ride_summary',
      status: 'active',
      createdAt: twoHoursAgo.toISOString(),
      // Sin TTL - no expira
    },
    {
      id: 'mock-3',
      title: 'Descuento en Viajes Largos',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
      placement: 'map_view',
      status: 'active',
      createdAt: now.toISOString(),
      ttlMinutes: 30, // Expira en 30 minutos
    },
    {
      id: 'mock-4',
      title: 'Nuevo Usuario - 20% OFF',
      imageUrl: 'https://picsum.photos/400/300?random=4',
      placement: 'home_screen',
      status: 'active',
      createdAt: oneDayAgo.toISOString(),
      ttlMinutes: 1440, // Expira en 24 horas (ya pasó)
    },
    {
      id: 'mock-5',
      title: 'Programa de Fidelidad',
      imageUrl: 'https://picsum.photos/400/300?random=5',
      placement: 'ride_summary',
      status: 'inactive',
      createdAt: oneDayAgo.toISOString(),
      deactivatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-6',
      title: 'Campaña de Lanzamiento',
      imageUrl: 'https://picsum.photos/400/300?random=6',
      placement: 'map_view',
      status: 'active',
      createdAt: new Date(now.getTime() - 10 * 60 * 1000).toISOString(), // Hace 10 minutos
      ttlMinutes: 60, // Expira en 1 hora
    },
    {
      id: 'mock-7',
      title: 'Promoción Black Friday',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
      placement: 'home_screen',
      status: 'active',
      createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // Hace 5 minutos
      // Sin TTL
    },
    {
      id: 'mock-8',
      title: 'Descuento para Estudiantes',
      imageUrl: 'https://picsum.photos/400/300?random=7',
      placement: 'ride_summary',
      status: 'active',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // Hace 15 minutos
      ttlMinutes: 45, // Expira en 45 minutos (aún activo)
    },
  ];
}

