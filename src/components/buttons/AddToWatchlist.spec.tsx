import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';

// mock next/navigation
const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
  useServerInsertedHTML: jest.fn((callback) => callback()),
}));

// mock api helper
const addToWatchListMock = jest.fn();
const requestRemoveFromWatchListMock = jest.fn();
jest.mock('@/utils/api/contentApi', () => ({ 
  addToWatchList: (...args: any[]) => addToWatchListMock(...args),
  requestRemoveFromWatchList: (...args: any[]) => requestRemoveFromWatchListMock(...args),
  getContent: jest.fn(() => Promise.resolve([])),
}));

// mock notification hook
const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

// mock useIsInWatchlist hook
let mockIsInWatchlist = false;
const mockRefetch = jest.fn();
jest.mock('@/hooks/useIsInWatchlist', () => ({
  useIsInWatchlist: () => ({ 
    isInWatchlist: mockIsInWatchlist, 
    loading: false, 
    refetch: mockRefetch 
  })
}));

import AddToWatchlist from './AddToWatchlist';

describe('AddToWatchlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsInWatchlist = false;
  });

  it('shows "Add to Watchlist" when movie is not in watchlist', () => {
    const movie = { id: 1, title: 'X', movieId: 1 } as any;
    renderWithProviders(<AddToWatchlist user={{ uid: 'u1' }} movie={movie} />);

    const btn = screen.getByRole('button', { name: /Add to Watchlist/i });
    expect(btn).toBeInTheDocument();
  });

  it('calls addToWatchList and shows notification when adding movie', async () => {
    const movie = { id: 1, title: 'X', movieId: 1 } as any;
    renderWithProviders(<AddToWatchlist user={{ uid: 'u1' }} movie={movie} />);

    const btn = screen.getByRole('button', { name: /Add to Watchlist/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(addToWatchListMock).toHaveBeenCalledWith('u1', movie);
      expect(enqueueMock).toHaveBeenCalledWith('Added to your watch list!', 'success');
    });
  });

  it('shows "Remove from Watchlist" when movie is in watchlist', () => {
    mockIsInWatchlist = true;
    const movie = { id: 1, title: 'X', movieId: 1 } as any;
    renderWithProviders(<AddToWatchlist user={{ uid: 'u1' }} movie={movie} />);

    const btn = screen.getByRole('button', { name: /Remove from Watchlist/i });
    expect(btn).toBeInTheDocument();
  });

  it('calls requestRemoveFromWatchList when removing movie', async () => {
    mockIsInWatchlist = true;
    const movie = { id: 1, title: 'X', movieId: 1 } as any;
    renderWithProviders(<AddToWatchlist user={{ uid: 'u1' }} movie={movie} />);

    const btn = screen.getByRole('button', { name: /Remove from Watchlist/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(requestRemoveFromWatchListMock).toHaveBeenCalledWith('u1', movie);
      expect(enqueueMock).toHaveBeenCalledWith('Removed from your watch list!', 'success');
    });
  });
});
