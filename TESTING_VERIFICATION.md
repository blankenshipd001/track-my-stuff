# Testing & Verification Guide

This guide helps you verify that improvements are working correctly.

---

## 1. CACHE VERIFICATION

### 1.1 Check Cache Headers

**Terminal Command:**
```bash
# Test popular endpoint
curl -I http://localhost:3000/api/popular

# Test search endpoint
curl -I http://localhost:3000/api/search?q=avatar

# Test movie detail endpoint
curl -I http://localhost:3000/api/movie/550

# Test image endpoint
curl -I "http://localhost:3000/api/image?path=/t/p/w500/image.jpg"
```

**Expected Output:**
```
HTTP/1.1 200 OK
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
CDN-Cache-Control: max-age=86400
X-Cache-Hit: 1        ← Present on second request
Content-Type: application/json
```

**What to look for:**
- ✅ Cache-Control header present
- ✅ max-age is reasonable (60-7200 seconds)
- ✅ X-Cache-Hit flips between 0 and 1

### 1.2 Performance Test

**Browser DevTools Method:**

1. Open Developer Tools (F12)
2. Go to Network tab
3. Make same request twice
4. Compare timing:

| Metric | First Request | Second Request |
|--------|---------------|-----------------|
| Time | 500ms+ | <50ms |
| Size | Full | From Cache |
| Cache Hit | 0 | 1 |

**Before vs After Check:**

```bash
# Before fix - requests always take 300-500ms
# After fix - cached requests take <50ms

# Run 10 requests and measure
for i in {1..10}; do
  time curl -s http://localhost:3000/api/popular > /dev/null
done
```

---

## 2. ACCESSIBILITY TESTING

### 2.1 Automated Accessibility Audit

**Using axe-core in your tests:**

```bash
npm install --save-dev @axe-core/react
```

**Test Code:**

```typescript
// __tests__/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WatchlistFlipCard } from '@/components/media/watchlist-flip-card';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should not have axe violations on flip card', async () => {
    const { container } = render(
      <WatchlistFlipCard
        movie={mockMovie}
        poster="/test.jpg"
        title="Test Movie"
        onRemove={jest.fn()}
        onNavigate={jest.fn()}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have violations on media grid', async () => {
    const { container } = render(
      <MediaGrid movies={[mockMovie]} user={mockUser} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have violations on layout', async () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Run Tests:**
```bash
npm run test -- accessibility.test.tsx
```

### 2.2 Manual Keyboard Navigation Test

**Steps:**

1. **Start server:**
   ```bash
   npm run dev
   ```

2. **Test skip link:**
   - Open http://localhost:3000
   - Press Tab once
   - You should see "Skip to main content" link
   - Press Enter - should jump to main content

3. **Test flip card keyboard:**
   - Press Tab to reach movie card
   - Press Enter/Space - card should flip
   - Press Escape - card should return to normal
   - All visible without mouse

4. **Test button labels:**
   - Hover over Add/Remove buttons
   - Verify aria-labels appear
   - Tab to button and verify it's readable

5. **Test search:**
   - Tab to search box
   - Type "avatar"
   - Tab through results
   - All items keyboard accessible

### 2.3 Screen Reader Testing

**macOS VoiceOver:**
```bash
# Open VoiceOver
# Press Cmd+F5

# Test navigation
# VO is Ctrl+Option on Mac
VO+U → Opens rotor for navigation
```

**Windows NVDA (Free):**
- Download: https://www.nvaccess.org/

**Expected Behavior:**
- Skip link announced first
- All images have alt text
- Button purposes clear
- Form labels associated

### 2.4 Color Contrast Check

**Using WebAIM Tool:**

1. Go to https://webaim.org/resources/contrastchecker/
2. Enter your colors:
   - Foreground: #f9fafb (text)
   - Background: #111827 (dark bg)
3. Check ratio: **Should be ≥ 4.5:1 for AA**

**Automated Check with Playwright:**

```typescript
import { test, expect } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';

test('color contrast passes WCAG AA', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await injectAxe(page);

  const violations = await getViolations(page, 'wcag2aa', { include: ['color-contrast'] });
  expect(violations).toHaveLength(0);
});
```

---

## 3. PERFORMANCE TESTING

### 3.1 Core Web Vitals Measurement

**Using Vercel Analytics (Already Integrated):**

Dashboard: https://vercel.com/dashboard/analytics

Monitor these metrics:
- **LCP (Largest Contentful Paint):** < 2.5s ✅
- **INP (Interaction to Next Paint):** < 200ms ✅
- **CLS (Cumulative Layout Shift):** < 0.1 ✅

### 3.2 Lighthouse Test

**In Browser:**
1. Open DevTools (F12)
2. Click "Lighthouse"
3. Select "Performance"
4. Click "Analyze page load"

**Expected Scores:**
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 80

**CLI Test:**
```bash
npm install -g lighthouse

