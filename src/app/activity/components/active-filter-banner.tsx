import { Film, Tv, X } from "lucide-react";
import { COLORS } from "@/lib/theme-constants";
import { ActivityFilter, toLabel } from "../activity-helpers";

interface ActiveFilterBannerProps {
  filter: ActivityFilter;
  count: number;
  onClear: () => void;
}

export function ActiveFilterBanner({ filter, count, onClear }: ActiveFilterBannerProps) {
  if (filter === "all") {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1rem",
        background: "rgba(168, 85, 247, 0.15)",
        border: "1px solid rgba(168, 85, 247, 0.3)",
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.25rem 0.75rem",
            background: "rgba(168, 85, 247, 0.3)",
            borderRadius: "0.375rem",
            border: "1px solid rgba(168, 85, 247, 0.4)",
          }}
        >
          {filter === "movies" && <Film size={16} color={COLORS.purple.solid} />}
          {filter === "tv" && <Tv size={16} color={COLORS.purple.solid} />}
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: COLORS.purple.solid }}>{toLabel(filter)}</span>
        </div>
        <span style={{ fontSize: "0.875rem", color: "#d1d5db" }}>
          Showing <strong style={{ color: COLORS.purple.solid }}>{count}</strong> {count === 1 ? "item" : "items"}
        </span>
      </div>
      <button
        onClick={onClear}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.375rem",
          padding: "0.375rem 0.625rem",
          background: "transparent",
          border: "1px solid rgba(168, 85, 247, 0.4)",
          borderRadius: "0.375rem",
          color: COLORS.purple.solid,
          fontSize: "0.8125rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(168, 85, 247, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <X size={14} />
        Clear Filter
      </button>
    </div>
  );
}
