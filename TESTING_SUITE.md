# Testing Suite

## Stack
- Jest + React Testing Library for unit and integration tests
- Cypress + cypress-axe for end-to-end and accessibility smoke tests
- Lighthouse CI for performance budgets

## Commands
- `npm test`
- `npm run test:coverage`
- `npm run test:e2e`
- `npm run test:e2e:ci`
- `npm run test:lighthouse`
- `npm run test:lighthouse:ci`

## Current coverage targets
- Global Jest threshold: `80%` for branches, functions, lines, and statements

## High-value test areas
- Auth validation and flows
- Quote and contact form submission UX
- Mobile navigation behavior
- Dashboard persistence helpers
- Chatbot response logic and widget interactions
- Homepage, services, projects, forms, and auth E2E journeys

## Notes
- The frontend uses fallback/mock API behavior when production auth/form endpoints are not configured. Tests lean on that behavior for deterministic local runs.
- Lighthouse CI is configured against the Vite preview server on `http://127.0.0.1:4173`.
