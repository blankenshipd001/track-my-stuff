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

describe('MediaGrid additional branches', () => {
  beforeEach(() => jest.clearAllMocks());

  it('handles add to watchlist for TV shows', async () => {
    const movie = { id: 2, movieId: 2, poster_path: '/p2.jpg', name: 'Show', title: 'Show' } as any;

    const tvShow = { id: 2, movieId: 2, name: 'Show', extra: 'x' };
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => tvShow } as any);

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(screen.getByAltText(/Show movie poster/i)).toBeVisible();
    });
  });

  it('handleRemove: when user exists and removal succeeds, enqueues success', async () => {
    const movie = { id: 3, movieId: 3, poster_path: '/p3.jpg', title: 'RemoveMe' } as any;

    renderWithProviders(<MediaGrid movies={[movie]} isWatchlist={true} user={{ uid: 'u1' }} />);

    await waitFor(() => {
      expect(screen.getByAltText(/RemoveMe movie poster/i)).toBeVisible();
    });

    const removeBtn = screen.getByRole('button', { name: /remove.*watchlist/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(enqueueMock).toHaveBeenCalledWith('Removed from your watch list!', 'success');
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
