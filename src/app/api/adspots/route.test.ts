import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import * as memoryStoreModule from '@/lib/api/memoryStore';
import * as validatorModule from '@/lib/validators/adspot';
import type { AdSpot, AdSpotCreatePayload } from '@/lib/types/adspot';
import * as yup from 'yup';

// Mock del memoryStore
vi.mock('@/lib/api/memoryStore', () => ({
  adSpotStore: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

// Mock del validador
vi.mock('@/lib/validators/adspot', () => ({
  adSpotCreateSchema: {
    validate: vi.fn(),
  },
}));

describe('API Route: /api/adspots', () => {
  const mockAdSpots: AdSpot[] = [
    {
      id: 'test-1',
      title: 'Test Ad 1',
      imageUrl: 'https://example.com/image1.jpg',
      placement: 'home_screen',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'test-2',
      title: 'Test Ad 2',
      imageUrl: 'https://example.com/image2.jpg',
      placement: 'ride_summary',
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'test-3',
      title: 'Test Ad 3',
      imageUrl: 'https://example.com/image3.jpg',
      placement: 'map_view',
      status: 'inactive',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/adspots', () => {
    it('debe retornar todos los AdSpots cuando no hay filtros', async () => {
      const getAllMock = vi.mocked(memoryStoreModule.adSpotStore.getAll);
      getAllMock.mockReturnValue(mockAdSpots);

      const request = new NextRequest('http://localhost:3000/api/adspots');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockAdSpots);
      expect(getAllMock).toHaveBeenCalledTimes(1);
    });

    it('debe filtrar por placement cuando se proporciona en query params', async () => {
      const getAllMock = vi.mocked(memoryStoreModule.adSpotStore.getAll);
      getAllMock.mockReturnValue(mockAdSpots);

      const request = new NextRequest(
        'http://localhost:3000/api/adspots?placement=home_screen'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].placement).toBe('home_screen');
    });

    it('debe filtrar por status cuando se proporciona en query params', async () => {
      const getAllMock = vi.mocked(memoryStoreModule.adSpotStore.getAll);
      getAllMock.mockReturnValue(mockAdSpots);

      const request = new NextRequest(
        'http://localhost:3000/api/adspots?status=active'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.every((ad: AdSpot) => ad.status === 'active')).toBe(true);
    });

    it('debe aplicar múltiples filtros cuando se proporcionan', async () => {
      const getAllMock = vi.mocked(memoryStoreModule.adSpotStore.getAll);
      getAllMock.mockReturnValue(mockAdSpots);

      const request = new NextRequest(
        'http://localhost:3000/api/adspots?placement=home_screen&status=active'
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].placement).toBe('home_screen');
      expect(data.data[0].status).toBe('active');
    });

    it('debe retornar un error 500 si falla la obtención de datos', async () => {
      const getAllMock = vi.mocked(memoryStoreModule.adSpotStore.getAll);
      getAllMock.mockImplementation(() => {
        throw new Error('Error en el store');
      });

      const request = new NextRequest('http://localhost:3000/api/adspots');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });
  });

  describe('POST /api/adspots', () => {
    const validPayload: AdSpotCreatePayload = {
      title: 'New Ad',
      imageUrl: 'https://example.com/new-image.jpg',
      placement: 'home_screen',
      ttlMinutes: 120,
    };

    const createdAdSpot: AdSpot = {
      id: 'new-id',
      title: 'New Ad',
      imageUrl: 'https://example.com/new-image.jpg',
      placement: 'home_screen',
      status: 'active',
      createdAt: new Date().toISOString(),
      ttlMinutes: 120,
    };

    it('debe crear un nuevo AdSpot con payload válido', async () => {
      const validateMock = vi.mocked(validatorModule.adSpotCreateSchema.validate);
      const createMock = vi.mocked(memoryStoreModule.adSpotStore.create);

      validateMock.mockResolvedValue(validPayload);
      createMock.mockReturnValue(createdAdSpot);

      const request = new NextRequest('http://localhost:3000/api/adspots', {
        method: 'POST',
        body: JSON.stringify(validPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data).toEqual(createdAdSpot);
      expect(validateMock).toHaveBeenCalledWith(validPayload, {
        abortEarly: false,
        stripUnknown: true,
      });
      expect(createMock).toHaveBeenCalledWith(validPayload);
    });

    it('debe crear un AdSpot sin ttlMinutes si no se proporciona', async () => {
      const payloadWithoutTTL: AdSpotCreatePayload = {
        title: 'New Ad',
        imageUrl: 'https://example.com/new-image.jpg',
        placement: 'home_screen',
      };

      const createdAdSpotWithoutTTL: AdSpot = {
        ...createdAdSpot,
        ttlMinutes: undefined,
      };

      const validateMock = vi.mocked(validatorModule.adSpotCreateSchema.validate);
      const createMock = vi.mocked(memoryStoreModule.adSpotStore.create);

      validateMock.mockResolvedValue(payloadWithoutTTL);
      createMock.mockReturnValue(createdAdSpotWithoutTTL);

      const request = new NextRequest('http://localhost:3000/api/adspots', {
        method: 'POST',
        body: JSON.stringify(payloadWithoutTTL),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data).toEqual(createdAdSpotWithoutTTL);
    });

    it('debe retornar error 400 si la validación falla', async () => {
      const validateMock = vi.mocked(validatorModule.adSpotCreateSchema.validate);
      
      // Crear una instancia real de ValidationError de yup
      const validationError = new yup.ValidationError(
        'Errores de validación',
        undefined,
        'title'
      );
      // Agregar múltiples errores manualmente
      validationError.errors = ['El título es requerido', 'La URL no es válida'];

      validateMock.mockRejectedValue(validationError);

      const invalidPayload = {
        title: '',
        imageUrl: 'not-a-url',
        placement: 'invalid',
      };

      const request = new NextRequest('http://localhost:3000/api/adspots', {
        method: 'POST',
        body: JSON.stringify(invalidPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Error de validación');
      expect(data.details).toEqual(validationError.errors);
    });

    it('debe retornar error 500 si falla la creación', async () => {
      const validateMock = vi.mocked(validatorModule.adSpotCreateSchema.validate);
      const createMock = vi.mocked(memoryStoreModule.adSpotStore.create);

      validateMock.mockResolvedValue(validPayload);
      createMock.mockImplementation(() => {
        throw new Error('Error al crear');
      });

      const request = new NextRequest('http://localhost:3000/api/adspots', {
        method: 'POST',
        body: JSON.stringify(validPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });

    it('debe manejar errores de JSON inválido', async () => {
      const request = new NextRequest('http://localhost:3000/api/adspots', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // El request.json() lanza un error que es capturado por el try-catch
      // y se retorna un error 500
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Error interno del servidor');
    });
  });
});

