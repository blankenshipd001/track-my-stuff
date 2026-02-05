import '@testing-library/jest-dom';

/* global jest */

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useServerInsertedHTML: jest.fn((callback) => {
    // In test environment, just call the callback to prevent SSR issues
    callback();
  }),
}));