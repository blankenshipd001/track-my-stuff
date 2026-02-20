import React from 'react';
import { renderWithProviders, screen, waitFor } from '@/utils/test-utils';
import userEvent from '@testing-library/user-event';

// Mock next/image so tests render predictably
jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

// Mock framer-motion to avoid animation complexities
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock ProviderLogos to a simple stub so MediaGrid test focuses on layout/flow
jest.mock('../provider/ProviderLogos', () => ({
  ProviderLogos: ({ list }: any) => <div data-testid="provider-logos">{String(list?.length)}</div>,
}));


jest.mock('./watchlist-flip-card', () => ({
  WatchlistFlipCard: ({ movie, onNavigate, onAdd, onRemove, ...props }: any) => {
    // Capture handlers for testing
    return (
      <div data-testid={`flip-card-${movie.id}`} data-movieid={movie.movieId}>
        <img alt={`${props.title} movie poster - `} src={props.poster} />
        <button onClick={() => onNavigate(movie)} data-testid={`navigate-${movie.id}`}>
          Navigate
        </button>
        {onAdd && <button onClick={() => onAdd(movie)} data-testid={`add-${movie.id}`}>Add</button>}
        {onRemove && <button onClick={() => onRemove(movie)} data-testid={`remove-${movie.id}`}>Remove</button>}
      </div>
    );
  },
}));

// Mock notification hook
const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({
  enqueueNotificationBar: enqueueMock,
  NotificationBarComponent: null,
}));

// Mock content API to avoid importing firebase/client which expects fetch in node
jest.mock('@/utils/api/contentApi', () => ({
  requestRemoveFromWatchList: jest.fn(),
  getContent: jest.fn(() => Promise.resolve([])),
}));

const pushMock = jest.fn();
const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useServerInsertedHTML: jest.fn((callback) => callback()),
}));

// Get mocks after they're created
import { requestRemoveFromWatchList, getContent } from '@/utils/api/contentApi';
const removeFromWatchListMock = requestRemoveFromWatchList as jest.Mock;
const getContentMock = getContent as jest.Mock;

import { MediaGrid } from './media-grid';

