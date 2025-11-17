import { NextRequest, NextResponse } from 'next/server';
import { adSpotStore } from '@/lib/api/memoryStore';

/**
 * API Route: POST /api/adspots/:id/deactivate
 * 
 * Marca un AdSpot como inactivo.
 * 
 * Establece automáticamente:
 * - `status`: "inactive"
 * - `deactivatedAt`: Fecha actual en formato ISO-8601
 * 
 * @param request - Request de Next.js
 * @param params - Parámetros de la ruta (contiene el id)
 * @returns El AdSpot actualizado o error 404
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedAdSpot = adSpotStore.updateStatus(id, 'inactive');

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
    console.error('Error al desactivar AdSpot:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

