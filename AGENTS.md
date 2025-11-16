# AGENTS.md

## Propósito

Esta guía establece las normas y mejores prácticas que deben seguir los agentes (personas y agentes de AI) que colaboren en el desarrollo de este proyecto **Next.js + TypeScript**, enfocado en el reto _"Mobility Ad Spots"_ (Lane B — Frontend).

El objetivo es mantener un código:

- Modular, mantenible y claro.
- Alineado a **SOLID** y **Clean Code**.
- Coherente con la arquitectura moderna de **Next.js (App Router, RSC, SSR, Server Actions)**.
- Estrictamente tipado en TypeScript.
- Muy bien **documentado**, para que el proyecto sea fácil de explicar en la prueba de ingreso.

> Nota: La parte de Go (Lane A) no se implementará en este proyecto. Cualquier referencia a backend se resolverá vía **API mock** o rutas `/api` en Next.js.

---

## 1. Contexto del Proyecto

### 1.1. Dominio: AdSpot

Un `AdSpot` tiene:

- `id: string`
- `title: string`
- `imageUrl: string`
- `placement: "home_screen" | "ride_summary" | "map_view"`
- `status: "active" | "inactive"`
- `createdAt: string` // ISO-8601
- `deactivatedAt?: string` // ISO-8601
- `ttlMinutes?: number` // si se define, el anuncio expira después de `createdAt + ttl`

Reglas de negocio importantes:

- Los nuevos AdSpots son **activos** por defecto.
- Si `ttlMinutes` está presente y ya pasó el tiempo, el ad se considera **inactivo**, aunque el campo `status` sea "active".
- La UI debe listar **solo ads elegibles/activos** según TTL para ciertas vistas.

### 1.2. Requisitos de UX (Lane B)

Según el challenge:

- **List page**
  - Mostrar ads filtrados por placement.
  - Permitir togglear activo/inactivo (llamando a la API o Server Actions).
- **Create page**
  - Formulario para `title`, `imageUrl`, `placement`, `ttlMinutes?`.
  - Validación básica y feedback (toasts/mensajes de error).
- **Rendering**
  - Al menos **una página con SSR o Server Component** que muestre una lista filtrada.
- **Data**
  - Integración con API mock (Next.js `/api` in-memory) si no hay backend Go.

Este `AGENTS.md` está optimizado para cumplir y mostrar seniority en estos puntos.

---

## 2. Principios Fundamentales

### 2.1. SOLID y modularidad

- **SRP (Responsabilidad Única):**
  - Cada página, componente, servicio o helper debe tener **una única responsabilidad clara**.
- **OCP (Abierto/Cerrado):**
  - El código debe ser extensible (nuevos filtros, nuevos placements) sin reescribir piezas críticas.
- **LSP (Liskov):**
  - Tipos e interfaces deben permitir intercambio de implementaciones sin romper el comportamiento esperado (por ejemplo, diferentes fuentes de datos para AdSpots).
- **ISP (Segregación de Interfaces):**
  - Tipos e interfaces pequeñas y específicas (ej. `AdSpot`, `AdSpotFormValues`, `AdSpotFilter`).
- **DIP (Inversión de Dependencia):**
  - La UI (páginas y componentes) dependen de **abstracciones** (servicios de datos) y no directamente de implementación de fetch o almacenamiento in-memory.

### 2.2. TypeScript estricto

- No se utiliza `any` salvo casos muy justificados y documentados.
- Tienen que existir tipos significativos para:
  - `AdSpot`.
  - Payloads de creación/actualización.
  - Respuestas de API/Server Actions.
- Tipos compartidos viven en `lib/types/`.
- El proyecto usa `strict: true` en `tsconfig.json` - respetar todas las verificaciones estrictas.

---

## 3. Arquitectura y Estructura de Carpetas

### 3.1. Estructura de alto nivel

**Importante**: El proyecto usa la estructura `src/` como raíz del código fuente. Todos los paths de imports deben usar el alias `@/*` que apunta a `src/*` (configurado en `tsconfig.json`).

