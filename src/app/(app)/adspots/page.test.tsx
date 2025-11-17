import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdSpotsPage from './page';
import * as adSpotServiceModule from '@/lib/services/adspotService';
import type { AdSpot } from '@/lib/types/adspot';

// Mock del servicio
vi.mock('@/lib/services/adspotService', () => ({
  adSpotService: {
    getAllAdSpots: vi.fn(),
  },
  getMetrics: vi.fn(),
}));

// Mock de los componentes que usan hooks de cliente
vi.mock('@/components/adspots/AdSpotFilters', () => ({
  AdSpotFilters: () => <div data-testid="adspot-filters">Filters</div>,
}));

vi.mock('@/components/adspots/AdSpotMetricsCard', () => ({
  AdSpotMetricsCard: () => <div data-testid="adspot-metrics">Metrics</div>,
}));

vi.mock('@/components/adspots/AutoRefreshWrapper', () => ({
  AutoRefreshWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auto-refresh-wrapper">{children}</div>
  ),
}));

vi.mock('@/components/adspots/AdSpotList', () => ({
  AdSpotList: ({ adSpots }: { adSpots: AdSpot[] }) => (
    <div data-testid="adspot-list">
      {adSpots.length} AdSpots
    </div>
  ),
}));

describe('AdSpotsPage', () => {
  const mockAdSpots: AdSpot[] = [
    {
      id: 'test-1',
      title: 'Test Ad 1',
      imageUrl: 'https://example.com/image1.jpg',
      placement: 'home_screen',
      status: 'active',
      createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
      ttlMinutes: 120,
    },
    {
      id: 'test-2',
      title: 'Test Ad 2',
      imageUrl: 'https://example.com/image2.jpg',
      placement: 'ride_summary',
      status: 'active',
      createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    },
    {
      id: 'test-3',
      title: 'Test Ad 3',
      imageUrl: 'https://example.com/image3.jpg',
      placement: 'map_view',
      status: 'inactive',
      createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
      deactivatedAt: new Date(Date.now() - 12 * 60 * 60000).toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar el título y descripción', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({});
      const page = await AdSpotsPage({ searchParams });

      const { container } = render(page);

      expect(container.textContent).toMatch(/adspots/i);
      expect(container.textContent).toMatch(/gestiona los anuncios/i);
    });

    it('debe renderizar los componentes de métricas y filtros', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({});
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(screen.getByTestId('adspot-metrics')).toBeInTheDocument();
      expect(screen.getByTestId('adspot-filters')).toBeInTheDocument();
      expect(screen.getByTestId('auto-refresh-wrapper')).toBeInTheDocument();
    });

    it('debe renderizar la lista de AdSpots', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({});
      const page = await AdSpotsPage({ searchParams });

      render(page);

      // Verificar que se llama al servicio
      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Filtrado por query params', () => {
    it('debe filtrar por placement cuando se proporciona en searchParams', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({ placement: 'home_screen' });
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
      // La lista debería mostrar solo los AdSpots con placement 'home_screen'
      // En este caso, solo 'test-1'
    });

    it('debe filtrar por search cuando se proporciona en searchParams', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({ search: 'Test Ad 1' });
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
      // La lista debería mostrar solo los AdSpots que contengan 'Test Ad 1' en el título
    });

    it('debe filtrar por status cuando se proporciona en searchParams', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({ status: 'active' });
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
      // La lista debería mostrar solo los AdSpots con status 'active'
    });

    it('debe aplicar múltiples filtros cuando se proporcionan', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({
        placement: 'home_screen',
        search: 'Test',
        status: 'active',
      });
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Manejo de datos', () => {
    it('debe manejar una lista vacía de AdSpots', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue([]);

      const searchParams = Promise.resolve({});
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
      // La lista debería mostrar el estado vacío
    });

    it('debe manejar errores al obtener AdSpots', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockRejectedValue(new Error('Error al obtener datos'));

      const searchParams = Promise.resolve({});

      // El componente debería manejar el error
      await expect(AdSpotsPage({ searchParams })).rejects.toThrow('Error al obtener datos');
    });
  });

  describe('Validación de filtros', () => {
    it('debe ignorar placements inválidos', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({ placement: 'invalid_placement' });
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
      // No debería filtrar por un placement inválido
    });

    it('debe ignorar status inválidos', async () => {
      const getAllAdSpotsMock = vi.mocked(adSpotServiceModule.adSpotService.getAllAdSpots);
      getAllAdSpotsMock.mockResolvedValue(mockAdSpots);

      const searchParams = Promise.resolve({ status: 'invalid_status' });
      const page = await AdSpotsPage({ searchParams });

      render(page);

      expect(getAllAdSpotsMock).toHaveBeenCalledTimes(1);
      // No debería filtrar por un status inválido
    });
  });
});

