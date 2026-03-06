import React from 'react';
import { renderWithProviders, screen } from '@/utils/test-utils';

// Mock SearchBox and TabsWrapper to isolate MovieContent
jest.mock('@/components/search', () => ({ SearchBox: () => <div data-testid="search" /> }));
const tabsWrapperMock = jest.fn(() => <div data-testid="tabs" />);
jest.mock('../panels/tab-wrapper', () => ({
  __esModule: true,
  default: (props: any) => tabsWrapperMock(props),
}));

import { MovieContent } from './movie-content';

describe('MovieContent', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders SearchBox and TabsWrapper and loads popular media', async () => {
    const popular = [{ id: 1, title: 'P' } as any];

    // getContent should not be called when user is null
    renderWithProviders(<MovieContent popularMedia={popular} user={null} />);

    expect(screen.getByTestId('search')).toBeVisible();
    expect(screen.getByTestId('tabs')).toBeVisible();
    expect(tabsWrapperMock).toHaveBeenCalledWith(
      expect.objectContaining({
        user: null,
        allContent: popular,
        watchList: [],
      })
    );
  });

  it('passes initial watchlist to TabsWrapper when user is provided', () => {
    const popular = [{ id: 1, title: 'Popular' }] as any;
    const watchList = [{ id: 2, title: 'Saved' }] as any;

    renderWithProviders(
      <MovieContent popularMedia={popular} user={{ uid: 'u1' } as any} initialWatchList={watchList} />
    );

    expect(screen.getByTestId('tabs')).toBeVisible();
    expect(tabsWrapperMock).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ uid: 'u1' }),
        allContent: popular,
        watchList,
      })
    );
  });

  it('defaults watchlist to an empty array when initialWatchList is omitted', () => {
    renderWithProviders(<MovieContent popularMedia={[]} user={{ uid: 'u2' } as any} />);

    expect(tabsWrapperMock).toHaveBeenCalledWith(
      expect.objectContaining({ watchList: [] })
    );
  });
});
