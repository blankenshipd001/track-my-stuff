import React from 'react';
import { renderWithProviders, screen, fireEvent, waitFor } from '@/utils/test-utils';

jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock, refresh: jest.fn() }) }));

const enqueueMock = jest.fn();
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: enqueueMock, NotificationBarComponent: null }));

// Prevent importing firebase-heavy modules via contentApi during module evaluation
jest.mock('@/utils/api/contentApi', () => ({ addToWatchList: jest.fn(), requestRemoveFromWatchList: jest.fn() }));

import { act } from 'react';
import { SearchBox } from './SearchBox';

describe('SearchBox TV navigation and clear behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it('navigates to /tv/:id when item is a tv result (no title)', async () => {
    const mockJson = { movies: [], tv: [{ id: 20, movieId: 20, name: 'ShowZ', popularity: 5 }] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    renderWithProviders(<SearchBox user={null} />);

    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'ShowZ' } });

  act(() => jest.advanceTimersByTime(250));

    const item = await screen.findByText(/ShowZ/i);
    expect(item).toBeVisible();

    fireEvent.click(item);
    expect(pushMock).toHaveBeenCalledWith('/tv/20');
  });

  it('clearing the input triggers the empty-value branch and closes dropdown', async () => {
    // First populate dropdown
    const mockJson = { movies: [{ id: 1, title: 'M1', popularity: 1 }], tv: [] };
    (global as any).fetch = jest.fn().mockResolvedValueOnce({ ok: true, json: async () => mockJson } as any);

    renderWithProviders(<SearchBox user={null} />);
    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'M1' } });
  act(() => jest.advanceTimersByTime(250));

    // ensure item rendered
    await screen.findByText(/M1/i);

    // now clear input — call change to empty string which should trigger the early return branch
    fireEvent.change(input, { target: { value: '' } });
    jest.advanceTimersByTime(250);

    await waitFor(() => {
      expect(screen.queryByText(/M1/i)).toBeNull();
    });
  });
});
