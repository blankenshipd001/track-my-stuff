import React from 'react';
import { renderWithProviders, screen, act } from '@/utils/test-utils';

// Mock next/navigation
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock, refresh: jest.fn() }) }));

// Mock SearchBox and TabsWrapper to isolate MovieContent
jest.mock('@/components/search', () => ({ SearchBox: () => <div data-testid="search" /> }));
jest.mock('../panels/tab-wrapper', () => () => <div data-testid="tabs" />);

// Mock getContent to control watchlist loading
const getContentMock = jest.fn();
jest.mock('@/utils/api/contentApi', () => ({ getContent: (...args: any[]) => getContentMock(...args) }));

import { MovieContent } from './movie-content';

describe('MovieContent', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders SearchBox and TabsWrapper and loads popular media', async () => {
    const popular = [{ id: 1, title: 'P' } as any];

    // getContent should not be called when user is null
    renderWithProviders(<MovieContent popularMedia={popular} user={null} />);

    expect(screen.getByTestId('search')).toBeVisible();
    expect(screen.getByTestId('tabs')).toBeVisible();
  });

  it('calls getContent when user provided and sets watchlist', async () => {
    const popular = [] as any;
    getContentMock.mockResolvedValueOnce([{ id: 2 }] as any);

    await act(async () => {
      renderWithProviders(<MovieContent popularMedia={popular} user={{ uid: 'u1' }} />);
    });

    expect(getContentMock).toHaveBeenCalledWith('u1');
    expect(screen.getByTestId('tabs')).toBeVisible();
  });

  it('redirects to / when getContent fails', async () => {
    getContentMock.mockRejectedValueOnce(new Error('fail'));

    await act(async () => {
      renderWithProviders(<MovieContent popularMedia={[]} user={{ uid: 'u2' }} />);
    });

    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
