import React from 'react';
import { renderWithProviders, screen, fireEvent } from '@/utils/test-utils';

// Stub child components to focus on DetailsPage behavior (episodes toggles)
jest.mock('./details-header', () => (props: any) => <div data-testid="header">HeaderStub</div>);
jest.mock('./details-media', () => (props: any) => <div data-testid="media">MediaStub</div>);
jest.mock('./details-media-gallery', () => (props: any) => <div data-testid="gallery">GalleryStub</div>);
jest.mock('./details-recommended', () => (props: any) => <div data-testid="recommended">RecommendedStub</div>);

import DetailsPage from './details-page';

describe('DetailsPage', () => {
  it('renders episodes grouped by season and toggles selection', () => {
    const media = {
      id: 1,
      title: 'Show',
      episodes: [
        {
          season_number: 1,
          episodes: [
            { id: 11, episode_number: 1, name: 'S1E1', overview: 'Overview 1' },
            { id: 12, episode_number: 2, name: 'S1E2', overview: 'Overview 2' },
          ],
        },
        {
          season_number: 2,
          episodes: [
            { id: 21, episode_number: 1, name: 'S2E1', overview: 'Overview A' },
          ],
        },
      ],
    } as any;

    renderWithProviders(<DetailsPage user={null} media={media} recommended={[]} isTv={true} />);

    // Header and media stubs present
    expect(screen.getByTestId('header')).toBeVisible();
    expect(screen.getByTestId('media')).toBeVisible();

    // By default the first season is selected and its episodes are shown
    expect(screen.getByText(/Episode 1:/i)).toBeVisible();
    expect(screen.getByText(/S1E1/i)).toBeVisible();

    // Click season 2 toggle
    const season2Btn = screen.getByRole('button', { name: '2' });
    fireEvent.click(season2Btn);

    // Now season 2 episode should be visible
    expect(screen.getByText(/S2E1/i)).toBeVisible();
  });
});
