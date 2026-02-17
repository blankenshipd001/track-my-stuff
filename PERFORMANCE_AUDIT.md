# Performance, Caching, SSR & Accessibility Audit

## Executive Summary
The ReelTime application has a solid Next.js foundation with good use of server components and static generation. However, there are significant opportunities to improve caching strategies, optimize data fetching patterns, and enhance accessibility compliance.

---

## 1. CACHING & SERVER SIDE RENDERING (SSR) IMPROVEMENTS

### 1.1 Replace In-Memory Cache with Next.js Data Cache (CRITICAL)

**Current Issue:**
- API routes use in-memory Map caches that are lost on server restart
- Cache is not shared across multiple server instances in production
- No persistent caching layer

**Affected Files:**
- `src/app/api/popular/route.ts`
- `src/app/api/search/route.ts`
- `src/app/api/movie/[id]/route.ts`
- `src/app/api/providers/route.ts`
- `src/app/api/image/route.ts`

**Recommendations:**

```typescript
// BEFORE - In-memory cache (bad for production)
const cache = new Map<string, CacheEntry>();

// AFTER - Use Next.js Data Cache with tags
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  try {
    const response = await fetch(SEARCH_URL, {
      next: {
        tags: ['search', `search:${q}`],
        revalidate: 3600 // 1 hour ISR
      }
    });
    // ... rest of logic
  } catch (error) {
    // handle error
  }
}
```

**Benefits:**
- Automatic cache invalidation on-demand using `revalidateTag()`
- Works across multiple server instances
- Persists across deployments
- Leverages Next.js built-in infrastructure

**Priority:** CRITICAL

---

### 1.2 Add Proper HTTP Cache Headers to API Responses

**Current Issue:**
- Most API routes return responses without cache-control headers
- Clients cannot cache responses
- Each request goes to server even for cacheable data

**Affected Files:**
- `src/app/api/popular/route.ts`
- `src/app/api/search/route.ts`
- `src/app/api/movie/[id]/route.ts`
- `src/app/api/tv/[id]/route.ts`
- `src/app/api/providers/route.ts`

**Recommendations:**

```typescript
// Add at end of GET functions
const headers = new Headers();

// For public, rarely-changing data
headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');

// For user-specific data
headers.set('Cache-Control', 'private, max-age=300');

// For searchable data
headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=3600');

return NextResponse.json(data, { headers });
```

**Cache Strategy by Endpoint:**

| Endpoint | Data Type | Suggested Strategy |
|----------|-----------|-------------------|
| `/api/popular` | Popular movies/TV | `public, max-age=3600, stale-while-revalidate=86400` |
| `/api/search` | User queries | `public, max-age=60, stale-while-revalidate=600` |
| `/api/movie/[id]` | Movie details | `public, max-age=7200, stale-while-revalidate=86400` |
| `/api/tv/[id]` | TV details | `public, max-age=7200, stale-while-revalidate=86400` |
| `/api/providers` | Provider list | `public, max-age=604800` (7 days) |
| `/api/image` | Images | `public, max-age=31536000, immutable` (1 year) ✓ Already good |
| `/api/watchlist` | User watchlist | `private, max-age=300` |
| `/api/session` | User session | `private, no-cache, no-store` |

**Priority:** HIGH

---

### 1.3 Implement Incremental Static Regeneration (ISR)

**Current State:**
- Pages use `revalidate: 3600` in fetch options (good)
- Top 50 items pre-rendered at build time (good)
- But full ISR strategy not implemented

**Recommendations:**

```typescript
// src/app/movies/[slug]/page.tsx
export const revalidate = 3600; // 1 hour ISR

// OR for more control per endpoint:
export async function generateStaticParams() {
  // ... 
}

// Add explicit revalidation path hints
export const dynamicParams = true; // Allow runtime generation of unlisted params
```

**Implementation Priority:**
1. Enable ISR for detail pages (movies, TV shows) ✓ Already using revalidate
2. Set shorter ISR for trending/popular content (30min)
3. Set longer ISR for stable content (2-6 hours)

**Priority:** MEDIUM

