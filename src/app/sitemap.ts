import { MetadataRoute } from 'next';
import { fetchPopularMoviesWithProviders, fetchPopularTV } from '@/services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [movies, tvShows] = await Promise.all([
      fetchPopularMoviesWithProviders(),
      fetchPopularTV(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const movieUrls = movies.slice(0, 100).map((movie: any) => ({
      url: `https://reeltime.app/movies/${movie.id}`,
      lastModified: new Date(movie.release_date || new Date()).toISOString().split('T')[0],
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tvUrls = tvShows.slice(0, 100).map((show: any) => ({
      url: `https://reeltime.app/tv/${show.id}`,
      lastModified: new Date(show.first_air_date || new Date()).toISOString().split('T')[0],
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    return [
      {
        url: 'https://reeltime.app',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: 'https://reeltime.app/movies',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: 'https://reeltime.app/tv',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: 'https://reeltime.app/about',
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      ...movieUrls,
      ...tvUrls,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}
