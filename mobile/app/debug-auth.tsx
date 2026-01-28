import React from 'react';
import { View, ScrollView, StyleSheet, Share } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { makeRedirectUri } from 'expo-auth-session';
// import * as Clipboard from 'expo-clipboard';
import { AppTheme } from '@/constants/theme';

export default function DebugAuthScreen() {
  const theme = useTheme<AppTheme>();
  
  const redirectUri = makeRedirectUri({
    scheme: 'moviestracker',
    path: 'redirect'
  });
  
  const expoRedirectUri = makeRedirectUri({
    useProxy: true,
  });

//   const copyToClipboard = async (text: string) => {
//     await Clipboard.setStringAsync(text);
//   };

  const shareUris = async () => {
    await Share.share({
      message: `Production: ${redirectUri}\n\nDevelopment: ${expoRedirectUri}`,
      title: 'Google OAuth Redirect URIs'
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground, marginBottom: 16 }}>
          Google OAuth Setup
        </Text>
        
        <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginBottom: 24 }}>
          Add these redirect URIs to your Google Cloud Console:
        </Text>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
              For Production Build:
            </Text>
            <Text selectable style={styles.uri}>
              {redirectUri}
            </Text>
            <Button 
              mode="outlined" 
            //   onPress={() => copyToClipboard(redirectUri)}
              style={{ marginTop: 8 }}
            >
              Copy
            </Button>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
              For Expo Go (Development):
            </Text>
            <Text selectable style={styles.uri}>
              {expoRedirectUri}
            </Text>
            <Button 
              mode="outlined" 
            //   onPress={() => copyToClipboard(expoRedirectUri)}
              style={{ marginTop: 8 }}
            >
              Copy
            </Button>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={shareUris}
          style={{ marginTop: 16 }}
          icon="share"
        >
          Share All URIs
        </Button>

        <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
              Setup Instructions:
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, lineHeight: 24 }}>
              1. Go to Google Cloud Console{'\n'}
              2. Navigate to APIs & Credentials{'\n'}
              3. Edit your OAuth 2.0 Client IDs{'\n'}
              4. Add the URIs above to "Authorized redirect URIs"{'\n'}
              5. Save changes{'\n'}
              6. Update your .env file with client IDs
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  uri: {
    fontFamily: 'monospace',
    fontSize: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
});