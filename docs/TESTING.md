# Documentación de Tests

Esta documentación describe la suite completa de tests del proyecto, su propósito, estructura y cómo ejecutarlos.

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estructura de Tests](#estructura-de-tests)
3. [Tests Unitarios](#tests-unitarios)
4. [Tests de Componentes](#tests-de-componentes)
5. [Tests de Integración](#tests-de-integración)
6. [Ejecución de Tests](#ejecución-de-tests)
7. [Interpretación de Resultados](#interpretación-de-resultados)
8. [Troubleshooting](#troubleshooting)

---

## Visión General

El proyecto utiliza **Vitest** como framework de testing, junto con **React Testing Library (RTL)** para tests de componentes y **MSW (Mock Service Worker)** para tests de integración.

### Stack Tecnológico

- **Vitest**: Runner de tests y framework de aserciones
- **React Testing Library**: Testing de componentes React
- **@testing-library/user-event**: Simulación de interacciones de usuario
- **MSW**: Mocking de requests HTTP para tests de integración
- **jsdom**: Entorno DOM para tests en Node.js

### Cobertura de Tests

- ✅ **77 tests unitarios**: Helpers, validadores y servicios
- ✅ **47 tests de componentes**: Formularios, listas y filtros
- ✅ **20+ tests de integración**: Páginas y API routes

### Configuración de Linting para Tests

Los archivos de testing tienen **reglas de linting más permisivas** que el código de producción. Esta decisión es intencional porque:

- Los archivos de test son **código de apoyo y soporte**, no parte directa del producto final
- En tests es común necesitar tipos flexibles como `any` para mocks complejos
- Variables no usadas son aceptables en contextos de setup y configuración de tests
- Los tests requieren mayor flexibilidad para simular diferentes escenarios

**Archivos afectados por reglas flexibles**:
- `**/*.test.ts` y `**/*.test.tsx` - Todos los archivos de test
- `vitest.setup.ts` - Configuración global de Vitest
- `src/mocks/**` - Handlers y configuración de MSW

**Reglas de ESLint deshabilitadas en tests**:
- `@typescript-eslint/no-explicit-any` - Permite usar `any` para mocks
- `@typescript-eslint/no-unused-vars` - Permite variables no usadas
- `no-unused-vars` - Permite variables no usadas (regla base de ESLint)

**Razón técnica**: Los tests necesitan simular condiciones variadas y edge cases que en código de producción serían anti-patrones. Por ejemplo:
- Mocks que aceptan `any` para máxima flexibilidad
- Variables de setup que pueden no usarse en todos los casos
- Configuraciones experimentales que pueden quedar sin usar temporalmente

Esta configuración está definida en `eslint.config.mjs` y aplica exclusivamente a archivos de testing.

---

## Estructura de Tests

```
src/
├── lib/
│   ├── helpers/
│   │   └── ttl.test.ts                    # Tests de funciones puras de TTL
│   ├── validators/
│   │   └── adspot.test.ts                 # Tests de validación (Yup)
│   └── services/
│       └── adspotService.test.ts          # Tests de lógica de negocio
├── components/
│   └── adspots/
│       ├── AdSpotForm.test.tsx            # Tests del formulario
│       ├── AdSpotListItem.test.tsx        # Tests de item de lista
│       └── AdSpotFilters.test.tsx        # Tests de filtros
├── app/
│   ├── (app)/adspots/
│   │   ├── page.test.tsx                  # Tests de página de lista
│   │   └── new/
│   │       └── page.test.tsx              # Tests de página de creación
│   └── api/
│       └── adspots/
│           └── route.test.ts              # Tests de API route
└── mocks/
    ├── handlers.ts                        # Handlers de MSW
    └── server.ts                          # Configuración de MSW
```

---

## Tests Unitarios

### 1. `lib/helpers/ttl.test.ts`

**Propósito**: Verificar la lógica de cálculo de TTL (Time To Live) para AdSpots.

**Funcionalidad testeada**: `isAdSpotActiveByTTL()`

#### Tests Incluidos (13 tests)

1. **AdSpots sin TTL**
   - ✅ AdSpot activo sin TTL → debe retornar `true`
   - ✅ AdSpot inactivo sin TTL → debe retornar `false`
   - ✅ AdSpot con `ttlMinutes: undefined` → debe retornar `true` si está activo
   - ✅ AdSpot con `ttlMinutes: null` → debe retornar `true` si está activo

2. **AdSpots con TTL que no ha expirado**
   - ✅ TTL no expirado y status active → debe retornar `true`
   - ✅ TTL no expirado pero status inactive → debe retornar `false`

3. **AdSpots con TTL que ha expirado**
   - ✅ TTL expirado aunque status sea active → debe retornar `false`
   - ✅ TTL expirado exactamente ahora → debe retornar `false`
   - ✅ TTL expirado hace mucho tiempo → debe retornar `false`

4. **Casos edge**
   - ✅ Status inactive independientemente del TTL → debe retornar `false`
   - ✅ TTL muy pequeño (1 minuto) → debe manejar correctamente
   - ✅ TTL muy grande (1 año) → debe manejar correctamente
   - ✅ CreatedAt en el futuro → debe manejar correctamente

**Cómo verificar que funciona**:
```bash
npm run test:run src/lib/helpers/ttl.test.ts
```

**Resultado esperado**: Todos los 13 tests deben pasar (✓).

---

### 2. `lib/validators/adspot.test.ts`

**Propósito**: Verificar que los schemas de validación de Yup funcionan correctamente.

**Funcionalidad testeada**: `adSpotCreateSchema`

#### Tests Incluidos (41 tests)

1. **Validación de `title`** (8 tests)
   - ✅ Título válido
   - ✅ Título vacío → debe rechazar
   - ✅ Título con solo espacios → debe rechazar
   - ✅ Título undefined → debe rechazar
   - ✅ Título null → debe rechazar
   - ✅ Título > 100 caracteres → debe rechazar
   - ✅ Título de exactamente 100 caracteres → debe aceptar
   - ✅ Trim de espacios al inicio y final

2. **Validación de `imageUrl`** (9 tests)
   - ✅ URL válida con http/https
   - ✅ URLs con diferentes extensiones (jpg, png, gif, webp)
   - ✅ URLs de Unsplash → debe aceptar
   - ✅ URLs de Picsum → debe aceptar
   - ✅ URL inválida → debe rechazar
   - ✅ URL sin protocolo → debe rechazar
   - ✅ URL vacía → debe rechazar
   - ✅ URL undefined → debe rechazar
   - ✅ URL que no apunta a imagen → debe rechazar
   - ✅ URLs con query parameters → debe aceptar
   - ✅ Trim de espacios

3. **Validación de `placement`** (6 tests)
   - ✅ Placement válido: `home_screen`, `ride_summary`, `map_view`
   - ✅ Placement inválido → debe rechazar
   - ✅ Placement undefined → debe rechazar
   - ✅ Placement null → debe rechazar
   - ✅ Placement vacío → debe rechazar

4. **Validación de `ttlMinutes`** (10 tests)
   - ✅ TTL válido
   - ✅ TTL undefined → debe aceptar (opcional)
   - ✅ TTL null → debe convertir a undefined
   - ✅ Cadena vacía → debe convertir a undefined
   - ✅ TTL negativo → debe rechazar
   - ✅ TTL cero → debe rechazar
   - ✅ TTL decimal → debe rechazar
   - ✅ TTL > 525600 (1 año) → debe rechazar
   - ✅ TTL de exactamente 525600 → debe aceptar
   - ✅ TTL de 1 minuto → debe aceptar

5. **Validación de payload completo** (4 tests)
   - ✅ Payload completo válido sin ttlMinutes
   - ✅ Payload completo válido con ttlMinutes
   - ✅ Payload con múltiples campos inválidos → debe rechazar
   - ✅ StripUnknown de campos no definidos

**Cómo verificar que funciona**:
```bash
npm run test:run src/lib/validators/adspot.test.ts
```

**Resultado esperado**: Todos los 41 tests deben pasar (✓).

---

### 3. `lib/services/adspotService.test.ts`

**Propósito**: Verificar la lógica de negocio del servicio, incluyendo la diferenciación entre ejecución en servidor y cliente.

**Funcionalidad testeada**: `AdSpotService` (clase completa)

#### Tests Incluidos (23 tests)

1. **`getAllAdSpots()`** (4 tests)
   - ✅ Obtener desde store cuando se ejecuta en servidor
   - ✅ Usar fetch cuando se ejecuta en cliente
   - ✅ Lanzar error si fetch falla
   - ✅ Usar NEXT_PUBLIC_APP_URL si está definido

2. **`getActiveAdSpotsFiltered()`** (4 tests)
   - ✅ Filtrar por placement
   - ✅ Filtrar por búsqueda
   - ✅ Aplicar múltiples filtros
   - ✅ Retornar solo AdSpots activos según TTL

3. **`createAdSpot()`** (4 tests)
   - ✅ Crear usando store en servidor
   - ✅ Crear usando fetch en cliente
   - ✅ Lanzar error si fetch falla con validación
   - ✅ Lanzar error si fetch falla sin detalles

4. **`deactivateAdSpot()`** (4 tests)
   - ✅ Desactivar usando store en servidor
   - ✅ Lanzar error si no existe en servidor
   - ✅ Desactivar usando fetch en cliente
   - ✅ Lanzar error si fetch retorna 404

5. **`toggleAdSpot()`** (5 tests)
   - ✅ Alternar de active a inactive en servidor
   - ✅ Alternar de inactive a active en servidor
   - ✅ Lanzar error si no existe al alternar
   - ✅ Alternar usando fetch en cliente
   - ✅ Lanzar error si fetch retorna 404

6. **`getMetrics()`** (1 test)
   - ✅ Calcular métricas usando el módulo de métricas

**Mocks utilizados**:
- `@/lib/api/memoryStore` → Mock del store in-memory
- `@/lib/helpers/adspotFilters` → Mock de funciones de filtrado
- `./adspotMetrics` → Mock del cálculo de métricas
- `global.fetch` → Mock de fetch para tests de cliente

**Cómo verificar que funciona**:
```bash
npm run test:run src/lib/services/adspotService.test.ts
```

**Resultado esperado**: Todos los 23 tests deben pasar (✓).

---

## Tests de Componentes

### 4. `components/adspots/AdSpotForm.test.tsx`

**Propósito**: Verificar el comportamiento del formulario de creación de AdSpots, incluyendo validación, envío y manejo de errores.

**Funcionalidad testeada**: `AdSpotForm` (Client Component)

#### Tests Incluidos (13 tests)

1. **Renderizado inicial** (3 tests)
   - ✅ Renderizar todos los campos del formulario
   - ✅ Mostrar placeholders correctos
   - ✅ Mostrar descripciones de ayuda

2. **Validación de campos** (4 tests)
   - ✅ Mostrar error si título está vacío
   - ✅ Mostrar error si URL de imagen está vacía
   - ✅ Mostrar error si URL no es válida
   - ✅ Mostrar error si placement no está seleccionado

3. **Envío del formulario** (5 tests)
   - ✅ Llamar a `createAdSpotAction` con datos correctos
   - ✅ Incluir `ttlMinutes` si se proporciona
   - ✅ Mostrar toast de éxito y redirigir cuando es exitoso
   - ✅ Mostrar toast de error cuando falla
   - ✅ Deshabilitar botón mientras está pendiente

4. **Botón cancelar** (1 test)
   - ✅ Redirigir a `/adspots` cuando se hace clic

**Mocks utilizados**:
- `next/navigation` → `useRouter`
- `sonner` → `toast`
- `@/app/(app)/adspots/actions` → `createAdSpotAction`

**Cómo verificar que funciona**:
```bash
npm run test:run src/components/adspots/AdSpotForm.test.tsx
```

**Resultado esperado**: Todos los 13 tests deben pasar (✓).

**Nota**: Algunos tests pueden requerir ajustes en los selectores si los componentes de shadcn UI cambian su estructura DOM.

---

### 5. `components/adspots/AdSpotListItem.test.tsx`

**Propósito**: Verificar el renderizado y comportamiento del item individual de la lista, incluyendo el botón de desactivar y la actualización optimista (Optimistic UI).

**Funcionalidad testeada**: `AdSpotListItem` (Client Component)

#### Tests Incluidos (14 tests)

1. **Renderizado** (4 tests)
   - ✅ Renderizar el contenido del AdSpot
   - ✅ Mostrar botón de desactivar si está activo
   - ✅ No mostrar botón si está inactivo
   - ✅ No mostrar botón si expiró por TTL

2. **Botón de desactivar** (5 tests)
   - ✅ Llamar a `deactivateAdSpotAction` cuando se hace clic
   - ✅ Mostrar toast de éxito cuando es exitoso
   - ✅ Mostrar toast de error cuando falla
   - ✅ Mostrar toast de info si ya está inactivo
   - ✅ Deshabilitar botón mientras está pendiente

3. **Optimistic UI** (3 tests)
   - ✅ Actualizar estado optimistamente antes de completar
   - ✅ Revertir estado optimista si la acción falla
   - ✅ Actualizar contenido con estado optimista

4. **Casos edge** (2 tests)
   - ✅ Manejar AdSpots con TTL correctamente
   - ✅ Manejar AdSpots sin TTL correctamente

**Mocks utilizados**:
- `sonner` → `toast`
- `@/app/(app)/adspots/actions` → `deactivateAdSpotAction`
- Componentes hijos → Mocks simplificados

**Cómo verificar que funciona**:
```bash
npm run test:run src/components/adspots/AdSpotListItem.test.tsx
```

**Resultado esperado**: Todos los 14 tests deben pasar (✓).

**Nota**: Los mocks de componentes hijos usan `<td>` en lugar de `<div>` para evitar errores de hidratación con `<tr>`.

---

### 6. `components/adspots/AdSpotFilters.test.tsx`

**Propósito**: Verificar la interacción con los filtros y la actualización de URL params.

**Funcionalidad testeada**: `AdSpotFilters` (Client Component)

#### Tests Incluidos (20 tests)

1. **Renderizado inicial** (3 tests)
   - ✅ Renderizar todos los filtros
   - ✅ Inicializar valores desde search params
   - ✅ Mostrar/ocultar botón de limpiar filtros según corresponda

2. **Filtro de placement** (3 tests)
   - ✅ Actualizar URL cuando se cambia placement
   - ✅ Mantener otros filtros al cambiar placement
   - ✅ Eliminar filtro si se selecciona el mismo valor

3. **Filtro de búsqueda** (4 tests)
   - ✅ Actualizar URL cuando se escribe en input
   - ✅ Mantener otros filtros al cambiar búsqueda
   - ✅ Eliminar filtro si se limpia el input
   - ✅ Trimear espacios en la búsqueda

4. **Filtro de status** (3 tests)
   - ✅ Actualizar URL cuando se cambia status
   - ✅ Mantener otros filtros al cambiar status
   - ✅ Eliminar filtro si se selecciona "Todos los estados"

5. **Botón de limpiar filtros** (2 tests)
   - ✅ Limpiar todos los filtros cuando se hace clic
   - ✅ Ocultarse después de limpiar

6. **Combinación de filtros** (2 tests)
   - ✅ Combinar múltiples filtros en la URL
   - ✅ Mantener formato correcto de URL

7. **Casos edge** (2 tests)
   - ✅ Manejar valores vacíos correctamente
   - ✅ Manejar eliminación de todos los filtros

**Mocks utilizados**:
- `next/navigation` → `useRouter`, `useSearchParams`

**Cómo verificar que funciona**:
```bash
npm run test:run src/components/adspots/AdSpotFilters.test.tsx
```

**Resultado esperado**: Todos los 20 tests deben pasar (✓).

**Nota**: Algunos tests pueden requerir ajustes en los selectores si los componentes de shadcn UI cambian su estructura.

---

## Tests de Integración

### 7. `app/(app)/adspots/page.test.tsx`

**Propósito**: Verificar que la página de lista (Server Component) obtiene datos correctamente y los muestra, incluyendo el filtrado por query params.

**Funcionalidad testeada**: `AdSpotsPage` (Server Component)

#### Tests Incluidos (10 tests)

1. **Renderizado básico** (3 tests)
   - ✅ Renderizar título y descripción
   - ✅ Renderizar componentes de métricas y filtros
   - ✅ Renderizar lista de AdSpots

2. **Filtrado por query params** (4 tests)
   - ✅ Filtrar por placement
   - ✅ Filtrar por search
   - ✅ Filtrar por status
   - ✅ Aplicar múltiples filtros

3. **Manejo de datos** (2 tests)
   - ✅ Manejar lista vacía
   - ✅ Manejar errores al obtener datos

4. **Validación de filtros** (2 tests)
   - ✅ Ignorar placements inválidos
   - ✅ Ignorar status inválidos

**Mocks utilizados**:
- `@/lib/services/adspotService` → `getAllAdSpots`
- Componentes hijos → Mocks simplificados

**Cómo verificar que funciona**:
```bash
npm run test:run src/app/\(app\)/adspots/page.test.tsx
```

**Resultado esperado**: Todos los 10 tests deben pasar (✓).

**Nota**: Este test verifica la integración entre el Server Component y el servicio, pero no renderiza completamente el DOM ya que algunos componentes son Client Components.

---

### 8. `app/(app)/adspots/new/page.test.tsx`

**Propósito**: Verificar que la página de creación renderiza correctamente el formulario y los elementos de navegación.

**Funcionalidad testeada**: `NewAdSpotPage` (Server Component)

#### Tests Incluidos (5 tests)

1. **Renderizado** (5 tests)
   - ✅ Renderizar título y descripción
   - ✅ Renderizar botón para volver a la lista
   - ✅ Renderizar formulario de creación
   - ✅ Mostrar icono de flecha en botón de volver
   - ✅ Tener estructura correcta con Card

**Mocks utilizados**:
- `@/components/adspots/AdSpotForm` → Mock del formulario

**Cómo verificar que funciona**:
```bash
npm run test:run src/app/\(app\)/adspots/new/page.test.tsx
```

**Resultado esperado**: Todos los 5 tests deben pasar (✓).

---

### 9. `app/api/adspots/route.test.ts`

**Propósito**: Verificar que las rutas API (GET y POST) funcionan correctamente con el store in-memory.

**Funcionalidad testeada**: `GET` y `POST` de `/api/adspots`

#### Tests Incluidos (10 tests)

1. **GET /api/adspots** (5 tests)
   - ✅ Retornar todos los AdSpots sin filtros
   - ✅ Filtrar por placement
   - ✅ Filtrar por status
   - ✅ Aplicar múltiples filtros
   - ✅ Retornar error 500 si falla

2. **POST /api/adspots** (5 tests)
   - ✅ Crear AdSpot con payload válido
   - ✅ Crear AdSpot sin ttlMinutes
   - ✅ Retornar error 400 si validación falla
   - ✅ Retornar error 500 si falla la creación
   - ✅ Manejar errores de JSON inválido

**Mocks utilizados**:
- `@/lib/api/memoryStore` → `adSpotStore`
- `@/lib/validators/adspot` → `adSpotCreateSchema`

**Cómo verificar que funciona**:
```bash
npm run test:run src/app/api/adspots/route.test.ts
```

**Resultado esperado**: Todos los 10 tests deben pasar (✓).

---

## Ejecución de Tests

### Comandos Disponibles

```bash
# Ejecutar todos los tests en modo watch
npm test

# Ejecutar todos los tests una vez
npm run test:run

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests de un archivo específico
npm run test:run src/lib/helpers/ttl.test.ts

# Ejecutar tests con cobertura (si está configurado)
npm run test:coverage
```

### Ejecutar Tests por Categoría

```bash
# Solo tests unitarios
npm run test:run src/lib/

# Solo tests de componentes
npm run test:run src/components/

# Solo tests de integración
npm run test:run src/app/
```

---

## Interpretación de Resultados

### Salida Exitosa

```
✓ src/lib/helpers/ttl.test.ts (13 tests) 3ms
✓ src/lib/validators/adspot.test.ts (41 tests) 10ms
✓ src/lib/services/adspotService.test.ts (23 tests) 8ms

Test Files  3 passed (3)
     Tests  77 passed (77)
```

**Significado**: Todos los tests pasaron correctamente.

### Salida con Errores

```
✓ src/lib/helpers/ttl.test.ts (13 tests) 3ms
✗ src/lib/validators/adspot.test.ts (41 tests | 2 failed) 10ms
  × debe rechazar un título mayor a 100 caracteres
  × debe aceptar URLs de Unsplash

Test Files  1 failed (1)
     Tests  75 passed (75) | 2 failed (2)
```

**Significado**: Algunos tests fallaron. Revisar el mensaje de error para cada test.

### Tipos de Errores Comunes

1. **AssertionError**: La aserción no se cumplió
   ```
   AssertionError: expected false to be true
   ```
   → Revisar la lógica del test o del código bajo prueba.

2. **TypeError**: Error de tipos o acceso a propiedades undefined
   ```
   TypeError: Cannot read property 'title' of undefined
   ```
   → Verificar que los mocks están configurados correctamente.

3. **Timeout**: El test excedió el tiempo límite
   ```
   Timeout: Test exceeded timeout of 5000ms
   ```
   → Aumentar el timeout o revisar si hay operaciones asíncronas que no se completan.

---

## Troubleshooting

### Problema: Tests fallan con errores de módulos no encontrados

**Solución**:
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Problema: Tests de componentes fallan con errores de hidratación

**Causa**: Los mocks de componentes hijos no coinciden con la estructura DOM esperada.

**Solución**: Ajustar los mocks para usar elementos HTML válidos (ej: `<td>` dentro de `<tr>`).

### Problema: Tests de integración fallan porque MSW no intercepta requests

**Solución**: Verificar que `vitest.setup.ts` está configurado correctamente y que MSW está iniciado.

### Problema: Tests asíncronos no completan

**Causa**: Falta `await` o `waitFor` en operaciones asíncronas.

**Solución**: Asegurarse de usar `await` y `waitFor` de React Testing Library para operaciones asíncronas.

### Problema: Mocks no se resetean entre tests

**Solución**: Verificar que `beforeEach` está limpiando los mocks con `vi.clearAllMocks()`.

---

## Mejores Prácticas

1. **Aislar tests**: Cada test debe ser independiente y no depender de otros.

2. **Usar mocks apropiados**: Mockear dependencias externas (APIs, servicios, etc.).

3. **Tests descriptivos**: Los nombres de los tests deben describir claramente qué están verificando.

4. **Arrange-Act-Assert**: Estructurar tests en tres fases claras.

5. **Evitar tests frágiles**: No depender de detalles de implementación que pueden cambiar.

6. **Cubrir casos edge**: Incluir tests para casos límite y errores.

---

## Mantenimiento

### Agregar Nuevos Tests

1. Crear archivo `*.test.ts` o `*.test.tsx` junto al código fuente.
2. Seguir la estructura y convenciones existentes.
3. Agregar mocks necesarios.
4. Ejecutar tests para verificar que pasan.

### Actualizar Tests Existentes

1. Identificar el test que necesita actualización.
2. Modificar según los cambios en el código.
3. Ejecutar tests para verificar que siguen pasando.
4. Actualizar esta documentación si es necesario.

---

## Recursos

- [Documentación de Vitest](https://vitest.dev/)
- [Documentación de React Testing Library](https://testing-library.com/react)
- [Documentación de MSW](https://mswjs.io/)
- [Guía de Testing de Next.js](https://nextjs.org/docs/testing)

---

**Última actualización**: Diciembre 2024

