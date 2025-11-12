import React from 'react';
import { renderWithProviders, screen } from '@/utils/test-utils';

// Mock next/image to a simple img
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

import DetailsMediaGallery from './details-media-gallery';

describe('DetailsMediaGallery', () => {
  it('renders iframes for videos and images for backdrops', () => {
    const media = {
      videos: { results: [{ id: 'v1', key: 'abc', name: 'Trailer' }] },
      images: { backdrops: [{ file_path: '/b1.jpg' }, { file_path: '/b2.jpg' }] },
    } as any;

    renderWithProviders(<DetailsMediaGallery media={media} />);

    // iframe is present for the video
    const iframe = document.querySelector('iframe[title="Trailer"]');
    expect(iframe).toBeTruthy();

    // images rendered as mock <img>
    const imgs = screen.getAllByRole('img');
    // two backdrops
    expect(imgs.length).toBeGreaterThanOrEqual(2);
  });
});