lighthouse http://localhost:3000 --view
```

### 3.3 Load Testing

**Using Artillery (npm package):**

```bash
npm install -g artillery

# Create artillery-config.yml
# Copy the config from next section
artillery run artillery-config.yml
```

**artillery-config.yml:**
```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      User-Agent: "Artillery"

scenarios:
  - name: "Popular endpoint stress test"
    flow:
      - get:
          url: "/api/popular"
      - get:
          url: "/api/popular"  # Second request should be cached
      - get:
          url: "/api/popular"  # Third request should be fast
```

**Expected Results:**
- First request: 300-500ms
- Cached requests: <50ms
- No errors under load

### 3.4 Bundle Size Analysis

**Check Current Size:**
```bash
npm run build

# Output will show:
# ├ / (1.2 kB)
# ├ /activity (2.3 kB)
# ├ /movies/[slug] (3.1 kB)
# └ _next/static/chunks (250 kB)
```

**Optimize with webpack-bundle-analyzer:**

```bash
npm install --save-dev webpack-bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Then run:
ANALYZE=true npm run build
```

---

## 4. N+1 QUERY VERIFICATION

### 4.1 Before Fix

**Monitor Network Tab:**

```
GET /api/popular
  → Returns 20 movies
  → For each movie, browser makes fetch to getMovieProviders()
  
Network timeline:
├ GET /api/popular - 400ms (1 request)
├ GET /api/movie/550 - 150ms
├ GET /api/movie/278 - 160ms
├ GET /api/movie/680 - 155ms
... × 20 providers requests

Total: ~3200ms with all movies serial
or ~300-400ms if parallel (still high)
```

### 4.2 After Fix (Batched)

**Expected Network Reduction:**

```
GET /api/popular - 400ms
  → Includes batched provider fetching internally
  → Maybe 5-10 internal requests instead of 20+
  
Total: ~800-1000ms (vs 3200ms before)
Success: 60-70% reduction
```

**How to Verify:**

1. Open DevTools Network tab
2. Filter to `/api/`
3. Make request to `/api/popular`
4. Count requests in waterfall
5. **Before:** ~20+ requests
6. **After:** ~2-5 requests

### 4.3 Test Code

```typescript
// __tests__/performance/n-plus-one.test.ts
import { fetchPopularContent } from '@/utils/api/serverContentApi';

describe('N+1 Query Optimization', () => {
  it('should fetch popular content with minimized API calls', async () => {
    // Mock fetch to count calls
    let fetchCount = 0;
    const originalFetch = global.fetch;

    global.fetch = jest.fn(async (url, options) => {
      fetchCount++;
      // Mock response
      return originalFetch(url, options);
    });

    const result = await fetchPopularContent();

    // After batching optimization:
    // Should be ~1-2 calls instead of 21+
    expect(fetchCount).toBeLessThan(5);
    expect(result.length).toBeGreaterThan(0);

    global.fetch = originalFetch;
  });
});
```

---

## 5. PAGINATION VERIFICATION

### 5.1 Before Fix

**Test:**
```typescript
test('should load ALL items initially (performance issue)', async () => {
  const { unmount } = render(
    <MediaGrid movies={largeMovieList} user={user} />
  );

  // All 500+ movies rendered
  const cards = screen.getAllByRole('article');
  expect(cards.length).toBe(500); // ❌ Too many
  
  unmount();
});
```

### 5.2 After Fix

**Test:**
```typescript
test('should paginate items with Load More button', async () => {
  const { rerender } = render(
    <MediaGrid movies={largeMovieList} user={user} />
  );

  // Only first 20 rendered
  let cards = screen.getAllByRole('article');
  expect(cards.length).toBe(20); // ✅ Manageable

  // Click Load More
  const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
  fireEvent.click(loadMoreBtn);

  // Now 40 items
  cards = screen.getAllByRole('article');
  expect(cards.length).toBe(40); // ✅ Progressive loading

  // Button should still exist (100 remaining)
  expect(loadMoreBtn).toBeInTheDocument();
});
```

---

## 6. DATABASE QUERY OPTIMIZATION

### 6.1 Activity Page - Before

**Issue:**
```typescript
// 1 initial query
const snapshot = await adminDB
  .collection(`/users/${uid}/movies`)
  .get(); // Returns 100 movies

// Then 100 individual queries
await Promise.all(
  movies.map(movie => getMostRecentSeasonEpisodes(movie.movieId))
  // ^^ 100 separate fetch() calls
);
```

**Total: 101 queries**

### 6.2 Activity Page - After

**Solution 1: Pagination**
```typescript
// 1 initial query (first 20)
const snapshot = await adminDB
  .collection(`/users/${uid}/movies`)
  .limit(20)
  .get();

