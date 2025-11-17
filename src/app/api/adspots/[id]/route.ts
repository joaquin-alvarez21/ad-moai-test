import { NextRequest, NextResponse } from 'next/server';
import { adSpotStore } from '@/lib/api/memoryStore';
import type { AdSpotStatus } from '@/lib/types/adspot';

/**
 * API Route: GET /api/adspots/:id
 * 
 * Obtiene el detalle de un AdSpot por su ID.
 * 
 * @param request - Request de Next.js
 * @param params - Parámetros de la ruta (contiene el id)
 * @returns El AdSpot encontrado o error 404
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adSpot = adSpotStore.getById(id);

    if (!adSpot) {
      return NextResponse.json(
        { error: 'AdSpot no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: adSpot },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener AdSpot:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * API Route: PATCH /api/adspots/:id
 * 
 * Actualiza el estado de un AdSpot.
 * 
 * Body debe contener:
 * - `status`: "active" | "inactive"
 * 
 * @param request - Request de Next.js con el status en el body
 * @param params - Parámetros de la ruta (contiene el id)
 * @returns El AdSpot actualizado o error 404
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: AdSpotStatus };

    if (!status || (status !== 'active' && status !== 'inactive')) {
      return NextResponse.json(
        { error: 'Status inválido. Debe ser "active" o "inactive"' },
        { status: 400 }
      );
    }

    const updatedAdSpot = adSpotStore.updateStatus(id, status);

    if (!updatedAdSpot) {
      return NextResponse.json(
        { error: 'AdSpot no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: updatedAdSpot },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar AdSpot:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

