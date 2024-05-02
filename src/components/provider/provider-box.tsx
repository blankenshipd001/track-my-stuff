import Image from "next/image";
import { Box } from "@mui/material";
import { ServiceProvider } from "@/data-models/service-provider.interface";

interface providerBox {
    provider: ServiceProvider;
}

const providerBox = {
  display: "flex",
  paddingRight: "10px",
  marginLeft: "10px",
  paddingTop: "10px",
};

const BASE_URL = process.env.NEXT_PUBLIC_THE_MOVIE_DB_BASE_URL;

export const ProviderBox = ({ provider }: providerBox): JSX.Element => (
  <Box sx={providerBox}>
    <Image src={`${BASE_URL}${provider.logo_path}`} alt={provider.provider_name} height={40} width={50} />
    <span>{provider.provider_name}</span>
  </Box>
);
