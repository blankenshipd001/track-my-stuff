import { renderHook, waitFor, act } from '@testing-library/react';
import useGetMyFavoriteProviders from './useGetMyFavoriteProviders';
import { getMyFavoriteProviders } from '@/utils/api/contentApi';

jest.mock('@/utils/api/contentApi', () => ({
  getMyFavoriteProviders: jest.fn(),
}));

describe('useGetMyFavoriteProviders', () => {
  const mockProviders = [
    { provider_id: 1, provider_name: 'Netflix', logo_path: '/logo1.jpg' },
    { provider_id: 2, provider_name: 'Hulu', logo_path: '/logo2.jpg' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state and empty providers', () => {
    (getMyFavoriteProviders as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 0))
    );
    
    const { result } = renderHook(() => useGetMyFavoriteProviders('user123'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.myFavoriteProviders).toEqual([]);
  });

  it('should fetch providers when uid is provided', async () => {
    (getMyFavoriteProviders as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProviders), 0))
    );

    const { result } = renderHook(() => useGetMyFavoriteProviders('user123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.myFavoriteProviders).toEqual(mockProviders);
    expect(getMyFavoriteProviders).toHaveBeenCalledWith('user123');
  });

  it('should not fetch when uid is empty', async () => {
    const { result } = renderHook(() => useGetMyFavoriteProviders(''));

    // Should remain in initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.myFavoriteProviders).toEqual([]);
    expect(getMyFavoriteProviders).not.toHaveBeenCalled();
  });

  it('should refetch when uid changes', async () => {
    (getMyFavoriteProviders as jest.Mock)
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve([mockProviders[0]]), 0))
      )
      .mockImplementationOnce(
        () => new Promise(resolve => setTimeout(() => resolve([mockProviders[1]]), 0))
      );

    const { result, rerender } = renderHook(
      ({ uid }) => useGetMyFavoriteProviders(uid),
      { initialProps: { uid: 'user123' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.myFavoriteProviders).toEqual([mockProviders[0]]);
    expect(getMyFavoriteProviders).toHaveBeenCalledWith('user123');

    // Change uid
    rerender({ uid: 'user456' });

    // Should start loading again
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.myFavoriteProviders).toEqual([mockProviders[1]]);
    expect(getMyFavoriteProviders).toHaveBeenCalledWith('user456');
    expect(getMyFavoriteProviders).toHaveBeenCalledTimes(2);
  });

  it('should not refetch when uid remains the same', async () => {
    (getMyFavoriteProviders as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProviders), 0))
    );

    const { result, rerender } = renderHook(
      ({ uid }) => useGetMyFavoriteProviders(uid),
      { initialProps: { uid: 'user123' } }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(getMyFavoriteProviders).toHaveBeenCalledTimes(1);

    // Rerender with same uid
    rerender({ uid: 'user123' });

    // Should not fetch again
    expect(getMyFavoriteProviders).toHaveBeenCalledTimes(1);
  });

  it('should handle empty providers array', async () => {
    (getMyFavoriteProviders as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 0))
    );

    const { result } = renderHook(() => useGetMyFavoriteProviders('user123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.myFavoriteProviders).toEqual([]);
  });

  it('should set loading state correctly during fetch', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    (getMyFavoriteProviders as jest.Mock).mockReturnValue(promise);

    const { result } = renderHook(() => useGetMyFavoriteProviders('user123'));

    // Should be loading
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    act(() => {
      resolvePromise!(mockProviders);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.myFavoriteProviders).toEqual(mockProviders);
  });

  it('should transition from empty uid to valid uid', async () => {
    (getMyFavoriteProviders as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProviders), 0))
    );

    const { result, rerender } = renderHook(
      ({ uid }) => useGetMyFavoriteProviders(uid),
      { initialProps: { uid: '' } }
    );

    // Should not fetch with empty uid
    expect(getMyFavoriteProviders).not.toHaveBeenCalled();

    // Update to valid uid
    rerender({ uid: 'user123' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.myFavoriteProviders).toEqual(mockProviders);
    expect(getMyFavoriteProviders).toHaveBeenCalledWith('user123');
  });
});
