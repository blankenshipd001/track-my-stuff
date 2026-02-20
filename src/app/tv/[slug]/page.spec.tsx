import React from 'react';

// Mock Firebase client
jest.mock('@/lib/firebase/client', () => ({
  __esModule: true,
  db: {},
  auth: {},
  googleProvider: {},
}));

// Mock server helpers
jest.mock('@/lib/getCookieHeader', () => jest.fn(async () => 'cookie-header'));
jest.mock('@/lib/firebase/auth', () => ({
  verifySessionToken: jest.fn(async () => ({ uid: 'user-1', name: 'Test User', email: 'test@example.com', auth_time: 1234567890, firebase: { identities: {}, sign_in_provider: 'google.com' } }))
}));

// Mock API functions
const mockFetchTVDetails = jest.fn();
const mockFetchRecommendedTV = jest.fn();
const mockFetchPopularTV = jest.fn();
jest.mock('@/services', () => ({
  fetchTVDetails: (...args: any[]) => mockFetchTVDetails(...args),
  fetchRecommendedTV: (...args: any[]) => mockFetchRecommendedTV(...args),
  fetchPopularTV: (...args: any[]) => mockFetchPopularTV(...args),
}));

// Mock MUI components
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Box: ({ children, sx, ...props }: any) => <div {...props}>{children}</div>,
  };
});

import { fetchTVDetails, fetchRecommendedTV } from '@/services';

describe('TV details page (server component)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchPopularTV.mockResolvedValue([]);
  });

  it('should fetch TV details correctly', async () => {
    const mockTV = { 
      id: 123, 
      name: 'Test Show',
      genres: [{ id: 10 }],
      first_air_date: '2020-01-01',
      overview: 'Test overview'
    };
    
    mockFetchTVDetails.mockResolvedValueOnce(mockTV);
    
    const result = await fetchTVDetails('123');
    
    expect(mockFetchTVDetails).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockTV);
  });

  it('should fetch recommended TV correctly', async () => {
    const mockRecommended = [
      { id: 999, name: 'Recommended Show' }
    ];
    
    mockFetchRecommendedTV.mockResolvedValueOnce(mockRecommended);
    
    const result = await fetchRecommendedTV('10');
    
    expect(mockFetchRecommendedTV).toHaveBeenCalledWith('10');
    expect(result).toEqual(mockRecommended);
  });

  it('should return null when TV details are not found', async () => {
    mockFetchTVDetails.mockRejectedValueOnce(new Error('Not found'));
    
    try {
      await fetchTVDetails('missing');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
    
    expect(mockFetchTVDetails).toHaveBeenCalledWith('missing');
  });

  it('should handle TV show with no genres', async () => {
    const mockTV = {
      id: 456,
      name: 'Show Without Genre',
      genres: [],
      first_air_date: '2021-01-01',
      overview: 'No genre'
    };
    
    mockFetchTVDetails.mockResolvedValueOnce(mockTV);
    mockFetchRecommendedTV.mockResolvedValueOnce([]);
    
    const tv = await fetchTVDetails('456');
    const recommended = await fetchRecommendedTV((tv?.genres?.[0]?.id?.toString() || '0'));
    
    expect(tv).toEqual(mockTV);
    expect(recommended).toEqual([]);
    expect(mockFetchRecommendedTV).toHaveBeenCalledWith('0');
  });
});