```txt
src/
  app/
    (app)/                      # Route group para la UI de administración
      layout.tsx                # Layout para la UI de administración
      adspots/
        page.tsx                # Lista principal de AdSpots (Server Component/SSR)
        loading.tsx             # Loading UI para Suspense
        error.tsx               # Error boundary para esta ruta
        new/
          page.tsx              # Página de creación
        actions.ts              # Server Actions relacionadas a AdSpots
    api/
      adspots/
        route.ts                # API mock in-memory (si no hay backend Go)
    globals.css                 # Estilos globales (Tailwind)
    layout.tsx                  # Root layout
    page.tsx                    # Home page
  components/
    adspots/
      AdSpotList.tsx            # Componente de lista
      AdSpotListItem.tsx        # Fila individual
      AdSpotFilters.tsx         # Chips de placement + search
      AdSpotForm.tsx            # Formulario de creación/edición
    ui/
      Button.tsx
      Input.tsx
      Select.tsx
      Toast.tsx                 # Para feedback simple
  lib/
    types/
      adspot.ts                 # Tipos e interfaces de dominio
    data/
      adspotsClient.ts          # Cliente de datos para fetch desde cliente (SWR/React Query/fetch)
    services/
      adspotService.ts          # Lógica de negocio (ej. cálculo de TTL) reutilizable
    helpers/
      ttl.ts                    # Helpers puros (ej. isAdSpotActiveByTTL)
    validators/
      adspot.ts                 # Validación de formularios (yup/zod)
    api/
      memoryStore.ts            # Módulo in-memory para /api/adspots (si se implementa)

docs/
  architecture.md
  decisions/
    YYYY-MM-DD-*.md

AGENTS.md
README.md
POSTMORTEM.md
Attestation.md
```

### 3.2. Convenciones de Imports

- **Siempre usar el alias `@/*`** para imports desde `src/`:
  ```typescript
  import { AdSpot } from '@/lib/types/adspot';
  import { Button } from '@/components/ui/Button';
  ```
- **Imports relativos** solo para archivos en la misma carpeta o subcarpeta cercana:
  ```typescript
  // ✅ OK: mismo directorio
  import { helper } from './helper';
  
  // ✅ OK: alias para cruzar directorios
  import { AdSpot } from '@/lib/types/adspot';
  ```
- **Orden de imports**:
  1. Imports de React/Next.js
  2. Imports de librerías externas
  3. Imports con alias `@/*`
  4. Imports relativos
  5. Imports de tipos (usar `type` keyword cuando sea posible)
  ```typescript
  import { Suspense } from 'react';
  import { z } from 'zod';
  import { Button } from '@/components/ui/Button';
  import { helper } from './helper';
  import type { AdSpot } from '@/lib/types/adspot';
  ```

### 3.3. Convenciones de Naming

- **Componentes React**: PascalCase (`AdSpotList.tsx`, `Button.tsx`)
- **Archivos de utilidades/helpers**: camelCase (`ttl.ts`, `adspotService.ts`)
- **Tipos e interfaces**: PascalCase (`AdSpot`, `AdSpotFormValues`)
- **Constantes**: UPPER_SNAKE_CASE para constantes globales, camelCase para constantes locales
- **Funciones y variables**: camelCase
- **Archivos de Server Actions**: `actions.ts` (singular, dentro de la carpeta de la ruta)
- **Archivos de API routes**: `route.ts` (dentro de la carpeta de la ruta)

---

## 4. Convenciones de Código

### 4.1. Componentes React

- **Server Components por defecto**: Usar Server Components siempre que sea posible. Solo usar `'use client'` cuando sea estrictamente necesario (interactividad, hooks, eventos).
- **Componentes pequeños y enfocados**: Un componente debe hacer una cosa y hacerla bien.
- **Props tipadas**: Todas las props deben tener tipos explícitos (no `any`).
- **Documentación JSDoc**: Componentes públicos deben tener comentarios JSDoc explicando su propósito y props:
  ```typescript
  /**
   * Lista de AdSpots con filtros por placement.
   * 
   * @param adspots - Array de AdSpots a mostrar
   * @param onToggleStatus - Callback cuando se cambia el status de un ad
   */
  export function AdSpotList({ adspots, onToggleStatus }: AdSpotListProps) {
    // ...
  }
  ```

### 4.2. Server Actions

- **Naming**: Prefijo `action` o nombre descriptivo del verbo (ej. `createAdSpot`, `toggleAdSpotStatus`).
- **Validación**: Validar inputs con zod o similar antes de procesar.
- **Manejo de errores**: Retornar objetos con `{ success: boolean, error?: string, data?: T }`.
- **Revalidación**: Usar `revalidatePath` o `revalidateTag` después de mutaciones.