---

### 1.4 Optimize N+1 Query Patterns

**Current Issue:**
In `fetchPopularContent()`:
```typescript
// Every movie fetches providers individually - N+1 pattern
const trendingResults: Media[] = await Promise.all(
  popularRes.results.map((item: { id: unknown }) => {
    return fetch(`.../watch/providers?...`) // One fetch per movie!
  })
);
```

This causes `N+1` requests (20 requests for 20 movies).

**Recommendations:**

```typescript
// OPTION 1: Batch similar requests or add pagination
export async function fetchPopularContent(): Promise<Media[]> {
  // Fetch popular movies (1 request)
  const movies = await fetch(popular_url, { 
    next: { revalidate: 3600, tags: ['popular-movies'] } 
  }).then(r => r.json());

  // Option A: Fetch providers in batches of 5
  const BATCH_SIZE = 5;
  const moviesWithProviders = [];
  
  for (let i = 0; i < movies.results.length; i += BATCH_SIZE) {
    const batch = movies.results.slice(i, i + BATCH_SIZE);
    const batchWithProviders = await Promise.all(
      batch.map(movie => fetchMovieProviders(movie))
    );
    moviesWithProviders.push(...batchWithProviders);
  }
  
  return moviesWithProviders;

  // Option B: Cache providers separately by ID
  // Only refresh if provider list changes infrequently
}

// Create a provider cache that runs less frequently
async function getProvidersByIds(movieIds: number[]) {
  // Fetch all providers once per hour
  const allProviders = await fetch(`.../watch/providers?...`, {
    next: { revalidate: 3600, tags: ['all-providers'] }
  });
  // Map local cache or return subset for requested IDs
}
```

**Expected Impact:**
- Reduce API calls by 50-80%
- Faster page loads
- Lower TMDB API quota usage

**Priority:** HIGH

---

### 1.5 Use Streaming for Large Responses

**Current Issue:**
- Large data fetches (e.g., all TV seasons/episodes) block rendering
- Users see blank page while data loads

**Recommendations:**

```typescript
// src/app/tv/[slug]/page.tsx
import { Suspense } from 'react';

export default async function TVDetailsPage({ params }) {
  const resolvedParams = await params;
  const tvShow = await getTVDetails(resolvedParams.slug);

  return (
    <>
      {/* Render immediately */}
      <DetailsHeaderServer media={tvShow} />
      
      {/* Stream episodes separately */}
      <Suspense fallback={<SkeletonLoader />}>
        <EpisodesStreamComponent tvId={tvShow.id} />
      </Suspense>
      
      {/* Stream cast separately */}
      <Suspense fallback={<SkeletonLoader />}>
        <CastStreamComponent credits={tvShow.credits} />
      </Suspense>

      {/* Stream recommendations separately */}
      <Suspense fallback={<SkeletonLoader />}>
        <RecommendationsStreamComponent />
      </Suspense>
    </>
  );
}
```

**Priority:** MEDIUM

---

## 2. PERFORMANCE OPTIMIZATIONS

### 2.1 Image Optimization

**Current State:** ✓ GOOD
- Using `next/image` with proper remotePatterns
- Image proxy route with aggressive caching (1 year)
- LRU cache implementation

**Recommendations to enhance:**

```typescript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https", 
        hostname: "static.tvmaze.com",
      },
      {
        protocol: "https",
        hostname: "artworks.thetvdb.com",
      },
    ],
    // Consider adding format optimization
    formats: ['image/avif', 'image/webp'],
    // Add responsive sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    localPatterns: [
      {
        pathname: "/api/image*",
      },
    ],
    // Cache optimized images
    minimumCacheTTL: 31536000,
  },
};
```

**Priority:** LOW (already well-implemented)

---

### 2.2 Reduce JavaScript Bundle Size

**Current Dependencies Review:**

