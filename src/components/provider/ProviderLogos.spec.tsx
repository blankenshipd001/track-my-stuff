import React from 'react';
import { renderWithProviders, screen } from '@/utils/test-utils';

// Mock next/image to render a real img element
jest.mock('next/image', () => (props: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={props.alt} />;
});

import { ProviderLogos } from './ProviderLogos';

describe('ProviderLogos', () => {
  it('renders images for providers with logo_path', () => {
    const list = [
      { provider_name: 'One', logo_path: '/logo1.png' },
      { provider_name: 'Two' },
    ] as any;

    renderWithProviders(<ProviderLogos list={list} />);

    // only one image is provided
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBe(1);
    expect(imgs[0]).toHaveAttribute('src');
  });
});
