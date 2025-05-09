/* eslint-disable @typescript-eslint/no-explicit-any */
// app/movies/[slug]/ProviderLogos.tsx
import { Grid } from "@mui/material";
import Image from "next/image";

export default function ProviderLogos({ providers }: { providers: any }) {
  const BASE_URL = "https://image.tmdb.org/t/p/w500";
  return (
    <Grid container spacing={1}>
      {["buy", "rent", "flatrate"].flatMap((type) =>
        Array.isArray(providers?.[type]) ? providers[type].map((p: any, i: number) => (
          <Grid key={`${type}-${i}`}>
            <Image
              src={`${BASE_URL}${p.logo_path}`}
              alt={p.provider_name}
              width={40}
              height={40}
              style={{ borderRadius: "25%", background: "#fff" }}
            />
          </Grid>
        )) : []
      )}
    </Grid>
  );
}