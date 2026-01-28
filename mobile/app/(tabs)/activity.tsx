import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Image } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator, useTheme, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import { Media } from '@shared/data-models/media.interface';
import { fetchWatchlist, fetchPopularContent } from '@/utils/api';
import { buildPosterUrl } from '@shared/utils/imageUrl';
import { AppTheme } from '@/constants/theme';

export default function ActivityScreen() {
  const theme = useTheme<AppTheme>();
  const [watchlist, setWatchlist] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // TODO: Get actual user ID from auth context
  const userId = 'guest';

  const loadWatchlist = async () => {
    setLoading(true);
    // For demo, load popular content
    // TODO: Replace with actual watchlist API call
    const { data, error } = await fetchPopularContent();
    if (data) {
      setWatchlist(data.slice(0, 10)); // Show first 10 for demo
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWatchlist();
    setRefreshing(false);
  };

  const handleMediaPress = (media: Media) => {
    const type = media.first_air_date ? 'tv' : 'movie';
    router.push(`/details/${media.movieId}?type=${type}`);
  };

  const renderMediaCard = ({ item }: { item: Media }) => (
    <Card 
      style={[styles.card, { backgroundColor: theme.colors.surface }]} 
      onPress={() => handleMediaPress(item)}
    >
      <View style={styles.cardContent}>
        <Image 
          source={{ uri: buildPosterUrl(item.poster_path) }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <Text variant="titleMedium" numberOfLines={2} style={{ color: theme.colors.onSurface }}>
            {item.title || item.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
            {item.release_date || item.first_air_date}
          </Text>
          {item.vote_average && (
            <Chip 
              icon="star" 
              style={styles.rating}
              textStyle={{ fontSize: 12 }}
            >
              {item.vote_average.toFixed(1)}
            </Chip>
          )}
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
          Loading your watchlist...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={watchlist}
        renderItem={renderMediaCard}
        keyExtractor={(item) => item.movieId?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
              Your watchlist is empty
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 8 }}>
              Search for movies and TV shows to add them
            </Text>
            <Button 
              mode="contained" 
              style={{ marginTop: 24 }}
              onPress={() => router.push('/(tabs)/search')}
            >
              Browse Content
            </Button>
          </View>
        }
      />
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
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
  },
  rating: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
  },
});
