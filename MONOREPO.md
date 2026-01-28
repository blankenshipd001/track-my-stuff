# Monorepo Structure

This repository contains both the web and mobile applications for the Movies Tracker project.

## Structure

```
.
├── src/                    # Next.js web app
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   ├── lib/              # Utilities & Firebase
│   └── hooks/            # React hooks
├── mobile/                # React Native mobile app (Expo)
│   ├── app/              # Expo Router (file-based routing)
│   ├── constants/        # Theme & config
│   ├── contexts/         # React contexts
│   └── utils/            # Mobile utilities
├── shared/                # Code shared between web & mobile
│   ├── data-models/      # TypeScript interfaces
│   ├── hooks/            # Shared React hooks
│   ├── utils/            # Shared utilities
│   └── config/           # Shared configuration
└── public/               # Static assets (web)
```

## Key Design Decisions

### 1. Code Sharing

- **Types & Interfaces**: Defined once in `/shared/data-models`
- **Utilities**: Image URL builders, helpers in `/shared/utils`
- **Hooks**: Can be shared between web and mobile
- **API Layer**: Mobile calls Next.js API routes (no duplication)

### 2. Technology Choices

**Web App**:
- Next.js 16 with App Router
- Material-UI (MUI)
- Tailwind CSS
- Server & Client Components

**Mobile App**:
- React Native with Expo
- Expo Router (similar to Next.js App Router)
- React Native Paper (Material Design)
- Tab-based navigation

### 3. Authentication

Both apps use Firebase Authentication:
- Web: Firebase client + Next.js API routes for session management
- Mobile: Firebase client + calls to Next.js session API

### 4. API Strategy

The mobile app doesn't duplicate backend logic. Instead, it calls the existing Next.js API routes:

```
Mobile App → Next.js API Routes → TMDB/Firebase
```

Benefits:
- Single source of truth
- No API key management in mobile app
- Consistent business logic
- Easier to maintain

### 5. Styling

- **Web**: Custom purple theme (#782FEF) with Tailwind + MUI
- **Mobile**: Matching purple theme with React Native Paper
- Dark mode by default on both platforms

## Development Workflow

### 1. Running Both Apps

```bash
# Terminal 1 - Web app
npm run dev

# Terminal 2 - Mobile app
npm run mobile
```

### 2. Adding Features

When adding a new feature:

1. **Define types** in `/shared/data-models` if needed
2. **Create API route** in `/src/app/api/` for backend logic
3. **Build web UI** in `/src/app/` or `/src/components/`
4. **Build mobile UI** in `/mobile/app/`
5. **Share utilities** in `/shared/utils/` when applicable

### 3. Testing

```bash
# Web tests
npm test

# Mobile tests (when added)
cd mobile && npm test
```

## Environment Variables

### Web (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Mobile (mobile/.env)
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Deployment

### Web
- Deploy to Vercel (or any Next.js host)
- Configured via `vercel.json` or Vercel dashboard

### Mobile
- Use EAS (Expo Application Services) for building
- Publish to App Store and Google Play Store

```bash
# Build for production
cd mobile
npx eas build --platform all
```

## Future Enhancements

- [ ] Shared API client library
- [ ] Shared state management (if needed)
- [ ] Shared testing utilities
- [ ] Shared design tokens
- [ ] Shared component library (platform-agnostic)
