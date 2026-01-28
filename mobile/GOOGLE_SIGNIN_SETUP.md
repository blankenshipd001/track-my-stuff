# Google Sign-In Setup Instructions (Expo Auth Session with Proxy)

This guide will help you complete the Google Sign-In configuration for the Movies Tracker mobile app using `expo-auth-session` with **Expo's authentication proxy**.

## Prerequisites

- A Firebase project set up at [Firebase Console](https://console.firebase.google.com/)
- Google Cloud Console access for your Firebase project
- An Expo account (sign up at [expo.dev](https://expo.dev))

## Benefits of expo-auth-session with Proxy

- ✅ **Works with Expo Go** (no development build required)
- ✅ **Simplified OAuth setup** - Expo handles redirect URIs
- ✅ **Google OAuth compliant** - Works with Google's strict redirect policies
- ✅ **Perfect for testing** - No need to configure multiple redirect URIs
- ✅ **Cross-platform support** out of the box

## Understanding the Expo Proxy

The Expo authentication proxy (`useProxy: true`) is a service that:
1. Handles OAuth redirects on your behalf during development
2. Provides a stable redirect URI: `https://auth.expo.io/@your-username/your-slug`
3. Complies with Google's OAuth 2.0 redirect URI policies
4. Works seamlessly with Expo Go for quick testing

**Current Configuration:**
- Project slug: `movies-mobile` (from app.json)
- Proxy project name: `@moviestracker/mobile`
- This means your redirect URI will be: `https://auth.expo.io/@moviestracker/mobile`

## Step 1: Get OAuth 2.0 Client IDs

### IMPORTANT: Add Expo Proxy Redirect URI

For development with Expo Go, you **must** add this redirect URI to your Google Cloud Console:

```
https://auth.expo.io/@moviestracker/mobile
```

**Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your **Web client ID** (the auto-created one from Firebase)
5. Under "Authorized redirect URIs", click **+ ADD URI**
6. Add: `https://auth.expo.io/@moviestracker/mobile`
7. Click **Save**

This redirect URI is required for Expo's OAuth proxy to work and comply with Google's OAuth 2.0 policy.

### For Web Client ID (Required)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **Credentials**
4. You should see a "Web client (auto created by Google Service)" - copy its **Client ID**
5. This will be your `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

### For iOS Client ID

1. In the same Credentials page, create an **iOS Client ID** if you don't have one
2. The bundle identifier should match: `com.moviestracker.app`
3. Copy the **Client ID** (format: `XXXXX.apps.googleusercontent.com`)
4. This will be your `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

### For Android Client ID

1. In the Credentials page, create an **Android Client ID** if you don't have one
2. The package name should match: `com.moviestracker.app`
3. You'll need to provide the SHA-1 certificate fingerprint:
   
   **For Expo Go (development):**
   ```
   SHA-1: 34:87:D8:C3:42:03:E0:58:62:16:6F:FA:8F:C0:4B:38:BD:43:30:66
   ```
   
   **For standalone builds, run:**
   ```bash
   # For development
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   
   # For production
   keytool -list -v -keystore your-release-key.keystore
   ```
4. Copy the **Client ID**
5. This will be your `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

## Step 2: Configure Environment Variables

Create or update `.env` file in the `mobile` directory:

```env
# Firebase Config
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google Sign-In (expo-auth-session)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxxxx.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

## Step 3: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Google** as a sign-in provider
5. Add your support email
6. Save

## Step 4: Test the Implementation

### With Expo Go (Recommended for Development)

```bash
cd mobile
npm start
```

Then scan the QR code with:
- **iOS**: Camera app or Expo Go app
- **Android**: Expo Go app

The Google Sign-In will open a web browser for authentication, then redirect back to your app.

### With Development Build (Optional)

For a more native experience:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Troubleshooting

### Expo Proxy Issues

- **Error: "Invalid redirect URI"**
  - Double-check the redirect URI in Google Cloud Console: `https://auth.expo.io/@moviestracker/mobile`
  - Ensure it matches exactly (no trailing slashes or extra characters)
  - Wait a few minutes after adding the URI for Google's servers to update

- **Error: "useProxy requires expo-web-browser"**
  - This package should already be installed
  - If missing, run: `npm install expo-web-browser`
  - Restart the Metro bundler

- **Browser opens but doesn't redirect back**
  - Check that `expo-web-browser` is properly configured
  - Verify the `scheme` in app.json is set to `movies`
  - Try closing and reopening Expo Go

### iOS Issues

- **Error: "No valid client ID found"**
  - Verify all three client IDs (web, iOS, Android) are set in `.env`
  - Restart the Metro bundler after changing `.env`

- **Browser doesn't redirect back**
  - Check that the bundle identifier in app.json matches: `com.moviestracker.app`
  - Ensure the iOS client ID is correctly configured in Google Cloud Console

### Android Issues

- **Error: "DEVELOPER_ERROR" or "Error 10"**
  - Verify the SHA-1 fingerprint is correct in Google Cloud Console
  - For Expo Go, use the Expo Go SHA-1: `34:87:D8:C3:42:03:E0:58:62:16:6F:FA:8F:C0:4B:38:BD:43:30:66`
  - Package name must be: `com.moviestracker.app`

- **Error: "Sign in cancelled"**
  - This is normal if the user closes the browser
  - Check that Google Sign-In is enabled in Firebase Console

### General Issues

- **"Module not found" errors**
  - Run `npm install` in the mobile directory
  - Restart the Metro bundler: `npm start -- --reset-cache`

- **Firebase auth errors**
  - Verify all Firebase environment variables are set correctly
  - Check Firebase Console for authentication settings
  - Ensure Google is enabled as a sign-in provider

- **Environment variables not loading**
  - Restart the Metro bundler after changing `.env`
  - Variables must start with `EXPO_PUBLIC_` to be accessible in the app

## Additional Resources

- [Expo Auth Session Documentation](https://docs.expo.dev/guides/authentication/#google)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Cloud Console](https://console.cloud.google.com/)

## Current Implementation

The Google Sign-In has been implemented with:

- ✅ `expo-auth-session` for OAuth flow
- ✅ `expo-web-browser` for in-app browser authentication
- ✅ Firebase authentication integration
- ✅ AuthContext with Google authentication
- ✅ Login screen with Google Sign-In button
- ✅ Loading states and error handling
- ✅ Works with Expo Go (no development build required)

## Next Steps

1. Get your OAuth 2.0 Client IDs from Google Cloud Console (Web, iOS, and Android)
2. Add environment variables to `.env` file
3. Enable Google Sign-In in Firebase Console
4. Run `npm start` and test with Expo Go
5. Try signing in with your Google account

Good luck! 🚀
