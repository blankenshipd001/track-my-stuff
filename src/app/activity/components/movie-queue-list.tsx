"use client";

import { CSSProperties } from "react";
import Image from "next/image";
import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";

const sectionStyle: CSSProperties = {
  marginTop: 20,
};

const headingStyle: CSSProperties = {
  margin: "0 0 12px 0",
  fontSize: "1.1rem",
  fontWeight: 700,
  color: COLORS.gray[100],
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const cardStyle: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  background: GRADIENTS.cardLight,
  border: "1px solid rgba(244, 114, 182, 0.2)",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.28)",
};

const titleStyle: CSSProperties = {
  fontSize: "0.98rem",
  color: COLORS.text.primary,
  lineHeight: 1.3,
};

const providerButtonStyle: CSSProperties = {
  height: 32,
  borderRadius: 999,
  border: "1px solid rgba(244, 114, 182, 0.35)",
  background: "rgba(244, 114, 182, 0.12)",
  color: COLORS.pink.solid,
  fontSize: "0.76rem",
  fontWeight: 700,
  padding: "0 12px",
  cursor: "pointer",
  transition: "all 0.18s ease",
};

const actionsStyle: CSSProperties = {
  marginTop: 10,
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 8,
};

const actionButtonBase: CSSProperties = {
  height: 38,
  borderRadius: 10,
  padding: "0 8px",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: COLORS.gray[50],
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "all 0.18s ease",
  whiteSpace: "nowrap",
};

const primaryActionStyle: CSSProperties = {
  background: GRADIENTS.purplePink,
};

const secondaryActionStyle: CSSProperties = {
  background: "rgba(31, 41, 55, 0.92)",
  borderColor: "rgba(156, 163, 175, 0.25)",
};

const dangerActionStyle: CSSProperties = {
  background: "rgba(239, 68, 68, 0.2)",
  borderColor: "rgba(239, 68, 68, 0.35)",
};

const emptyStateStyle: CSSProperties = {
  padding: "14px 12px",
  borderRadius: 12,
  border: "1px dashed rgba(156,163,175,0.35)",
  color: COLORS.gray[300],
  background: "rgba(31, 41, 55, 0.45)",
  fontSize: "0.9rem",
};

interface Props {
  items: Media[];
  providerById: Map<string, ServiceProvider>;
  onStartWatching: (item: Media) => void;
  onMarkWatched: (item: Media) => void;
  onDelete: (item: Media) => void;
  onProviderOverride: (item: Media) => void;
}

export function MovieQueueList({ items, providerById, onStartWatching, onMarkWatched, onDelete, onProviderOverride }: Props) {
  if (items.length === 0) {
    return (
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Movies To See</h2>
        <div style={emptyStateStyle}>No movies in your queue yet.</div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>Movies To See</h2>

      <div style={listStyle}>
        {items.map((item) => {
          const selectedProvider = providerById.get(String(item.provider || item.selectedStreamer || ""));
          const posterPath = item.poster_path || item.backdrop_path;
          const flatrate = item.providers?.flatrate ?? [];
          return (
            <article key={item.id} style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 10, alignItems: "center" }}>
                <div style={{ width: 56, height: 84, borderRadius: 8, overflow: "hidden", background: "#1f2937", flexShrink: 0 }}>{posterPath ? <Image src={getProxyImageUrlForPath(posterPath, "w185") || ""} alt={item.title || item.name || "Poster"} width={56} height={84} style={{ width: "56px", height: "84px", objectFit: "cover" }} /> : <div style={{ width: "56px", height: "84px", display: "grid", placeItems: "center", color: COLORS.gray[500], fontSize: 10 }}>No Art</div>}</div>

                <div style={{ minWidth: 0 }}>
                  <strong style={titleStyle}>{item.title || item.name}</strong>

                  <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                    {selectedProvider?.logo_path ? <Image src={getProxyImageUrlForPath(selectedProvider.logo_path, "w45") || ""} alt={selectedProvider.provider_name} width={18} height={18} style={{ borderRadius: 4, background: "#fff", padding: 1 }} /> : null}
                    <span style={{ fontSize: 12, color: COLORS.gray[300], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedProvider?.provider_name || "Provider not set"}</span>
                  </div>

                  {!selectedProvider && flatrate.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                      {flatrate.slice(0, 4).map((p) => (
                        <Image key={p.provider_id} src={getProxyImageUrlForPath(p.logo_path, "w45") || ""} alt={p.provider_name} width={16} height={16} style={{ borderRadius: 3, background: "#fff", padding: 1 }} />
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => onProviderOverride(item)} style={providerButtonStyle}>
                  Provider
                </button>
              </div>
             
              <div style={actionsStyle}>
                <button
                  onClick={() => onStartWatching(item)}
                  style={{ ...actionButtonBase, ...primaryActionStyle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "brightness(1.06)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "brightness(1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Start Watching
                </button>

                <button
                  onClick={() => onMarkWatched(item)}
                  style={{ ...actionButtonBase, ...secondaryActionStyle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(31, 41, 55, 1)";
                    e.currentTarget.style.borderColor = "rgba(192, 132, 252, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(31, 41, 55, 0.92)";
                    e.currentTarget.style.borderColor = "rgba(156, 163, 175, 0.25)";
                  }}
                >
                  Mark Watched
                </button>

                <button
                  onClick={() => onDelete(item)}
                  style={{ ...actionButtonBase, ...dangerActionStyle }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.35)";
                  }}
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
