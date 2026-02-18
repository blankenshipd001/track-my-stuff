# 🎬 ReelTime - Movie & TV Show Watchlist Manager

A modern Next.js application that brings all your TV and movie watch lists together in one place. Discover trending content, manage your personal watchlist, and find where your favorite shows are streaming.

**Tech Stack:** Next.js 16 • React 19 • TypeScript • Material-UI • Firebase • Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase project credentials (`.env.local`)

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create .env.local with your Firebase credentials and TMDB API key
cp .env.example .env.local

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

**Other useful commands:**
```bash
npm run build      # Production build
npm run start      # Start production server
npm run test       # Run test suite
npm run test:watch # Run tests in watch mode
npm run lint       # Run ESLint
```

---

## 📁 Project Structure

This is a **Next.js App Router** project. Here's how it's organized:

```
src/
├── app/                    # Routes & pages (App Router) - each folder = one route
│   ├── page.tsx           # Homepage (/trending)
│   ├── movies/            # Movie detail pages (/movies/:id)
│   ├── tv/                # TV show detail pages (/tv/:id)
│   ├── activity/          # User activity & watchlist
│   ├── about/             # Static pages
│   ├── api/               # API routes & backend logic
│   └── layout.tsx         # Root layout (Skip link, Header, Footer)
│
├── components/            # Reusable React components (organized by feature)
│   ├── media/             # Movie/TV card components & grids
│   ├── details/           # Detail page sections (cast, episodes, etc)
│   ├── buttons/           # Button components
│   ├── header/            # Navigation & user menu
│   └── ...
│
├── lib/                   # Shared utilities & libraries
│   ├── firebase/          # Firebase config & auth helpers
│   ├── theme-constants.ts # Design tokens (colors, spacing)
│   └── ...
│
├── hooks/                 # Custom React hooks
│   ├── useWatchlist.ts    # Watchlist management
│   ├── useFetchProviders.ts
│   └── ...
│
├── utils/                 # Helper functions
│   ├── api/               # API client functions
│   └── ...
│
└── data-models/           # TypeScript interfaces
    └── media.interface.ts # Media type definitions
```

**Key Pattern:** Keep `/app` folder clean with only routes. Put most component code in `/lib/components` and shared utilities in `/lib`.

---

## 🛠️ Development Guide

### Creating a New Page

1. Create a folder under `src/app/` with your route name
2. Add a `page.tsx` file with your component
3. Next.js automatically creates the route

**Example:** Create `/src/app/favorites/page.tsx` → Route becomes `/favorites`

```tsx
export default function FavoritesPage() {
  return <div>Your favorites</div>;
}
```

### Server vs Client Components

By default, components are **Server Components** (best for data fetching, reading secrets, large dependencies).

For interactivity (hooks, events, state), add `"use client"` at the top:

```tsx
"use client";

import { useState } from "react";

export default function MyComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Naming Conventions

- **Server components:** `component-name.tsx`
- **Client components:** `component-name-client.tsx` (optional but make intent clear)
- **Test files:** `component-name.spec.tsx`

### Styling

We use **Tailwind CSS** and **Material-UI** with design tokens in `/lib/theme-constants.ts`:

```tsx
import { COLORS, GRADIENTS } from '@/lib/theme-constants';

<Box sx={{ background: GRADIENTS.card, color: COLORS.purple.solid }}>
  Content
</Box>
```

--- 

## 📌 Common Tasks

### Adding a New Component

1. Create file in `src/components/feature/component-name.tsx`
2. Export as named export
3. Import and use in pages

```tsx
// src/components/media/movie-card.tsx
export function MovieCard({ title, poster }: Props) {
  return <div>{title}</div>;
}
```

### Fetching Data

**Server-side (recommended):**
```tsx
// In a page.tsx or component
const data = await fetch('https://api.example.com/data');
const json = await data.json();
```

**Client-side hook:**
```tsx
"use client";
import { useEffect, useState } from "react";

export function Component() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/endpoint').then(r => r.json()).then(setData);
  }, []);
  return <div>{data}</div>;
}
```

### API Routes

Create files in `src/app/api/`:
```tsx
// src/app/api/favorite/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=3600');
  return Response.json({ success: true }, { headers });
}
```

---

## 🧪 Testing

This project uses **Jest** and **React Testing Library**:

```bash
# Run all tests
npm run test

# Watch mode (re-runs on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

**Writing tests:**
```tsx
// src/components/media/movie-card.spec.tsx
import { render, screen } from '@testing-library/react';
import { MovieCard } from './movie-card';

describe('MovieCard', () => {
  it('displays movie title', () => {
    render(<MovieCard title="Inception" poster="/url" />);
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });
});
```

---

## 🎨 Authentication & Firebase

User authentication is handled through Firebase:

- **Config:** `src/lib/firebase/config.ts`
- **Auth helpers:** `src/lib/firebase/auth.ts`
- **Logout:** `src/lib/clientLogout.ts`

