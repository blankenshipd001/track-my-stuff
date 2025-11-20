"use client"
import Image, { ImageProps } from 'next/image'
import React from 'react'
import Box from '@mui/material/Box'
import { getProxyImageUrlForPath, getProxyImageUrlForSrc } from '@/lib/imageUrl'

type ProxyImageProps = Omit<ImageProps, 'src'> & {
  /** TMDB file path like '/abcd.jpg' */
  path?: string | null
  /** full remote src; if provided, used instead of path */
  srcUrl?: string | null
  /** TMDB size (w185, w500, etc.) when using `path` */
  size?: string
  /** If true, renders a plain <img> instead of Next/Image (for Avatar compatibility) */
  plainImg?: boolean
}

export default function ProxyImage({ path, srcUrl, size = 'w500', plainImg = false, alt = '', width, height, style, ...rest }: ProxyImageProps) {
  const proxySrc = srcUrl ? getProxyImageUrlForSrc(srcUrl) : getProxyImageUrlForPath(path ?? undefined, size)

  if (!proxySrc) {
    // Render a simple placeholder box that matches requested size when available
    if (width && height) {
      return (
        <Box sx={{ width, height, bgcolor: 'grey.900', borderRadius: 1 }} style={style as React.CSSProperties} />
      )
    }
    return null
  }

  // When consumers need a plain <img> (e.g., inside Avatar), they can opt-in.
  if (plainImg) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <img src={proxySrc} alt={alt} style={{ width: width ?? 'auto', height: height ?? 'auto', objectFit: (style as any)?.objectFit ?? 'cover', borderRadius: (style as any)?.borderRadius }} {...(rest as any)} />
  }

  return <Image alt={alt ?? ''} src={proxySrc} width={width} height={height} style={style} {...rest} />
}

export type { ProxyImageProps }
