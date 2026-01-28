# Shared Code

This directory contains code shared between the Next.js web app and the React Native mobile app.

## Structure

- `/data-models` - TypeScript interfaces and types for movies, TV shows, users, etc.
- `/hooks` - Shared React hooks (can be used in both web and mobile)
- `/utils` - Shared utility functions
- `/config` - Shared configuration (Firebase, API endpoints)
- `/types` - Consolidated type exports

## Usage

### In Web App (Next.js)
```typescript
import { Media } from '@/shared/types';
```

### In Mobile App (React Native/Expo)
```typescript
import { Media } from '../../shared/types';
```
