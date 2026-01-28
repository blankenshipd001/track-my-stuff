import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, List, Avatar, useTheme, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { AppTheme } from '@/constants/theme';

export default function ProfileScreen() {
  const theme = useTheme<AppTheme>();

  // TODO: Get actual user from auth context
  const user = null;

  const handleSignOut = () => {
    // TODO: Implement sign out
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Avatar.Icon 
          size={80} 
          icon="account" 
          style={{ backgroundColor: theme.colors.primary }}
        />
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, marginTop: 16 }}>
          {user ? 'User Name' : 'Guest User'}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {user ? 'user@example.com' : 'Sign in to sync your data'}
        </Text>
      </View>

      <View style={styles.section}>
        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>Account</List.Subheader>
          {!user ? (
            <List.Item
              title="Sign In"
              description="Sign in to save your watchlist"
              left={(props) => <List.Icon {...props} icon="login" color={theme.colors.primary} />}
              onPress={() => router.push('/(auth)/login')}
            />
          ) : (
            <>
              <List.Item
                title="Account Settings"
                description="Manage your account"
                left={(props) => <List.Icon {...props} icon="account-cog" />}
                onPress={() => {}}
              />
              <List.Item
                title="Notifications"
                description="Manage notification preferences"
                left={(props) => <List.Icon {...props} icon="bell" />}
                onPress={() => {}}
              />
            </>
          )}
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>Preferences</List.Subheader>
          <List.Item
            title="Streaming Services"
            description="Manage your subscriptions"
            left={(props) => <List.Icon {...props} icon="youtube-tv" />}
            onPress={() => router.push('/(tabs)/providers')}
          />
          <List.Item
            title="Theme"
            description="Dark mode"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            onPress={() => {}}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader style={{ color: theme.colors.primary }}>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {}}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => {}}
          />
        </List.Section>
      </View>

      {user && (
        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            Sign Out
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  section: {
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  signOutButton: {
    borderRadius: 12,
  },
});
