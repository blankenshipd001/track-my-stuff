# Implementation Examples: Critical Fixes

This file contains copy-paste ready implementations for the highest-priority improvements.

---

## 1. REPLACE IN-MEMORY CACHE - SEARCH ENDPOINT

**File:** `src/app/api/search/route.ts`

### Before (Current):
```typescript
const CACHE_TTL = 1000 * 60; // 60s
const cache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  
  const cacheKey = `search:${q}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data as Record<string, unknown>);
  }
  // ... rest of logic
}
```

### After (Recommended):
```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache';

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  if (!q) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=0');
    return NextResponse.json({ movies: [], tv: [], all: [] }, { headers });
  }

  try {
    const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&region=us`;
    const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&include_adult=false&language=en-US&region=us`;

    const [movieResp, tvResp] = await Promise.all([
      fetchJson(movieUrl),
      fetchJson(tvUrl)
    ]);

    const movies = Array.isArray(movieResp?.results) ? movieResp.results : [];
    const tv = Array.isArray(tvResp?.results) ? tvResp.results : [];

    // Attach US providers to each result
    const attachProviders = async (items: Array<{ id?: number }>, isTv = false) => {
      return Promise.all(
        items.map(async (item) => {
          try {
            const id = item.id;
            const type = isTv ? "tv" : "movie";
            const providerRes = await fetch(
              `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
              {
                next: {
                  tags: ['search-providers', `search-provider:${type}:${id}`],
                  revalidate: 3600 // 1 hour
                }
              }
            );
            const providerJson = await providerRes.json();
            return {
              ...item,
              movieId: id,
              providers: providerJson?.results?.US ?? [],
            };
          } catch (e) {
            console.error(e);
            return { ...item, movieId: item.id, providers: [] };
          }
        })
      );
    };

    const moviesWithProviders = await attachProviders(movies, false);
    const tvWithProviders = await attachProviders(tv, true);

    const all = [...moviesWithProviders, ...tvWithProviders];

    const result = { movies: moviesWithProviders, tv: tvWithProviders, all };

    // Add HTTP cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=600');
    // Use CDN cache tags if on Vercel
    headers.set('CDN-Cache-Control', 'max-age=600');

    return NextResponse.json(result, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=0');
    return NextResponse.json(
      { movies: [], tv: [], all: [], error: String(err) },
      { status: 500, headers }
    );
  }
}
```

---

## 2. FIX POPULAR ENDPOINT - REDUCE N+1 QUERIES

**File:** `src/app/api/popular/route.ts`

### Before (Current):
```typescript
export async function GET() {
  try {
    const cacheKey = "popular:movies";
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data as Record<string, unknown>);
    }

    const movies = await fetchPopularContent();
    const result = { movies };
    cache.set(cacheKey, { ts: Date.now(), data: result });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ movies: [], error: String(err) }, { status: 500 });
  }
}
```

### After (Recommended):
```typescript
import { NextResponse } from "next/server";
import { revalidateTag } from 'next/cache';

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;
const popular_url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&include_video=false`;

export async function GET() {
  try {
    // Fetch popular movies (1 request)
    const popularRes = await fetch(popular_url, {
      next: {
        tags: ['popular-movies'],
        revalidate: 1800 // 30 minutes - popular content changes more frequently
      }
    }).then(r => r.json());

    if (!Array.isArray(popularRes.results)) {
      throw new Error('Invalid response from TMDB');
    }

    // OPTION A: Batch providers in groups of 5 to reduce request overload
    const BATCH_SIZE = 5;
    const moviesWithProviders = [];

    for (let i = 0; i < popularRes.results.length; i += BATCH_SIZE) {
      const batch = popularRes.results.slice(i, i + BATCH_SIZE);
      
      const batchResults = await Promise.all(
        batch.map(async (item: { id?: number; [key: string]: unknown }) => {
          try {
            const providerRes = await fetch(
              `https://api.themoviedb.org/3/movie/${item.id}/watch/providers?api_key=${TMDB_API_KEY}&external_source=imdb_id`,
              {
                next: {
                  tags: ['popular-providers', `movie-provider:${item.id}`],
                  revalidate: 86400 // 24 hours - providers change slowly
                }
              }
            );
            
            const providers = await providerRes.json();
            
            return {
              ...item,
              movieId: item.id,
              providers: providers.results?.US ?? [],
            };
          } catch (error) {
            console.error(`Error fetching providers for movie ${item.id}:`, error);
            return {
              ...item,
              movieId: item.id,
              providers: [],
            };
          }
        })
      );

      moviesWithProviders.push(...batchResults);
      
      // Optional: Add small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < popularRes.results.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const result = { movies: moviesWithProviders };

    // Add HTTP cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=1800, stale-while-revalidate=3600');
    headers.set('CDN-Cache-Control', 'max-age=3600');

    return NextResponse.json(result, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { movies: [], error: String(err) },
      { status: 500, headers }
    );
  }
}
```

---

## 3. FIX MOVIE DETAILS ENDPOINT - ADD CACHE TAGS

**File:** `src/app/api/movie/[id]/route.ts`

### After (Recommended):
```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache';

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_THE_MOVIE_DB_API_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=0');
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400, headers }
    );
  }

  try {
    // Fetch movie details with cache tag
    const movieRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,images,credits`,
      {
        next: {
          tags: ['movie-detail', `movie:${id}`],
          revalidate: 3600 // 1 hour
        }
      }
    );

    if (!movieRes.ok) {
      const headers = new Headers();
      headers.set('Cache-Control', 'public, max-age=60');
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers }
      );
    }

    const movie = await movieRes.json();

    // Fetch providers
    const providerRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`,
      {
        next: {
          tags: ['movie-providers', `movie-provider:${id}`],
          revalidate: 86400 // 24 hours
        }
      }
    );

    const providerData = await providerRes.json();

    const result = {
      ...movie,
      movieId: Number(movie.id),
      providers: providerData.results?.US ?? [],
    };

    // Cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    headers.set('CDN-Cache-Control', 'max-age=86400');

    return NextResponse.json(result, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers }
    );
  }
}
```

---

## 4. FIX ACCESSIBILITY - WATCHLIST FLIP CARD

**File:** `src/components/media/watchlist-flip-card.tsx`

### Add Keyboard Navigation and ARIA:
```typescript
"use client";

import React, { ReactNode, useState } from "react";
import { Box, useMediaQuery, useTheme, IconButton } from "@mui/material";
import Image from "next/image";
import { BookmarkAdd, BookmarkRemove, Info, OpenInNew } from "@mui/icons-material";
import { motion } from "framer-motion";
import ImageListItem from "@mui/material/ImageListItem";
import { Media } from "@/data-models/media.interface";
import { ProviderLogos } from "../provider/ProviderLogos";

export interface WatchlistFlipCardProps {
  movie: Media;
  poster: string | null | undefined;
  title: string | null | undefined;
  onRemove: (movie: Media) => Promise<void>;
  onNavigate: (movie: Media) => void;
  onAdd?: (movie: Media) => Promise<void>;
  isInWatchlist?: boolean;
}

export const WatchlistFlipCard: React.FC<WatchlistFlipCardProps> = ({
  movie,
  poster,
  title,
  onRemove,
  onNavigate,
  onAdd,
  isInWatchlist = true,
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const containerVariants = {
    rest: { rotateY: 0 },
    hover: { rotateY: 180 },
  };

  const getProviders = (): ReactNode => {
    const providers = movie?.providers?.flatrate;
    if (Array.isArray(providers) && providers.length > 0) {
      return <ProviderLogos list={providers} />;
    }
    return (
      <Box sx={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center' }}>
        Not available
      </Box>
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
    if (e.key === 'Escape') {
      setIsFlipped(false);
    }
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial="rest"
      animate={isFlipped ? "hover" : "rest"}
      variants={containerVariants}
      transition={{ duration: 0.6 }}
      style={{
        perspective: 1000,
        height: '100%',
        cursor: isMobile ? 'default' : 'pointer',
      }}
    >
      <ImageListItem
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-pressed={isFlipped}
        aria-label={`${title} - press Enter to see available providers. Currently showing ${isFlipped ? 'providers' : 'poster'}`}
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          width: "100%",
          height: "100%",
          border: isFocused
            ? '2px solid #a78bfa'
            : '1px solid rgba(192, 132, 252, 0.2)',
          outline: isFocused ? '2px solid #a78bfa' : 'none',
          outlineOffset: '2px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.85))',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(192, 132, 252, 0.5)',
            boxShadow: '0 8px 32px rgba(192, 132, 252, 0.15)',
          },
          '&:focus-visible': {
            outline: '2px solid #a78bfa',
            outlineOffset: '2px',
          },
        }}
      >
        {/* Front side - Poster */}
        {!isFlipped && poster ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <Image
              src={`${BASE_URL}${poster}`}
              alt={`${title} movie poster`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />
          </Box>
        ) : (
          // Back side - Providers
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <Box sx={{ mb: 2, textAlign: 'center', color: '#f9fafb' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>
                Watch on:
              </p>
            </Box>
            {getProviders()}
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                gap: 1,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(movie);
                }}
                aria-label={`View ${title} details`}
                title={`View ${title} details`}
              >
                <Info sx={{ color: '#a78bfa' }} />
              </IconButton>
              {isInWatchlist ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(movie);
                  }}
                  aria-label={`Remove ${title} from watchlist`}
                  title={`Remove ${title} from watchlist`}
                >
                  <BookmarkRemove sx={{ color: '#ef4444' }} />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd?.(movie);
                  }}
                  aria-label={`Add ${title} to watchlist`}
                  title={`Add ${title} to watchlist`}
                >
                  <BookmarkAdd sx={{ color: '#10b981' }} />
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      </ImageListItem>
    </motion.div>
  );
};
```

---

## 5. ADD SKIP NAVIGATION LINK

**File:** `src/app/layout.tsx`

```typescript
import { Roboto } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"
import { CssBaseline } from "@mui/material";
import { Providers } from "@utils/providers/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { FontLoader } from "@/components/font-loader";
import { Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ReelTime",
  description: "ReelTime brings all your TV and movie watch lists together in one place.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReelTime",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only"
          style={{
            position: 'absolute',
            top: -40,
            left: 0,
            zIndex: 100,
            padding: '8px',
            backgroundColor: '#a78bfa',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '0 0 4px 0',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLElement).style.top = '0';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.top = '-40px';
          }}
        >
          Skip to main content
        </a>

        <FontLoader />
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#111827" }} />}>
          <Providers>
            <CssBaseline />
            <Header />
            <main
              id="main-content"
              style={{ minHeight: "calc(100vh - 200px)" }}
              role="main"
            >
              {children}
            </main>
            <Footer />
            <PWAInstallPrompt />
            <SpeedInsights />
            <Analytics />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
```

Add to `src/app/globals.css`:
```css
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

.focus-visible\:not-sr-only:focus-visible {
  position: static;
  width: auto;
  height: auto;
  padding: 8px;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 6. ADD PAGINATION TO MEDIA GRID

**File:** `src/components/media/media-grid.tsx`

```typescript
"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Media } from "@/data-models/media.interface";
import { useMediaQuery, useTheme, Button, Box, CircularProgress } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import useNotificationBar from "@/components/notifications/useNotificationBar";
import { requestRemoveFromWatchList, getContent } from "@/utils/api/contentApi";
import { WatchlistFlipCard } from "./watchlist-flip-card";

interface MediaGridProps {
  movies: Media[];
  isWatchlist?: boolean;
  user?: { uid: string; email?: string } | null;
}

const ITEMS_PER_PAGE = 20;

export const MediaGrid = ({ movies, isWatchlist, user }: MediaGridProps): React.ReactElement => {
  const router = useRouter();
  const [watchlistIds, setWatchlistIds] = useState<Set<number>>(new Set());
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { enqueueNotificationBar, NotificationBarComponent } = useNotificationBar();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const cols = useMemo(() => {
    if (isXs) return 2;
    if (isSm) return 3;
    if (isMd) return 4;
    return 6;
  }, [isXs, isSm, isMd]);

  // Fetch watchlist IDs if not already on watchlist page
  useEffect(() => {
    if (!isWatchlist && user?.uid) {
      getContent(user.uid).then((watchlist) => {
        const ids = new Set(watchlist.map((item) => item.movieId ?? item.id).filter(Boolean) as number[]);
        setWatchlistIds(ids);
      }).catch(console.error);
    }
  }, [user?.uid, isWatchlist]);

  const handleClickEvent = useCallback((movie: Media) => {
    const isTV = movie.first_air_date !== undefined;
    const slug = movie.id;
    router.push(isTV ? `/tv/${slug}` : `/movies/${slug}`);
  }, [router]);

  const handleRemoveFromWatchlist = useCallback(async (movie: Media) => {
    if (!user?.uid) {
      enqueueNotificationBar("Please log in first", "error");
      return;
    }

    try {
      const movieId = movie.movieId ?? movie.id;
      await requestRemoveFromWatchList(user.uid, movieId);
      setWatchlistIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
      enqueueNotificationBar(`Removed ${movie.title || movie.name} from watchlist`, "success");
    } catch (error) {
      enqueueNotificationBar("Failed to remove from watchlist", "error");
      console.error(error);
    }
  }, [user?.uid, enqueueNotificationBar]);

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  }, []);

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;

  return (
    <Box>
      <ImageList cols={cols} rowHeight={300}>
        {visibleMovies.map((movie) => (
          <WatchlistFlipCard
            key={movie.id}
            movie={movie}
            poster={movie.poster_path || movie.backdrop_path}
            title={movie.title || movie.name}
            onRemove={handleRemoveFromWatchlist}
            onNavigate={handleClickEvent}
            isInWatchlist={watchlistIds.has(movie.movieId ?? movie.id)}
          />
        ))}
      </ImageList>

      {hasMore && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#a78bfa',
              color: '#a78bfa',
              '&:hover': {
                borderColor: '#c084fc',
                backgroundColor: 'rgba(167, 139, 250, 0.08)',
              },
              '&:disabled': {
                borderColor: '#6b7280',
                color: '#6b7280',
              },
            }}
          >
            {isLoadingMore ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: '#a78bfa' }} />
                Loading...
              </>
            ) : (
              `Load More (${movies.length - visibleCount} remaining)`
            )}
          </Button>
        </Box>
      )}

      {NotificationBarComponent}
    </Box>
  );
};
```

---

## 7. ADD ARIA LIVE REGION FOR NOTIFICATIONS

**File:** `src/components/notifications/useNotificationBar.tsx`

```typescript
"use client";

import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import { AlertColor, Box } from "@mui/material";

interface AlertData {
  message: string;
  severity: AlertColor;
  id: number;
}

export default function useNotificationBar() {
  const [notifications, setNotifications] = useState<AlertData[]>([]);

  const enqueueNotificationBar = (message: string, severity: AlertColor = "info") => {
    const id = Date.now();
    const newNotification: AlertData = { message, severity, id };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);

    return () => clearTimeout(timer);
  };

  const NotificationBarComponent = () => (
    <>
      {/* Announce to screen readers */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          zIndex: 9999,
          maxWidth: 400,
        }}
      >
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            severity={notification.severity}
            sx={{
              minWidth: 300,
              animation: "slideIn 0.3s ease-in-out",
              "@keyframes slideIn": {
                from: {
                  transform: "translateX(400px)",
                  opacity: 0,
                },
                to: {
                  transform: "translateX(0)",
                  opacity: 1,
                },
              },
            }}
          >
            {notification.message}
          </Alert>
        ))}
      </Box>
    </>
  );

  return { enqueueNotificationBar, NotificationBarComponent };
}
```

---

## 8. API RETRY HELPER WITH EXPONENTIAL BACKOFF

**File:** `src/utils/api/retryFetch.ts`

```typescript
interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
  } = retryOptions;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Check rate limit headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');

      if (remaining && parseInt(remaining, 10) < 10) {
        console.warn(`[Rate Limit] Only ${remaining} requests remaining until reset at ${resetTime}`);
      }

      // Don't retry on client errors (4xx) except 429
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }

      // Retry on server errors (5xx) and rate limits (429)
      if (response.status >= 500 || response.status === 429) {
        if (attempt === maxRetries - 1) {
          return response;
        }

        // Calculate backoff delay
        const delayMs = Math.min(
          initialDelayMs * Math.pow(backoffMultiplier, attempt),
          maxDelayMs
        );

        console.warn(
          `[Retry] Attempt ${attempt + 1}/${maxRetries} failed with status ${response.status}. ` +
          `Retrying in ${delayMs}ms...`
        );

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries - 1) {
        throw error;
      }

      const delayMs = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt),
        maxDelayMs
      );

      console.warn(
        `[Retry] Attempt ${attempt + 1}/${maxRetries} failed with error: ${lastError.message}. ` +
        `Retrying in ${delayMs}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

/**
 * Wrapper for fetchWithRetry that automatically converts response to JSON
 */
export async function fetchJsonWithRetry<T>(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<T> {
  const response = await fetchWithRetry(url, options, retryOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
```

---

## TESTING THESE CHANGES

Add to your test suite to verify improvements:

```typescript
// __tests__/api/cache.test.ts
describe('Cache Headers', () => {
  it('should return proper cache headers for /api/popular', async () => {
    const response = await fetch('/api/popular');
    
    expect(response.headers.get('Cache-Control')).toBeTruthy();
    expect(response.headers.get('Cache-Control')).toContain('public');
    expect(response.status).toBe(200);
  });

  it('should return proper cache headers for search', async () => {
    const response = await fetch('/api/search?q=test');
    
    expect(response.headers.get('Cache-Control')).toBeTruthy();
    expect(response.status).toBe(200);
  });
});

// __tests__/components/accessibility.test.tsx
describe('Accessibility', () => {
  it('should have keyboard navigation for flip cards', () => {
    const { getByRole } = render(
      <WatchlistFlipCard
        movie={mockMovie}
        poster="/test.jpg"
        title="Test Movie"
        onRemove={jest.fn()}
        onNavigate={jest.fn()}
      />
    );

    const button = getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '0');
    expect(button).toHaveAttribute('aria-pressed');
    expect(button).toHaveAttribute('aria-label');
  });

  it('should have skip to main content link', () => {
    const { getByText } = render(<RootLayout><div>test</div></RootLayout>);
    
    const skipLink = getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
```

