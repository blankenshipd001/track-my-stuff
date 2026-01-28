# 🚀 Quick Start Guide - Mobile App

Get the mobile app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your phone (optional)

## Step 1: Install Mobile Dependencies

```bash
cd mobile
npm install
```

## Step 2: Set Up Environment Variables

```bash
cd mobile
cp .env.example .env
```

Edit `.env` and add your Firebase credentials (same as web app).

## Step 3: Start the Backend

The mobile app needs the Next.js API server running:

```bash
# In the root directory (not /mobile)
npm run dev
```

Keep this terminal open!

## Step 4: Update API URL

Edit `mobile/constants/config.ts` and update `API_BASE_URL`:

### For iOS Simulator / Android Emulator:
```typescript
export const API_BASE_URL = 'http://localhost:3000';
```

### For Physical Device:
Find your computer's IP address:

```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Then update:
```typescript
export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000';
// Example: 'http://192.168.1.100:3000'
```

## Step 5: Start the Mobile App

```bash
# In a new terminal
cd mobile
npm start
```

This will open Expo Dev Tools in your browser.

## Step 6: Run on a Device

### Option A: iOS Simulator (Mac only)

Press `i` in the terminal or click "Run on iOS simulator" in Expo Dev Tools.

### Option B: Android Emulator

Press `a` in the terminal or click "Run on Android device/emulator" in Expo Dev Tools.

### Option C: Physical Device

1. Install Expo Go app:
   - iOS: App Store
   - Android: Google Play Store

2. Scan the QR code shown in terminal with:
   - iOS: Camera app
   - Android: Expo Go app

**Remember**: Use your computer's IP address in config, not localhost!

## Troubleshooting

### "Cannot connect to Metro bundler"
- Make sure you're on the same WiFi network
- Check your firewall isn't blocking port 8081

### "Network request failed" when fetching data
- Verify Next.js dev server is running (`npm run dev` in root)
- Check `API_BASE_URL` in `constants/config.ts`
- For physical device, use computer's IP, not `localhost`
- Ensure both devices are on same network

### "Invariant Violation" or dependency errors
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start -c  # Clear cache
```

### Firebase errors
- Check all EXPO_PUBLIC_FIREBASE_* variables are set in `.env`
- Verify Firebase project is configured correctly

## Next Steps

Once the app is running:

1. **Browse**: Check out the Activity tab to see demo content
2. **Search**: Try searching for your favorite movies
3. **Details**: Tap any movie to see the details page
4. **Providers**: Configure your streaming services
5. **Profile**: Check out settings and preferences

## Development Tips

- **Fast Refresh**: Just save files, changes appear instantly
- **Shake gesture**: Opens dev menu on physical device
- **Cmd+D (iOS)**: Opens dev menu in simulator
- **Cmd+M (Android)**: Opens dev menu in emulator

## Building for Production

See [README.md](README.md#building-for-production) for instructions on building standalone apps for App Store and Google Play Store.

## Need Help?

- Check [mobile/README.md](README.md) for detailed documentation
- Check [MONOREPO.md](../MONOREPO.md) for architecture overview
- Review Expo docs: https://docs.expo.dev/
