# Guía Rápida de Tests

Referencia rápida para ejecutar y verificar los tests del proyecto.

## Comandos Rápidos

```bash
# Ejecutar todos los tests
npm run test:run

# Ejecutar tests en modo watch
npm test

# Ejecutar tests con UI
npm run test:ui

# Ejecutar tests específicos
npm run test:run src/lib/helpers/ttl.test.ts
```

## Verificación Rápida por Categoría

### Tests Unitarios (77 tests)

```bash
# Helpers - TTL
npm run test:run src/lib/helpers/ttl.test.ts
# Esperado: ✓ 13 tests pasando

# Validadores
npm run test:run src/lib/validators/adspot.test.ts
# Esperado: ✓ 41 tests pasando

# Servicios
npm run test:run src/lib/services/adspotService.test.ts
# Esperado: ✓ 23 tests pasando
```

### Tests de Componentes (47 tests)

```bash
# Formulario
npm run test:run src/components/adspots/AdSpotForm.test.tsx
# Esperado: ✓ 13 tests pasando

# Item de lista
npm run test:run src/components/adspots/AdSpotListItem.test.tsx
# Esperado: ✓ 14 tests pasando

# Filtros
npm run test:run src/components/adspots/AdSpotFilters.test.tsx
# Esperado: ✓ 20 tests pasando
```

### Tests de Integración (20+ tests)

```bash
# Página de lista
npm run test:run src/app/\(app\)/adspots/page.test.tsx
# Esperado: ✓ 10 tests pasando

# Página de creación
npm run test:run src/app/\(app\)/adspots/new/page.test.tsx
# Esperado: ✓ 5 tests pasando

# API Route
npm run test:run src/app/api/adspots/route.test.ts
# Esperado: ✓ 10 tests pasando
```

## Checklist de Verificación

### ✅ Tests Unitarios
- [ ] `ttl.test.ts` - 13 tests pasando
- [ ] `adspot.test.ts` - 41 tests pasando
- [ ] `adspotService.test.ts` - 23 tests pasando

### ✅ Tests de Componentes
- [ ] `AdSpotForm.test.tsx` - 13 tests pasando
- [ ] `AdSpotListItem.test.tsx` - 14 tests pasando
- [ ] `AdSpotFilters.test.tsx` - 20 tests pasando

### ✅ Tests de Integración
- [ ] `page.test.tsx` (lista) - 10 tests pasando
- [ ] `page.test.tsx` (creación) - 5 tests pasando
- [ ] `route.test.ts` (API) - 10 tests pasando

## Resultado Esperado Completo

```
Test Files  9 passed (9)
     Tests  144+ passed (144+)
```

## Problemas Comunes

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "MSW not intercepting requests"
Verificar que `vitest.setup.ts` incluye la configuración de MSW.

### Error: "Hydration error"
Ajustar mocks de componentes para usar elementos HTML válidos.

### Advertencia: "Unexpected any" en archivos de test
Esto es esperado. Los archivos de test tienen reglas de linting más permisivas porque son código de apoyo. Ver sección "Linting Configuration for Tests" en [TESTING.md](./TESTING.md) para más detalles.

---

## Nota sobre Linting

Los archivos de test (`*.test.ts`, `*.test.tsx`, `vitest.setup.ts`, `mocks/**`) tienen reglas de linting más flexibles:
- ✅ Permite usar `any` para mocks
- ✅ Permite variables no usadas
- ✅ Mayor flexibilidad en general

**Razón**: Los tests son código de apoyo, no parte del producto final, y requieren mayor flexibilidad para simular diferentes escenarios.

---

Para documentación completa, ver [TESTING.md](./TESTING.md).

