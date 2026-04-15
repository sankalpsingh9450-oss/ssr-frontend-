# 🏗️ SSR Group — Corporate Website

Premium construction & real estate website for [ssrgroupcivil.in](https://ssrgroupcivil.in)

## Tech Stack

- **React 18** + **Vite 5** (fast dev & build)
- **React Router v6** (multi-page SPA)
- **Framer Motion** (scroll reveals, page transitions, parallax)
- **React Icons** (social icons)
- **Custom CSS** (no framework — full control)
- **Meta Pixel** ready for ad tracking
- **Google Analytics** ready

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Cinematic hero, services, projects, testimonials, CTA |
| Services | `/services` | All 8 services with detailed cards |
| Projects | `/projects` | Filterable portfolio with animations |
| About Us | `/about` | Company story, values, team |
| Contact | `/contact` | Contact form + info card + Google Maps |
| Login | `/login` | Login / Sign Up with Google OAuth UI |

## Features

- ✅ Auto-popup lead form (10s delay)
- ✅ Top promotional banner with CTA
- ✅ Floating social buttons (WhatsApp, Instagram, LinkedIn, YouTube)
- ✅ Scroll reveal animations (staggered)
- ✅ Tilt-on-hover project cards (3D effect)
- ✅ Counter animations for stats
- ✅ Glassmorphism hero form card
- ✅ Particle effects in hero
- ✅ Mobile-first responsive design
- ✅ Meta Pixel integration
- ✅ Backend API integration (FastAPI)
- ✅ Form submissions with success states

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start dev server
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm run preview  # preview the build locally
```

The `dist/` folder is ready to deploy to Vercel, Netlify, or any static host.

## Connect to Backend

Make sure your FastAPI backend is running on port 8000:

```bash
cd ../ssr-backend
uvicorn app.main:app --reload --port 8000
```

The frontend will send form submissions to `http://localhost:8000/api/v1/`.

## Deploy

### Vercel (recommended for frontend)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo → Deploy
4. Set `VITE_API_URL` in environment variables

### Netlify
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Add site from Git → Deploy
4. Add `_redirects` file: `/* /index.html 200`

## Meta Pixel Setup

1. Go to [Meta Business Suite](https://business.facebook.com)
2. Create a Pixel → Copy the ID
3. In `index.html`, uncomment and replace `YOUR_PIXEL_ID`
4. Every form submission automatically fires a `Lead` event

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router + layout
├── constants.js          # All site data
├── hooks/
│   └── index.js          # Custom hooks (scroll, tilt, counter, API)
├── components/
│   ├── Navbar.jsx/.css    # Navigation with glassmorphism
│   ├── TopBanner.jsx/.css # Promotional banner
│   ├── Footer.jsx/.css    # Site footer
│   ├── FloatButtons.jsx/.css # Social float buttons
│   └── PopupForm.jsx/.css # Lead capture popup
├── pages/
│   ├── Home.jsx/.css      # Landing page
│   ├── Services.jsx/.css  # Services listing
│   ├── Projects.jsx       # Projects portfolio
│   ├── About.jsx/.css     # About us
│   ├── Contact.jsx/.css   # Contact page
│   └── Login.jsx/.css     # Auth page
└── styles/
    └── globals.css        # Design system
```

---
Built for **SSR Group Civil** — [ssrgroupcivil.in](https://ssrgroupcivil.in)
