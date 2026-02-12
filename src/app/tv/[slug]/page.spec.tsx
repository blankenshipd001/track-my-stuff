import React from 'react';
import { screen } from '@testing-library/react';

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
  verifySessionToken: jest.fn(async () => ({ uid: 'user-1' }))
}));

// Mock API functions
const mockGetTVDetails = jest.fn();
const mockGetRecommendedTV = jest.fn();
const mockFetchPopularTV = jest.fn();
jest.mock('@/utils/api/serverContentApi', () => ({
  getTVDetails: (...args: any[]) => mockGetTVDetails(...args),
  getRecommendedTV: (...args: any[]) => mockGetRecommendedTV(...args),
  fetchPopularTV: (...args: any[]) => mockFetchPopularTV(...args),
}));

// Mock MUI components
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Box: ({ children, sx, ...props }: any) => <div {...props}>{children}</div>,
  };
});

import { getTVDetails, getRecommendedTV } from '@/utils/api/serverContentApi';

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
    
    mockGetTVDetails.mockResolvedValueOnce(mockTV);
    
    const result = await getTVDetails('123');
    
    expect(mockGetTVDetails).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockTV);
  });

  it('should fetch recommended TV correctly', async () => {
    const mockRecommended = [
      { id: 999, name: 'Recommended Show' }
    ];
    
    mockGetRecommendedTV.mockResolvedValueOnce(mockRecommended);
    
    const result = await getRecommendedTV(10);
    
    expect(mockGetRecommendedTV).toHaveBeenCalledWith(10);
    expect(result).toEqual(mockRecommended);
  });

  it('should return null when TV details are not found', async () => {
    mockGetTVDetails.mockResolvedValueOnce(null);
    
    const result = await getTVDetails('missing');
    
    expect(mockGetTVDetails).toHaveBeenCalledWith('missing');
    expect(result).toBeNull();
  });

  it('should handle TV show with no genres', async () => {
    const mockTV = {
      id: 456,
      name: 'Show Without Genre',
      genres: [],
      first_air_date: '2021-01-01',
      overview: 'No genre'
    };
    
    mockGetTVDetails.mockResolvedValueOnce(mockTV);
    mockGetRecommendedTV.mockResolvedValueOnce([]);
    
    const tv = await getTVDetails('456');
    const recommended = await getRecommendedTV(tv?.genres?.[0]?.id || 0);
    
    expect(tv).toEqual(mockTV);
    expect(recommended).toEqual([]);
    expect(mockGetRecommendedTV).toHaveBeenCalledWith(0);
  });
});
