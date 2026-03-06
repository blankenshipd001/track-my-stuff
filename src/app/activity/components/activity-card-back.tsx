import { ExternalLink, Info } from "lucide-react";
import { Media } from "@/data-models/media.interface";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";
import { CardBack, IconButton } from "../styles";

interface ActivityCardBackProps {
  item: Media;
  onFlip: (id: number | undefined) => void;
  onNavigateToDetails: (item: Media) => void;
}

export function ActivityCardBack({ item, onFlip, onNavigateToDetails }: ActivityCardBackProps) {
  return (
    <CardBack>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: COLORS.purple.solid, margin: 0 }}>{item.title || item.name}</h3>
        <IconButton onClick={() => onFlip(item.id)} style={{ position: "static" }}>
          <Info size={14} />
        </IconButton>
      </div>

      <div style={{ fontSize: "0.875rem", color: "#d1d5db", lineHeight: "1.5", marginBottom: "1rem" }}>
        {item.overview ? (
          <p style={{ margin: 0 }}>{item.overview.length > 200 ? `${item.overview.slice(0, 200)}...` : item.overview}</p>
        ) : (
          <p style={{ margin: 0, fontStyle: "italic" }}>No overview available</p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
        {item.release_date && (
          <div>
            <span style={{ color: COLORS.gray[400], fontWeight: 600 }}>Release Date: </span>
            <span style={{ color: "#d1d5db" }}>{new Date(item.release_date).toLocaleDateString()}</span>
          </div>
        )}
        {item.first_air_date && (
          <div>
            <span style={{ color: COLORS.gray[400], fontWeight: 600 }}>First Air Date: </span>
            <span style={{ color: "#d1d5db" }}>{new Date(item.first_air_date).toLocaleDateString()}</span>
          </div>
        )}
        {item.vote_average > 0 && (
          <div>
            <span style={{ color: COLORS.gray[400], fontWeight: 600 }}>TMDB Rating: </span>
            <span style={{ color: "#fbbf24", fontWeight: 600 }}>{item.vote_average.toFixed(1)}/10</span>
          </div>
        )}
        {item.genres && item.genres.length > 0 && (
          <div>
            <span style={{ color: COLORS.gray[400], fontWeight: 600 }}>Genres: </span>
            <span style={{ color: "#d1d5db" }}>{item.genres.map((g) => g.name).join(", ")}</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
        <IconButton
          onClick={() => onNavigateToDetails(item)}
          style={{
            width: "100%",
            background: GRADIENTS.textPinkPurple,
            border: "none",
            padding: "0.75rem",
            gap: "0.5rem",
            fontWeight: 600,
          }}
        >
          <ExternalLink size={16} />
          View Full Details
        </IconButton>
      </div>
    </CardBack>
  );
}
