# Accessibility Audit Report

## Scope
- Homepage
- Contact page
- Auth forms
- Quote and contact lead forms
- Mobile navigation
- Chatbot widget

## Automated checks included
- `jest-axe` on critical form components
- `cypress-axe` smoke tests on homepage and contact page

## Manual verification checklist
- Keyboard-only navigation across nav, forms, chatbot, and profile dashboard
- Focus visibility on all interactive controls
- Form labels and inline error messaging
- Touch targets at or above `44x44px`
- Color contrast on dark hero surfaces, gold CTAs, and white text
- Screen reader announcements for form errors and dialog controls

## Expected AA checkpoints
- Logical heading order
- Form controls with associated labels
- Visible focus indicators
- No keyboard traps in chatbot, mobile drawer, or popup quote form
- CTA and body copy contrast preserved in dark/light sections

## Follow-up actions
- Run VoiceOver/NVDA pass against production deploy
- Capture contrast readings for gold-on-dark combinations after final brand tweaks
- Expand Cypress accessibility coverage to `/services`, `/projects`, and `/login`
