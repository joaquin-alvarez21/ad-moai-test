# Design Notes & Postmortem

## Risks Identified

### TTL Drift
Server-side calculations are authoritative. Client countdown is UX-only and refreshes every 60s.

### Concurrency
In-memory store isn't thread-safe. Each instance has its own store. Production needs a database with transactions.

### Data Loss
All data lost on restart (acceptable for demo). Production needs persistent storage.

### Performance
No pagination, fixed 60s refresh. Could add pagination and make refresh configurable.

### Image Loading
Currently allows any domain. Should restrict to known CDNs and add validation.

## Productionization Plan

### Deployment Options

1. **Vercel** - Native Next.js support, zero-config, built-in CI/CD
2. **Google Cloud Run** - Container-based, serverless, Docker already configured
3. **AWS Fargate** - Similar to Cloud Run, good for AWS teams

### Next Steps

- Replace in-memory store with PostgreSQL/MongoDB
- Add authentication (NextAuth.js)
- Set up monitoring (Sentry, logging)
- Add pagination and caching (Redis)
- Implement testing (unit, integration, E2E)
- Set up CI/CD pipeline
- Restrict image domains and add validation