// Only 20 episode queries
await Promise.all(
  tvMovies.map(movie => getMostRecentSeasonEpisodes(movie.movieId))
);
```

**Total: 21 queries (90% reduction!)**

**Verification Test:**
```typescript
it('should paginate watchlist', async () => {
  const movies = [];

  // Fetch first page
  const { getByRole, getByText } = render(
    <ActivityPage />
  );

  // Should show only first 20
  const items = screen.getAllByRole('article');
  expect(items.length).toBeLessThanOrEqual(20);

  // Load more button present
  const loadMore = getByRole('button', { name: /load more/i });
  expect(loadMore).toBeInTheDocument();
});
```

---

## 7. COMPREHENSIVE TEST SUITE

**Create:** `__tests__/performance-improvements.test.ts`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { fetchWithRetry } from '@/utils/api/retryFetch';

expect.extend(toHaveNoViolations);

describe('Performance Improvements', () => {
  describe('Caching', () => {
    it('should include cache headers in API responses', async () => {
      const response = await fetch('/api/popular');
      
      expect(response.headers.get('Cache-Control')).toBeTruthy();
      expect(response.headers.get('Cache-Control')).toContain('max-age');
    });
  });

  describe('Accessibility', () => {
    it('should have no axe violations', async () => {
      const { container } = render(<RootLayout><div>Test</div></RootLayout>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have skip link', () => {
      render(<RootLayout><div>Test</div></RootLayout>);
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  describe('Performance', () => {
    it('should retry failed requests', async () => {
      // Mock fetch to fail then succeed
      let attempts = 0;
      global.fetch = jest.fn(async () => {
        attempts++;
        if (attempts < 2) {
          return Promise.reject(new Error('Network error'));
        }
        return new Response('Success', { status: 200 });
      });

      const result = await fetchWithRetry('/api/test');
      expect(result.ok).toBe(true);
      expect(attempts).toBe(2); // Retried once
    });

    it('should paginate media grid', async () => {
      // Create 100 mock movies
      const movies = Array(100).fill(null).map((_, i) => ({
        id: i,
        title: `Movie ${i}`,
      }));

      render(<MediaGrid movies={movies} />);

      // Only 20 visible initially
      expect(screen.getAllByRole('article')).toHaveLength(20);

      // Click load more
      fireEvent.click(screen.getByRole('button', { name: /load more/i }));

      // Now 40 visible
      expect(screen.getAllByRole('article')).toHaveLength(40);
    });
  });
});
```

**Run Tests:**
```bash
npm run test -- performance-improvements.test.ts
```

---

## 8. MONITORING CHECKLIST

After deploying improvements, monitor these metrics weekly:

| Metric | Target | Tool | Frequency |
|--------|--------|------|-----------|
| Cache Hit Rate | > 70% | X-Cache-Hit header | Daily |
| API Response Time | < 200ms | Server logs | Daily |
| LCP | < 2.5s | Vercel Analytics | Weekly |
| INP | < 200ms | Vercel Analytics | Weekly |
| CLS | < 0.1 | Vercel Analytics | Weekly |
| WCAG Score | A or A+ | Lighthouse | Weekly |
| Error Rate | < 0.5% | Error tracking | Daily |
| Server CPU | -50% | Server metrics | Daily |

---

## 9. REGRESSION TESTING

**Before & After Comparison:**

| Phase | Metric | Before | After | Pass? |
|-------|--------|--------|-------|-------|
| **Caching** | Cache-Control headers | ❌ None | ✅ Present | ? |
| | API response time (cold) | 500ms | 450ms | ? |
| | API response time (warm) | 500ms | 30ms | ? |
| **Accessibility** | Keyboard navigation | ❌ Limited | ✅ Full | ? |
| | Screen reader support | ❌ Poor | ✅ Good | ? |
| | WCAG violations | 15+ | 0 | ? |
| **Performance** | Initial page load | 3.2s | 1.8s | ? |
| | N+1 queries | 21+ | 3-5 | ? |
| | Bundle size | 280KB | 240KB | ? |
| **Data** | Watchlist load time | 2.5s | 0.5s | ? |
| | Episodes pagination | 1-based | 20-based | ? |

---

## 10. DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All tests passing locally
- [ ] No console warnings or errors
- [ ] Cache headers verified in all endpoints
- [ ] Accessibility tests pass (axe-core)
- [ ] Lighthouse score > 80
- [ ] Load test passes (no errors under 50 req/sec)
- [ ] Git branch reviewed
- [ ] Performance metrics baseline recorded
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

**Deploy with confidence after these checks! ✅**

