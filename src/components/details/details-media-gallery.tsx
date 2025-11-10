import React from "react"
import Image from "next/image";
import { Box, Grid, Typography } from "@mui/material";
import { Media } from "@/data-models/media.interface";

export default function DetailsMediaGallery({media}: { media: Media }) {

    {/* Media Gallery */}
    return (
      <Box mt={6}>
        {/* Videos */}
        <Grid container spacing={2} mt={2}>
          {media.videos?.results?.slice(0, 2).map((video) => (
            <Grid size={{ xs: 12, md: 6 }} key={video.id}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "56.25%", // 16:9 aspect ratio
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                  allowFullScreen
                ></iframe>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom color="white">
          Media Gallery
        </Typography>
        <Grid container spacing={2}>
          {/* Images */}
          {media.images?.backdrops?.slice(0, 4).map((img, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              {img.file_path ? (
                <Image
                  src={`/api/image?path=${encodeURIComponent(`/t/p/w780${img.file_path}`)}`}
                  alt={`Backdrop ${index + 1}`}
                  width={300}
                  height={170}
                  style={{
                    borderRadius: 10,
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
}