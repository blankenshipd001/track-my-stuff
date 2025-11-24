"use client";

import { useState } from "react";
import { Plus, Film, Tv, Edit2, Trash2 } from "lucide-react";
import { Media } from "@/data-models/media.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import WatchlistModal from "./WathlistModal";
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
  Legend,
  LegendTitle,
  LegendItems,
  LegendItem,
  LegendDot,
  LegendLabel,
} from "./styles";
import { requestRemoveFromWatchList, updateMovie } from "@/utils/api/contentApi";

type Progress = {
  current?: number;
  total?: number;
};
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
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null | undefined>(null);
  const [formData, setFormData] = useState<Media>({} as Media);
  
console.log('Rendering MyWatchlist with watchlist:', watchlist);

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

  const handleAdd = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item: Media) => {
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = () => {
    if(!user) {
      return;
    }

    updateMovie(user.uid, formData);

    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = async (movie: Media) => {
    if (!user) {
      return;
    }

    await requestRemoveFromWatchList(user.uid, movie);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const getStatus = (item: Media) => {
    if (item.status) {
      return item.status.charAt(0).toUpperCase() + item.status.slice(1);
    } else { 
      return "U";
    }
  }

  const calculateProgress = (progress: Progress) => {
    if (!progress || !progress.total) return 0;
    return progress?.current ? (progress.current / progress.total) * 100 : 0;
  };

  const getProviderBadgesForTile = (item: Media) => {
    if (!item || !item.provider) {
      return null;
    }
    
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
    <Container>
      <Header>
        <HeaderTop>
          <div>
            <Title>My Watchlist</Title>
            <Subtitle>Track what you&apos;re watching across all platforms</Subtitle>
          </div>
          <AddButton onClick={handleAdd}>
            <Plus size={20} />
            Add Title
          </AddButton>
        </HeaderTop>

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

        <FilterContainer>
          {["all", "watching", "completed", "watchlist", "movies", "tv"].map((f) => (
            <FilterButton key={f} active={(filter === f).toString()} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterButton>
          ))}
        </FilterContainer>
      </Header>

      <GridContainer>
        <Grid>
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <ImageContainer>
                <Image src={getProxyImageUrlForPath(item.poster_path || item.backdrop_path, 'w185')!} alt={item.title} />
                <ImageOverlay />

                <CardActions>
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

                  {item.progress && item.progress.total && item.progress.total > 0 && (
                    <ProgressContainer>
                      <ProgressText>
                        {item.progress.current}/{item.progress.total} episodes
                      </ProgressText>
                      <ProgressBar>
                        <ProgressFill width={calculateProgress(item.progress)} />
                      </ProgressBar>
                    </ProgressContainer>
                  )}

                  <CardBottom>
                    <Stars>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} filled={i < item.rating && true} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </Star>
                      ))}
                    </Stars>

                    <StatusBadge status={item.status}>{getStatus(item)}</StatusBadge>
                  </CardBottom>
                </CardInfo>
              </ImageContainer>
            </Card>
          ))}
        </Grid>
      </GridContainer>

      {showModal && (
        <WatchlistModal
          show={showModal}
          editingId={editingId}
          formData={formData}
          providers={providers}
          handleCancel={handleCancel}
          handleSave={handleSave}
          setFormData={setFormData}
        />
      )}

      <Legend>
        <LegendTitle>STREAMING SERVICES</LegendTitle>
        <LegendItems>
          {Object.entries(providers).map(([key, provider]) => (
            <LegendItem key={key}>
              <LegendDot color={provider.color} />
              <LegendLabel>{provider.name}</LegendLabel>
            </LegendItem>
          ))}
        </LegendItems>
      </Legend>
    </Container>
  );
};

export default StreamingWatchlist;