```json
// KEEP (Essential)
"next": "^16.1.6"
"react": "19.2.3"
"@mui/material": "^7.3.5"
"firebase": "^12.5.0"

// REVIEW
"framer-motion": "^12.23.24" - Heavy animation lib, consider alternatives
"styled-components": "^6.1.19" - Overlapping with Tailwind

// CONSIDER
"justwatch-api": "^1.0.7" - Check if still maintained/needed
"streaming-availability": "^4.4.0" - Heavy, consider lazy loading
```

**Recommendations:**

```typescript
// Lazy load heavy dependencies
const justWatch = dynamic(() => import('justwatch-api'), { ssr: false });

// Use Tailwind for animations instead of framer-motion where possible
// Reserve framer-motion for critical UI interactions only

// Switch from styled-components to Tailwind + @tailwindcss/plugins
// or use MUI's sx prop directly
```

**Expected Impact:**
- Reduce initial JS by 15-25%
- Faster TTI (Time to Interactive)
- Better performance on mobile devices

**Priority:** MEDIUM

---

### 2.3 Implement Progressive Data Loading

**Current Issue:**
- `MediaGrid` loads all watchlist IDs on mount
- `Activity` page loads all movies + fetches recent episodes for each
- No pagination

**Recommendations:**

```typescript
// src/components/media/media-grid.tsx
"use client";

import { useTransition } from 'react';
import { fetchMoreWatchlist } from '@/utils/api/contentApi';

export const MediaGrid = ({ movies, isWatchlist, user }: MediaGridProps) => {
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState(20);

  const handleLoadMore = () => {
    startTransition(() => {
      setVisibleCount(prev => prev + 20);
    });
  };

  const visibleMovies = movies.slice(0, visibleCount);

  return (
    <>
      <ImageList cols={cols} rowHeight={300}>
        {visibleMovies.map(movie => (
          <WatchlistFlipCard key={movie.id} {...movie} />
        ))}
      </ImageList>

      {visibleCount < movies.length && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button 
            onClick={handleLoadMore} 
            disabled={isPending}
            variant="outlined"
          >
            {isPending ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </>
  );
};
```

**Priority:** MEDIUM

---

### 2.4 Font Performance Optimization

**Current State:** ✓ GOOD
- Using Roboto from `@fontsource`
- Font display: "swap"

**Recommendation - Add font preloading hints:**

```tsx
// src/app/layout.tsx
export const metadata = {
  // ... existing metadata
};

// Add font preload in HTML head
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="/fonts/roboto-latin.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body>
        {/* ... */}
      </body>
    </html>
  );
}
```

**Priority:** LOW

---

### 2.5 Core Web Vitals Optimization

**Recommendations:**

1. **LCP (Largest Contentful Paint):**
   - Preload critical images
   - Prioritize above-fold content rendering

```typescript
// Preload hero images
<img 
  src={heroImage} 
  fetchPriority="high"
  alt="Featured movie"
/>
```

2. **FID (First Input Delay):**
   - Move sorting/filtering to useTransition
   - Use debouncing for search

3. **CLS (Cumulative Layout Shift):**
   - Set explicit dimensions for images
   - Reserve space for loading skeletons

**Priority:** MEDIUM

---

## 3. ACCESSIBILITY IMPROVEMENTS

### 3.1 Missing Semantic HTML & ARIA Labels

**Current Issues:**

```tsx
// ISSUE 1: Missing alt text on images
<Image 
  src={getPosterImage(movie)} 
  alt="" // Empty alt text!
/>

// ISSUE 2: Non-semantic buttons
<IconButton onClick={handleClick}>
  <BookmarkAdd />
</IconButton>

// ISSUE 3: Complex interactions without roles
<motion.div>
  <Box onClick={handleFlip}>
    {/* Card content */}
  </Box>
</motion.div>
```

**Recommendations:**

```tsx
// FIX 1: Meaningful alt text
<Image 
  src={getPosterImage(movie)}
  alt={`${movie.title} poster - ${movie.release_date}`}
  width={300}
  height={450}
  priority={isHeroImage}
/>

// FIX 2: Semantic buttons with aria labels
<IconButton 
  onClick={handleClick}
  aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
  title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
>
  {isInWatchlist ? <BookmarkRemove /> : <BookmarkAdd />}
</IconButton>

// FIX 3: Semantic flip card with proper roles
<article 
  role="button"
  tabIndex={0}
  onKeyPress={handleFlip}
  onClick={handleFlip}
  aria-pressed={isFlipped}
  aria-label={`${movie.title} - press to see available providers`}
>
  {/* Card content */}
</article>
```

