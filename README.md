# Ad-Moai-Test

A Next.js application for managing mobility ad spots (Lane B — Frontend). Built with Next.js 16, TypeScript, and Shadcn UI.

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker (One Command)

```bash
docker-compose up --build
```

The application will be available at [http://localhost:3000](http://localhost:3000)

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

## What I'd Do With More Time

- Add edit/update functionality for existing AdSpots
- Implement pagination for large lists
- Add bulk operations (activate/deactivate multiple)
- Add image upload instead of URL input (this need a backend or backet)
- Implement proper authentication and authorization (AuthJS)
- Add unit and integration tests
- Set up CI/CD pipeline
- Add monitoring and error tracking (Sentry, etc.)

## Routes

- `/adspots` - List of AdSpots with filters and metrics
- `/adspots/new` - Create new AdSpot
- `/api/adspots` - REST API endpoints
- `/api/health` - Health check endpoint
- Any other route - Shows custom 404 page

## Lane Completed

**Lane B (Frontend)** — All core requirements plus multiple stretch features.
