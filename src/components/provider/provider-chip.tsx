import { Avatar, Chip } from "@mui/material";
import { ServiceProvider } from "@/data-models/service-provider.interface";

interface providerChip {
  providerInfo: ServiceProvider;
}

export const ProviderChip = ({ providerInfo }: providerChip) => {
  const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

  const getProviderLogo = (p: ServiceProvider) => {
    return `${BASE_URL}${p.logo_path}`;
  };

  return (
    <Chip label={providerInfo.provider_name} sx={{ mr: 1, mt: 1 }} avatar={<Avatar alt={providerInfo.provider_name} src={getProviderLogo(providerInfo)} />} />
  );
};
