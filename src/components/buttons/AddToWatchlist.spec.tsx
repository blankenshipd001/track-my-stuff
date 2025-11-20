import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

// mock next/navigation
const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ refresh: refreshMock }) }));

// mock api helper
const addToWatchListMock = jest.fn();
jest.mock('@/utils/api/contentApi', () => ({ addToWatchList: (...args: any[]) => addToWatchListMock(...args) }));

// mock notification hook
const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

import AddToWatchlist from './AddToWatchlist';

describe('AddToWatchlist', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls addToWatchList and shows notification when clicked', async () => {
    const movie = { id: 1, title: 'X' } as any;
    renderWithProviders(<AddToWatchlist user={{ uid: 'u1' }} movie={movie} />);

    const btn = screen.getByRole('button', { name: /Add to Watchlist/i });
    fireEvent.click(btn);

    expect(addToWatchListMock).toHaveBeenCalledWith('u1', movie);
    expect(enqueueMock).toHaveBeenCalledWith('Added to your watch list!', 'success');
  });
});
