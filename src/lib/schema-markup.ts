import { Media } from '@/data-models/media.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateMovieSchema(movie: Media): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
    datePublished: movie.release_date,
    contentRating: movie.adult ? 'R' : 'PG',
    ...(movie.genres && {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      genre: movie.genres.map((g: any) => g.name || g),
    }),
    ...(movie.vote_average && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (movie.vote_average / 2).toFixed(1),
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateTVSchema(tvShow: Media): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: tvShow.name,
    description: tvShow.overview,
    image: tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : undefined,
    datePublished: tvShow.first_air_date,
    ...(tvShow.genres && {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      genre: tvShow.genres.map((g: any) => g.name || g),
    }),
    ...(tvShow.vote_average && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (tvShow.vote_average / 2).toFixed(1),
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generatePersonSchema(person: any): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.biography,
    image: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : undefined,
    birthDate: person.birthday,
    deathDate: person.deathday,
    birthPlace: person.place_of_birth,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateOrganizationSchema(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ReelTime',
    description: 'ReelTime brings all your TV and movie watch lists together in one place.',
    url: 'https://reeltime.app',
    applicationCategory: 'EntertainmentApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
