import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';

// Mock next/image
jest.mock('next/image', () => (props: any) => {
  const { onMouseOver, onMouseOut, onClick, ...rest } = props;
  return (
    <img 
      {...rest} 
      alt={props.alt}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    />
  );
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock ProviderLogos
jest.mock('../provider/ProviderLogos', () => ({
  ProviderLogos: ({ list }: any) => (
    <div data-testid="provider-logos">
      {list?.map((provider: any, i: number) => (
        <div key={i} data-testid={`provider-${i}`}>
          {provider.provider_name}
        </div>
      ))}
    </div>
  ),
}));

import { WatchlistFlipCard } from './watchlist-flip-card';

describe('WatchlistFlipCard - Additional Coverage', () => {
  const mockMovie = {
    id: 1,
    movieId: 1,
    title: 'Coverage Test Movie',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2024-01-01',
    providers: {
      flatrate: [
        { provider_name: 'Netflix', logo_path: '/netflix.png' },
      ],
    },
  } as any;

  const mockCallbacks = {
    onRemove: jest.fn().mockResolvedValue(undefined),
    onNavigate: jest.fn(),
    onAdd: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL = 'https://image.tmdb.org';
  });

  describe('Image interactions', () => {
    it('scales image on mouse over and out', async () => {
      renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const image = screen.getByAltText(/Coverage Test Movie movie poster/i);
      
      // Hover over
      fireEvent.mouseOver(image);
      expect(image).toHaveStyle('transform: scale(1.03)');

      // Hover out
      fireEvent.mouseOut(image);
      expect(image).toHaveStyle('transform: scale(1)');
    });

    it('navigates on image click in desktop mode', async () => {
      // Mock non-mobile view
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false, // desktop
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const image = screen.getByAltText(/Coverage Test Movie movie poster/i);
      fireEvent.click(image);

      await waitFor(() => {
        expect(mockCallbacks.onNavigate).toHaveBeenCalledWith(mockMovie);
      });
    });

    it('flips card on image click in mobile mode', async () => {
      // Mock mobile view
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: true, // mobile
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const image = screen.getByAltText(/Coverage Test Movie movie poster/i);
      fireEvent.click(image);

      const card = container.querySelector('[role="button"]');
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });

  describe('Desktop action buttons overlay', () => {
    beforeEach(() => {
      // Mock desktop view for these tests
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false, // desktop
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it('flips card when info button is clicked on front', async () => {
      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const infoButton = container.querySelector('button[title="View available providers"]');
      expect(infoButton).toBeInTheDocument();

      fireEvent.click(infoButton!);

      const card = container.querySelector('[role="button"]');
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('calls onRemove when remove button is clicked on front', async () => {
      renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const removeButton = screen.getByRole('button', { name: /Remove.*from watchlist/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(mockCallbacks.onRemove).toHaveBeenCalledWith(mockMovie);
      });
    });

    it('calls onAdd when add button is clicked on front and not in watchlist', async () => {
      renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={false}
          {...mockCallbacks}
        />
      );

      const addButton = screen.getByRole('button', { name: /Add.*to watchlist/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockCallbacks.onAdd).toHaveBeenCalledWith(mockMovie);
      });
    });
  });

  describe('Back side actions', () => {
    it('unflips card when info button clicked on back', async () => {
      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const card = container.querySelector('[role="button"]');
      
      // First flip the card
      fireEvent.keyDown(card!, { key: 'Enter' });
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'true');
      });

      // Find and click the info button on back (View poster)
      const backInfoButton = screen.getByRole('button', { name: /View poster/i });
      fireEvent.click(backInfoButton);

      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'false');
      });
    });

    it('calls onNavigate when Open button clicked on back', async () => {
      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const card = container.querySelector('[role="button"]');
      
      // Flip the card
      fireEvent.keyDown(card!, { key: 'Enter' });
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'true');
      });

      // Click the "More information" button
      const openButton = screen.getByRole('button', { name: /More information/i });
      fireEvent.click(openButton);

      await waitFor(() => {
        expect(mockCallbacks.onNavigate).toHaveBeenCalledWith(mockMovie);
      });
    });

    it('calls onRemove when remove button clicked on back', async () => {
      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const card = container.querySelector('[role="button"]');
      
      // Flip the card
      fireEvent.keyDown(card!, { key: 'Enter' });
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'true');
      });

      // Click the remove button on back
      const removeButton = screen.getByRole('button', { name: /Remove.*from watchlist/i });
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(mockCallbacks.onRemove).toHaveBeenCalledWith(mockMovie);
      });
    });

    it('calls onAdd when add button clicked on back and not in watchlist', async () => {
      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={false}
          {...mockCallbacks}
        />
      );

      const card = container.querySelector('[role="button"]');
      
      // Flip the card
      fireEvent.keyDown(card!, { key: 'Enter' });
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'true');
      });

      // Click the add button on back
      const addButton = screen.getByRole('button', { name: /Add.*to watchlist/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockCallbacks.onAdd).toHaveBeenCalledWith(mockMovie);
      });
    });

    it('unflips card when clicking on back of card', async () => {
      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const card = container.querySelector('[role="button"]');
      
      // Flip the card
      fireEvent.click(card!);
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'true');
      });

      // Click on the card again to flip back
      fireEvent.click(card!);
      await waitFor(() => {
        expect(card).toHaveAttribute('aria-pressed', 'false');
      });
    });
  });

  describe('Edge cases', () => {
    it('handles undefined providers gracefully', async () => {
      const movieNoProviders = {
        ...mockMovie,
        providers: undefined,
      };

      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={movieNoProviders}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const card = container.querySelector('[role="button"]');
      fireEvent.keyDown(card!, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Not available')).toBeVisible();
      });
    });

    it('handles non-array providers gracefully', async () => {
      const movieBadProviders = {
        ...mockMovie,
        providers: { flatrate: null },
      };

      const { container } = renderWithProviders(
        <WatchlistFlipCard
          movie={movieBadProviders}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={true}
          {...mockCallbacks}
        />
      );

      const card = container.querySelector('[role="button"]');
      fireEvent.keyDown(card!, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Not available')).toBeVisible();
      });
    });

    it('calls onRemove when onAdd is not provided and isInWatchlist is false', async () => {
      renderWithProviders(
        <WatchlistFlipCard
          movie={mockMovie}
          poster={mockMovie.poster_path}
          title={mockMovie.title}
          isInWatchlist={false}
          onRemove={mockCallbacks.onRemove}
          onNavigate={mockCallbacks.onNavigate}
        />
      );

      const addButton = screen.getByRole('button', { name: /Add.*to watchlist/i });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockCallbacks.onRemove).toHaveBeenCalledWith(mockMovie);
      });
    });
  });
});
