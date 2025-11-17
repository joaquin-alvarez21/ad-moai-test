import { NextResponse } from 'next/server';

/**
 * Endpoint de health check para Docker y monitoreo.
 * 
 * @returns Respuesta 200 OK si el servidor está funcionando
 */
export async function GET() {
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}

