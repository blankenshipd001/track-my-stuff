// API Configuration
// These should point to your Next.js API routes

// For local development
// iOS Simulator can use localhost, physical devices need the computer's IP
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' // Works for iOS Simulator
  : 'https://your-production-url.com';

export const API_ENDPOINTS = {
  // Auth
  SESSION: `${API_BASE_URL}/api/session`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  
  // Content
  POPULAR: `${API_BASE_URL}/api/popular`,
  SEARCH: `${API_BASE_URL}/api/search`,
  MOVIE: (id: string) => `${API_BASE_URL}/api/movie/${id}`,
  TV: (id: string) => `${API_BASE_URL}/api/tv/${id}`,
  
  // Watchlist
  WATCHLIST: `${API_BASE_URL}/api/watchlist`,
  
  // Providers
  PROVIDERS: `${API_BASE_URL}/api/providers`,
};

// Firebase config - uses environment variables
export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
