import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import { adSpotService } from './adspotService';
import * as memoryStoreModule from '@/lib/api/memoryStore';
import * as adspotFiltersModule from '@/lib/helpers/adspotFilters';
import * as adspotMetricsModule from './adspotMetrics';
import type {
  AdSpot,
  AdSpotCreatePayload,
  AdSpotFilter,
} from '@/lib/types/adspot';

// Mock del módulo memoryStore
vi.mock('@/lib/api/memoryStore', () => ({
  adSpotStore: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

// Mock del módulo de filtros
vi.mock('@/lib/helpers/adspotFilters', () => ({
  filterAdSpotsByPlacement: vi.fn(),
  filterAdSpotsBySearch: vi.fn(),
}));

// Mock del módulo de métricas
vi.mock('./adspotMetrics', () => ({
  calculateAdSpotMetrics: vi.fn(),
}));

describe('AdSpotService', () => {
  // Datos de prueba
  const mockAdSpot: AdSpot = {
    id: 'test-id-1',
    title: 'Test Ad',
    imageUrl: 'https://example.com/image.jpg',
    placement: 'home_screen',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
  };

  const mockAdSpots: AdSpot[] = [
    mockAdSpot,
    {
      id: 'test-id-2',
      title: 'Another Ad',
      imageUrl: 'https://example.com/image2.jpg',
      placement: 'ride_summary',
      status: 'active',
      createdAt: '2024-01-15T11:00:00Z',
    },
  ];

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    vi.clearAllMocks();
    // Resetear el entorno a servidor por defecto
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    // Resetear process.env
    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  describe('getAllAdSpots', () => {
    it('debe obtener todos los AdSpots desde el store cuando se ejecuta en el servidor', async () => {
      const getAllMock = memoryStoreModule.adSpotStore.getAll as MockedFunction<
        typeof memoryStoreModule.adSpotStore.getAll
      >;
      getAllMock.mockReturnValue(mockAdSpots);

      const result = await adSpotService.getAllAdSpots();

      expect(getAllMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAdSpots);
    });

    it('debe usar fetch cuando se ejecuta en el cliente', async () => {
      // Simular entorno de cliente
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockAdSpots }),
      });
      global.fetch = mockFetch;

      const result = await adSpotService.getAllAdSpots();

      expect(mockFetch).toHaveBeenCalledWith('/api/adspots', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockAdSpots);
    });

    it('debe lanzar un error si fetch falla en el cliente', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });
      global.fetch = mockFetch;

      await expect(adSpotService.getAllAdSpots()).rejects.toThrow(
        'Error al obtener AdSpots: Internal Server Error'
      );
    });

    it('debe usar NEXT_PUBLIC_APP_URL si está definido en el cliente', async () => {
      // En el cliente, NEXT_PUBLIC_APP_URL se usa para construir la URL base
      // pero el servicio usa ruta relativa cuando window está definido
      // Este test verifica que en el cliente se usa la ruta relativa
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockAdSpots }),
      });
      global.fetch = mockFetch;

      await adSpotService.getAllAdSpots();

      // En el cliente, siempre se usa ruta relativa
      expect(mockFetch).toHaveBeenCalledWith('/api/adspots', expect.any(Object));
    });
  });

  describe('getActiveAdSpotsFiltered', () => {
    it('debe filtrar AdSpots activos por placement', async () => {
      const getAllMock = memoryStoreModule.adSpotStore.getAll as MockedFunction<
        typeof memoryStoreModule.adSpotStore.getAll
      >;
      const filterByPlacementMock = adspotFiltersModule.filterAdSpotsByPlacement as MockedFunction<
        typeof adspotFiltersModule.filterAdSpotsByPlacement
      >;

      getAllMock.mockReturnValue(mockAdSpots);
      filterByPlacementMock.mockReturnValue([mockAdSpot]);

      const filter: AdSpotFilter = {
        placement: 'home_screen',
      };

      const result = await adSpotService.getActiveAdSpotsFiltered(filter);

      expect(getAllMock).toHaveBeenCalledTimes(1);
      expect(filterByPlacementMock).toHaveBeenCalledWith(
        expect.arrayContaining([mockAdSpot]),
        'home_screen'
      );
      expect(result).toEqual([mockAdSpot]);
    });

    it('debe filtrar AdSpots activos por búsqueda', async () => {
      const getAllMock = memoryStoreModule.adSpotStore.getAll as MockedFunction<
        typeof memoryStoreModule.adSpotStore.getAll
      >;
      const filterBySearchMock = adspotFiltersModule.filterAdSpotsBySearch as MockedFunction<
        typeof adspotFiltersModule.filterAdSpotsBySearch
      >;

      getAllMock.mockReturnValue(mockAdSpots);
      filterBySearchMock.mockReturnValue([mockAdSpot]);

      const filter: AdSpotFilter = {
        search: 'Test',
      };

      const result = await adSpotService.getActiveAdSpotsFiltered(filter);

      expect(getAllMock).toHaveBeenCalledTimes(1);
      expect(filterBySearchMock).toHaveBeenCalledWith(
        expect.arrayContaining([mockAdSpot]),
        'Test'
      );
      expect(result).toEqual([mockAdSpot]);
    });

    it('debe aplicar múltiples filtros (placement y búsqueda)', async () => {
      const getAllMock = memoryStoreModule.adSpotStore.getAll as MockedFunction<
        typeof memoryStoreModule.adSpotStore.getAll
      >;
      const filterByPlacementMock = adspotFiltersModule.filterAdSpotsByPlacement as MockedFunction<
        typeof adspotFiltersModule.filterAdSpotsByPlacement
      >;
      const filterBySearchMock = adspotFiltersModule.filterAdSpotsBySearch as MockedFunction<
        typeof adspotFiltersModule.filterAdSpotsBySearch
      >;

      getAllMock.mockReturnValue(mockAdSpots);
      filterByPlacementMock.mockReturnValue([mockAdSpot]);
      filterBySearchMock.mockReturnValue([mockAdSpot]);

      const filter: AdSpotFilter = {
        placement: 'home_screen',
        search: 'Test',
      };

      const result = await adSpotService.getActiveAdSpotsFiltered(filter);

      expect(filterByPlacementMock).toHaveBeenCalled();
      expect(filterBySearchMock).toHaveBeenCalled();
      expect(result).toEqual([mockAdSpot]);
    });

    it('debe retornar solo AdSpots activos según TTL', async () => {
      const activeAdSpot: AdSpot = {
        ...mockAdSpot,
        status: 'active',
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
        ttlMinutes: 60,
      };

      const expiredAdSpot: AdSpot = {
        ...mockAdSpot,
        id: 'expired-id',
        status: 'active',
        createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
        ttlMinutes: 60, // Expiró
      };

      const inactiveAdSpot: AdSpot = {
        ...mockAdSpot,
        id: 'inactive-id',
        status: 'inactive',
      };

      const getAllMock = memoryStoreModule.adSpotStore.getAll as MockedFunction<
        typeof memoryStoreModule.adSpotStore.getAll
      >;
      getAllMock.mockReturnValue([activeAdSpot, expiredAdSpot, inactiveAdSpot]);

      const filter: AdSpotFilter = {};

      const result = await adSpotService.getActiveAdSpotsFiltered(filter);

      // Solo el activeAdSpot debe estar en el resultado
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(activeAdSpot.id);
    });
  });

  describe('createAdSpot', () => {
    const createPayload: AdSpotCreatePayload = {
      title: 'New Ad',
      imageUrl: 'https://example.com/new-image.jpg',
      placement: 'map_view',
      ttlMinutes: 120,
    };

    it('debe crear un AdSpot usando el store cuando se ejecuta en el servidor', async () => {
      const createMock = memoryStoreModule.adSpotStore.create as MockedFunction<
        typeof memoryStoreModule.adSpotStore.create
      >;
      createMock.mockReturnValue(mockAdSpot);

      const result = await adSpotService.createAdSpot(createPayload);

      expect(createMock).toHaveBeenCalledWith(createPayload);
      expect(result).toEqual(mockAdSpot);
    });

    it('debe crear un AdSpot usando fetch cuando se ejecuta en el cliente', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockAdSpot }),
      });
      global.fetch = mockFetch;

      const result = await adSpotService.createAdSpot(createPayload);

      expect(mockFetch).toHaveBeenCalledWith('/api/adspots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPayload),
      });
      expect(result).toEqual(mockAdSpot);
    });

    it('debe lanzar un error si fetch falla con error de validación', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          error: 'Error de validación',
          details: ['El título es requerido', 'La URL no es válida'],
        }),
      });
      global.fetch = mockFetch;

      await expect(adSpotService.createAdSpot(createPayload)).rejects.toThrow(
        'Error de validación: El título es requerido, La URL no es válida'
      );
    });

    it('debe lanzar un error si fetch falla sin detalles', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Bad Request' }),
      });
      global.fetch = mockFetch;

      await expect(adSpotService.createAdSpot(createPayload)).rejects.toThrow(
        'Error al crear AdSpot: Bad Request'
      );
    });
  });

  describe('deactivateAdSpot', () => {
    it('debe desactivar un AdSpot usando el store cuando se ejecuta en el servidor', async () => {
      const updateStatusMock = memoryStoreModule.adSpotStore.updateStatus as MockedFunction<
        typeof memoryStoreModule.adSpotStore.updateStatus
      >;
      updateStatusMock.mockReturnValue({ ...mockAdSpot, status: 'inactive' });

      await adSpotService.deactivateAdSpot('test-id-1');

      expect(updateStatusMock).toHaveBeenCalledWith('test-id-1', 'inactive');
    });

    it('debe lanzar un error si el AdSpot no existe en el servidor', async () => {
      const updateStatusMock = memoryStoreModule.adSpotStore.updateStatus as MockedFunction<
        typeof memoryStoreModule.adSpotStore.updateStatus
      >;
      updateStatusMock.mockReturnValue(undefined);

      await expect(adSpotService.deactivateAdSpot('non-existent-id')).rejects.toThrow(
        'AdSpot con id non-existent-id no encontrado'
      );
    });

    it('debe desactivar un AdSpot usando fetch cuando se ejecuta en el cliente', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
      });
      global.fetch = mockFetch;

      await adSpotService.deactivateAdSpot('test-id-1');

      expect(mockFetch).toHaveBeenCalledWith('/api/adspots/test-id-1/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('debe lanzar un error si fetch retorna 404 en el cliente', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      global.fetch = mockFetch;

      await expect(adSpotService.deactivateAdSpot('non-existent-id')).rejects.toThrow(
        'AdSpot con id non-existent-id no encontrado'
      );
    });

    it('debe lanzar un error si fetch falla en el cliente', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });
      global.fetch = mockFetch;

      await expect(adSpotService.deactivateAdSpot('test-id-1')).rejects.toThrow(
        'Error al desactivar AdSpot: Internal Server Error'
      );
    });
  });

  describe('toggleAdSpot', () => {
    it('debe alternar de active a inactive usando el store en el servidor', async () => {
      const updatedAdSpot = { ...mockAdSpot, status: 'inactive' as const };
      const updateStatusMock = memoryStoreModule.adSpotStore.updateStatus as MockedFunction<
        typeof memoryStoreModule.adSpotStore.updateStatus
      >;
      updateStatusMock.mockReturnValue(updatedAdSpot);

      const result = await adSpotService.toggleAdSpot('test-id-1', 'active');

      expect(updateStatusMock).toHaveBeenCalledWith('test-id-1', 'inactive');
      expect(result).toEqual(updatedAdSpot);
    });

    it('debe alternar de inactive a active usando el store en el servidor', async () => {
      const inactiveAdSpot = { ...mockAdSpot, status: 'inactive' as const };
      const activeAdSpot = { ...mockAdSpot, status: 'active' as const };
      const updateStatusMock = memoryStoreModule.adSpotStore.updateStatus as MockedFunction<
        typeof memoryStoreModule.adSpotStore.updateStatus
      >;
      updateStatusMock.mockReturnValue(activeAdSpot);

      const result = await adSpotService.toggleAdSpot('test-id-1', 'inactive');

      expect(updateStatusMock).toHaveBeenCalledWith('test-id-1', 'active');
      expect(result).toEqual(activeAdSpot);
    });

    it('debe lanzar un error si el AdSpot no existe al alternar en el servidor', async () => {
      const updateStatusMock = memoryStoreModule.adSpotStore.updateStatus as MockedFunction<
        typeof memoryStoreModule.adSpotStore.updateStatus
      >;
      updateStatusMock.mockReturnValue(undefined);

      await expect(adSpotService.toggleAdSpot('non-existent-id', 'active')).rejects.toThrow(
        'AdSpot con id non-existent-id no encontrado'
      );
    });

    it('debe alternar usando fetch cuando se ejecuta en el cliente', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const updatedAdSpot = { ...mockAdSpot, status: 'inactive' as const };
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: updatedAdSpot }),
      });
      global.fetch = mockFetch;

      const result = await adSpotService.toggleAdSpot('test-id-1', 'active');

      expect(mockFetch).toHaveBeenCalledWith('/api/adspots/test-id-1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'inactive' }),
      });
      expect(result).toEqual(updatedAdSpot);
    });

    it('debe lanzar un error si fetch retorna 404 al alternar en el cliente', async () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      global.fetch = mockFetch;

      await expect(adSpotService.toggleAdSpot('non-existent-id', 'active')).rejects.toThrow(
        'AdSpot con id non-existent-id no encontrado'
      );
    });
  });

  describe('getMetrics', () => {
    it('debe calcular métricas usando el módulo de métricas', async () => {
      const mockMetrics = {
        total: 2,
        active: 1,
        inactive: {
          expiredByTTL: 0,
          deactivatedByUser: 1,
        },
        placementDistribution: [
          { placement: 'home_screen' as const, count: 1, percentage: 50 },
          { placement: 'ride_summary' as const, count: 1, percentage: 50 },
          { placement: 'map_view' as const, count: 0, percentage: 0 },
        ],
      };

      const getAllMock = memoryStoreModule.adSpotStore.getAll as MockedFunction<
        typeof memoryStoreModule.adSpotStore.getAll
      >;
      const calculateMetricsMock = adspotMetricsModule.calculateAdSpotMetrics as MockedFunction<
        typeof adspotMetricsModule.calculateAdSpotMetrics
      >;

      getAllMock.mockReturnValue(mockAdSpots);
      calculateMetricsMock.mockReturnValue(mockMetrics);

      const result = await adSpotService.getMetrics();

      expect(getAllMock).toHaveBeenCalledTimes(1);
      expect(calculateMetricsMock).toHaveBeenCalledWith(mockAdSpots);
      expect(result).toEqual(mockMetrics);
    });
  });
});

