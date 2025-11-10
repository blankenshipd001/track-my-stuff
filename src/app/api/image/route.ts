import { NextRequest } from 'next/server'

type CacheEntry = {
  buffer: Uint8Array
  contentType: string
  size: number
  created: number
}

// Configurable via environment variables
const MAX_CACHE_BYTES = parseInt(process.env.IMAGE_CACHE_BYTES || '52428800', 10) // 50MB
const MAX_CACHE_ITEMS = parseInt(process.env.IMAGE_CACHE_ITEMS || '1000', 10)

// Simple in-memory LRU-ish cache using insertion order (Map keeps insertion order).
// On reads we re-insert to mark as most-recently-used.
const cache = new Map<string, CacheEntry>()
let currentCacheBytes = 0

function evictIfNeeded() {
  while ((currentCacheBytes > MAX_CACHE_BYTES && cache.size > 0) || cache.size > MAX_CACHE_ITEMS) {
    const oldestKey = cache.keys().next().value
    if (!oldestKey) break
    const entry = cache.get(oldestKey)
    if (!entry) break
    currentCacheBytes -= entry.size
    cache.delete(oldestKey)
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const params = url.searchParams
    const path = params.get('path')
    const src = params.get('src')

    if (!path && !src) {
      return new Response('Missing query parameter `path` or `src`', { status: 400 })
    }

    // Build final URL. If `src` is provided, use it directly. Otherwise, treat
    // `path` as the TMDB image path (e.g. /t/p/w500/abcd.jpg) and prefix with
    // https://image.tmdb.org
    let finalUrl = ''
    if (src) {
      finalUrl = src
    } else {
      // Ensure leading slash
      const normalized = path!.startsWith('/') ? path! : `/${path!}`
      finalUrl = `https://image.tmdb.org${normalized}`
    }

    const cacheKey = finalUrl

    // Serve from cache if present
    const cached = cache.get(cacheKey)
    if (cached) {
      // refresh MRU: delete+set
      cache.delete(cacheKey)
      cache.set(cacheKey, cached)

      const headers = new Headers()
      headers.set('Content-Type', cached.contentType)
      // Let clients cache aggressively; we control upstream caching separately.
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      headers.set('X-Cache-Hit', '1')
  return new Response(cached.buffer as unknown as BodyInit, { status: 200, headers })
    }

    // Not cached -> fetch from upstream
    const upstream = await fetch(finalUrl)
    if (!upstream.ok) {
      // Pass through status
      return new Response(null, { status: upstream.status })
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await upstream.arrayBuffer()
    const u8 = new Uint8Array(arrayBuffer)
    const size = u8.byteLength

    // Only cache items that are smaller than the total cache size.
    if (size <= MAX_CACHE_BYTES) {
      // Insert into cache as MRU
      const entry: CacheEntry = { buffer: u8, contentType, size, created: Date.now() }
      cache.set(cacheKey, entry)
      currentCacheBytes += size
      evictIfNeeded()
    }

    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('X-Cache-Hit', '0')

  return new Response(u8 as unknown as BodyInit, { status: 200, headers })
  } catch (err) {
    // Unexpected error
    return new Response(String(err ?? 'unknown error'), { status: 500 })
  }
}

// Make sure Next doesn't statically optimize this route away.
export const runtime = 'nodejs'
