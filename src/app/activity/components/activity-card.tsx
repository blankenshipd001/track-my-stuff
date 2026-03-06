import { memo } from "react";
import { Film, Tv, Edit2, Trash2, Info } from "lucide-react";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import {
  Card,
  CardInner,
  CardFront,
  ImageContainer,
  Image,
  ImageOverlay,
  CardActions,
  IconButton,
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
} from "../styles";
import { calculateTvProgress, getTotalEpisodes, isTvMedia } from "../activity-helpers";
import { ActivityCardBack } from "./activity-card-back";
import { ActivityProviderBadge } from "./activity-provider-badge";

interface ActivityCardProps {
  item: Media;
  isFlipped: boolean;
  statusLabel: string;
  providerById: Map<string, ServiceProvider>;
  onFlip: (id: number | undefined) => void;
  onEdit: (item: Media) => void;
  onDelete: (item: Media) => void;
  onNavigateToDetails: (item: Media) => void;
}

function ActivityCardComponent({
  item,
  isFlipped,
  statusLabel,
  providerById,
  onFlip,
  onEdit,
  onDelete,
  onNavigateToDetails,
}: ActivityCardProps) {
  const currentSeason = (item as Media & { currentSeason?: number }).currentSeason;
  const currentEpisode = (item as Media & { currentEpisode?: number }).currentEpisode;
  const totalEpisodes = getTotalEpisodes(item);
  const isTv = isTvMedia(item);
  const displayType = isTv ? "TV Show" : "Movie";

  return (
    <Card>
      <CardInner $flipped={isFlipped}>
        <CardFront>
          <ImageContainer>
            <Image src={getProxyImageUrlForPath(item.poster_path || item.backdrop_path, "w185")!} alt={item.title || item.name} />
            <ImageOverlay />

            <CardActions>
              <IconButton onClick={() => onFlip(item.id)} title="More Details">
                <Info size={14} />
              </IconButton>
              <IconButton onClick={() => onEdit(item)}>
                <Edit2 size={14} />
              </IconButton>
              <IconButton onClick={() => onDelete(item)}>
                <Trash2 size={14} />
              </IconButton>
            </CardActions>

            <ActivityProviderBadge providerId={item.provider} providerById={providerById} />

            <TypeBadge>
              {isTv ? <Tv size={12} /> : <Film size={12} />}
              {displayType}
            </TypeBadge>

            <CardInfo>
              <CardTitle>{item.title || item.name}</CardTitle>

              {isTv && totalEpisodes > 0 && (
                <ProgressContainer>
                  <ProgressText>
                    S{currentSeason ?? 1} E{currentEpisode ?? 1} • {totalEpisodes} total episodes
                  </ProgressText>
                  <ProgressBar>
                    <ProgressFill width={calculateTvProgress(item)} />
                  </ProgressBar>
                </ProgressContainer>
              )}

              {isTv && totalEpisodes === 0 && currentSeason && currentEpisode && (
                <ProgressContainer>
                  <ProgressText>
                    Season {currentSeason}, Episode {currentEpisode}
                  </ProgressText>
                </ProgressContainer>
              )}

              <CardBottom>
                <Stars>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} $filled={i < item.rating ? true : undefined} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </Star>
                  ))}
                </Stars>
                <StatusBadge $status={item.status}>{statusLabel}</StatusBadge>
              </CardBottom>
            </CardInfo>
          </ImageContainer>
        </CardFront>

        <ActivityCardBack item={item} onFlip={onFlip} onNavigateToDetails={onNavigateToDetails} />
      </CardInner>
    </Card>
  );
}

export const ActivityCard = memo(ActivityCardComponent);
