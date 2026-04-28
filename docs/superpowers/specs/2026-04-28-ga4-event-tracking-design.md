# GA4 Event Tracking Design

## Summary

Add Google Analytics 4 event tracking to the frontend using the existing `window.gtag` pattern already present in the codebase. The goal is to capture high-value lead and engagement events without changing UI behavior or introducing a new analytics dependency.

This work will:

- initialize GA4 through `gtag.js`
- use a measurement ID from environment configuration
- add a small shared analytics helper
- track form submissions, property interactions, contact actions, filter usage, and calculator usage

## Goals

- Capture business-critical interaction events in GA4
- Keep implementation lightweight and safe when GA is not configured
- Reuse the current `window.gtag` approach already referenced in the app
- Centralize event tracking so future additions stay consistent

## Non-Goals

- No migration to `react-ga4`
- No backend analytics ingestion
- No event dashboard or reporting UI
- No change to visual styling or layout
- No cookie consent implementation in this phase

## Implementation Approach

Use plain `gtag.js` and a shared helper instead of adding `react-ga4`.

Why this approach:

- the app already uses `window.gtag` checks in multiple places
- this avoids adding dependency weight
- the helper can keep calls safe and consistent

## GA Initialization

### Source of Configuration

Use one frontend environment variable:

- `VITE_GA_MEASUREMENT_ID`

### Behavior

- if `VITE_GA_MEASUREMENT_ID` exists, inject and initialize GA4 in `index.html`
- if it does not exist, tracking should silently no-op
- the app must continue working normally either way

### Initialization Pattern

Use the standard GA4 `gtag.js` setup in `index.html`, replacing the current placeholder with a real conditional pattern driven by Vite environment injection.

## Shared Analytics Helper

Create:

- `src/lib/analytics.js`

Expose one small public function:

- `trackEvent(eventName, params = {})`

Behavior:

- return early if `window.gtag` is unavailable
- otherwise call:
  - `window.gtag('event', eventName, params)`

This helper becomes the single recommended entry point for app-level GA events.

## Event Coverage

### 1. Form Submissions

Track successful submissions for the existing lead/contact flows.

Event name:

- `form_submission`

Required parameters:

- `form_type`

Optional contextual parameters where available:

- `service`
- `property_id`
- `source`
- `intent`

Tracked form surfaces should include:

- contact inquiry form
- quote request form
- newsletter/business inquiry forms if they already report successful submit
- property lead form
- service consultation form
- site visit booking form
- calculator quote reveal or submit flow where applicable

Only successful submissions should emit the GA4 event.

### 2. Property Card Clicks

Track when a user clicks into a property from list/grid surfaces.

Event name:

- `property_card_click`

Parameters:

- `property_id`
- `property_title`
- `location`
- `source`

Typical source values:

- `properties_grid`
- `saved_properties`

### 3. WhatsApp Clicks

Track all WhatsApp CTA clicks where context exists.

Event name:

- `whatsapp_click`

Parameters:

- `source`
- `service` when on service pages
- `property_id` when on property pages/cards
- `property_title` when on property pages/cards

Likely source values:

- `service_detail`
- `property_card`
- `property_detail`
- `contact_page`
- `mobile_sticky_bar`

### 4. Phone Call Clicks

Track all `tel:` CTA interactions.

Event name:

- `phone_call_click`

Parameters:

- `source`
- `service` when relevant
- `property_id` when relevant

### 5. Property Filter Usage

Track user interaction with the `/properties` filtering system.

Event name:

- `property_filter_used`

Parameters:

- `filter_key`
- `filter_value`
- `results_count`

Track each meaningful filter change:

- budget
- location
- BHK
- property type
- status
- clear all

Sorting should be tracked separately.

### 6. Property Sorting

Track sort usage in the results header.

Event name:

- `property_sort_used`

Parameters:

- `sort_value`
- `results_count`

### 7. Calculator Usage

Track meaningful usage of the construction cost calculator.

Two events should be emitted:

1. when the estimate is generated or updated
   - `construction_calculator_used`
2. when the detailed quote CTA is used
   - `construction_calculator_quote_request`

Parameters:

- `plot_size`
- `floors`
- `finish_quality`
- `estimated_range`
- `source`

Source values:

- `homepage_calculator`
- `service_detail_calculator`

## Existing Code Integration

The following existing patterns should be extended rather than replaced:

- `window.gtag` usage in `src/lib/performance.js`
- `window.gtag` usage in `src/lib/chatbotApi.js`

This task does not need to refactor chatbot or performance tracking unless sharing the helper is straightforward.

## Error Handling

- No analytics call should ever break user interactions
- If GA is unavailable, all tracking helpers should safely no-op
- No try/catch-heavy abstraction is needed beyond safe existence checks

## Data Quality Rules

- Only emit form events on successful submit
- Do not send raw long-form message bodies
- Keep parameter names consistent and lowercase with underscores
- Prefer stable identifiers like `property_id` over only titles where available

## Files Expected To Change

- `index.html`
- `src/lib/analytics.js`
- existing form components or form submit helpers
- property card/detail interaction points
- properties page filter/sort logic
- construction calculator component

The exact set of touched components should stay minimal and only include places where requested events originate.

## Verification

Verification should include:

1. confirm no runtime error when `VITE_GA_MEASUREMENT_ID` is missing
2. confirm `window.gtag` receives calls when GA is configured
3. confirm each requested interaction emits the expected event name
4. confirm event payloads include the expected context fields
5. confirm UI behavior is unchanged

## Open Decisions Resolved

- Use `gtag.js` instead of `react-ga4`: yes
- Skip aggregate analytics abstraction for now: yes
- Keep tracking frontend-only: yes
- Track only successful form submissions: yes
