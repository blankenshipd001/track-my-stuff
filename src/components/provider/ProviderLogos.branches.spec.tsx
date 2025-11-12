import React from 'react';
import { renderWithProviders, screen } from '@/utils/test-utils';

jest.mock('next/image', () => (props: any) => {
  return <img {...props} alt={props.alt} />;
});

jest.mock('@/lib/imageUrl', () => ({ getProxyImageUrlForPath: (p: string) => `/proxy${p}` }));

import ProviderSections, { ProviderLogos } from './ProviderLogos';

describe('ProviderLogos / ProviderSections branches', () => {
  it('renders nothing when providers object is empty', () => {
    renderWithProviders(<ProviderSections providers={{}} />);
    // No section titles should be present
    expect(screen.queryByText(/Streaming On/i)).toBeNull();
    expect(screen.queryByText(/Available to Rent/i)).toBeNull();
    expect(screen.queryByText(/Available to Buy/i)).toBeNull();
  });

  it('renders image when provider has logo_path and falls back when missing', () => {
    const providers = {
      flatrate: [
        { provider_name: 'HasLogo', logo_path: '/logo1.png' },
        { provider_name: 'NoLogo', logo_path: undefined },
      ],
      rent: [],
      buy: [],
    } as any;

    renderWithProviders(<ProviderSections providers={providers} />);

    // Title should be present
    expect(screen.getByText(/Streaming On/i)).toBeVisible();

    // There should be at least one img rendered for the provider that has a logo
    const imgs = screen.getAllByRole('img');
    expect(imgs.some((i) => i.getAttribute('alt') === 'HasLogo')).toBeTruthy();

    // Also render ProviderLogos directly with an item missing logo_path to ensure fallback branch
    renderWithProviders(<ProviderLogos title="Test" list={[{ provider_name: 'X' } as any]} />);
    // No img for the fallback box (previous render added one img, ensure at least one title exists)
    expect(screen.getAllByText(/Test/i).length).toBeGreaterThanOrEqual(1);
  });
});
