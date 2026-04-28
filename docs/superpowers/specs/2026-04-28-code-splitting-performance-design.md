# Code Splitting Performance Design

## Summary

Improve frontend performance by extending the existing lazy-loading strategy instead of rebuilding the router. The app already lazy-loads route components in `src/App.jsx`, so this work focuses on the remaining gaps:

- preload a small set of critical next-step routes
- lazy load heavy in-page components
- add local `Suspense` fallbacks for those heavy components

This keeps the current React Router structure intact and avoids unnecessary refactoring.

## Goals

- Reduce the initial JavaScript needed for first render
- Improve perceived navigation speed to high-value routes
- Lazy load heavy components that are not needed immediately
- Add graceful loading states for split components

## Non-Goals

- No router migration
- No redesign of page layouts
- No splitting of every small component
- No backend or deployment changes
- No bundle analysis tooling changes in this phase

## Current State

The app already uses `React.lazy` for:

- page routes in `src/App.jsx`
- chatbot widget
- popup form

The remaining useful work is:

- preloading likely next routes
- splitting heavy components embedded within already-lazy pages

## Route Preloading

Preload only the most valuable public routes:

- `Services`
- `Properties`
- `Contact`

Reasoning:

- these are high-intent pages
- they are likely follow-on navigations from homepage and hero CTAs
- preloading all routes would dilute the performance benefit

### Behavior

Preloading should:

- happen after the shell is mounted
- not block initial render
- use dynamic imports already defined for the route components

This should be implemented in a lightweight way inside the existing app shell rather than introducing a new preloading framework.

## Heavy Component Splitting

Lazy load the following components:

### 1. Property Gallery

Current usage:

- property detail page

Reason:

- image gallery logic and image-heavy UI do not need to be bundled into the initial route shell

### 2. Construction Cost Calculator

Current usage:

- homepage compact calculator
- residential construction service detail page

Reason:

- calculator includes form logic and validation dependencies
- it is useful to defer until its containing page/section renders

### 3. Map / Embed-heavy Block

Current usage:

- contact-related hero or contact page map section

Reason:

- iframe/embed-heavy sections are good candidates for deferred loading

If the current implementation is only a lightweight placeholder and not a real embed-heavy block, then this split can be skipped during implementation.

## Suspense Fallbacks

Add local `Suspense` boundaries with small, purpose-specific fallbacks.

### Route Fallback

Keep the existing page-level route fallback in `src/App.jsx`.

### Component Fallbacks

Add component-level fallbacks for split heavy components:

- calculator:
  - small section loader / placeholder block
- property gallery:
  - image panel placeholder
- map block:
  - compact section placeholder

Fallbacks should:

- be visually simple
- not introduce layout shift larger than necessary
- match the current Tailwind styling language

## Implementation Approach

### App Shell

Keep the current route-level `React.lazy` setup in `src/App.jsx`.

Add:

- lightweight post-mount preloading for selected routes

Do not:

- replace `Routes`
- replace `Suspense`
- add a route manifest system

### Page-Level Splits

Move heavy component imports from static imports to `React.lazy` where appropriate inside:

- `src/pages/Home.jsx`
- `src/pages/ServiceDetail.jsx`
- `src/pages/PropertyDetail.jsx`
- possibly `src/pages/Contact.jsx` if the map block qualifies

Each lazy component should be wrapped in a local `Suspense`.

## Files Expected To Change

- `src/App.jsx`
- `src/pages/Home.jsx`
- `src/pages/ServiceDetail.jsx`
- `src/pages/PropertyDetail.jsx`
- possibly `src/pages/Contact.jsx`

No other files should be touched unless required to support a fallback component.

## Error Handling

- If a lazy component fails to load, the surrounding page should still mount normally
- This task does not require introducing a new error boundary
- Existing route-level behavior should remain unchanged

## Verification

Verification should include:

1. confirm all route components remain lazy-loaded
2. confirm `Services`, `Properties`, and `Contact` are preloaded after app mount
3. confirm heavy components load behind local `Suspense` boundaries
4. confirm fallback placeholders appear briefly when expected
5. confirm no route regressions
6. confirm no visible layout break in:
   - homepage
   - service detail page
   - property detail page
   - contact page if touched

## Open Decisions Resolved

- Keep existing React Router setup: yes
- Preload only `Services`, `Properties`, and `Contact`: yes
- Split only meaningful heavy components: yes
- Keep current route fallback and add local component fallbacks: yes
