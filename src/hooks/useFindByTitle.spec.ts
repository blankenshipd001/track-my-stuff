import { renderHook, act, waitFor } from '@testing-library/react';
import { useFindByTitle } from './useFindByTitle';

// Mock fetch
global.fetch = jest.fn();

describe('useFindByTitle', () => {
  const mockResponse = {
    movies: [
      { id: 1, title: 'Test Movie', media_type: 'movie' },
    ],
    tv: [
      { id: 2, name: 'Test TV Show', media_type: 'tv' },
    ],
    all: [
      { id: 1, title: 'Test Movie', media_type: 'movie' },
      { id: 2, name: 'Test TV Show', media_type: 'tv' },
    ],
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should initialize with empty arrays', () => {
    const { result } = renderHook(() => useFindByTitle());

    expect(result.current.allContent).toEqual([]);
    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
    expect(typeof result.current.fetchContent).toBe('function');
  });

  it('should fetch content when fetchContent is called with a search value', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useFindByTitle());

    await act(async () => {
      await result.current.fetchContent('test');
    });

    await waitFor(() => {
      expect(result.current.moviesContent).toEqual(mockResponse.movies);
      expect(result.current.tvContent).toEqual(mockResponse.tv);
      expect(result.current.allContent).toEqual(mockResponse.all);
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/search?q=test');
  });

  it('should encode special characters in search query', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useFindByTitle());

    await act(async () => {
      await result.current.fetchContent('test & special');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/search?q=test%20%26%20special');
  });

  it('should not fetch when search value is empty', async () => {
    const { result } = renderHook(() => useFindByTitle());

    await act(async () => {
      await result.current.fetchContent('');
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useFindByTitle());

    await act(async () => {
      await result.current.fetchContent('test');
    });

    // State should remain unchanged
    expect(result.current.allContent).toEqual([]);
    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useFindByTitle());

    await act(async () => {
      await result.current.fetchContent('test');
    });

    // State should remain unchanged
    expect(result.current.allContent).toEqual([]);
    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
  });

  it('should handle missing data in response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useFindByTitle());

    await act(async () => {
      await result.current.fetchContent('test');
    });

    expect(result.current.allContent).toEqual([]);
    expect(result.current.moviesContent).toEqual([]);
    expect(result.current.tvContent).toEqual([]);
  });

  it('should update state with subsequent searches', async () => {
    const firstResponse = {
      movies: [{ id: 1, title: 'First Movie', media_type: 'movie' }],
      tv: [],
      all: [{ id: 1, title: 'First Movie', media_type: 'movie' }],
    };

    const secondResponse = {
      movies: [{ id: 2, title: 'Second Movie', media_type: 'movie' }],
      tv: [],
      all: [{ id: 2, title: 'Second Movie', media_type: 'movie' }],
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => firstResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => secondResponse,
      });

    const { result } = renderHook(() => useFindByTitle());

    // First search
    await act(async () => {
      await result.current.fetchContent('first');
    });

    await waitFor(() => {
      expect(result.current.moviesContent).toEqual(firstResponse.movies);
    });

    // Second search
    await act(async () => {
      await result.current.fetchContent('second');
    });

    await waitFor(() => {
      expect(result.current.moviesContent).toEqual(secondResponse.movies);
    });
  });
});
