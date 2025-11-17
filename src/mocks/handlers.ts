import { http, HttpResponse } from 'msw';
import type { AdSpot } from '@/lib/types/adspot';

/**
 * Handlers de MSW para mockear las respuestas de la API.
 * 
 * Estos handlers interceptan las peticiones HTTP y retornan respuestas mockeadas.
 */

// Datos mock para los tests
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

export const handlers = [
  // GET /api/adspots
  http.get('/api/adspots', ({ request }) => {
    const url = new URL(request.url);
    const placement = url.searchParams.get('placement');
    const status = url.searchParams.get('status');

    let filteredAdSpots = [...mockAdSpots];

    if (placement) {
      filteredAdSpots = filteredAdSpots.filter((ad) => ad.placement === placement);
    }

    if (status) {
      filteredAdSpots = filteredAdSpots.filter((ad) => ad.status === status);
    }

    return HttpResponse.json({ data: filteredAdSpots });
  }),

  // POST /api/adspots
  http.post('/api/adspots', async ({ request }) => {
    const body = await request.json() as {
      title: string;
      imageUrl: string;
      placement: string;
      ttlMinutes?: number;
    };

    // Validación básica
    if (!body.title || !body.imageUrl || !body.placement) {
      return HttpResponse.json(
        {
          error: 'Error de validación',
          details: ['Campos requeridos faltantes'],
        },
        { status: 400 }
      );
    }

    const newAdSpot: AdSpot = {
      id: `test-${Date.now()}`,
      title: body.title,
      imageUrl: body.imageUrl,
      placement: body.placement as AdSpot['placement'],
      status: 'active',
      createdAt: new Date().toISOString(),
      ttlMinutes: body.ttlMinutes,
    };

    return HttpResponse.json({ data: newAdSpot }, { status: 201 });
  }),

  // GET /api/adspots/:id
  http.get('/api/adspots/:id', ({ params }) => {
    const { id } = params;
    const adSpot = mockAdSpots.find((ad) => ad.id === id);

    if (!adSpot) {
      return HttpResponse.json(
        { error: 'AdSpot no encontrado' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: adSpot });
  }),

  // PATCH /api/adspots/:id
  http.patch('/api/adspots/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { status: string };
    const adSpot = mockAdSpots.find((ad) => ad.id === id);

    if (!adSpot) {
      return HttpResponse.json(
        { error: 'AdSpot no encontrado' },
        { status: 404 }
      );
    }

    const updatedAdSpot: AdSpot = {
      ...adSpot,
      status: body.status as AdSpot['status'],
      deactivatedAt: body.status === 'inactive' ? new Date().toISOString() : undefined,
    };

    return HttpResponse.json({ data: updatedAdSpot });
  }),

  // POST /api/adspots/:id/deactivate
  http.post('/api/adspots/:id/deactivate', ({ params }) => {
    const { id } = params;
    const adSpot = mockAdSpots.find((ad) => ad.id === id);

    if (!adSpot) {
      return HttpResponse.json(
        { error: 'AdSpot no encontrado' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];

