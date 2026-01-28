import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, Button, Chip, ActivityIndicator, useTheme, IconButton } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { Media } from '@shared/data-models/media.interface';
import { fetchMediaDetails, addToWatchlist } from '@/utils/api';
import { buildBackdropUrl, buildPosterUrl } from '@shared/utils/imageUrl';
import { AppTheme } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function DetailsScreen() {
  const theme = useTheme<AppTheme>();
  const params = useLocalSearchParams<{ id: string; type: string }>();
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    loadMediaDetails();
  }, [params.id]);

  const loadMediaDetails = async () => {
    if (!params.id || !params.type) return;
    
    setLoading(true);
    const { data, error } = await fetchMediaDetails(
      params.id, 
      params.type as 'movie' | 'tv'
    );
    if (data) {
      setMedia(data);
    }
    setLoading(false);
  };

  const handleAddToWatchlist = async () => {
    if (!media) return;
    
    // TODO: Get actual user ID from auth context
    const userId = 'guest';
    
    const { error } = await addToWatchlist(media, userId);
    if (!error) {
      setInWatchlist(true);
      // Show success message
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!media) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
          Content not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Backdrop Image */}
      {media.backdrop_path && (
        <Image 
          source={{ uri: buildBackdropUrl(media.backdrop_path) }}
          style={styles.backdrop}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        {/* Poster and Title */}
        <View style={styles.header}>
          {media.poster_path && (
            <Image 
              source={{ uri: buildPosterUrl(media.poster_path) }}
              style={styles.poster}
              resizeMode="cover"
            />
          )}
          <View style={styles.titleContainer}>
            <Text variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
              {media.title || media.name}
            </Text>
            <View style={styles.meta}>
              {media.release_date && (
                <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
                  {new Date(media.release_date).getFullYear()}
                </Text>
              )}
              {media.vote_average && (
                <Chip icon="star" style={styles.chip}>
                  {media.vote_average.toFixed(1)}
                </Chip>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button 
            mode="contained" 
            icon={inWatchlist ? "check" : "plus"}
            onPress={handleAddToWatchlist}
            disabled={inWatchlist}
            style={styles.actionButton}
          >
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </Button>
        </View>

        {/* Overview */}
        {media.overview && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
              Overview
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.outline, lineHeight: 22 }}>
              {media.overview}
            </Text>
          </View>
        )}

        {/* Genres */}
        {media.genres && media.genres.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
              Genres
            </Text>
            <View style={styles.genres}>
              {media.genres.map((genre: any) => (
                <Chip key={genre.id} style={styles.genreChip}>
                  {genre.name}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 12 }}>
            Information
          </Text>
          {media.runtime && (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>Runtime:</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>
                {media.runtime} min
              </Text>
            </View>
          )}
          {media.status && (
            <View style={styles.infoRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>Status:</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>
                {media.status}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
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
  backdrop: {
    width: width,
    height: width * 0.56, // 16:9 aspect ratio
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginTop: -60, // Overlap with backdrop
    marginBottom: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  actions: {
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 12,
  },
  section: {
    marginBottom: 24,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
