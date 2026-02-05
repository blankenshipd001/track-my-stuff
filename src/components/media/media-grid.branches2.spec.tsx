import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

const pushMock = jest.fn();
const refreshMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
  useServerInsertedHTML: jest.fn((callback) => callback()),
}));

const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

const requestRemoveMock = jest.fn();
jest.mock('@/utils/api/contentApi', () => ({ requestRemoveFromWatchList: (...args: any[]) => requestRemoveMock(...args) }));

import { MediaGrid } from './media-grid';

describe('MediaGrid additional branches', () => {
  beforeEach(() => jest.clearAllMocks());

  it('when addClicked exists and movie.name (tv) fetch succeeds, calls addClicked with tv show body', async () => {
    const movie = { id: 2, movieId: 2, poster_path: '/p2.jpg', name: 'Show' } as any;
    const addClicked = jest.fn();

    const tvShow = { id: 2, movieId: 2, name: 'Show', extra: 'x' };
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => tvShow } as any);

    renderWithProviders(<MediaGrid movies={[movie]} addClicked={addClicked} user={null} />);

    const listItems = screen.getAllByRole('listitem');
    const first = listItems[0];
    const svg = first.querySelector('svg');
    if (svg) fireEvent.click(svg);

    // wait a tick for async handler
    await waitFor(() => expect(addClicked).toHaveBeenCalledWith(tvShow));
  });

  it('handleRemove: when user exists and removal succeeds, enqueues success and refreshes router', async () => {
    const movie = { id: 3, movieId: 3, poster_path: '/p3.jpg', title: 'RemoveMe' } as any;
    requestRemoveMock.mockResolvedValueOnce(true);

    renderWithProviders(<MediaGrid movies={[movie]} isWatchlist={true} user={{ uid: 'u1' }} />);

    const listItems = screen.getAllByRole('listitem');
    const first = listItems[0];
    const svg = first.querySelector('svg');
    if (svg) fireEvent.click(svg);

    await waitFor(() => {
      expect(requestRemoveMock).toHaveBeenCalledWith('u1', movie);
      expect(enqueueMock).toHaveBeenCalledWith('Removed from your watch list!', 'success');
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
