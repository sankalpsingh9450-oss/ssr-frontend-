# Service Location Pages Design

## Summary

Add location-specific service landing pages for SSR Group Civil using the existing service detail template and data-driven service architecture. The new pages will live under:

- `/services/:service/:location`

Examples:

- `/services/residential-construction/gurgaon`
- `/services/commercial-projects/noida`
- `/services/investment-advisory/delhi`

The goal is to support localized service discovery, stronger local SEO signals, and higher-intent landing pages without rebuilding the current service detail system.

This work should reuse the existing `/services/:slug` page structure and only layer location-specific content where available.

## Goals

- Reuse the current service detail template for location-specific pages.
- Add location-aware copy, FAQs, and project highlights.
- Support local SEO metadata per service-location combination.
- Keep the service data structure maintainable and scalable.
- Avoid introducing a separate parallel page system unless necessary.

## Non-Goals

- No backend rendering or SSR changes.
- No CMS integration.
- No automatic generation for every possible city.
- No redesign of the generic service page template.
- No changes to unrelated routes or navigation structure.

## Supported Locations (Phase 1)

Initial location coverage will be limited to:

- `gurgaon`
- `noida`
- `greater-noida`
- `delhi`

Only explicitly configured service-location pairs should render localized pages. Unsupported combinations should return a clear not-found state rather than silently falling back.

## Routing

### Existing Route

- `/services/:slug`

### New Route

- `/services/:service/:location`

### Route Behavior

1. If only `:slug` is present, render the existing generic service detail page.
2. If both `:service` and `:location` are present:
   - find the base service by `service`
   - find the location-specific content under that service
   - merge location-specific content into the base template
3. If the service does not exist, show the existing service not found state.
4. If the service exists but the location is unsupported for that service, show a clear not found state.

## Data Model

The current `src/services.js` structure should remain the source of truth. Each service entry will gain an optional `locations` object.

### Base Service Shape

Existing fields remain unchanged:

- `slug`
- `title`
- `description`
- `sections`

### New Location Shape

Each service may add:

```js
locations: {
  gurgaon: {
    description: "...",
    localSeoTitle: "...",
    localSeoDescription: "...",
    projectsInLocation: [
      { title, type, location, description }
    ],
    faqs: [
      { question, answer }
    ],
    closing: "...",
  }
}
```

### Content Rules

- Base service data stays generic and reusable.
- Location entries only override the fields that need localization.
- If a location does not provide a field, the page falls back to the generic service value where appropriate.
- `projectsInLocation` and location FAQ content are additive and should be rendered only for location routes.

## Rendering Strategy

The existing `ServiceDetail.jsx` page should handle both generic and localized service pages.

### Generic Page

Uses:

- service title
- service description
- generic sections
- generic FAQs
- generic projects/testimonials/timeline

### Location Page

Uses:

- title adjusted to include location, for example:
  - `Residential Construction in Gurgaon`
- localized description when present
- generic sections where still relevant
- localized FAQ block instead of generic FAQ block when location FAQs exist
- `Projects in [Location]` section
- localized closing copy when present

## Page Structure for `/services/:service/:location`

1. Page header
   - service title + location
   - localized description
2. Existing reusable sections
   - timeline
   - offerings / process / why choose us / quality / benefits
3. `Projects in [Location]`
   - 3 local project cards
4. Location-specific FAQ section
5. Existing calculator block when the service already uses it
6. Existing consultation form
7. Existing CTA / WhatsApp support areas

This keeps the current template intact while inserting localized content in the highest-value places.

## SEO Behavior

Because this is a React + Vite SPA, the simplest production-safe SEO layer for now is client-side metadata updates.

### Metadata to Update

For location pages:

- `document.title`
- meta description

### Metadata Format

Title pattern:

- `[Service Title] in [Location] | SSR Group Civil`

Description pattern:

- localized SEO description from data when present
- otherwise derived from service title + location + business value proposition

### Canonical Behavior

No canonical tag changes are required in this phase because the app is currently SPA-based and there is no SSR meta system in place. If a future SEO phase introduces server-rendered metadata, this structure should be upgraded there rather than duplicated now.

## Components and File Changes

### Files to Update

- `src/App.jsx`
  - add `/services/:service/:location`
- `src/pages/ServiceDetail.jsx`
  - support both generic and localized routes
  - update metadata on mount for localized pages
- `src/services.js`
  - add `locations` data to supported services

### Reuse

Existing components should continue to be reused:

- `FaqAccordion`
- `ServiceConsultationForm`
- `ConstructionCostCalculator`
- existing project/testimonial/timeline blocks already inside `ServiceDetail.jsx`

No new top-level page component is needed for phase 1.

## Error Handling

### Invalid Service

Show the existing service not found state.

### Invalid Location

Show a service-location not found state with:

- a short explanation
- a link back to `/services`
- optionally a link to the generic service page if the base service exists

### Missing Optional Local Content

If location content exists but some optional fields are missing:

- use generic fallback where appropriate
- skip localized-only sections if there is no content

## Testing and Verification

### Functional Checks

- `/services/residential-construction/gurgaon` loads correctly
- `/services/commercial-projects/noida` loads correctly
- `/services/investment-advisory/delhi` loads correctly
- unsupported location route shows not found
- existing `/services/:slug` pages still work unchanged

### UI Checks

- localized title and description appear correctly
- `Projects in [Location]` renders when data exists
- localized FAQs render correctly
- consultation form still submits with the correct service context

### SEO Checks

- `document.title` updates per location page
- meta description updates per location page

## Open Decisions Resolved

- URL format: `/services/:service/:location`
- Initial locations:
  - Gurgaon
  - Noida
  - Greater Noida
  - Delhi
- Unsupported service-location combinations should not silently fall back.

## Recommended Implementation Order

1. Add location data to `services.js`
2. Add the new route in `App.jsx`
3. Extend `ServiceDetail.jsx` to:
   - read both params
   - resolve base service + location content
   - merge display content
   - update title/meta description
4. Add the location-specific project and FAQ rendering
5. Verify generic service pages still behave correctly

## Scope Check

This is appropriately scoped for a single implementation plan. It does not require decomposition into multiple sub-projects.
