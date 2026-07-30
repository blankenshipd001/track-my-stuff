import { ExternalLink, Info } from "lucide-react";
import { Box, Button, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";

interface ActivityCardBackProps {
  item: Media;
  onFlip: (id: number | undefined) => void;
  onNavigateToDetails: (item: Media) => void;
}

export function ActivityCardBack({ item, onFlip, onNavigateToDetails }: ActivityCardBackProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        background: "linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)",
        backdropFilter: "blur(12px)",
        p: "1.5rem",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxSizing: "border-box",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: "0.5rem" }}>
        <Typography component="h3" sx={{ fontSize: "1.25rem", fontWeight: "bold", color: COLORS.purple.solid, m: 0 }}>
          {item.title || item.name}
        </Typography>
        <Button
          onClick={() => onFlip(item.id)}
          sx={{
            minWidth: 0,
            background: "rgba(17, 24, 39, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(75, 85, 99, 0.5)",
            borderRadius: "0.5rem",
            p: "0.5rem",
            color: "white",
            "&:hover": {
              background: "rgba(31, 41, 55, 0.9)",
              borderColor: "#a855f7",
            },
          }}
        >
          <Info size={14} />
        </Button>
      </Box>

      <Box sx={{ fontSize: "0.875rem", color: "#d1d5db", lineHeight: "1.5", mb: "1rem" }}>
        {item.overview ? (
          <Typography component="p" sx={{ m: 0 }}>{item.overview.length > 200 ? `${item.overview.slice(0, 200)}...` : item.overview}</Typography>
        ) : (
          <Typography component="p" sx={{ m: 0, fontStyle: "italic" }}>No overview available</Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
        {item.release_date && (
          <Typography>
            <Box component="span" sx={{ color: COLORS.gray[400], fontWeight: 600 }}>Release Date: </Box>
            <Box component="span" sx={{ color: "#d1d5db" }}>{new Date(item.release_date).toLocaleDateString()}</Box>
          </Typography>
        )}
        {item.first_air_date && (
          <Typography>
            <Box component="span" sx={{ color: COLORS.gray[400], fontWeight: 600 }}>First Air Date: </Box>
            <Box component="span" sx={{ color: "#d1d5db" }}>{new Date(item.first_air_date).toLocaleDateString()}</Box>
          </Typography>
        )}
        {item.vote_average > 0 && (
          <Typography>
            <Box component="span" sx={{ color: COLORS.gray[400], fontWeight: 600 }}>TMDB Rating: </Box>
            <Box component="span" sx={{ color: "#fbbf24", fontWeight: 600 }}>{item.vote_average.toFixed(1)}/10</Box>
          </Typography>
        )}
        {item.genres && item.genres.length > 0 && (
          <Typography>
            <Box component="span" sx={{ color: COLORS.gray[400], fontWeight: 600 }}>Genres: </Box>
            <Box component="span" sx={{ color: "#d1d5db" }}>{item.genres.map((g) => g.name).join(", ")}</Box>
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: "auto", pt: "1rem" }}>
        <Button
          onClick={() => onNavigateToDetails(item)}
          sx={{
            width: "100%",
            background: GRADIENTS.textPinkPurple,
            border: "none",
            p: "0.75rem",
            gap: "0.5rem",
            fontWeight: 600,
            color: "white",
            textTransform: "none",
            "&:hover": {
              filter: "brightness(1.05)",
            },
          }}
        >
          <ExternalLink size={16} />
          View Full Details
        </Button>
      </Box>
    </Box>
  );
}
