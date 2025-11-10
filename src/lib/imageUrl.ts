/**
 * Helpers to build proxy image URLs for TMDB images.
 * These return a string suitable for Next/Image src or undefined when input is missing.
 */

export function getProxyImageUrlForPath(posterPath?: string | null, size = 'w500'): string | undefined {
  if (!posterPath) return undefined
  // posterPath is usually like '/abcd.jpg' — ensure it starts with '/'
  const normalized = posterPath.startsWith('/') ? posterPath : `/${posterPath}`
  const tmdbPath = `/t/p/${size}${normalized}`
  return `/api/image?path=${encodeURIComponent(tmdbPath)}`
}

export function getProxyImageUrlForSrc(src?: string | null): string | undefined {
  if (!src) return undefined
  return `/api/image?src=${encodeURIComponent(src)}`
}
