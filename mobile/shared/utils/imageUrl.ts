// Shared utility for building TMDB image URLs
export const buildImageUrl = (
  path: string | undefined | null,
  size: 'w200' | 'w300' | 'w500' | 'original' = 'w500'
): string => {
  if (!path) return '/placeholder-image.png';
  const BASE_URL = 'https://image.tmdb.org/t/p/';
  return `${BASE_URL}${size}${path}`;
};

export const buildBackdropUrl = (path: string | undefined | null): string => {
  return buildImageUrl(path, 'original');
};

export const buildPosterUrl = (path: string | undefined | null): string => {
  return buildImageUrl(path, 'w500');
};
