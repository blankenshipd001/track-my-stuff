/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import Image from "next/image";


const ProviderComponent = ({provider, imageSrc}: any) => {
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