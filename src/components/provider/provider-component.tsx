import Image from "next/image";
import { Box } from "@mui/material";
import { ServiceProvider } from "@/data-models/service-provider.interface";

interface ProviderComponent {
  provider: ServiceProvider;
  imageSrc: string;
}

const ProviderComponent = ({provider, imageSrc}: ProviderComponent) => {
    return (
      <Box sx={{ paddingRight: "10px" }}>
        <Image
          style={{ borderRadius: "10px" }}
          src={imageSrc}
          alt={provider.provider_name}
          height={32}
          width={32}
        />
      </Box>
    );
  };

  export default ProviderComponent;