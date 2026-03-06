import { memo } from "react";
import NextImage from "next/image";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { COLORS } from "@/lib/theme-constants";
import { getProxyImageUrlForPath } from "@/lib/imageUrl";
import { FALLBACK_PROVIDER_META } from "../activity-helpers";
import { ProviderBadgesContainer, ProviderBadge } from "../styles";

interface ActivityProviderBadgeProps {
  providerId?: string;
  providerById: Map<string, ServiceProvider>;
}

function ActivityProviderBadgeComponent({ providerId, providerById }: ActivityProviderBadgeProps) {
  if (!providerId) {
    return null;
  }

  const provider = providerById.get(String(providerId));

  if (!provider) {
    const providerMeta = FALLBACK_PROVIDER_META[providerId];
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
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <NextImage
            src={getProxyImageUrlForPath(provider.logo_path, "w45")!}
            alt={provider.provider_name}
            width={24}
            height={24}
            style={{ objectFit: "contain" }}
          />
        </div>
      ) : (
        <ProviderBadge color={COLORS.purple.solid}>{provider.provider_name}</ProviderBadge>
      )}
    </ProviderBadgesContainer>
  );
}

export const ActivityProviderBadge = memo(ActivityProviderBadgeComponent);
