# First Contentful Paint (FCP) Optimization

## Key FCP Bottlenecks Found

### 1. FontLoader Component – Inefficient Material Icons Loading
- Currently loading async in `useEffect`, but already using Emotion/Material-UI
- Better to preload in the `<head>` tag
- Consider using an icon library preload or defer it entirely
- **File:** `src/components/font-loader.tsx`

### 2. Header Makes Blocking Server Calls
- `verifySessionToken()` in Header blocks the entire page render
- Both Header and page.tsx make similar auth calls – redundant work
- **Suggestion:** Cache session or move header into Suspense boundary
- **File:** `src/components/header/header.tsx`, `src/app/layout.tsx`

### 3. MovieContent Makes Additional Client-Side Calls
- `useEffect` calls `getContent()` after hydration
- Delays interactive content from rendering
- **Suggestion:** Fetch user data server-side and pass it down
- **File:** `src/components/media/movie-content.tsx`

### 4. EmotionCache/Providers Setup
- Emotion's CSS-in-JS setup happens after React hydration
- EmotionCache flushes CSS during SSR but still requires client-side processing
- **Suggestion:** Consider optimizing with inline critical styles
- **File:** `src/utils/providers/EmotionCache.tsx`

### 5. Page Transition Animation
- The `fadeIn` animation in globals.css triggers layout recalculation
- Uses `transform: translateY(10px)` which forces paint
- **Suggestion:** Use `opacity` only or defer animation
- **File:** `src/app/globals.css`

### 6. Unused MUI CssBaseline
- `<CssBaseline />` resets global styles, adding unnecessary CSS
- **Suggestion:** Consider custom reset or skip it if Tailwind is primary
- **File:** `src/app/layout.tsx`

### 7. Single Suspense Boundary
- Header (critical path) isn't wrapped in Suspense
- Page doesn't load progressively
- **Suggestion:** Split into multiple boundaries for progressive rendering
- **File:** `src/app/layout.tsx`

## Recommended Changes Prioritized

### High Priority
1. **Preload Material Icons** – Remove FontLoader useEffect, add preload link
2. **Wrap Header in Suspense** – with a lightweight fallback
3. **Optimize fadeIn animation** – Use opacity only instead of transform

### Medium Priority
4. **Move user/auth data fetching** – to a shared location (avoid duplication)
5. **Parallelize server-side auth calls** – in layout

### Lower Priority (Investigate)
6. **Consider removing CssBaseline** – or deferring it
7. **Optimize EmotionCache** – Evaluate inline critical styles

## Implementation Notes

- Material Icons preload should go in `layout.tsx` `<head>` via metadata
- Header Suspense fallback should be minimal (e.g., logo only, no nav)
- MovieContent could receive user/watchlist data as props instead of fetching client-side
- Animation optimization is a quick win with minimal risk
- Test Core Web Vitals after each change using Vercel Speed Insights (already configured)
