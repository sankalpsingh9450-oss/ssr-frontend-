# QA Checklist

## Core journeys
- Homepage loads without console errors
- Hero CTAs route correctly
- Services filters update visible service content
- Projects filters update project grid
- Contact page form submits and shows success state
- Quote popup submits and shows success state
- Chatbot opens, responds, and offers handoff actions

## Authentication
- Register flow reaches dashboard
- Login flow reaches dashboard
- Forgot password OTP flow reaches success screen
- Mobile auth forms remain usable at `320px`

## Dashboard
- Profile details update correctly
- Avatar upload preview works
- Saved projects can be removed
- Inquiries filter and pagination work
- Quote request actions update state
- Settings save without UI regressions

## Mobile and responsive
- Mobile drawer opens/closes via button and overlay
- Bottom navigation renders on dashboard mobile layout
- No horizontal scrolling at `320px`, `768px`, `1024px`, and `1440px`
- Forms collapse to single-column on mobile

## Accessibility
- Keyboard navigation works for nav, forms, chatbot, dashboard
- Focus ring visible on all buttons and links
- Inline form errors are readable and associated with inputs
- Color contrast remains readable on dark hero surfaces

## Performance
- Production build succeeds
- Lighthouse CI passes configured warnings/budgets
- No obvious CLS during hero/image load
- Route transitions remain responsive on mobile
