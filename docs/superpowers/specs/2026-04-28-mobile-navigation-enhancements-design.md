# Mobile Navigation Enhancements Design

## Summary

Enhance the existing mobile navigation drawer without changing its overall interaction model. The current slide-in menu already supports navigation links, service submenu, account actions, and auto-close behavior on route change. This work adds stronger conversion and contact affordances inside that same menu.

Enhancements will include:

- a `Call Now` action
- a `WhatsApp` action
- clearer contact information in the expanded menu
- a language switcher placeholder
- preserved close-on-route-change behavior

## Goals

- Make mobile navigation more action-oriented for high-intent users
- Surface contact information more clearly inside the menu
- Keep the current visual language and drawer behavior
- Avoid unnecessary refactoring

## Non-Goals

- No full navbar redesign
- No real language switching implementation
- No desktop navigation changes
- No backend or routing changes

## Current State

The current mobile menu in `src/components/Navbar.jsx` already has:

- slide-in drawer animation
- services accordion submenu
- account section
- quote button
- footer contact/social area
- close on route change through `useEffect([location.pathname])`

This means the requested work is an enhancement to an already-good base, not a rewrite.

## Implementation Approach

Modify the existing `MobileMenu` inside `Navbar.jsx` directly rather than splitting it into new files.

Why:

- the menu is already centralized in one component
- the requested changes are small and closely related
- this keeps the change focused and easy to review

## UI Additions

### 1. Primary Mobile Contact Actions

Add a dedicated action row in the mobile menu for:

- `Call Now`
- `WhatsApp`

Behavior:

- `Call Now` uses the existing `SITE.phoneRaw` in a `tel:` link
- `WhatsApp` uses the existing `WHATSAPP_URL`
- both actions should be prominent and touch-friendly
- both actions should close the menu before navigating away where practical

### 2. Expanded Contact Information

Make the contact block more explicit and readable inside the mobile drawer.

Show:

- phone number
- email address
- office address
- office hours if spacing remains clean

The current footer already has some contact links. This work should upgrade the presentation so it feels like a real contact block rather than just a few footer links.

### 3. Language Switcher Placeholder

Add a simple non-functional placeholder block for language selection.

Recommended display:

- `English | Hindi`

Behavior:

- no real translation logic
- no routing change
- purely presentational placeholder to reserve space for future multilingual support

## Existing Behavior To Preserve

The following must remain intact:

- overlay click closes menu
- close button closes menu
- `Escape` closes menu
- route changes close menu
- services accordion continues working
- account and quote actions remain available

## Styling

Use the current design language already present in:

- `src/components/Navbar.css`

Guidelines:

- keep the dark blue / gold / white brand system
- maintain 44px+ touch targets
- avoid introducing new visual patterns that clash with the current drawer

The new CTA row can be visually stronger than normal links, but should still feel part of the existing menu.

## Files Expected To Change

- `src/components/Navbar.jsx`
- `src/components/Navbar.css`

No other files should need modification unless a tiny constant export is needed.

## Verification

Verification should include:

1. open mobile menu
2. confirm `Call Now` appears and uses `tel:`
3. confirm `WhatsApp` appears and uses the existing WhatsApp URL
4. confirm contact info is visible and readable
5. confirm language placeholder is visible
6. confirm menu still closes on route change
7. confirm services accordion still works
8. confirm no desktop navbar regression

## Open Decisions Resolved

- Enhance the existing mobile nav instead of refactoring it: yes
- Keep language switcher as placeholder only: yes
- Preserve current close-on-route-change logic: yes
