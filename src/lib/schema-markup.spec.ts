import {
  generateMovieSchema,
  generateTVSchema,
  generatePersonSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from './schema-markup';
import { Media } from '@/data-models/media.interface';

describe('schema-markup', () => {
  describe('generateMovieSchema', () => {
    it('should generate basic movie schema', () => {
      const movie: Media = {
        id: 1,
        title: 'Test Movie',
        overview: 'This is a test movie',
        poster_path: '/test.jpg',
        release_date: '2023-01-01',
        adult: false,
        vote_average: 8.4,
      } as Media;

      const schema = generateMovieSchema(movie);

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Movie',
        name: 'Test Movie',
        description: 'This is a test movie',
        image: 'https://image.tmdb.org/t/p/w500/test.jpg',
        datePublished: '2023-01-01',
        contentRating: 'PG',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.2',
          bestRating: '5',
          worstRating: '1',
        },
      });
    });

    it('should handle adult content rating', () => {
      const movie: Media = {
        id: 1,
        title: 'Adult Movie',
        adult: true,
      } as Media;

      const schema = generateMovieSchema(movie);

      expect(schema.contentRating).toBe('R');
    });

    it('should include genres when present', () => {
      const movie: Media = {
        id: 1,
        title: 'Test Movie',
        genres: [
          { id: 1, name: 'Action' },
          { id: 2, name: 'Adventure' },
        ],
      } as Media;

      const schema = generateMovieSchema(movie);

      expect(schema.genre).toEqual(['Action', 'Adventure']);
    });

    it('should handle genres as strings', () => {
      const movie: Media = {
        id: 1,
        title: 'Test Movie',
        genres: ['Action', 'Comedy'] as any,
      } as Media;

      const schema = generateMovieSchema(movie);

      expect(schema.genre).toEqual(['Action', 'Comedy']);
    });

    it('should omit image when poster_path is not provided', () => {
      const movie: Media = {
        id: 1,
        title: 'Test Movie',
        poster_path: null,
      } as Media;

      const schema = generateMovieSchema(movie);

      expect(schema.image).toBeUndefined();
    });

    it('should omit rating when vote_average is not provided', () => {
      const movie: Media = {
        id: 1,
        title: 'Test Movie',
      } as Media;

      const schema = generateMovieSchema(movie);

      expect(schema.aggregateRating).toBeUndefined();
    });
  });

  describe('generateTVSchema', () => {
    it('should generate basic TV schema', () => {
      const tvShow: Media = {
        id: 1,
        name: 'Test TV Show',
        overview: 'This is a test TV show',
        poster_path: '/tv-test.jpg',
        first_air_date: '2023-01-01',
        vote_average: 9.0,
      } as Media;

      const schema = generateTVSchema(tvShow);

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'TVSeries',
        name: 'Test TV Show',
        description: 'This is a test TV show',
        image: 'https://image.tmdb.org/t/p/w500/tv-test.jpg',
        datePublished: '2023-01-01',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          bestRating: '5',
          worstRating: '1',
        },
      });
    });

    it('should include genres when present', () => {
      const tvShow: Media = {
        id: 1,
        name: 'Test TV Show',
        genres: [{ id: 1, name: 'Drama' }],
      } as Media;

      const schema = generateTVSchema(tvShow);

      expect(schema.genre).toEqual(['Drama']);
    });

    it('should handle missing poster_path', () => {
      const tvShow: Media = {
        id: 1,
        name: 'Test TV Show',
        poster_path: null,
      } as Media;

      const schema = generateTVSchema(tvShow);

      expect(schema.image).toBeUndefined();
    });
  });

  describe('generatePersonSchema', () => {
    it('should generate complete person schema', () => {
      const person = {
        name: 'John Doe',
        biography: 'Test biography',
        profile_path: '/person.jpg',
        birthday: '1980-01-01',
        deathday: null,
        place_of_birth: 'New York, USA',
      };

      const schema = generatePersonSchema(person);

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'John Doe',
        description: 'Test biography',
        image: 'https://image.tmdb.org/t/p/w500/person.jpg',
        birthDate: '1980-01-01',
        deathDate: null,
        birthPlace: 'New York, USA',
      });
    });

    it('should handle deceased person', () => {
      const person = {
        name: 'Jane Doe',
        deathday: '2020-01-01',
      };

      const schema = generatePersonSchema(person);

      expect(schema.deathDate).toBe('2020-01-01');
    });

    it('should handle missing profile_path', () => {
      const person = {
        name: 'John Doe',
        profile_path: null,
      };

      const schema = generatePersonSchema(person);

      expect(schema.image).toBeUndefined();
    });

    it('should handle minimal person data', () => {
      const person = {
        name: 'Minimal Person',
      };

      const schema = generatePersonSchema(person);

      expect(schema['@type']).toBe('Person');
      expect(schema.name).toBe('Minimal Person');
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate breadcrumb schema with multiple items', () => {
      const items = [
        { name: 'Home', url: 'https://example.com/' },
        { name: 'Movies', url: 'https://example.com/movies' },
        { name: 'Action', url: 'https://example.com/movies/action' },
      ];

      const schema = generateBreadcrumbSchema(items);

      expect(schema).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://example.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Movies',
            item: 'https://example.com/movies',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Action',
            item: 'https://example.com/movies/action',
          },
        ],
      });
    });

    it('should handle single item', () => {
      const items = [{ name: 'Home', url: 'https://example.com/' }];

      const schema = generateBreadcrumbSchema(items);

      expect(schema.itemListElement).toHaveLength(1);
      expect(schema.itemListElement[0].position).toBe(1);
    });

    it('should handle empty array', () => {
      const schema = generateBreadcrumbSchema([]);

      expect(schema.itemListElement).toEqual([]);
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should generate organization schema', () => {
      const schema = generateOrganizationSchema();

      expect(schema).toEqual({
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
      });
    });

    it('should indicate free application', () => {
      const schema = generateOrganizationSchema();

      expect(schema.offers.price).toBe('0');
      expect(schema.offers.priceCurrency).toBe('USD');
    });
  });
});
