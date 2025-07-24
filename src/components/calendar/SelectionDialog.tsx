import { Media } from "@/data-models/media.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";
import { Box, Chip, Dialog, DialogContent, DialogTitle, Grid, Slide, Typography, useTheme, SlideProps } from "@mui/material";
import Image from "next/image";
import React from "react";
import dayjs from "dayjs";

interface SelectionDialogProps {
  selectedDay: dayjs.Dayjs;
  selectedShows: Media[];
  handleCloseDialog: () => void;
}

const Transition = React.forwardRef(function Transition(props: SlideProps, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SelectionDialog = ({ selectedDay, selectedShows, handleCloseDialog }: SelectionDialogProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          color: theme.palette.primary.contrastText,
          fontWeight: "bold",
          fontSize: "1.5rem",
          borderRadius: "12px 12px 12px 12px",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "center",
          marginBottom: theme.spacing(2),
          py: 2,
          borderRadius: "12px 12px 0 0",
        }}
      >
        {selectedDay.format("dddd, MMMM D, YYYY")}
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          {selectedShows.map((show, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={index}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                borderRadius={2}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: 2,
                  height: "100%",
                  p: 2,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <Image src={`https://image.tmdb.org/t/p/w185${show.poster_path}`} alt={show.name ?? 'image'} width={110} height={165} style={{ borderRadius: 8 }} />

                <Typography variant="subtitle1" fontWeight={600} mt={1} textAlign="center" noWrap title={show.name}>
                  {show.name}
                </Typography>

                {/* Metadata Section */}
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  {show.first_air_date ? dayjs(show.first_air_date).format("YYYY") : ""}
                  {show.vote_average ? ` • ⭐ ${show.vote_average.toFixed(1)}` : ""}
                </Typography>

                {show.genres?.length > 0 && (
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    {show.genres.map((g) => g.name).join(", ")}
                  </Typography>
                )}

                {/* Providers */}
                {show.providers?.flatrate?.length > 0 && (
                  <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1} mt={1}>
                    {show.providers.flatrate.map((provider: ServiceProvider) => (
                      <Chip
                        key={provider.provider_id}
                        icon={<Image loading="lazy" src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} alt={provider.provider_name ?? 'image'} width={24} height={24} style={{ borderRadius: 4 }} />}
                        label={provider.provider_name}
                        size="small"
                        sx={{
                          bgcolor: theme.palette.grey[900],
                          color: "white",
                          pl: 0.5,
                          maxWidth: 140,
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SelectionDialog;
