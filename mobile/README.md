# Movies Tracker - Mobile App

React Native mobile application built with Expo, sharing code with the Next.js web app.

## Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing, similar to Next.js App Router)
- **UI Library**: React Native Paper (Material Design)
- **State**: React hooks + Context API
- **Backend**: Calls existing Next.js API routes
- **Shared Code**: Types, utilities, and hooks shared with web app

## Project Structure

```
mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── (auth)/            # Authentication flow
│   │   └── login.tsx      # Login screen
│   ├── (tabs)/            # Main tab navigation
│   │   ├── activity.tsx   # Watchlist/Activity
│   │   ├── search.tsx     # Search movies/TV
│   │   ├── providers.tsx  # Streaming service preferences
│   │   └── profile.tsx    # User profile & settings
│   ├── details/[id].tsx   # Media details (modal)
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Entry point
├── constants/
│   ├── theme.ts           # React Native Paper theme (#782FEF)
│   └── config.ts          # API endpoints & Firebase config
├── contexts/
│   └── AuthContext.tsx    # Firebase auth context
├── utils/
│   └── api.ts             # API utilities for Next.js backend
└── assets/                # Images, icons, etc.
```

## Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

### 3. Update API Configuration

In `constants/config.ts`, update `API_BASE_URL` to point to your Next.js dev server:

- **Local dev**: Use your computer's local IP (e.g., `http://192.168.1.100:3000`)
- **Production**: Use your production URL

**Important**: For physical device testing, you MUST use your computer's IP address, not `localhost`.

## Running the App

### Start Next.js Backend (Required!)

The mobile app calls your Next.js API routes, so the web server must be running:

```bash
# In the root directory
npm run dev
```

### Start Expo

```bash
# In the mobile directory
npm start
```

This opens the Expo Dev Tools. From here you can:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Scan QR code with Expo Go app on your phone

### Platform-Specific Commands

```bash
npm run ios        # Open in iOS Simulator
npm run android    # Open in Android Emulator
npm run web        # Open in web browser
```

## Development Workflow

### 1. Making Changes

Expo uses Fast Refresh - changes appear instantly as you save files.

### 2. Shared Code

Code in `/shared` is used by both web and mobile:

```typescript
// In mobile app
import { Media } from '@shared/data-models/media.interface';
import { buildPosterUrl } from '@shared/utils/imageUrl';
```

### 3. Adding New Routes

Expo Router uses file-based routing like Next.js:

- Create `app/my-route/page.tsx` → `/my-route` route
- Dynamic routes: `app/user/[id].tsx` → `/user/123`
- Layouts: `app/(group)/_layout.tsx` → shared layout

### 4. API Calls

All API calls go through `utils/api.ts`, which calls your Next.js backend:

```typescript
import { searchContent } from '@/utils/api';

const { data, error } = await searchContent('inception');
```

## Features

### ✅ Implemented

- **Authentication**: Firebase auth integration (UI ready, Google Sign-In needs API key setup)
- **Activity/Watchlist**: View and manage your watchlist
- **Search**: Search movies and TV shows
- **Providers**: Select streaming services you subscribe to
- **Details**: View detailed movie/TV information
- **Profile**: User settings and preferences

### 🚧 To Complete

- Google Sign-In integration (requires Firebase setup)
- Real API integration (currently using mock/demo data)
- Provider logo images
- Push notifications for new releases
- Offline support
- App icons and splash screens

## Customization

### Theme

The app uses a custom purple theme matching your web app. Edit `constants/theme.ts`:

```typescript
colors: {
  primary: '#782FEF',    // Your brand purple
  background: '#111827',  // Dark background
  surface: '#1f2937',     // Card backgrounds
  // ... more colors
}
```

### Navigation

Tab bar icons and labels are in `app/(tabs)/_layout.tsx`.

## Testing on Physical Device

### iOS

1. Install Expo Go from App Store
2. Run `npm start` in mobile directory
3. Scan QR code with Camera app
4. Update `API_BASE_URL` to your computer's IP

### Android

1. Install Expo Go from Play Store
2. Run `npm start` in mobile directory
3. Scan QR code with Expo Go app
4. Update `API_BASE_URL` to your computer's IP

**Find your IP**:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

## Building for Production

### Development Build

```bash
npx expo install expo-dev-client
npx expo run:ios
npx expo run:android
```

### Production Build (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform all
```

## Troubleshooting

### Metro bundler not starting
```bash
npx expo start -c  # Clear cache
```

### Cannot connect to API
- Verify Next.js server is running on port 3000
- Check `API_BASE_URL` in `constants/config.ts`
- Use computer's IP, not `localhost` for physical devices
- Ensure both devices are on same WiFi network

### Firebase errors
- Verify all environment variables are set in `.env`
- Check Firebase project configuration
- Ensure Firebase Auth is enabled in Firebase Console

### TypeScript errors with shared code
- Run `npm install` in both root and mobile directories
- Check `tsconfig.json` paths are correct

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Firebase for React Native](https://rnfirebase.io/)

## Contributing

When adding features:

1. Check if code can be shared (types, utilities)
2. Place shared code in `/shared` directory
3. Use React Native Paper components when possible
4. Follow mobile best practices (gestures, animations)
5. Test on both iOS and Android
