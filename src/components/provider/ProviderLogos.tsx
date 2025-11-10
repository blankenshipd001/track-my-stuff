import { ServiceProvider } from "@/data-models/service-provider.interface";
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { getProxyImageUrlForPath } from '@/lib/imageUrl';

interface ProviderSectionsProps {
  providers: {
    flatrate?: ServiceProvider[];
    buy?: ServiceProvider[];
    rent?: ServiceProvider[];
  };
}

export const ProviderLogos = ({ title, list }: { title?: string; list: ServiceProvider[] }) => (
  <Box mb={1}>
    <Typography variant="subtitle1" sx={{ fontWeight: 400, mb: 0.5 }}>
      {title}
    </Typography>
    <Grid container spacing={1}>
      {list.map((p, i) => (
        <Grid key={`${title}-${i}`}>
          {p.logo_path ? (
            <Image
              src={getProxyImageUrlForPath(p.logo_path, 'w500')!}
              alt={p.provider_name ?? 'image'}
              width={40}
              height={40}
              style={{
                borderRadius: "25%",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
            />
          ) : (
            <Box sx={{ width: 40, height: 40, borderRadius: '25%', background: '#fff' }} />
          )}
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default function ProviderSections({ providers }: ProviderSectionsProps) {
  return (
    <Box mt={1}>
      {(providers?.flatrate?.length ?? 0) > 0 && <ProviderLogos title="Streaming On" list={providers.flatrate ?? []} />}
      {(providers?.rent?.length ?? 0) > 0 && <ProviderLogos title="Available to Rent" list={providers.rent ?? []} />}
      {(providers?.buy?.length ?? 0) > 0 && <ProviderLogos title="Available to Buy" list={providers.buy ?? []} />}
    </Box>
  );
}
