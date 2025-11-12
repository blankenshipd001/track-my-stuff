import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

// Mock next/image so tests render predictably
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

// Mock ProviderLogos to a simple stub so MediaGrid test focuses on layout/flow
jest.mock('../provider/ProviderLogos', () => ({
  ProviderLogos: ({ list }: any) => <div data-testid="provider-logos">{String(list?.length)}</div>,
}));

// Mock content API to avoid importing firebase/client which expects fetch in node
jest.mock('@/utils/api/contentApi', () => ({ requestRemoveFromWatchList: jest.fn() }));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock, refresh: jest.fn() }) }));

// Mock notification hook
jest.mock('@/components/notifications/useNotificationBar', () => () => ({
  enqueueNotificationBar: jest.fn(),
  NotificationBarComponent: null,
}));

import { MediaGrid } from './media-grid';

describe('MediaGrid', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders movies and provider logos when provided', () => {
    const movie = {
      id: 1,
      movieId: 1,
      poster_path: '/path.jpg',
      title: 'My Movie',
      providers: { flatrate: [{ provider_name: 'P', logo_path: '/logo.png' }] },
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={{ uid: 'u1' }} />);

    // Image component renders an <img> due to our mock; find by alt/title
    expect(screen.getByAltText(/My Movie/i)).toBeVisible();

    // Provider logos stub should be present
    expect(screen.getByTestId('provider-logos')).toBeVisible();
  });

  it('navigates to the movie page when image is clicked', () => {
    const movie = {
      id: 2,
      movieId: 42,
      poster_path: '/p.jpg',
      title: 'Movie Click',
    } as any;

    renderWithProviders(<MediaGrid movies={[movie]} user={null} />);

    fireEvent.click(screen.getByAltText(/Movie Click/i));
    expect(pushMock).toHaveBeenCalledWith('/movies/42', { scroll: false });
  });
});
