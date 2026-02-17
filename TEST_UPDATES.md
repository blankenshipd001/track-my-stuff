# Test Updates Summary

This document outlines all the test updates made to support the recent component refactoring and new features.

## Overview

The following changes were made to align tests with the refactored components:
- Replaced deprecated `addClicked` and `removeClicked` props with direct `onAdd`/`onRemove` callbacks
- Updated to use new `WatchlistFlipCard` component with flip functionality
- Added mocks for `framer-motion` to simplify animation testing
- Updated alt text expectations to match new image alt text format
- Added proper accessibility testing (ARIA labels, keyboard navigation)

---

## Files Updated

### 1. Media Grid Core Tests
**File:** `src/components/media/media-grid.spec.tsx`

**Changes:**
- Updated to work with new WatchlistFlipCard component rendering
- Removed old ImageListItem structure expectations
- Added framer-motion mock to prevent animation errors
- Updated image alt text pattern from `/My Movie/i` to `/My Movie movie poster/i`
- Simplified test expectations focused on component behavior rather than DOM structure

**Key Updates:**
- ✅ Mock framer-motion to avoid animation complexity
- ✅ Test flip card rendering instead of old ImageListItemBar
- ✅ Verify pagination "Load More" button appears
- ✅ Test accessibility by finding buttons by accessible names

### 2. Media Grid Branches Tests
**File:** `src/components/media/media-grid.branches.spec.tsx`

**Changes:**
- Removed old `addClicked` and `removeClicked` prop tests
- Updated to use new callback-based API with `onAdd`/`onRemove`
- Added movie title to test objects to prevent undefined alt text
- Updated button finding logic to use accessible button roles

**Key Updates:**
- ✅ Test remove button via accessibility role
- ✅ TV show handling with proper title attributes
- ✅ Regular movie addition workflow
- ✅ Watchlist ID fetching on mount

### 3. Media Grid Branches 2 Tests
**File:** `src/components/media/media-grid.branches2.spec.tsx`

**Changes:**
- Migrated from old callback props to new API
- Fixed TV show test to include `title` property
- Updated assertions to work with new component structure
- Added proper fetch mocking for TV show details

**Key Updates:**
- ✅ TV show addition with proper title
- ✅ Remove functionality with success notification
- ✅ Router refresh verification

### 4. New WatchlistFlipCard Tests
**File:** `src/components/media/watchlist-flip-card.spec.tsx` (NEW)

**Type:** Comprehensive component test suite

**Test Coverage:**
- ✅ Renders poster image on initial load
- ✅ Has proper keyboard navigation support (tabIndex, aria-pressed, aria-label)
- ✅ Flips card when Enter key pressed
- ✅ Flips card when Space key pressed
- ✅ Unflips card when Escape key pressed
- ✅ Calls onNavigate when info button clicked
- ✅ Calls onRemove when remove button clicked
- ✅ Calls onAdd when add button clicked
- ✅ Has proper focus styles
- ✅ Displays provider logos on back
- ✅ Shows "Not available" for no providers
- ✅ Has proper accessibility labels

**Key Testing Patterns:**
```typescript
// Keyboard navigation
fireEvent.keyDown(card!, { key: 'Enter' });

// Button accessibility
const removeBtn = screen.getByRole('button', { name: /remove.*watchlist/i });

// Focus management
fireEvent.focus(card!);
```

---

## Mock Updates

### Framer Motion
All media grid and flip card tests now mock framer-motion to simplify testing:
```typescript
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));
```

### API Mocks
Updated to use `getContent` mock consistently across all tests:
```typescript
jest.mock('@/utils/api/contentApi', () => ({
  requestRemoveFromWatchList: jest.fn(),
  getContent: jest.fn(() => Promise.resolve([])),
}));
```

---

## Accessibility Improvements Tested

### 1. Keyboard Navigation
- ✅ Tab to focus elements
- ✅ Enter/Space to activate
- ✅ Escape to close/reset

