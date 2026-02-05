"use client";

import { useState } from "react";
import { Plus, Film, Tv, Edit2, Trash2, ChevronDown, ChevronUp, Info, ExternalLink, X } from "lucide-react";
import { useRouter } from "next/navigation";
import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
import { Media } from "@/data-models/media.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import NextImage from "next/image";
import WatchlistModal from "./ActivityModal";
import SearchModal from "./SearchModal";
import {
  Container,
  Header,
  HeaderTop,
  Title,
  Subtitle,
  AddButton,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  FilterContainer,
  FilterButton,
  GridContainer,
  Grid,
  Card,
  CardInner,
  CardFront,
  CardBack,
  ImageContainer,
  Image,
  ImageOverlay,
  CardActions,
  IconButton,
  ProviderBadgesContainer,
  ProviderBadge,
  TypeBadge,
  CardInfo,
  CardTitle,
  ProgressContainer,
  ProgressText,
  ProgressBar,
  ProgressFill,
  CardBottom,
  Stars,
  Star,
  StatusBadge,
} from "./styles";
import { addToWatchList, requestRemoveFromWatchList, updateMovie } from "@/utils/api/contentApi";

interface ProviderDetails {
  name: string;
  color: string;
}
type ProviderKey = "netflix" | "hulu" | "disney" | "hbo" | "prime" | "apple" | "paramount";
type Providers = Record<ProviderKey, ProviderDetails>;

interface MyWatchlistProps {
  watchlist: Media[];
  user?: { uid: string; email?: string } | null;
}

