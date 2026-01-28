import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri } from 'expo-auth-session';

// Required for web browser to close properly after auth
WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: 'moviestracker',
      preferLocalhost: true, // Use Expo proxy for development (required for Google OAuth policy)
    }),
  });

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleResponse(authentication?.accessToken);
    } else if (response?.type === 'error') {
      console.error('Google OAuth error:', response.error);
    }
  }, [response]);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (accessToken?: string) => {
    if (!accessToken) return;

    try {
      // Fetch user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      
      const userInfo = await userInfoResponse.json();
      
      const userData: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('accessToken', accessToken);
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to authenticate with Google');
    }
  };

  const signInWithGoogle = async () => {
    if (!request) {
      throw new Error('Google Sign-In not ready');
    }
    await promptAsync();
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'accessToken']);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { initializeApp, getApps } from 'firebase/app';
// import { getAuth, signInWithCredential, GoogleAuthProvider, User } from 'firebase/auth';
// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { FIREBASE_CONFIG } from '@/constants/config';

// // Needed for expo-auth-session to work properly
// WebBrowser.maybeCompleteAuthSession();

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signInWithGoogle: () => Promise<void>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Initialize Firebase
// const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
// const auth = getAuth(app);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Configure Google Auth Request
//   // useProxy: true is required for development to comply with Google's OAuth 2.0 policy
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
//     androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
//     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
//   }, {
//     useProxy: true, // Use Expo's proxy service for development (Google OAuth compliant)
//     projectNameForProxy: '@moviestracker/mobile',
//   });

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Handle the authentication response
//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token } = response.params;
      
//       if (id_token) {
//         const credential = GoogleAuthProvider.credential(id_token);
//         signInWithCredential(auth, credential).catch((error) => {
//           console.error('Firebase Sign In Error:', error);
//         });
//       }
//     }
//   }, [response]);

//   const signInWithGoogle = async () => {
//     try {
//       await promptAsync();
//     } catch (error) {
//       console.error('Google Sign In Error:', error);
//       throw error;
//     }
//   };

//   const signOut = async () => {
//     try {
//       await auth.signOut();
//     } catch (error) {
//       console.error('Sign Out Error:', error);
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
