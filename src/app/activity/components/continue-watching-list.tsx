"use client";

import { CSSProperties } from "react";
import styled from "styled-components";
import { Media } from "@/data-models/media.interface";
import { COLORS, GRADIENTS } from "@/lib/theme-constants";
import Image from "next/image";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { ServiceProvider } from "@/data-models/service-provider.interface";

interface Props {
  items: Media[];
  providerById: Map<string, ServiceProvider>;
  onNextEpisode: (item: Media) => void;
  onMarkWatched: (item: Media) => void;
  onProviderOverride: (item: Media) => void;
  onOpenDetails: (item: Media) => void;
}

const Section = styled.section`
  margin-bottom: 1.25rem;
`;

const Heading = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${COLORS.gray[100]};
`;

const List = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const Card = styled.article`
  padding: 0.9rem;
  border-radius: 0.9rem;
  background: ${GRADIENTS.card};
  border: 1px solid rgba(192, 132, 252, 0.2);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
`;

const ProgressText = styled.div`
  margin-top: 0.4rem;
  color: ${COLORS.gray[300]};
  font-size: 0.88rem;
`;

const Actions = styled.div`
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "danger" | "neutral" }>`
  height: 2.4rem;
  border-radius: 0.65rem;
  border: 1px solid transparent;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${COLORS.gray[50]};
  cursor: pointer;
  transition: all 0.18s ease;
  background: ${({ $variant }) => ($variant === "primary" ? GRADIENTS.purplePink : $variant === "danger" ? "rgba(239,68,68,0.22)" : "rgba(31,41,55,0.9)")};
  border-color: ${({ $variant }) => ($variant === "danger" ? "rgba(239,68,68,0.35)" : "rgba(156,163,175,0.25)")};

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.06);
  }
`;

const ProviderButton = styled.button`
  height: 2rem;
  border-radius: 999px;
  border: 1px solid rgba(192, 132, 252, 0.4);
  background: rgba(168, 85, 247, 0.15);
  color: ${COLORS.purple.solid};
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0 0.7rem;
  cursor: pointer;

  &:hover {
    background: rgba(168, 85, 247, 0.24);
  }
`;

const titleStyle: CSSProperties = {
  fontSize: "0.98rem",
  color: COLORS.text.primary,
  lineHeight: 1.3,
};

export function ContinueWatchingList({ items, providerById, onNextEpisode, onMarkWatched, onProviderOverride, onOpenDetails }: Props) {
  return (
    <Section>
      <Heading>Continue Watching</Heading>
      <List>
        {items.map((item) => {
          const selectedProvider = providerById.get(String(item.provider || item.selectedStreamer || ""));
          const posterPath = item.poster_path || item.backdrop_path;
          const flatrate = item.providers?.flatrate ?? [];

          return (
            <Card key={item.id}>
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

                <ProviderButton onClick={() => onProviderOverride(item)}>
                  Provider
                </ProviderButton>
              </div>
              <ProgressText>
                S{item.currentSeason ?? 1} E{item.currentEpisode ?? 1}
              </ProgressText>
              <Actions>
                <ActionButton $variant="primary" onClick={() => onNextEpisode(item)}>
                  Next Episode
                </ActionButton>
                <ActionButton $variant="danger" onClick={() => onMarkWatched(item)}>
                  Mark Watched
                </ActionButton>
                <ActionButton $variant="neutral" onClick={() => onOpenDetails(item)}>
                  Details
                </ActionButton>
              </Actions>
            </Card>
          );
        })}
      </List>
    </Section>
  );
}
