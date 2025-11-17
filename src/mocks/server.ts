import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * Configuración del servidor MSW para tests en Node.js.
 * 
 * Este servidor intercepta las peticiones HTTP durante los tests.
 */
export const server = setupServer(...handlers);