### 4.3. Manejo de Errores

- **Error Boundaries**: Usar `error.tsx` en rutas para capturar errores de Server Components.
- **Try-Catch en Server Actions**: Siempre envolver operaciones que puedan fallar.
- **Mensajes de error claros**: Los errores deben ser informativos para el usuario final, no técnicos.
- **Logging**: En desarrollo, loggear errores completos. En producción, solo mensajes seguros.

### 4.4. Estilos

- **Tailwind CSS**: Usar clases de Tailwind para estilos. No usar CSS modules a menos que sea absolutamente necesario.
- **Clases utilitarias**: Preferir composición de clases de Tailwind sobre estilos inline.
- **Responsive**: Usar breakpoints de Tailwind (`sm:`, `md:`, `lg:`, etc.).

---

## 5. Testing (Opcional pero Recomendado)

> Nota: El testing no está configurado inicialmente, pero se recomienda agregarlo para demostrar buenas prácticas.

Si se implementa testing:

- **Unit tests**: Para helpers, servicios y utilidades puras.
- **Component tests**: Para componentes UI con interacciones.
- **Integration tests**: Para flujos completos (crear ad, filtrar, etc.).
- **Testing Library**: Usar `@testing-library/react` para tests de componentes.
- **Vitest o Jest**: Para el runner de tests.

---

## 6. Documentación

### 6.1. Documentación de Código

- **JSDoc para funciones públicas**: Todas las funciones exportadas deben tener JSDoc.
- **Comentarios explicativos**: Comentar el "por qué", no el "qué" (el código ya lo dice).
- **README.md**: Mantener actualizado con instrucciones de setup y desarrollo.

### 6.2. Decisiones Técnicas

- **ADRs (Architecture Decision Records)**: Documentar decisiones importantes en `docs/decisions/YYYY-MM-DD-*.md`.
- **Formato ADR**:
  - Contexto
  - Decisión
  - Consecuencias (positivas y negativas)

---

## 7. Puntos de Atención y Aclaraciones

### 7.1. TTL (Time To Live)

- **Cálculo de TTL**: El helper `isAdSpotActiveByTTL` debe considerar:
  - Si `ttlMinutes` no existe, el ad está activo si `status === "active"`.
  - Si `ttlMinutes` existe, calcular: `createdAt + ttlMinutes * 60000 < Date.now()`.
  - Si expiró, el ad es inactivo independientemente de `status`.

### 7.2. Server Components vs Client Components

- **Regla general**: Empezar con Server Component. Convertir a Client Component solo si:
  - Necesitas `useState`, `useEffect`, u otros hooks.
  - Necesitas event handlers (`onClick`, `onChange`, etc.).
  - Necesitas APIs del navegador.
- **Composición**: Puedes tener Server Components que rendericen Client Components.

### 7.3. Estado de la Aplicación

- **No se requiere state management global**: Para este proyecto, el estado puede manejarse con:
  - Server Components + Server Actions para datos del servidor.
  - `useState` local para estado de UI (filtros, formularios).
  - URL search params para estado compartido (filtros en la lista).

### 7.4. API Mock

- **Almacenamiento in-memory**: El `memoryStore.ts` puede ser un simple array o Map en memoria.
- **Persistencia**: No se requiere persistencia (se reinicia con cada restart del servidor).
- **Estructura de respuestas**: Seguir convenciones REST:
  - `GET /api/adspots` → `{ data: AdSpot[] }`
  - `POST /api/adspots` → `{ data: AdSpot }`
  - `PATCH /api/adspots/:id` → `{ data: AdSpot }`

---

## 8. Checklist para Agentes

Antes de implementar una feature, verificar:

- [ ] ¿Sigue los principios SOLID?
- [ ] ¿Está correctamente tipado (sin `any`)?
- [ ] ¿Usa el alias `@/*` para imports?
- [ ] ¿Está documentado con JSDoc?
- [ ] ¿Maneja errores apropiadamente?
- [ ] ¿Sigue las convenciones de naming?
- [ ] ¿Es un Server Component cuando es posible?
- [ ] ¿Valida inputs en Server Actions?

---

## 9. Recursos y Referencias

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