**Priority:** HIGH

---

### 3.2 Keyboard Navigation

**Current Issues:**
- Flip cards not keyboard accessible
- Search results not navigable with arrow keys
- No visible focus indicators

**Recommendations:**

```tsx
// src/components/media/watchlist-flip-card.tsx
export const WatchlistFlipCard = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
    if (e.key === 'Escape') {
      setIsFlipped(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      sx={{
        outline: isFocused ? '2px solid #c084fc' : 'none',
        outlineOffset: '2px',
      }}
    >
      {/* Card content */}
    </div>
  );
};
```

**Priority:** HIGH

---

### 3.3 Color Contrast & Dark Mode

**Current Issue:**
- Dark background with light text might not meet WCAG AA standards
- Some interactive elements may have insufficient contrast

**Recommendations:**

```tsx
// Test all text against dark background
// WCAG AA requires 4.5:1 contrast for normal text
// WCAG AAA requires 7:1 contrast

// Example color adjustments
const colors = {
  // Primary text on dark bg - ensure 7:1 ratio
  text: {
    primary: '#f9fafb', // Instead of white (#ffffff)
    secondary: '#d1d5db',
  },
  // Interactive elements
  interactive: {
    primary: '#a78bfa', // Better contrast than pure purple
    hover: '#c084fc',
  },
};
```

Test with: https://webaim.org/resources/contrastchecker/

**Priority:** MEDIUM

---

### 3.4 Form Accessibility

**Recommendations for search and filters:**

```tsx
// src/components/search/SearchBox.tsx
export const SearchBox = () => {
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search-input">
        Search movies and TV shows
      </label>
      <input
        id="search-input"
        type="search"
        placeholder="Type a title..."
        aria-describedby="search-help"
        aria-label="Search for movies and TV shows"
      />
      <div id="search-help" className="sr-only">
        Search by movie or TV show title. Results appear as you type.
      </div>
    </form>
  );
};

// Add screen reader only class
const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
```

**Priority:** MEDIUM

---

### 3.5 Skip Navigation Links

**Current Issue:**
- No way for keyboard users to skip to main content

