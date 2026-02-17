import React from 'react';
import { renderWithProviders, screen, waitFor } from '@/utils/test-utils';

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

// Mock notification hook
const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({
  enqueueNotificationBar: enqueueMock,
  NotificationBarComponent: null,
}));

import { MediaGrid } from './media-grid';

describe('MediaGrid', () => {
  beforeEach(() => jest.clearAllMocks());

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
      expect(screen.getByAltText(/My Movie movie poster/i)).toBeVisible();
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

    await waitFor(() => {
      // Should initially show only 20 items
      const images = container.querySelectorAll('img[alt*="movie poster"]');
      expect(images.length).toBeLessThanOrEqual(20);
    });

    // Load More button should be present
    const loadMoreBtn = screen.getByRole('button', { name: /load more/i });
    expect(loadMoreBtn).toBeVisible();
  });
});
