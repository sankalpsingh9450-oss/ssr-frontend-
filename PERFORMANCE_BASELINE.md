# Performance Baseline

## Tooling
- Lighthouse CI via `.lighthouserc.json`
- Vite production build
- Route-level lazy loading already enabled
- Responsive image component with lazy loading and `srcset`

## Target budgets
- Performance: `> 90`
- Accessibility: `> 95`
- Best Practices: `> 90`
- SEO: `> 90`
- LCP: `< 2.5s`
- FCP: `< 1.5s`
- CLS: `< 0.1`

## Audit routes
- `/`
- `/services`
- `/projects`
- `/contact`
- `/login`

## Existing optimizations supporting the baseline
- Route-based code splitting
- Manual vendor chunking
- Service worker and offline page
- Preconnects in `index.html`
- Lazy-loaded chatbot and popup form
- Responsive image loading with WebP/JPEG fallback
- Netlify caching/security headers

## Recommended next measurements
- Run `npm run test:lighthouse:ci`
- Compare mobile and desktop reports after every major hero/media redesign
- Track bundle changes alongside Lighthouse output in pull requests
