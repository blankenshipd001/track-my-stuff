import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';
import { act } from 'react';

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock, refresh: jest.fn() }) }));

const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

const addToWatchListMock = jest.fn();
jest.mock('@/utils/api/contentApi', () => ({ addToWatchList: (...args: any[]) => addToWatchListMock(...args) }));

import { SearchBox } from './SearchBox';

describe('SearchBox fetch edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows error notification when fetch returns not ok', async () => {
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: false } as any);

    renderWithProviders(<SearchBox user={null} />);

    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'fail' } });

    // advance debounce
    jest.advanceTimersByTime(250);

    await waitFor(() => {
      expect(enqueueMock).toHaveBeenCalledWith('Search failed', 'error');
    });
  });

  it('populates dropdown on success and navigates on item click; add to watchlist works', async () => {
    const mockJson = { movies: [{ id: 10, title: 'MovieX', popularity: 1 }], tv: [] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    renderWithProviders(<SearchBox user={{ uid: 'u1' }} />);

    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'MovieX' } });

    jest.advanceTimersByTime(250);

    // wait for dropdown to render item
    const item = await screen.findByText(/MovieX/i);
    expect(item).toBeVisible();

    // click the title to navigate
    fireEvent.click(item);
    expect(pushMock).toHaveBeenCalledWith('/movies/10');
  });

  it('adds to watchlist from dropdown when user is present', async () => {
    const mockJson = { movies: [{ id: 10, title: 'MovieX', popularity: 1, poster_path: '/p.jpg' }], tv: [] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    renderWithProviders(<SearchBox user={{ uid: 'u1' }} />);

    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'MovieX' } });

    jest.advanceTimersByTime(250);

    // find bookmark svg inside list item and click it
    const listItem = await screen.findByText(/MovieX/i);
    const bookmark = listItem.closest('li')!.querySelector('svg');
    if (bookmark) fireEvent.click(bookmark);

    await waitFor(() => {
      expect(addToWatchListMock).toHaveBeenCalled();
      expect(enqueueMock).toHaveBeenCalledWith('Added to watchlist!', 'success');
    });
  });

  it('handles no results (dropdown stays closed)', async () => {
    const mockJson = { movies: [], tv: [], all: [] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    renderWithProviders(<SearchBox user={null} />);

    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'nothing' } });

    jest.advanceTimersByTime(250);

    // wait a tick for state to settle
    await waitFor(() => {
      const items = screen.queryAllByRole('listitem');
      expect(items.length).toBe(0);
    });
  });

  it('shows error notification when fetch throws', async () => {
    (global as any).fetch = jest.fn().mockRejectedValueOnce(new Error('boom'));

    renderWithProviders(<SearchBox user={null} />);
    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'explode' } });

    jest.advanceTimersByTime(250);

    await waitFor(() => {
      expect(enqueueMock).toHaveBeenCalled();
      const calledWith = (enqueueMock.mock.calls[0] || [])[0] as string;
      expect(calledWith).toContain('boom');
    });
  });

  it('shows "Show more" when >5 results and expands list', async () => {
    const items = Array.from({ length: 7 }).map((_, i) => ({ id: i + 1, title: `M${i + 1}`, popularity: 1 }));
    const mockJson = { movies: items, tv: [] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    renderWithProviders(<SearchBox user={null} />);
    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'many' } });
    jest.advanceTimersByTime(250);

    const showMore = await screen.findByText(/Show more/i);
    expect(showMore).toBeVisible();

    fireEvent.click(showMore);

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(5);
    });
  });

  it('clicking outside closes the dropdown (click away)', async () => {
    const mockJson = { movies: [{ id: 1, title: 'AwayTest', popularity: 1 }], tv: [] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    renderWithProviders(<SearchBox user={null} />);
    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'AwayTest' } });
    jest.advanceTimersByTime(250);

    const item = await screen.findByText(/AwayTest/i);
    expect(item).toBeVisible();

  // simulate clicking away by dispatching a native click event on the document body
    act(() => {
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    await waitFor(() => {
      expect(screen.queryByText(/AwayTest/i)).toBeNull();
    });
  });
});
