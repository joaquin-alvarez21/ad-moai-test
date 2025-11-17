import { describe, it, expect } from 'vitest';
import { adSpotCreateSchema } from './adspot';
import type { AdSpotCreatePayload } from '@/lib/types/adspot';

describe('adSpotCreateSchema', () => {
  const validPayload: AdSpotCreatePayload = {
    title: 'Promoción Verano 2024',
    imageUrl: 'https://example.com/image.jpg',
    placement: 'home_screen',
  };

  describe('Validación de title', () => {
    it('debe aceptar un título válido', async () => {
      const payload = { ...validPayload };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        title: 'Promoción Verano 2024',
      });
    });

    it('debe rechazar un título vacío', async () => {
      const payload = { ...validPayload, title: '' };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un título con solo espacios', async () => {
      const payload = { ...validPayload, title: '   ' };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un título undefined', async () => {
      const payload = { ...validPayload };
      delete (payload as { title?: string }).title;
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un título null', async () => {
      const payload = { ...validPayload, title: null as unknown as string };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un título mayor a 100 caracteres', async () => {
      const payload = {
        ...validPayload,
        title: 'a'.repeat(101),
      };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe aceptar un título de exactamente 100 caracteres', async () => {
      const payload = {
        ...validPayload,
        title: 'a'.repeat(100),
      };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        title: 'a'.repeat(100),
      });
    });

    it('debe trimear espacios al inicio y final del título', async () => {
      const payload = { ...validPayload, title: '  Título con espacios  ' };
      const result = await adSpotCreateSchema.validate(payload) as AdSpotCreatePayload;
      expect(result.title).toBe('Título con espacios');
    });
  });

  describe('Validación de imageUrl', () => {
    it('debe aceptar una URL válida con http', async () => {
      const payload = { ...validPayload, imageUrl: 'http://example.com/image.jpg' };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        imageUrl: 'http://example.com/image.jpg',
      });
    });

    it('debe aceptar una URL válida con https', async () => {
      const payload = { ...validPayload, imageUrl: 'https://example.com/image.jpg' };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        imageUrl: 'https://example.com/image.jpg',
      });
    });

    it('debe aceptar URLs de imágenes con diferentes extensiones', async () => {
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      for (const ext of extensions) {
        const payload = {
          ...validPayload,
          imageUrl: `https://example.com/image.${ext}`,
        };
        await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
          imageUrl: `https://example.com/image.${ext}`,
        });
      }
    });

    it('debe aceptar URLs de Unsplash', async () => {
      const payload = {
        ...validPayload,
        imageUrl: 'https://images.unsplash.com/photo-123456',
      };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        imageUrl: 'https://images.unsplash.com/photo-123456',
      });
    });

    it('debe aceptar URLs de Picsum', async () => {
      const payload = {
        ...validPayload,
        imageUrl: 'https://picsum.photos/200/300',
      };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        imageUrl: 'https://picsum.photos/200/300',
      });
    });

    it('debe rechazar una URL inválida', async () => {
      const payload = { ...validPayload, imageUrl: 'not-a-url' };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar una URL sin protocolo', async () => {
      const payload = { ...validPayload, imageUrl: 'example.com/image.jpg' };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar una URL vacía', async () => {
      const payload = { ...validPayload, imageUrl: '' };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar una URL undefined', async () => {
      const payload = { ...validPayload };
      delete (payload as { imageUrl?: string }).imageUrl;
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar una URL que no apunta a una imagen válida', async () => {
      const payload = { ...validPayload, imageUrl: 'https://example.com/document.pdf' };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe aceptar URLs con query parameters', async () => {
      const payload = {
        ...validPayload,
        imageUrl: 'https://example.com/image.jpg?width=200&height=300',
      };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        imageUrl: 'https://example.com/image.jpg?width=200&height=300',
      });
    });

    it('debe trimear espacios en la URL', async () => {
      const payload = {
        ...validPayload,
        imageUrl: '  https://example.com/image.jpg  ',
      };
      const result = await adSpotCreateSchema.validate(payload) as AdSpotCreatePayload;
      expect(result.imageUrl).toBe('https://example.com/image.jpg');
    });
  });

  describe('Validación de placement', () => {
    it('debe aceptar home_screen', async () => {
      const payload = { ...validPayload, placement: 'home_screen' as const };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        placement: 'home_screen',
      });
    });

    it('debe aceptar ride_summary', async () => {
      const payload = { ...validPayload, placement: 'ride_summary' as const };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        placement: 'ride_summary',
      });
    });

    it('debe aceptar map_view', async () => {
      const payload = { ...validPayload, placement: 'map_view' as const };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        placement: 'map_view',
      });
    });

    it('debe rechazar un placement inválido', async () => {
      const payload = { ...validPayload, placement: 'invalid_placement' as any };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un placement undefined', async () => {
      const payload = { ...validPayload };
      delete (payload as { placement?: string }).placement;
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un placement null', async () => {
      const payload = { ...validPayload, placement: null as unknown as string };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un placement vacío', async () => {
      const payload = { ...validPayload, placement: '' as any };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });
  });

  describe('Validación de ttlMinutes', () => {
    it('debe aceptar un ttlMinutes válido', async () => {
      const payload = { ...validPayload, ttlMinutes: 60 };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        ttlMinutes: 60,
      });
    });

    it('debe aceptar ttlMinutes undefined', async () => {
      const payload = { ...validPayload };
      const result = await adSpotCreateSchema.validate(payload) as AdSpotCreatePayload;
      expect(result.ttlMinutes).toBeUndefined();
    });

    it('debe aceptar ttlMinutes null y convertirlo a undefined', async () => {
      const payload = { ...validPayload, ttlMinutes: null };
      const result = await adSpotCreateSchema.validate(payload) as AdSpotCreatePayload;
      expect(result.ttlMinutes).toBeUndefined();
    });

    it('debe aceptar una cadena vacía y convertirla a undefined', async () => {
      const payload = { ...validPayload, ttlMinutes: '' as any };
      const result = await adSpotCreateSchema.validate(payload) as AdSpotCreatePayload;
      expect(result.ttlMinutes).toBeUndefined();
    });

    it('debe rechazar un ttlMinutes negativo', async () => {
      const payload = { ...validPayload, ttlMinutes: -10 };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un ttlMinutes cero', async () => {
      const payload = { ...validPayload, ttlMinutes: 0 };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un ttlMinutes decimal', async () => {
      const payload = { ...validPayload, ttlMinutes: 60.5 };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe rechazar un ttlMinutes mayor a 525600 (1 año)', async () => {
      const payload = { ...validPayload, ttlMinutes: 525601 };
      await expect(adSpotCreateSchema.validate(payload)).rejects.toThrow();
    });

    it('debe aceptar un ttlMinutes de exactamente 525600 (1 año)', async () => {
      const payload = { ...validPayload, ttlMinutes: 525600 };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        ttlMinutes: 525600,
      });
    });

    it('debe aceptar un ttlMinutes de 1 minuto', async () => {
      const payload = { ...validPayload, ttlMinutes: 1 };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject({
        ttlMinutes: 1,
      });
    });
  });

  describe('Validación de payload completo', () => {
    it('debe aceptar un payload completo válido sin ttlMinutes', async () => {
      const payload: AdSpotCreatePayload = {
        title: 'Promoción Verano',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
      };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject(payload);
    });

    it('debe aceptar un payload completo válido con ttlMinutes', async () => {
      const payload: AdSpotCreatePayload = {
        title: 'Promoción Verano',
        imageUrl: 'https://example.com/image.jpg',
        placement: 'home_screen',
        ttlMinutes: 120,
      };
      await expect(adSpotCreateSchema.validate(payload)).resolves.toMatchObject(payload);
    });

    it('debe rechazar un payload con múltiples campos inválidos', async () => {
      const payload = {
        title: '',
        imageUrl: 'not-a-url',
        placement: 'invalid',
        ttlMinutes: -10,
      };
      await expect(adSpotCreateSchema.validate(payload, { abortEarly: false })).rejects.toThrow();
    });

    it('debe stripUnknown campos no definidos en el schema', async () => {
      const payload = {
        ...validPayload,
        unknownField: 'should be removed',
        anotherUnknown: 123,
      };
      const result = await adSpotCreateSchema.validate(payload, { stripUnknown: true });
      expect(result).not.toHaveProperty('unknownField');
      expect(result).not.toHaveProperty('anotherUnknown');
    });
  });
});

