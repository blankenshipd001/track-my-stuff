import '@testing-library/jest-dom';

/* global jest */

// Suppress the MUI anchorEl warning in tests (false positive in test environment)
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0]?.includes?.('MUI: The `anchorEl` prop provided to the component is invalid')
  ) {
    return;
  }
  originalWarn(...args);
};

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