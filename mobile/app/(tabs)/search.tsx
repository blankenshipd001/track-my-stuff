import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Image, Keyboard } from 'react-native';
import { Searchbar, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { Media } from '@shared/data-models/media.interface';
import { searchContent } from '@/utils/api';
import { buildPosterUrl } from '@shared/utils/imageUrl';
import { AppTheme } from '@/constants/theme';

export default function SearchScreen() {
  const theme = useTheme<AppTheme>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    console.log('🔍 Search button pressed, query:', query);
    Keyboard.dismiss();
    setLoading(true);
    setSearched(true);
    
    const { data, error } = await searchContent(query);
    console.log('📦 Search results received:', { dataLength: data?.length, error });
    console.log('📦 First result:', data?.[0]);
    
    if (data) {
      console.log('✅ Setting results:', data.length, 'items');
      console.log('📊 Results state before:', results.length);
      setResults(data);
      console.log('📊 Results data:', data.slice(0, 3)); // Log first 3 items
    } else if (error) {
      console.error('❌ Search error:', error);
      setResults([]);
    }
    setLoading(false);
  };

  // Add a useEffect to log when results change
  React.useEffect(() => {
    console.log('🔄 Results state updated:', results.length, 'items');
    console.log('🔄 Searched:', searched, 'Loading:', loading);
  }, [results, searched, loading]);

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
        {item.poster_path ? (
          <Image 
            source={{ uri: buildPosterUrl(item.poster_path) }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.poster, { backgroundColor: theme.colors.surfaceVariant }]} />
        )}
        <View style={styles.details}>
          <Text variant="titleMedium" numberOfLines={2} style={{ color: theme.colors.onSurface }}>
            {item.title || item.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
            {item.release_date || item.first_air_date}
          </Text>
          {item.overview && (
            <Text variant="bodySmall" numberOfLines={3} style={{ color: theme.colors.outline, marginTop: 8 }}>
              {item.overview}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search movies and TV shows"
        onChangeText={setQuery}
        value={query}
        onSubmitEditing={handleSearch}
        style={styles.searchbar}
        iconColor={theme.colors.primary}
      />
      
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
      {!loading && searched && results.length === 0 && (
        <View style={styles.empty}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
            No results found
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 8 }}>
            Try a different search term
          </Text>
        </View>
      )}
      
      {!loading && !searched && (
        <View style={styles.empty}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, textAlign: 'center' }}>
            Search for content
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 8 }}>
            Find your favorite movies and TV shows
          </Text>
        </View>
      )}
      
      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderMediaCard}
          keyExtractor={(item) => item.movieId?.toString() || Math.random().toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  list: {
    padding: 16,
    paddingTop: 0,
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
  },
});
