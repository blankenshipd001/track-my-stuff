import React from 'react';
import { renderWithProviders, screen } from '@/utils/test-utils';

// Mock next/image to a simple img
jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

// Mock ProviderLogos to avoid complex rendering
jest.mock('@/components/provider/ProviderLogos', () => () => <div data-testid="provider-logos" />);

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

  it('renders poster image when poster_path exists (lines 18-29)', () => {
    const media = {
      title: 'My Movie',
      release_date: '2020-05-01',
      poster_path: '/poster123.jpg',
      genres: [],
      overview: 'An overview',
      providers: {},
    } as any;

    renderWithProviders(<DetailsMedia media={media} isTv={false} />);

    const image = screen.getByAltText('My Movie');
    expect(image).toBeVisible();
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '450');
  });

  it('does not render image when poster_path is missing', () => {
    const media = {
      title: 'My Movie',
      release_date: '2020-05-01',
      poster_path: null,
      genres: [],
      overview: 'An overview',
      providers: {},
    } as any;

    renderWithProviders(<DetailsMedia media={media} isTv={false} />);

    expect(screen.queryByAltText('image')).not.toBeInTheDocument();
  });

  it('renders TV title with name and first_air_date when isTv is true (lines 33-36)', () => {
    const media = {
      name: 'My Show',
      first_air_date: '2021-06-15',
      poster_path: null,
      genres: [],
      overview: 'A TV overview',
      providers: {},
    } as any;

    renderWithProviders(<DetailsMedia media={media} isTv={true} />);

    expect(screen.getByText(/My Show \(2021\)/i)).toBeVisible();
  });

  it('renders movie title with title and release_date when isTv is false (lines 38-41)', () => {
    const media = {
      title: 'My Movie',
      release_date: '2020-05-01',
      poster_path: null,
      genres: [],
      overview: 'A movie overview',
      providers: {},
    } as any;

    renderWithProviders(<DetailsMedia media={media} isTv={false} />);

    expect(screen.getByText(/My Movie \(2020\)/i)).toBeVisible();
  });
});
