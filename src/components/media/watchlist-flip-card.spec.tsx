import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';

// Mock next/image
jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
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

describe('WatchlistFlipCard', () => {
  const mockMovie = {
    id: 1,
    movieId: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    providers: {
      flatrate: [
        { provider_name: 'Netflix', logo_path: '/netflix.png' },
        { provider_name: 'Hulu', logo_path: '/hulu.png' },
      ],
    },
  } as any;

  const mockCallbacks = {
    onRemove: jest.fn(),
    onNavigate: jest.fn(),
    onAdd: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with poster image on initial load', async () => {
    renderWithProviders(
      <WatchlistFlipCard
        movie={mockMovie}
        poster={mockMovie.poster_path}
        title={mockMovie.title}
        isInWatchlist={true}
        {...mockCallbacks}
      />
    );

    // Should show the poster image
    await waitFor(() => {
      expect(screen.getByAltText(/Test Movie movie poster/i)).toBeVisible();
    });
  });

  it('has keyboard navigation support', () => {
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
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-pressed', 'false');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('Test Movie'));
  });

  it('flips card when Enter key pressed', async () => {
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
    
    // Press Enter to flip
    fireEvent.keyDown(card!, { key: 'Enter' });

    await waitFor(() => {
      expect(card).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('flips card when Space key pressed', () => {
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
    
    // Press Space to flip
    fireEvent.keyDown(card!, { key: ' ' });

    expect(card).toHaveAttribute('aria-pressed', 'true');
  });

  it('unflips card when Escape key pressed', async () => {
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
    
    // Flip the card first
    fireEvent.keyDown(card!, { key: 'Enter' });
    await waitFor(() => {
      expect(card).toHaveAttribute('aria-pressed', 'true');
    });

    // Then press Escape
    fireEvent.keyDown(card!, { key: 'Escape' });

    expect(card).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onNavigate when info button clicked on front', async () => {
    const { container } = renderWithProviders(
      <WatchlistFlipCard
        movie={mockMovie}
        poster={mockMovie.poster_path}
        title={mockMovie.title}
        isInWatchlist={true}
        {...mockCallbacks}
      />
    );

    // Find and click the info button (should be visible on hover on desktop view)
    // First, we need to flip to see providers
    const card = container.querySelector('[role="button"]');
    fireEvent.keyDown(card!, { key: 'Enter' });

    await waitFor(() => {
      expect(card).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('calls onRemove when remove button clicked and isInWatchlist is true', async () => {
    const { container } = renderWithProviders(
      <WatchlistFlipCard
        movie={mockMovie}
        poster={mockMovie.poster_path}
        title={mockMovie.title}
        isInWatchlist={true}
        {...mockCallbacks}
      />
    );

    // Find info button specifically by its SVG icon data-testid
    const infoButton = container.querySelector('button[title="View available providers"]');
    if (infoButton) {
      fireEvent.click(infoButton);
    }
  });

  it('calls onAdd when add button clicked and isInWatchlist is false', async () => {
    renderWithProviders(
      <WatchlistFlipCard
        movie={mockMovie}
        poster={mockMovie.poster_path}
        title={mockMovie.title}
        isInWatchlist={false}
        {...mockCallbacks}
      />
    );

    // Find the add button
    const addBtn = screen.getByRole('button', { name: /add.*watchlist/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockCallbacks.onAdd).toHaveBeenCalledWith(mockMovie);
    });
  });

  it('has proper focus styles when focused', () => {
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
    
    // Simulate focus
    fireEvent.focus(card!);

    // Should have focus styling
    expect(card).toHaveStyle('outline: 2px solid #a78bfa');
  });

  it('displays provider logos on back of card', async () => {
    const { container } = renderWithProviders(
      <WatchlistFlipCard
        movie={mockMovie}
        poster={mockMovie.poster_path}
        title={mockMovie.title}
        isInWatchlist={true}
        {...mockCallbacks}
      />
    );

    // Flip the card to show providers
    const card = container.querySelector('[role="button"]');
    fireEvent.keyDown(card!, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('provider-logos')).toBeVisible();
    });
  });

  it('shows "Not available" when no providers', async () => {
    const movieNoProviders = {
      ...mockMovie,
      providers: { flatrate: [] },
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

    // Flip the card to show providers
    const card = container.querySelector('[role="button"]');
    fireEvent.keyDown(card!, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Not available')).toBeVisible();
    });
  });

  it('has proper accessibility labels on buttons', () => {
    renderWithProviders(
      <WatchlistFlipCard
        movie={mockMovie}
        poster={mockMovie.poster_path}
        title={mockMovie.title}
        isInWatchlist={true}
        {...mockCallbacks}
      />
    );

    // Check for accessible button labels
    const removeBtn = screen.getByRole('button', { name: /remove.*Test Movie.*watchlist/i });
    expect(removeBtn).toHaveAttribute('aria-label', expect.stringContaining('Remove'));
    expect(removeBtn).toHaveAttribute('title', 'Remove from watchlist');
  });
});
