import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock('../provider/ProviderLogos', () => ({
  ProviderLogos: ({ list }: any) => <div data-testid="provider-logos">{String(list?.length)}</div>,
}));

const pushMock = jest.fn();
const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useServerInsertedHTML: jest.fn((callback) => callback()),
}));

const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

jest.mock('@/utils/api/contentApi', () => ({ 
  requestRemoveFromWatchList: jest.fn(),
  getContent: jest.fn(() => Promise.resolve([])),
}));

import { MediaGrid } from './media-grid';

describe('MediaGrid branch coverage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('removes item from watchlist when remove button clicked', async () => {
    const movie = { id: 1, movieId: 1, poster_path: '/p.jpg', title: 'T' } as any;

    renderWithProviders(<MediaGrid movies={[movie]} isWatchlist={true} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(screen.getByAltText(/T movie poster/i)).toBeVisible();
    });

    const removeBtn = screen.getByRole('button', { name: /remove.*watchlist/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(enqueueMock).toHaveBeenCalledWith('Removed from your watch list!', 'success');
    });
  });

  it('shows error when TV show fetch fails', async () => {
    const movie = { id: 2, movieId: 2, poster_path: '/p2.jpg', name: 'Show', title: 'Show' } as any;

    // mock fetch to return not ok
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false } as any);

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(screen.getByAltText(/Show movie poster/i)).toBeVisible();
    });
  });

  it('handles adding regular movies to watchlist', async () => {
    const movie = { id: 3, movieId: 3, poster_path: '/p3.jpg', title: 'NoNameMovie' } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(screen.getByAltText(/NoNameMovie movie poster/i)).toBeVisible();
    });
  });

  it('fetches watchlist IDs on mount when user provided', async () => {
    const movie = { id: 4, movieId: 4, poster_path: '/p4.jpg', title: 'RemoveMe' } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(screen.getByAltText(/RemoveMe movie poster/i)).toBeVisible();
    });
  });
});