### 2. ARIA Labels
- ✅ `aria-label` on all buttons
- ✅ `aria-pressed` on flip cards
- ✅ `aria-label` for movie titles

### 3. Focus Visible
- ✅ Focus styles verified with outline
- ✅ Focus state properly managed

### 4. Alt Text
- ✅ Images have descriptive alt text
- ✅ Format: `{title} movie poster - {year}`

---

## Migration Guide

### Old API → New API

**Before:**
```typescript
<MediaGrid 
  movies={[movie]} 
  addClicked={handleAdd}
  removeClicked={handleRemove}
/>
```

**After:**
```typescript
<MediaGrid 
  movies={[movie]} 
  user={{ uid: 'u1' }}
  isWatchlist={false}
/>
```

**Test Pattern Changes:**
- Remove mocks for `addClicked` and `removeClicked`
- Use `screen.getByRole('button', { name: /add.*watchlist/i })`
- Import and use accessibility-first query methods

---

## Test Execution

### Run All Tests
```bash
npm run test
```

### Run Media Grid Tests Only
```bash
npm run test -- media-grid --no-coverage
```

### Run WatchlistFlipCard Tests Only
```bash
npm run test -- watchlist-flip-card --no-coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

---

## Common Test Patterns

### Waiting for Async Rendering
```typescript
await waitFor(() => {
  expect(screen.getByAltText(/Test movie poster/i)).toBeVisible();
});
```

### Keyboard Event Testing
```typescript
const card = container.querySelector('[role="button"]');
fireEvent.keyDown(card!, { key: 'Enter' });
```

### Button Finding by Accessibility
```typescript
const removeBtn = screen.getByRole('button', { name: /remove.*watchlist/i });
fireEvent.click(removeBtn);
```

### Verifying Notifications
```typescript
await waitFor(() => {
  expect(enqueueMock).toHaveBeenCalledWith('Removed from your watch list!', 'success');
});
```

---

## Known Test Considerations

### 1. Animation Mocking
Framer-motion animations are mocked to prevent delays in tests. This means:
- No actual flip animation timing
- `.animate` and `.initial` props are preserved but not executed

### 2. Image Mocking
Next Image component is mocked to render a simple `<img>` tag:
- Prevents layout issues in test environment
- Preserves alt text for accessibility testing

### 3. Provider Logos Mock
ProviderLogos component is stub-mocked to:
- Avoid complex rendering logic
- Allow provider list length verification
- Keep tests focused on MediaGrid logic

### 4. Notification Bar
NotificationBarComponent is mocked to `null` in most tests:
- Tests call `enqueueNotificationBar` directly
- Real notification rendering tested separately if needed

---

## Next Steps

### Tests Not Yet Updated (Out of Scope)
- `src/components/search/SearchBox.spec.tsx` - May need updates if search uses MediaGrid
- `src/components/details/*` - Independent component tests
- `src/components/header/*` - Header tests remain unchanged

### Recommended Future Updates
1. Create test for SkipLink component (new accessibility feature)
2. Create integration test for activity page pagination
3. Add performance tests for pagination performance
4. Add tests for ARIA live regions in notifications

---

## Verification Checklist

- ✅ Media grid tests updated and passing
- ✅ WatchlistFlipCard tests created with comprehensive coverage
- ✅ Branch coverage tests working with new component API
- ✅ Accessibility features properly tested
- ✅ Mock structure consistent across all tests
- ✅ Alt text and ARIA labels verified
- ✅ Keyboard navigation tested
- ✅ Focus management verified

---

## Contact & Questions

If you encounter test failures:
1. Check the error message for specific element queries
2. Verify mock setup matches current code structure
3. Ensure movie test objects have required properties (id, movieId, poster_path, title)
4. Check that framer-motion and provider-logos mocks are in place

For additional context, see:
- `IMPLEMENTATION_EXAMPLES.md` - Implementation details
- `PERFORMANCE_AUDIT.md` - Architecture changes
- `TESTING_VERIFICATION.md` - Testing best practices
