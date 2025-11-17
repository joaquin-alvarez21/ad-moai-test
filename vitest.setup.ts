import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/mocks/server';

// Mock para hasPointerCapture (requerido por Radix UI en jsdom)
// jsdom no implementa hasPointerCapture, que es usado por componentes de Radix UI
if (typeof Element.prototype.hasPointerCapture === 'undefined') {
  Element.prototype.hasPointerCapture = function() {
    return false;
  };
}

// Mock para releasePointerCapture (también usado por Radix UI)
if (typeof Element.prototype.releasePointerCapture === 'undefined') {
  Element.prototype.releasePointerCapture = function() {
    // No-op
  };
}

// Mock para setPointerCapture (también usado por Radix UI)
if (typeof Element.prototype.setPointerCapture === 'undefined') {
  Element.prototype.setPointerCapture = function() {
    // No-op
  };
}

// Mock para scrollIntoView (también usado por Radix UI)
if (typeof Element.prototype.scrollIntoView === 'undefined') {
  Element.prototype.scrollIntoView = function() {
    // No-op
  };
}

// Iniciar MSW antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Resetear handlers después de cada test
afterEach(() => server.resetHandlers());

// Cerrar MSW después de todos los tests
afterAll(() => server.close());

