import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Text, Card, Checkbox, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { AppTheme } from '@/constants/theme';

// Mock provider data - you'll want to fetch this from your API
const MOCK_PROVIDERS = [
  { id: '8', name: 'Netflix', logo: '/logos/netflix.png' },
  { id: '9', name: 'Amazon Prime Video', logo: '/logos/prime.png' },
  { id: '337', name: 'Disney Plus', logo: '/logos/disney.png' },
  { id: '384', name: 'HBO Max', logo: '/logos/hbo.png' },
  { id: '15', name: 'Hulu', logo: '/logos/hulu.png' },
  { id: '350', name: 'Apple TV Plus', logo: '/logos/apple.png' },
];

export default function ProvidersScreen() {
  const theme = useTheme<AppTheme>();
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch providers from API
    // For now, use mock data
    setTimeout(() => {
      setProviders(MOCK_PROVIDERS);
      setLoading(false);
    }, 500);
  }, []);

  const toggleProvider = (providerId: string) => {
    const newSelected = new Set(selectedProviders);
    if (newSelected.has(providerId)) {
      newSelected.delete(providerId);
    } else {
      newSelected.add(providerId);
    }
    setSelectedProviders(newSelected);
  };

  const savePreferences = async () => {
    // TODO: Save to API
    console.log('Saving preferences:', Array.from(selectedProviders));
    // Show success message
  };

  const renderProvider = ({ item }: { item: any }) => (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={() => toggleProvider(item.id)}
    >
      <View style={styles.cardContent}>
        <View style={styles.providerInfo}>
          {item.logo && (
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              {/* You'll need to add proper logo images */}
              <Text style={{ fontSize: 24 }}>📺</Text>
            </View>
          )}
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {item.name}
          </Text>
        </View>
        <Checkbox
          status={selectedProviders.has(item.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleProvider(item.id)}
        />
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
          Select Your Streaming Services
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline, marginTop: 8 }}>
          Choose which services you have access to
        </Text>
      </View>
      
      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      
      <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
        <Button 
          mode="contained" 
          onPress={savePreferences}
          disabled={selectedProviders.size === 0}
          style={styles.saveButton}
        >
          Save Preferences ({selectedProviders.size})
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButton: {
    borderRadius: 12,
  },
});
