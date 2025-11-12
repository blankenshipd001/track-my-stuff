import React from 'react';
import { renderWithProviders, screen } from '@/utils/test-utils';

// Mock server helpers and Details component
jest.mock('@/lib/getCookieHeader', () => jest.fn(async () => 'cookie-header'));
jest.mock('@/lib/firebase/auth', () => ({
  verifySessionToken: jest.fn(async () => ({ uid: 'user-1' }))
}));

const mockGetTVDetails = jest.fn();
const mockGetRecommendedTV = jest.fn();
jest.mock('@/utils/api/serverContentApi', () => ({
  getTVDetails: (...args: any[]) => mockGetTVDetails(...args),
  getRecommendedTV: (...args: any[]) => mockGetRecommendedTV(...args),
}));

// Replace the real Details component with a lightweight stub that renders props as JSON
jest.mock('@/components/details/details-page', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="details">{JSON.stringify(props)}</div>
}));

import TVDetailsPage from './page';

describe('TV details page (server component)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a not-found message when no TV show is returned', async () => {
    mockGetTVDetails.mockResolvedValueOnce(null);
    mockGetRecommendedTV.mockResolvedValueOnce([]);

    const element = await TVDetailsPage({ params: { slug: 'missing' } });
    renderWithProviders(element as any);

    expect(screen.getByText(/TV Show not found/i)).toBeVisible();
  });

  it('renders the Details component when tv data is present and passes isTv=true', async () => {
    const tv = { id: 123, name: 'Test Show', genres: [{ id: 10 }] };
    const recommended = [{ id: 999 }];

    mockGetTVDetails.mockResolvedValueOnce(tv);
    mockGetRecommendedTV.mockResolvedValueOnce(recommended);

    const element = await TVDetailsPage({ params: { slug: '123' } });
    renderWithProviders(element as any);

    const details = screen.getByTestId('details');
    expect(details).toBeVisible();

    // The stub renders JSON of props; check the important fields are present
    const text = details.textContent || '';
    expect(text).toContain('"isTv":true');
    expect(text).toContain('"media":');
    expect(text).toContain('Test Show');
  });
});