const StreamingWatchlist = ({ watchlist, user }: MyWatchlistProps) => {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null | undefined>(null);
  const [formData, setFormData] = useState<Media>({} as Media);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [shouldShowDetailsAfterAdd, setShouldShowDetailsAfterAdd] = useState(true);
  const { myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");
  
  const providers: Providers = {
    netflix: { name: "Netflix", color: "#dc2626"},
    hulu: { name: "Hulu", color: "#22c55e" },
    paramount: { name: "Paramount+", color: "#166534" },
    disney: { name: "Disney+", color: "#2563eb" },
    hbo: { name: "HBO Max", color: "#9333ea" },
    prime: { name: "Prime Video", color: "#0ea5e9" },
    apple: { name: "Apple TV+", color: "#1f2937" },
  };

  const filteredItems: Media[] = watchlist.filter((item) => {
    if (filter === "all") return true;
    if (filter === "movies") return item.type === "movie";
    if (filter === "tv") return item.type === "tv";
    return item.status === filter;
  });

  const stats = {
    watching: watchlist.filter((i) => i.status === "watching").length,
    completed: watchlist.filter((i) => i.status === "completed").length,
    watchlist: watchlist.filter((i) => i.status === "watchlist").length,
  };

  const resetForm = () => {
    setFormData({} as Media);
  };

  const handleAdd = (showDetails: boolean) => {
    setEditingId(null);
    resetForm();
    setShouldShowDetailsAfterAdd(showDetails);
    setShowSearchModal(true);
    setShowAddDropdown(false);
  };

  const handleSelectTitle = async (selectedMedia: Media) => {
    // Fetch full details for the selected title
    try {
      const result = await addToWatchList(user?.uid as string, selectedMedia);
      if (typeof result !== 'string') {
        setFormData(result);
        setEditingId(result?.id);
        if (shouldShowDetailsAfterAdd) {
          setShowModal(true);
        } else {
          // Quick add without showing modal - refresh the page
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Error fetching title details:", err);
    }
  };

  const handleEdit = (item: Media) => {
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = async () => {
    if(!user) {
      return;
    }

    await updateMovie(user.uid, formData);

    setShowModal(false);
    setEditingId(null);
    resetForm();
    
    // Refresh the page data
    router.refresh();
  };

  const handleDelete = async (movie: Media) => {
    if (!user) {
      return;
    }

    await requestRemoveFromWatchList(user.uid, movie);

    // Refresh the page data
    router.refresh();
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const toggleFlip = (id: number | undefined) => {
    if (!id) return;
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleNavigateToDetails = (item: Media) => {
    const slug = item.movieId || item.id;
    if (item.type === 'movie') {
      router.push(`/movies/${slug}`);
    } else {
      router.push(`/tv/${slug}`);
    }
  };

  const getStatus = (item: Media) => {
    if (item.status) {
      return item.status.charAt(0).toUpperCase() + item.status.slice(1);
    } else { 
      return "U";
    }
  }
  
  const calculateProgress = (item: Media) => {
    if (item.type !== 'tv') return 0;
    
    const currentSeason = (item as Media & { currentSeason?: number }).currentSeason ?? 1;
    const currentEpisode = (item as Media & { currentEpisode?: number }).currentEpisode ?? 1;
    
    // Calculate total episodes watched up to current point
    let totalWatched = 0;
    let totalEpisodes = 0;
    
    // Try to use episodes array first (has full episode data)
    if (item.episodes && item.episodes.length > 0) {
      item.episodes.forEach((season) => {
        const episodeCount = Array.isArray(season.episodes) ? season.episodes.length : 0;
        totalEpisodes += episodeCount;
        
        if (season.season_number < currentSeason) {
          // All episodes from previous seasons are watched
          totalWatched += episodeCount;
        } else if (season.season_number === currentSeason) {
          // Add current episode count from current season
          totalWatched += currentEpisode;
        }
      });
    } 
    // Fallback to seasons array (has episode counts per season)
    else if (item.seasons && item.seasons.length > 0) {
      item.seasons.forEach((season) => {
        const episodeCount = season.episode_count || 0;
        totalEpisodes += episodeCount;
        
        if (season.season_number < currentSeason) {
          // All episodes from previous seasons are watched
          totalWatched += episodeCount;
        } else if (season.season_number === currentSeason) {
          // Add current episode count from current season
          totalWatched += currentEpisode;
        }
      });
    }
    
    return totalEpisodes > 0 ? (totalWatched / totalEpisodes) * 100 : 0;
  };

  const getProviderBadgesForTile = (item: Media) => {
    if (!item || !item.provider) {
      return null;
    }
    
    // Try to find the provider in myFavoriteProviders
    const provider = myFavoriteProviders.find(p => String(p.provider_id) === String(item.provider));
    
    if (!provider) {
      // Fallback to old providers object
      const providerKey = item.provider as keyof typeof providers;
      const providerMeta = providers[providerKey];
      
      if (!providerMeta) {
        return null;
      }

      return (
        <ProviderBadgesContainer>
          <ProviderBadge color={providerMeta.color}>{providerMeta.name}</ProviderBadge>
        </ProviderBadgesContainer>
      );
    }

    return (
      <ProviderBadgesContainer>
        {provider.logo_path ? (
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
            <NextImage
              src={getProxyImageUrlForPath(provider.logo_path, 'w45')!}
              alt={provider.provider_name}
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <ProviderBadge color="#a855f7">{provider.provider_name}</ProviderBadge>
        )}
      </ProviderBadgesContainer>
    );
  }
  
  return (
    <Container>
      <Header>
        <HeaderTop>
          <div>
            <Title>My Watchlist</Title>
            <Subtitle>Track what you&apos;re watching across all platforms</Subtitle>
          </div>

          {/* My Streaming Services dropdown */}
          {myFavoriteProviders.length > 0 && (
            <div style={{ width: '100%', marginTop: '1rem' }}>
              <div 
                onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'rgba(31, 41, 55, 0.9)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(31, 41, 55, 1)';
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(31, 41, 55, 0.9)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>
                  MY STREAMING SERVICES
                </span>
                {isLegendCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </div>
              {!isLegendCollapsed && (
                <div style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: 'rgba(31, 41, 55, 0.5)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '0.75rem',
                  }}>
                    {myFavoriteProviders
                      .sort((a, b) => a.display_priority - b.display_priority)
                      .map((provider) => (
                        <div key={provider.provider_id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}>
                          {provider.logo_path ? (
                            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              <NextImage
                                src={getProxyImageUrlForPath(provider.logo_path, 'w45')!}
                                alt={provider.provider_name}
                                width={24}
                                height={24}
                                style={{ objectFit: 'contain' }}
                              />
                            </div>
                          ) : (
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a855f7' }} />
                          )}
                          <span style={{ fontSize: '0.875rem', color: '#e5e7eb' }}>{provider.provider_name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <AddButton onClick={() => setShowAddDropdown(!showAddDropdown)}>
              <Plus size={20} />
              Add Title
              <ChevronDown size={16} style={{ marginLeft: '0.25rem' }} />
            </AddButton>
            {showAddDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'rgba(17, 24, 39, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                minWidth: '200px',
                zIndex: 50
              }}>
                <button
                  onClick={() => handleAdd(false)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: '#e5e7eb',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                    e.currentTarget.style.color = '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e5e7eb';
                  }}
                >
                  <Plus size={16} />
                  Quick Add
                </button>
                <button
                  onClick={() => handleAdd(true)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    color: '#e5e7eb',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
                    e.currentTarget.style.color = '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#e5e7eb';
                  }}
                >
                  <Edit2 size={16} />
                  Add with Details
                </button>
              </div>
            )}
          </div>

          <StatsGrid>
            <StatCard>
              <StatNumber color="#60a5fa">{stats.watching}</StatNumber>
              <StatLabel>Currently Watching</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber color="#4ade80">{stats.completed}</StatNumber>
              <StatLabel>Completed</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber color="#c084fc">{stats.watchlist}</StatNumber>
              <StatLabel>In Watchlist</StatLabel>
            </StatCard>
          </StatsGrid>
        </HeaderTop>

        <FilterContainer>
          {["all", "watching", "completed", "watchlist", "movies", "tv"].map((f) => (
            <FilterButton key={f} $active={(filter === f).toString()} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterButton>
          ))}
        </FilterContainer>

        {/* Active Filter Indicator */}
        {filter !== "all" && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                background: 'rgba(168, 85, 247, 0.3)',
                borderRadius: '0.375rem',
                border: '1px solid rgba(168, 85, 247, 0.4)'
              }}>
                {filter === "movies" && <Film size={16} color="#c084fc" />}
                {filter === "tv" && <Tv size={16} color="#c084fc" />}
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#c084fc' }}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </span>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                Showing <strong style={{ color: '#c084fc' }}>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setFilter("all")}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.625rem',
                background: 'transparent',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '0.375rem',
                color: '#c084fc',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <X size={14} />
              Clear Filter
            </button>
          </div>
        )}
      </Header>

      <GridContainer>
        <Grid>
          {filteredItems.map((item) => {
            const isFlipped = flippedCards.has(item.id!);
            
            return (
              <Card key={item.id}>
                <CardInner $flipped={isFlipped}>
                  {/* Front of Card */}
                  <CardFront>
                    <ImageContainer>
                      <Image src={getProxyImageUrlForPath(item.poster_path || item.backdrop_path, 'w185')!} alt={item.title} />
                      <ImageOverlay />

                      <CardActions>
                        <IconButton onClick={() => toggleFlip(item.id)} title="More Details">
                          <Info size={14} />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(item)}>
                          <Edit2 size={14} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item)}>
                          <Trash2 size={14} />
                        </IconButton>
                      </CardActions>

                      {getProviderBadgesForTile(item)}

                      <TypeBadge>
                        {item.type === "movie" ? <Film size={12} /> : <Tv size={12} />}
                        {item.type === "movie" ? "Movie" : "TV Show"}
                      </TypeBadge>

                      <CardInfo>
                        <CardTitle>{item.title}</CardTitle>

                        {item.type === 'tv' && (() => {
                          const currentSeason = (item as Media & { currentSeason?: number }).currentSeason;
                          const currentEpisode = (item as Media & { currentEpisode?: number }).currentEpisode;
                          
                          let totalEpisodes = 0;
                          
                          // Calculate total episodes from episodes array or seasons array
                          if (item.episodes && item.episodes.length > 0) {
                            totalEpisodes = item.episodes.reduce((sum, season) => {
                              return sum + (Array.isArray(season.episodes) ? season.episodes.length : 0);
                            }, 0);
                          } else if (item.seasons && item.seasons.length > 0) {
                            totalEpisodes = item.seasons.reduce((sum, season) => {
                              return sum + (season.episode_count || 0);
                            }, 0);
                          }
                          
                          // Show progress if we have episode data
                          if (totalEpisodes > 0) {
                            return (
                              <ProgressContainer>
                                <ProgressText>
                                  S{currentSeason ?? 1} E{currentEpisode ?? 1} • {totalEpisodes} total episodes
                                </ProgressText>
                                <ProgressBar>
                                  <ProgressFill width={calculateProgress(item)} />
                                </ProgressBar>
                              </ProgressContainer>
                            );
                          }
                          
                          // Fallback: show season/episode if available
                          if (currentSeason && currentEpisode) {
                            return (
                              <ProgressContainer>
                                <ProgressText>
                                  Season {currentSeason}, Episode {currentEpisode}
                                </ProgressText>
                              </ProgressContainer>
                            );
                          }
                          
                          return null;
                        })()}

                        <CardBottom>
                          <Stars>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} $filled={i < item.rating ? true : undefined} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </Star>
                            ))}
                          </Stars>

                          <StatusBadge $status={item.status}>{getStatus(item)}</StatusBadge>
                        </CardBottom>
                      </CardInfo>
                    </ImageContainer>
                  </CardFront>

                  {/* Back of Card */}
                  <CardBack>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#c084fc', margin: 0 }}>{item.title || item.name}</h3>
                      <IconButton onClick={() => toggleFlip(item.id)} style={{ position: 'static' }}>
                        <Info size={14} />
                      </IconButton>
                    </div>

                    <div style={{ fontSize: '0.875rem', color: '#d1d5db', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {item.overview ? (
                        <p style={{ margin: 0 }}>{item.overview.length > 200 ? `${item.overview.slice(0, 200)}...` : item.overview}</p>
                      ) : (
                        <p style={{ margin: 0, fontStyle: 'italic' }}>No overview available</p>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                      {item.release_date && (
                        <div>
                          <span style={{ color: '#9ca3af', fontWeight: 600 }}>Release Date: </span>
                          <span style={{ color: '#d1d5db' }}>{new Date(item.release_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {item.first_air_date && (
                        <div>
                          <span style={{ color: '#9ca3af', fontWeight: 600 }}>First Air Date: </span>
                          <span style={{ color: '#d1d5db' }}>{new Date(item.first_air_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {item.vote_average > 0 && (
                        <div>
                          <span style={{ color: '#9ca3af', fontWeight: 600 }}>TMDB Rating: </span>
                          <span style={{ color: '#fbbf24', fontWeight: 600 }}>{item.vote_average.toFixed(1)}/10</span>
                        </div>
                      )}
                      {item.genres && item.genres.length > 0 && (
                        <div>
                          <span style={{ color: '#9ca3af', fontWeight: 600 }}>Genres: </span>
                          <span style={{ color: '#d1d5db' }}>{item.genres.map(g => g.name).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                      <IconButton 
                        onClick={() => handleNavigateToDetails(item)}
                        style={{ 
                          width: '100%', 
                          background: 'linear-gradient(to right, #a855f7, #ec4899)',
                          border: 'none',
                          padding: '0.75rem',
                          gap: '0.5rem',
                          fontWeight: 600
                        }}
                      >
                        <ExternalLink size={16} />
                        View Full Details
                      </IconButton>
                    </div>
                  </CardBack>
                </CardInner>
              </Card>
            );
          })}
        </Grid>
      </GridContainer>

      {showModal && (
        <WatchlistModal
          show={showModal}
          editingId={editingId}
          formData={formData}
          myFavoriteProviders={myFavoriteProviders}
          handleCancel={handleCancel}
          handleSave={handleSave}
          setFormData={setFormData}
        />
      )}

      {showSearchModal && (
        <SearchModal
          show={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onSelectTitle={handleSelectTitle}
        />
      )}
    </Container>
  );
};

export default StreamingWatchlist;
