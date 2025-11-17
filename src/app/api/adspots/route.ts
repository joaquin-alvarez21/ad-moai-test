import { NextRequest, NextResponse } from 'next/server';
import { adSpotStore } from '@/lib/api/memoryStore';
import { adSpotCreateSchema } from '@/lib/validators/adspot';
import {
  filterAdSpotsByPlacement,
} from '@/lib/helpers/adspotFilters';
import type {
  AdSpotCreatePayload,
  AdSpotPlacement,
  AdSpotStatus,
} from '@/lib/types/adspot';
import * as yup from 'yup';

/**
 * API Route: GET /api/adspots
 * 
 * Obtiene todos los AdSpots con soporte para filtros opcionales.
 * 
 * Query params:
 * - `placement`: Filtrar por placement específico
 * - `status`: Filtrar por status (opcional)
 * 
 * @param request - Request de Next.js con query params
 * @returns Lista de AdSpots filtrados
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placement = searchParams.get('placement') as AdSpotPlacement | null;
    const status = searchParams.get('status') as AdSpotStatus | null;

    let adSpots = adSpotStore.getAll();

    // Aplicar filtro por placement si se proporciona
    if (placement) {
      adSpots = filterAdSpotsByPlacement(adSpots, placement);
    }

    // Aplicar filtro por status si se proporciona
    if (status) {
      adSpots = adSpots.filter((ad) => ad.status === status);
    }

    return NextResponse.json(
      { data: adSpots },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener AdSpots:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * API Route: POST /api/adspots
 * 
 * Crea un nuevo AdSpot.
 * 
 * Body debe contener:
 * - `title`: string (requerido)
 * - `imageUrl`: string URL válida (requerido)
 * - `placement`: "home_screen" | "ride_summary" | "map_view" (requerido)
 * - `ttlMinutes`: number positivo (opcional)
 * 
 * @param request - Request de Next.js con el payload en el body
 * @returns El AdSpot creado
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar el payload con yup
    const validatedPayload = await adSpotCreateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    }) as AdSpotCreatePayload;

    // Crear el AdSpot
    const newAdSpot = adSpotStore.create(validatedPayload);

    return NextResponse.json(
      { data: newAdSpot },
      { status: 201 }
    );
  } catch (error) {
    // Manejar errores de validación de yup
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error al crear AdSpot:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