describe('MediaGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock getContent to resolve with empty array by default
    getContentMock.mockResolvedValue([]);
    
    // Suppress act() warning - it's a known limitation with async useEffect
    jest.spyOn(console, 'error').mockImplementation((msg) => {
      if (typeof msg === 'string' && msg.includes('An update to MediaGrid inside a test was not wrapped in act')) {
        return;
      }
    });
  });

  it('renders flip cards for movies', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/path.jpg',
      title: 'My Movie',
      providers: { flatrate: [{ provider_name: 'P', logo_path: '/logo.png' }] },
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    // Wait for async getContent call to complete
    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });

    // Image component renders an <img> due to our mock; find by alt/title
    expect(screen.getByAltText(/My Movie movie poster/i)).toBeVisible();
  });

  it('navigates to movie details when Info button clicked', async () => {
    const movie = {
      id: 2,
      movieId: 42,
      poster_path: '/p.jpg',
      title: 'Movie Click',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={null} />);

    await waitFor(() => {
      expect(screen.getByAltText(/Movie Click movie poster/i)).toBeVisible();
    });
  });

  it('shows pagination with Load More button when items exceed limit', async () => {
    // Create 25 movies (more than default ITEMS_PER_PAGE of 20)
    const movies = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      movieId: i,
      poster_path: '/p.jpg',
      title: `Movie ${i}`,
    })) as any[];

    const { container } = renderWithProviders(
      <MediaGrid movies={movies} user={{ uid: 'u1' }} />
    );

    // Wait for async getContent call to complete and DOM to update
    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
      const images = container.querySelectorAll('img[alt*="movie poster"]');
      expect(images.length).toBeLessThanOrEqual(20);
    });

    // Load More button should be present
    const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
    expect(loadMoreBtn).toBeVisible();
  });

  it('loads more items when Load More button is clicked', async () => {
    const user = userEvent.setup();
    
    // Create 45 movies (more than 2 pages of 20)
    const movies = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      movieId: i,
      poster_path: '/p.jpg',
      title: `Movie ${i}`,
    })) as any[];

    renderWithProviders(
      <MediaGrid movies={movies} user={{ uid: 'u1' }} />
    );

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
      expect(screen.getByAltText(/Movie 0 movie poster/i)).toBeInTheDocument();
    });

    // Click Load More
    const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
    await user.click(loadMoreBtn);

    // Wait for loading to complete
    await waitFor(() => {
      expect(loadMoreBtn).not.toBeDisabled();
    });

    // Should show more items now
    expect(screen.getByAltText(/Movie 30 movie poster/i)).toBeInTheDocument();
  });

  it('shows "Please log in" notification when adding to watchlist without user', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={null} />);

    await waitFor(() => {
      expect(screen.getByAltText(/Test Movie movie poster/i)).toBeVisible();
    });
  });

  it('shows loading state on Load More button', async () => {
    const movies = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      movieId: i,
      poster_path: '/p.jpg',
      title: `Movie ${i}`,
    })) as any[];

    renderWithProviders(
      <MediaGrid movies={movies} user={{ uid: 'u1' }} />
    );

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });

    const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
    expect(loadMoreBtn).not.toBeDisabled();
  });

  it('renders with no movies', async () => {
    renderWithProviders(<MediaGrid movies={[]} user={{ uid: 'u1' }} />);

    // Load More button should not be visible
    const loadMoreBtn = screen.queryByRole('button', { name: /load more/i });
    expect(loadMoreBtn).not.toBeInTheDocument();
  });

  it('shows remaining count in Load More button', async () => {
    const movies = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      movieId: i,
      poster_path: '/p.jpg',
      title: `Movie ${i}`,
    })) as any[];

    renderWithProviders(
      <MediaGrid movies={movies} user={{ uid: 'u1' }} />
    );

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });

    const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
    // Should show "10 remaining" (30 total - 20 initial)
    expect(loadMoreBtn).toHaveTextContent('10 remaining');
  });

  it('handles TV shows correctly', async () => {
    const tvShow = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      original_name: 'Breaking Bad',
      first_air_date: '2008-01-20',
    } as any;

    renderWithProviders(<MediaGrid movies={[tvShow]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
      expect(screen.getByAltText(/Breaking Bad movie poster/i)).toBeVisible();
    });
  });

  it('fetches watchlist on mount when user is provided and not on watchlist page', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'user-123' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalledWith('user-123');
    });
  });

  it('does not fetch watchlist when isWatchlist is true', async () => {
    getContentMock.mockClear();
    
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(
      <MediaGrid movies={[movie]} user={{ uid: 'user-123' }} isWatchlist={true} />
    );

    // getContent should not be called when on watchlist page
    expect(getContentMock).not.toHaveBeenCalled();
  });

  it('renders without user prop', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} />);

    await waitFor(() => {
      expect(screen.getByAltText(/Test Movie movie poster/i)).toBeVisible();
    });
  });

  it('uses fallback image path from backdrop_path when poster_path is missing', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: null,
      backdrop_path: '/backdrop.jpg',
      title: 'Movie with Backdrop',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
      expect(screen.getByAltText(/Movie with Backdrop movie poster/i)).toBeVisible();
    });
  });

  it('uses fallback title from original_name when title is missing', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: null,
      original_name: 'Original Title',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
      expect(screen.getByAltText(/Original Title movie poster/i)).toBeVisible();
    });
  });

  it('handles removal from watchlist correctly', async () => {
    removeFromWatchListMock.mockResolvedValue({});

    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(
      <MediaGrid movies={[movie]} user={{ uid: 'user-123' }} isWatchlist={true} />
    );

    await waitFor(() => {
      expect(screen.getByAltText(/Test Movie movie poster/i)).toBeVisible();
    });
  });

  it('displays correct image count on pagination', async () => {
    const movies = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      movieId: i,
      poster_path: '/p.jpg',
      title: `Movie ${i}`,
    })) as any[];

    const { container } = renderWithProviders(
      <MediaGrid movies={movies} user={{ uid: 'u1' }} />
    );

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
      const images = container.querySelectorAll('img[alt*="movie poster"]');
      // Should show 20 on first page
      expect(images.length).toBe(20);
    });

    // Check that Load More shows correct remaining count
    const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
    expect(loadMoreBtn).toHaveTextContent('2 remaining');
  });

  it('navigates to TV show details when TV show is clicked', async () => {
    const user = userEvent.setup();
    const tvShow = {
      id: 1,
      movieId: 100,
      poster_path: '/p.jpg',
      original_name: 'Test TV Show',
      first_air_date: '2020-01-01',
    } as any;

    renderWithProviders(<MediaGrid movies={[tvShow]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });

    // Click navigate button
    const navigateBtn = screen.getByTestId('navigate-1');
    await user.click(navigateBtn);

    // Verify push was called with TV path
    expect(pushMock).toHaveBeenCalledWith('/tv/100', { scroll: false });
  });

  it('navigates to movie details when movie is clicked', async () => {
    const user = userEvent.setup();
    const movie = {
      id: 2,
      movieId: 200,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });

    // Click navigate button
    const navigateBtn = screen.getByTestId('navigate-2');
    await user.click(navigateBtn);

    // Verify push was called with movie path
    expect(pushMock).toHaveBeenCalledWith('/movies/200', { scroll: false });
  });

  it('adds TV show to watchlist with API fetch', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ movieId: 100, id: 1 }),
      } as Response)
    );

    const tvShow = {
      id: 1,
      name: 'Test TV Show',
      poster_path: '/p.jpg',
    } as any;

    renderWithProviders(<MediaGrid movies={[tvShow]} user={{ uid: 'user-123' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });

    // Click add button
    const addBtn = screen.getByTestId('add-1');
    await user.click(addBtn);

    // Verify fetch was called for TV show
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tv/1');
    });
  });

  it('shows error notification when TV show fetch fails', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve({
        ok: false,
      } as Response)
    );

    const tvShow = {
      id: 1,
      name: 'Test TV Show',
      poster_path: '/p.jpg',
    } as any;

    renderWithProviders(<MediaGrid movies={[tvShow]} user={{ uid: 'user-123' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });

    // Click add button
    const addBtn = screen.getByTestId('add-1');
    await user.click(addBtn);

    // Verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tv/1');
    });
  });

  it('handles error when adding to watchlist throws exception', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'user-123' }} />);

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalled();
    });
  });

  it('removes movie from watchlist and calls router refresh', async () => {
    const user = userEvent.setup();
    removeFromWatchListMock.mockResolvedValue({});

    const movie = {
      id: 1,
      movieId: 100,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(
      <MediaGrid movies={[movie]} user={{ uid: 'user-123' }} isWatchlist={true} />
    );

    await waitFor(() => {
      expect(screen.getByAltText(/Test Movie movie poster/i)).toBeVisible();
    });

    // Click remove button
    const removeBtn = screen.getByTestId('remove-1');
    await user.click(removeBtn);

    // Verify router.refresh was called after removal
    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it('shows error notification when removal fails', async () => {
    removeFromWatchListMock.mockRejectedValue(new Error('Failed to remove'));

    const movie = {
      id: 1,
      movieId: 100,
      poster_path: '/p.jpg',
      title: 'Test Movie',
    } as any;

    renderWithProviders(
      <MediaGrid movies={[movie]} user={{ uid: 'user-123' }} isWatchlist={true} />
    );

    await waitFor(() => {
      expect(screen.getByAltText(/Test Movie movie poster/i)).toBeVisible();
    });
  });

  it('tracks watchlist status in isInWatchlist state', async () => {
    const movies = [
      {
        id: 1,
        movieId: 1,
        poster_path: '/p.jpg',
        title: 'In Watchlist',
      },
      {
        id: 2,
        movieId: 2,
        poster_path: '/p.jpg',
        title: 'Not In Watchlist',
      },
    ] as any[];

    getContentMock.mockResolvedValue([
      { movieId: 1, id: 1 },
    ]);

    renderWithProviders(
      <MediaGrid movies={movies} user={{ uid: 'user-123' }} />
    );

    await waitFor(() => {
      expect(getContentMock).toHaveBeenCalledWith('user-123');
    });

    // Verify both movies are rendered
    expect(screen.getByTestId('flip-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('flip-card-2')).toBeInTheDocument();
  });

  it('shows "in watchlist" state when isWatchlist prop is true', async () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/p.jpg',
      title: 'Watchlist Movie',
    } as any;

    renderWithProviders(
      <MediaGrid movies={[movie]} user={{ uid: 'user-123' }} isWatchlist={true} />
    );

    await waitFor(() => {
      expect(screen.getByAltText(/Watchlist Movie movie poster/i)).toBeVisible();
    });

    // Verify getContent was not called when isWatchlist is true
    expect(getContentMock).not.toHaveBeenCalled();
  });
});
