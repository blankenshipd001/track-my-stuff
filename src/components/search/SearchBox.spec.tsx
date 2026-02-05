import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

// Mock next/image for safety (SearchBox uses img tags for thumbnails)
jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

// Mock notification hook
jest.mock('@/components/notifications/useNotificationBar', () => () => ({ enqueueNotificationBar: jest.fn(), NotificationBarComponent: null }));

// Mock content API to avoid firebase/client import side-effects
jest.mock('@/utils/api/contentApi', () => ({ addToWatchList: jest.fn() }));

// Mock next/navigation so useRouter is available in tests
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: jest.fn() }),
  useServerInsertedHTML: jest.fn((callback) => callback()),
}));

import { SearchBox } from './SearchBox';

describe('SearchBox basic behavior', () => {
  it('shows clear button when typing and clears on click', async () => {
    renderWithProviders(<SearchBox user={null} />);

    const input = screen.getByPlaceholderText('Search title...');
    fireEvent.change(input, { target: { value: 'batman' } });

    // the clear icon should appear
    const clear = await screen.findByLabelText('clear');
    expect(clear).toBeVisible();

    fireEvent.click(clear);
    expect((input as HTMLInputElement).value).toBe('');
  });
});
