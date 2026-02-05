import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: jest.fn() }),
  useServerInsertedHTML: jest.fn((callback) => callback()),
}));

const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

// Mock requestRemoveFromWatchList to avoid network
jest.mock('@/utils/api/contentApi', () => ({ requestRemoveFromWatchList: jest.fn() }));

import { MediaGrid } from './media-grid';

describe('MediaGrid branch coverage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls removeClicked when removeClicked prop is provided and bookmark clicked', () => {
    const movie = { id: 1, movieId: 1, poster_path: '/p.jpg', title: 'T' } as any;
    const removeClicked = jest.fn();

    renderWithProviders(<MediaGrid movies={[movie]} removeClicked={removeClicked} user={null} />);

     const listItems = screen.getAllByRole('listitem');
     const first = listItems[0];
     const svg = first.querySelector('svg');
  if (svg) fireEvent.click(svg);

    expect(removeClicked).toHaveBeenCalledWith(movie);
  });

  it('when addClicked exists and movie.name (tv) fetch fails, shows notification', async () => {
    const movie = { id: 2, movieId: 2, poster_path: '/p2.jpg', name: 'Show' } as any;
    const addClicked = jest.fn();

    // mock fetch to return not ok
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false } as any);

    renderWithProviders(<MediaGrid movies={[movie]} addClicked={addClicked} user={null} />);

  const listItems = screen.getAllByRole('listitem');
  const first = listItems[0];
  const svg = first.querySelector('[data-testid="BookmarkAddIcon"]') || first.querySelector('svg');
  if (svg) fireEvent.click(svg);

  expect(addClicked).not.toHaveBeenCalled();
  await new Promise((r) => setTimeout(r, 0));
  expect(enqueueMock).toHaveBeenCalledWith('Could not load TV details', 'error');
  });

  it('calls addClicked directly when movie has no name', async () => {
    const movie = { id: 3, movieId: 3, poster_path: '/p3.jpg', title: 'NoNameMovie' } as any;
    const addClicked = jest.fn().mockResolvedValue(undefined);

    renderWithProviders(<MediaGrid movies={[movie]} addClicked={addClicked} user={null} />);

     const listItems = screen.getAllByRole('listitem');
     const first = listItems[0];
     const svg = first.querySelector('svg');
    
    if (svg) fireEvent.click(svg);
    
    await waitFor(() => {
      expect(addClicked).toHaveBeenCalledWith(movie);
    });
  });

  it('when isWatchlist and no user, enqueue please log in message', () => {
    const movie = { id: 4, movieId: 4, poster_path: '/p4.jpg', title: 'RemoveMe' } as any;

    renderWithProviders(<MediaGrid movies={[movie]} isWatchlist={true} user={null} />);

     const listItems = screen.getAllByRole('listitem');
     const first = listItems[0];
     const svg = first.querySelector('svg');
    if (svg) fireEvent.click(svg);

    expect(enqueueMock).toHaveBeenCalledWith('Please log in to save movies.', 'info');
  });
});
