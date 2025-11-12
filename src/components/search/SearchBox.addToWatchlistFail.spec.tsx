import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { act } from 'react';

jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock, refresh: jest.fn() }) }));

const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

const addToWatchListMock = jest.fn();
jest.mock('@/utils/api/contentApi', () => ({ addToWatchList: (...args: any[]) => addToWatchListMock(...args) }));

import { SearchBox } from './SearchBox';

describe('SearchBox addToWatchList failure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it('shows failure notification when addToWatchList throws', async () => {
    const mockJson = { movies: [{ id: 10, title: 'MovieFail', popularity: 1, poster_path: '/p.jpg' }], tv: [] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    addToWatchListMock.mockRejectedValueOnce(new Error('write fail'));

    renderWithProviders(<SearchBox user={{ uid: 'u1' }} />);

    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'MovieFail' } });

    act(() => jest.advanceTimersByTime(250));

    const listItem = await screen.findByText(/MovieFail/i);
    const bookmark = listItem.closest('li')!.querySelector('svg');
    if (bookmark) fireEvent.click(bookmark);

    await waitFor(() => {
      expect(addToWatchListMock).toHaveBeenCalled();
      expect(enqueueMock).toHaveBeenCalledWith('Failed to add to watchlist', 'error');
    });
  });
});
