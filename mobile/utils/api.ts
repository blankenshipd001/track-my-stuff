// API utilities for calling Next.js backend
import { API_ENDPOINTS } from '@/constants/config';
import { Media } from '@shared/data-models/media.interface';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Fetch popular content
export async function fetchPopularContent(): Promise<ApiResponse<Media[]>> {
  try {
    const response = await fetch(API_ENDPOINTS.POPULAR);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching popular content:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fetch watchlist
export async function fetchWatchlist(userId: string): Promise<ApiResponse<Media[]>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.WATCHLIST}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Add to watchlist
export async function addToWatchlist(media: Media, userId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(API_ENDPOINTS.WATCHLIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ media, userId }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {};
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Remove from watchlist
export async function removeFromWatchlist(mediaId: string, userId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.WATCHLIST}?mediaId=${mediaId}&userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {};
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Search content
export async function searchContent(query: string): Promise<ApiResponse<Media[]>> {
  try {
    console.log('🔍 Searching for:', query);
    const url = `${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`;
    console.log('📡 API URL:', url);
    
    const response = await fetch(url);
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('📦 API Response:', JSON.stringify(result, null, 2));
    
    // API returns {movies, tv, all} - we want all results combined
    const data = result.all || [];
    console.log('✅ Returning', data.length, 'results');
    
    return { data };
  } catch (error) {
    console.error('❌ Error searching content:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Fetch movie/TV details
export async function fetchMediaDetails(id: string, type: 'movie' | 'tv'): Promise<ApiResponse<Media>> {
  try {
    const endpoint = type === 'movie' ? API_ENDPOINTS.MOVIE(id) : API_ENDPOINTS.TV(id);
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error fetching media details:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