**Recommendations:**

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a 
          href="#main-content" 
          className="sr-only focus-visible:not-sr-only"
        >
          Skip to main content
        </a>
        
        <Header />
        
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
```

**Priority:** MEDIUM

---

### 3.6 ARIA Live Regions for Dynamic Content

**Current Issue:**
- Loading states not announced to screen readers
- Toast notifications appear without announcement

**Recommendations:**

```tsx
// src/components/notifications/useNotificationBar.tsx
export const useNotificationBar = () => {
  const [notification, setNotification] = useState<AlertData | null>(null);

  const enqueueNotificationBar = (message: string, severity: AlertColor) => {
    setNotification({ message, severity });
    
    // Auto-dismiss
    setTimeout(() => setNotification(null), 5000);
  };

  const NotificationBarComponent = () => (
    <Alert 
      severity={notification?.severity}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {notification?.message}
    </Alert>
  );

  return { enqueueNotificationBar, NotificationBarComponent };
};
```

**Priority:** MEDIUM

---

## 4. ADDITIONAL PERFORMANCE CONSIDERATIONS

### 4.1 Monitor Core Web Vitals

**Current State:** ✓ GOOD
- Vercel Analytics integrated
- Speed Insights integrated

**Recommendations:**
- Set up alerts for Core Web Vitals thresholds
- Monitor LCP, FID/INP, CLS weekly
- Target: LCP < 2.5s, INP < 200ms, CLS < 0.1

**Priority:** LOW

---

### 4.2 API Rate Limiting & Error Handling

**Missing:**
- Rate limit headers not checked
- No exponential backoff for retries
- No circuit breaker for TMDB API

**Recommendations:**

```typescript
// src/utils/api/retryFetch.ts
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Check rate limits
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining && parseInt(remaining) < 10) {
        console.warn('Rate limit approaching', remaining);
      }
      
      if (response.ok || response.status >= 500) {
        return response;
      }
      
      if (response.status === 429) {
        // Exponential backoff
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const waitTime = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

**Priority:** MEDIUM

---

### 4.3 Database Query Optimization (Firebase)

**Current Issue:**
- `Activity` page fetches all movies then queries episodes individually

```typescript
// src/app/activity/page.tsx - INEFFICIENT
const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
const movies = snapshot.docs.map(doc => doc.data());

// Then N individual queries
await Promise.all(movies.map(item => getMostRecentSeasonEpisodes(item.movieId)));
```

**Recommendations:**

```typescript
// Option 1: Paginate
const snapshot = await adminDB
  .collection(`/users/${user?.uid}/movies`)
  .limit(20) // Start with 20
  .get();

// Option 2: Only fetch TV show episodes on client (lazy)
const moviesWithEpisodes = movies.map(movie => ({
  ...movie,
  episodes: movie.media_type === 'tv' ? null : undefined, // Lazy load
}));

// Option 3: Pre-compute in cloud function
// Trigger a cloud function when watchlist changes to pre-fetch episodes
```

**Priority:** MEDIUM

---

### 4.4 Testing Performance Impact

**Add performance tests:**

```typescript
// __tests__/performance.test.ts
describe('Performance', () => {
  it('should render media grid with 100 items under 1s', async () => {
    const start = performance.now();
    render(<MediaGrid movies={largeMockList} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(1000);
  });

  it('should search execute in under 200ms', async () => {
    const start = performance.now();
    const results = await fetch('/api/search?q=test');
    const end = performance.now();
    
    expect(end - start).toBeLessThan(200);
  });
});
```

**Priority:** LOW

---

## 5. IMPLEMENTATION ROADMAP

### Phase 1 - CRITICAL (Week 1)
- [ ] Replace in-memory cache with Next.js Data Cache (tags/revalidation)
- [ ] Add HTTP cache headers to API responses
- [ ] Fix semantic HTML and ARIA labels for accessibility
- [ ] Add keyboard navigation to interactive components

### Phase 2 - HIGH (Week 2-3)
- [ ] Optimize N+1 query patterns in fetchPopularContent
- [ ] Add skip navigation links
- [ ] Implement pagination for watchlist and activity
- [ ] Fix color contrast issues

### Phase 3 - MEDIUM (Week 4-5)
- [ ] Implement streaming for large responses
- [ ] Reduce JavaScript bundle size
- [ ] Add ARIA live regions for dynamic content
- [ ] Implement API retry logic with exponential backoff

### Phase 4 - LOW (Ongoing)
- [ ] Monitor Core Web Vitals
- [ ] Optimize database queries
- [ ] Add performance tests
- [ ] Fine-tune image formats and sizes

---

## 6. QUICK WINS (Low effort, high impact)

1. **Add Cache-Control headers** (15 min)
   - 30% reduction in server load for repeated requests

2. **Fix alt text on images** (30 min)
   - 100% accessibility improvement for visual content

3. **Add aria-labels to buttons** (20 min)
   - Screen reader users can now use interactive elements

4. **Enable keyboard navigation** (1 hour)
   - Full keyboard accessibility for flip cards

5. **Add skip link** (10 min)
   - Keyboard users can skip to main content

---

## 7. MONITORING & METRICS

Track these metrics after implementation:

| Metric | Current | Target | Tool |
|--------|---------|--------|------|
| LCP | ? | < 2.5s | Vercel Analytics |
| INP | ? | < 200ms | Vercel Analytics |
| CLS | ? | < 0.1 | Vercel Analytics |
| API response time | ? | < 200ms | Logs |
| Cache hit rate | 0% | > 70% | X-Cache-Hit header |
| WCAG Score | ? | A or AA | WAVE tool |

---

## 8. ADDITIONAL RESOURCES

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Core Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

