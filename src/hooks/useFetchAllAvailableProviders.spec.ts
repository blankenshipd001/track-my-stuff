import { renderHook, waitFor } from '@testing-library/react';
import useFetchAllAvailableProviders from './useFetchAllAvailableProviders';

// Mock fetch
global.fetch = jest.fn();

describe('useFetchAllAvailableProviders', () => {
  const mockResponse = {
    movies: [
      { provider_id: 1, provider_name: 'Netflix', logo_path: '/logo1.jpg' },
      { provider_id: 2, provider_name: 'Hulu', logo_path: '/logo2.jpg' },
    ],
    tv: [
      { provider_id: 1, provider_name: 'Netflix', logo_path: '/logo1.jpg' },
      { provider_id: 3, provider_name: 'Disney+', logo_path: '/logo3.jpg' },
    ],
    all: [
      { provider_id: 1, provider_name: 'Netflix', logo_path: '/logo1.jpg' },
      { provider_id: 2, provider_name: 'Hulu', logo_path: '/logo2.jpg' },
      { provider_id: 3, provider_name: 'Disney+', logo_path: '/logo3.jpg' },
    ],
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch providers on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useFetchAllAvailableProviders());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
    expect(result.current.allProviders).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.moviesContent).toEqual(mockResponse.movies);
    expect(result.current.tvContent).toEqual(mockResponse.tv);
    expect(result.current.allProviders).toEqual(mockResponse.all);
    expect(global.fetch).toHaveBeenCalledWith('/api/providers');
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useFetchAllAvailableProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
    expect(result.current.allProviders).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useFetchAllAvailableProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
    expect(result.current.allProviders).toEqual([]);
  });

  it('should handle missing data in response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useFetchAllAvailableProviders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
    expect(result.current.allProviders).toEqual([]);
  });

  it('should only fetch once on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const { rerender } = renderHook(() => useFetchAllAvailableProviders());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Rerender shouldn't cause another fetch
    rerender();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
