import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isAdSpotActiveByTTL } from './ttl';
import type { AdSpot } from '@/lib/types/adspot';

describe('isAdSpotActiveByTTL', () => {
  // Mock de Date.now() para controlar el tiempo en los tests
  let mockNow: number;

  beforeEach(() => {
    // Establecer un tiempo base para los tests
    mockNow = new Date('2024-01-15T12:00:00Z').getTime();
    vi.spyOn(Date, 'now').mockReturnValue(mockNow);
  });

  describe('AdSpots sin TTL', () => {
    it('debe retornar true si el status es active y no tiene TTL', () => {
      const ad: AdSpot = {
        id: '1',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(true);
    });

    it('debe retornar false si el status es inactive y no tiene TTL', () => {
      const ad: AdSpot = {
        id: '2',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'inactive',
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(false);
    });

    it('debe retornar true si el status es active y ttlMinutes es undefined', () => {
      const ad: AdSpot = {
        id: '3',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        ttlMinutes: undefined,
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(true);
    });

    it('debe retornar true si el status es active y ttlMinutes es null', () => {
      const ad: AdSpot = {
        id: '4',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        ttlMinutes: null as unknown as undefined,
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(true);
    });
  });

  describe('AdSpots con TTL que no ha expirado', () => {
    it('debe retornar true si el TTL no ha expirado y el status es active', () => {
      // Creado hace 30 minutos, TTL de 60 minutos (aún no expirado)
      const ad: AdSpot = {
        id: '5',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date(mockNow - 30 * 60000).toISOString(), // hace 30 minutos
        ttlMinutes: 60, // expira en 60 minutos
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(true);
    });

    it('debe retornar false si el TTL no ha expirado pero el status es inactive', () => {
      // Creado hace 30 minutos, TTL de 60 minutos, pero status inactive
      const ad: AdSpot = {
        id: '6',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'inactive',
        createdAt: new Date(mockNow - 30 * 60000).toISOString(),
        ttlMinutes: 60,
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(false);
    });
  });

  describe('AdSpots con TTL que ha expirado', () => {
    it('debe retornar false si el TTL ha expirado aunque el status sea active', () => {
      // Creado hace 90 minutos, TTL de 60 minutos (ya expirado)
      const ad: AdSpot = {
        id: '7',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date(mockNow - 90 * 60000).toISOString(), // hace 90 minutos
        ttlMinutes: 60, // expiró hace 30 minutos
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(false);
    });

    it('debe retornar false si el TTL expiró exactamente ahora', () => {
      // Creado hace 60 minutos, TTL de 60 minutos (expira exactamente ahora)
      const ad: AdSpot = {
        id: '8',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date(mockNow - 60 * 60000).toISOString(), // hace 60 minutos
        ttlMinutes: 60, // expira exactamente ahora
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(false);
    });

    it('debe retornar false si el TTL expiró hace mucho tiempo', () => {
      // Creado hace 1 día, TTL de 1 hora (expiró hace mucho)
      const ad: AdSpot = {
        id: '9',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date(mockNow - 24 * 60 * 60000).toISOString(), // hace 1 día
        ttlMinutes: 60, // expiró hace 23 horas
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(false);
    });
  });

  describe('Casos edge', () => {
    it('debe retornar false si el status es inactive independientemente del TTL', () => {
      const ad: AdSpot = {
        id: '10',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'inactive',
        createdAt: new Date(mockNow - 30 * 60000).toISOString(),
        ttlMinutes: 60,
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(false);
    });

    it('debe manejar TTL muy pequeño correctamente', () => {
      // Creado hace 2 minutos, TTL de 1 minuto (ya expirado)
      const ad: AdSpot = {
        id: '11',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date(mockNow - 2 * 60000).toISOString(), // hace 2 minutos
        ttlMinutes: 1, // expiró hace 1 minuto
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(false);
    });

    it('debe manejar TTL muy grande correctamente', () => {
      // Creado hace 1 hora, TTL de 1 año (aún no expirado)
      const ad: AdSpot = {
        id: '12',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date(mockNow - 60 * 60000).toISOString(), // hace 1 hora
        ttlMinutes: 525600, // 1 año en minutos
      };

      expect(isAdSpotActiveByTTL(ad)).toBe(true);
    });

    it('debe manejar createdAt en el futuro (caso edge)', () => {
      // Creado en el futuro (caso edge)
      const ad: AdSpot = {
        id: '13',
        title: 'Test Ad',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        status: 'active',
        createdAt: new Date(mockNow + 60 * 60000).toISOString(), // en 1 hora
        ttlMinutes: 30,
      };

      // Aunque esté en el futuro, si el status es active y no ha expirado según cálculo, está activo
      expect(isAdSpotActiveByTTL(ad)).toBe(true);
    });
  });
});