Session tokens are managed via `src/app/api/session` route.

---

## ♿ Accessibility

ReelTime is WCAG A compliant with:
- ✅ Alt text on all images
- ✅ aria-labels on interactive elements
- ✅ Keyboard navigation (Enter/Space to flip cards)
- ✅ Skip-to-content link
- ✅ Focus indicators
- ✅ Screen reader support

When adding features, remember:
- Add `alt` text to `<Image>` components
- Add `aria-label` to buttons without visible text
- Support keyboard navigation (Tab, Enter, Escape)
- Test with a screen reader

---

## 🚀 Performance & Caching

The app uses Next.js best practices:
- **Data Cache:** `fetch()` with `next: { tags, revalidate }`
- **HTTP Cache:** `Cache-Control` headers with `stale-while-revalidate`
- **Batched API calls:** Provider requests batched in groups of 5
- **Pagination:** Loads 20 items initially with "Load More" button

See `QUICK_REFERENCE.md` for optimization details.

---

## 📱 Progressive Web App (PWA)

This app works offline and can be installed on devices:

```bash
# Build and test PWA locally
npm run build
npm run start
```

Then:
1. Look for install button (⊕) in address bar
2. Test offline: DevTools → Network → Offline
3. App should still work with cached content

---

## 🤝 Contributing

### Before You Start
1. Create a new branch: `git checkout -b feature/my-feature`
2. Make changes following the patterns in this README
3. Test your changes: `npm run test`
4. Lint: `npm run lint`

### Code Standards
- Use TypeScript (no `any` types)
- Add alt text & aria-labels
- Write tests for new components
- Keep components small & focused
- Use server components by default

### Pull Request Checklist
- [ ] Changes follow project patterns
- [ ] Tests pass (`npm run test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Accessibility features added (alt text, aria-labels)
- [ ] Updated QUICK_REFERENCE.md if needed

---

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs) - App Router patterns
- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Docs](https://mui.com)
- [Firebase Web SDK](https://firebase.google.com/docs/web)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility

## Progressive Web App (PWA)

This app is configured as a PWA, which means users can install it on their devices and use it offline.

### What's Included
- **Service Worker**: Automatically generated in production for offline support
- **Manifest**: App metadata for installation (`/public/manifest.json`)
- **Icons**: Optimized app icons for all devices
- **Offline Mode**: Cached assets work without internet connection

### Testing the PWA Locally

1. Build and start the production server:
```bash
npm run build
npm run start
```

2. Open http://localhost:3000 in your browser

3. Test PWA features:
   - **Chrome DevTools**: Open Application tab → Service Workers to verify registration
   - **Install**: Look for the install button (⊕) in the browser address bar
   - **Offline Mode**: In DevTools Network tab, select "Offline" and reload - the app should still work

### Generating New Icons

If you update the app logo, regenerate PWA icons:
```bash
# Replace public/monkey.png with your new logo first
node generate-icons.js
```

This creates all required icon sizes (192x192, 256x256, 384x384, 512x512, apple-touch-icon, and favicon).

### Production Deployment

When deployed to production (Vercel, etc.), the PWA features activate automatically:
- Service worker registers and caches assets
- Users see an "Install App" prompt
- App works offline after first visit
- Appears in app drawer on mobile devices

### NOTES

 - CSS Fonts
  This was removed from globals.css in favor of trying to use the nextjs optimized fonts
  `@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");`
  [`Fonts Doc``](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)
## Links used:

https://firebase.google.com/docs/web/modular-upgrade#example_2_refactoring_a_function
https://console.cloud.google.com/apis/api/firebasedatabase.googleapis.com/credentials?project=code-monkey-292017
https://travis.media/how-to-use-firebase-with-react/

TODO: some nice setup/styles to use
https://github.com/wdevon99/Next-js-starter/tree/main/src

Building a movies page:
https://www.freecodecamp.org/news/react-movie-app-tutorial/

Icons page 
https://fonts.google.com/icons?selected=Material+Symbols+Outlined:home:FILL@0;wght@400;GRAD@0;opsz@48

https://heroicons.com/


https://www.themoviedb.org/settings/api
https://www.themoviedb.org/login?to=read_me&redirect_uri=/docs
https://www.themoviedb.org/settings/api/details


https://www.themoviedb.org/about/logos-attribution

## TODOs
 - Update to allow easy updating of the season and episode when on mobile screens
 - Make the tiles on the MyWatchlist tapable for edit especially on mobile screens
 - Make it so the legend can be dismissed and brought back up
 - Make it so the legend is populated by your list of providers
 - Make a way to save your list of providers
 - Make a way to know what providers a show is available on
 - Make a way to select which provider you're watching from
 - Make the "Add Title" on MyWatchlist.tsx actually search for titles and add them to the watchlist
 - 

## ISSUES
