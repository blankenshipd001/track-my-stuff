import React from 'react';
import { renderWithProviders, screen } from '@/utils/test-utils';

// Mock next/image to a simple img
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

// Mock ProviderLogos to avoid complex rendering
jest.mock('@/components/provider/ProviderLogos', () => (props: any) => <div data-testid="provider-logos" />);

import DetailsMedia from './details-media';

describe('DetailsMedia', () => {
  it('renders title, genres, overview and provider logos for movie', () => {
    const media = {
      title: 'My Movie',
      release_date: '2020-05-01',
      poster_path: '/p.jpg',
      genres: [{ id: 1, name: 'Action' }],
      overview: 'An overview',
      providers: { flatrate: [{ provider_name: 'P' }] },
    } as any;

    renderWithProviders(<DetailsMedia media={media} isTv={false} />);

    expect(screen.getByText(/My Movie \(2020\)/i)).toBeVisible();
    expect(screen.getByText(/Action/i)).toBeVisible();
    expect(screen.getByText(/An overview/i)).toBeVisible();
    expect(screen.getByTestId('provider-logos')).toBeVisible();
  });
});
