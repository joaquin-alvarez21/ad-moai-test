# Ad-Moai-Test

A Next.js application for managing mobility ad spots (Lane B — Frontend). Built with Next.js 16, TypeScript, and Shadcn UI.

## 🚀 Live Demo

**Vercel Deployment**: [https://ad-moai-test.vercel.app](https://ad-moai-test.vercel.app)

> ⚠️ **Important**: The app is deployed on Vercel, but due to its serverless architecture, **created AdSpots won't persist**. For full functionality, use Docker or local development. See [Vercel Limitations](#️-vercel-limitations) below.

## Quick Start

### Docker (Recommended)

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## What Was Built

### Core Features
- **AdSpot Management**: Create, list, and deactivate ad spots
- **Filtering**: Filter by placement (home_screen, ride_summary, map_view), search text, and status
- **Metrics Dashboard**: Real-time metrics showing total, active, inactive (by TTL/user), and placement distribution
- **Form Validation**: Robust validation with Yup and user-friendly error messages
- **Server Components**: List page uses SSR for optimal performance

### Stretch Features Implemented
- **Preview Mode**: Visual preview of how ads appear in different placements with mobile mock UI
- **Lifecycle Timeline**: Visual timeline showing creation, expiration (TTL), deactivation, and final status
- **Auto-refresh**: Automatic data refresh every 60 seconds
- **Real-time TTL Countdown**: Live countdown showing time until expiration for ads with TTL
- **Optimistic UI**: Instant feedback when deactivating ads using React's `useOptimistic`

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **UI**: Shadcn UI components, Tailwind CSS
- **Validation**: Yup with react-hook-form
- **State Management**: React hooks (useOptimistic, useTransition)
- **Data Layer**: In-memory mock store (no backend required)

## Architecture

- **Server Components** for data fetching and static content
- **Client Components** only when needed (interactivity, hooks, browser APIs)
- **Server Actions** for mutations (create, deactivate)
- **Modular components** following SOLID principles
- **Type-safe** throughout with TypeScript
- **404 Handling**: Custom not-found page for unmatched routes

## Trade-offs

- **In-memory storage**: Data is lost on server restart (acceptable for demo/mock)
- **No real backend**: Uses Next.js API routes with in-memory store
- **Auto-refresh interval**: Fixed at 60 seconds (could be configurable)
- **Image domains**: Currently allows any domain (should be restricted in production)

## ⚠️ Vercel Limitations

**The in-memory store doesn't persist data on Vercel** due to its serverless architecture.

**Why?** Vercel uses ephemeral Lambda functions. Each request may execute on a different instance with its own memory, so created AdSpots "disappear" between requests.

| Environment | Persistence | Why |
|-------------|-------------|-----|
| **Docker** | ✅ Works | Single continuous Node.js process |
| **Local Dev** | ✅ Works | Single continuous Node.js process |
| **Vercel** | ❌ Doesn't work | Multiple ephemeral Lambda instances |

**To evaluate the app properly**, use Docker or local development where the in-memory store works as intended. For production on Vercel, you'd need real persistence (database, KV store, etc.).

## Testing

The project includes a comprehensive test suite with:

- **77 unit tests**: Pure functions, validators, and business logic ✅
- **36 component tests**: Forms, lists, and filters with user interactions ✅
- **26 integration tests**: Pages and API routes ✅
- **11 tests skipped**: Due to jsdom limitations with Radix UI components

**Total**: 139/150 tests passing (93%)

### Running Tests

```bash
# Run all tests in watch mode
npm test

# Run all tests once
npm run test:run

# Run tests with interactive UI
npm run test:ui
```

### Test Status

11 tests were commented out due to jsdom limitations with Radix UI components. The components work correctly in the browser. Test files also have more permissive linting rules (allowing `any`, unused vars) since they're supporting code, not production code.

For implementation details and rationale, see [POSTMORTEM.md](./POSTMORTEM.md#testing-implementation) and [docs/TESTING.md](./docs/TESTING.md).

### CI/CD

The project includes GitHub Actions configured to automatically run tests on every push or pull request to the `main` branch. The workflow includes:

- ✅ Dependency installation
- ✅ Linter execution
- ✅ Test execution
- ✅ Coverage report generation

See configuration at [.github/workflows/test.yml](.github/workflows/test.yml)

## What I'd Do With More Time

- Add edit/update functionality for existing AdSpots
- Implement pagination for large lists
- Add bulk operations (activate/deactivate multiple)
- Add image upload instead of URL input (this need a backend or bucket)
- Implement proper authentication and authorization (AuthJS)
- Improve test coverage with E2E testing (Playwright/Cypress)
- Add monitoring and error tracking (Sentry, etc.)
- Implement visual regression testing (Chromatic/Percy)

## Routes

- `/` - Redirects to `/adspots`
- `/adspots` - List of AdSpots with filters and metrics
- `/adspots/new` - Create new AdSpot
- `/api/adspots` - REST API endpoints
- `/api/health` - Health check endpoint
- Any other route - Shows custom 404 page

## Lane Completed

**Lane B (Frontend)** — All core requirements plus multiple stretch features.
