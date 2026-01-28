import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { AppTheme } from '@/constants/theme';

export default function LoginScreen() {
  const theme = useTheme<AppTheme>();
  const { user, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  // Redirect to main app if user logs in successfully
  useEffect(() => {
    if (user && !loading) {
      router.replace('/(tabs)/activity');
    }
  }, [user, loading]);

  const handleGoogleSignIn = async () => {

      // router.push('/debug-auth');
    try {
      setLoading(true);
      await signInWithGoogle();
      // Navigation will happen automatically via useEffect when user state updates
    } catch (error: any) {
      Alert.alert(
        'Sign In Error',
        error.message || 'Failed to sign in with Google. Please try again.',
        [{ text: 'OK' }]
      );
      router.push('/debug-auth');
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Movies Tracker
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.outline }]}>
          Track your favorite movies and TV shows
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleGoogleSignIn}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              'Sign in with Google'
            )}
          </Button>
          
          <Button 
            mode="text" 
            onPress={() => router.replace('/(tabs)/activity')}
            style={styles.skipButton}
            disabled={loading}
          >
            Continue as Guest
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  skipButton: {
    marginTop: 8,
  },
});
