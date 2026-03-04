"use client";

import React, { useState, useEffect } from "react";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import { SearchBox } from "@components/search";
import { Media } from "@/data-models/media.interface";
import { User } from "@/data-models/user.interface";
import TabsWrapper from "../panels/tab-wrapper";
interface MovieContentProps {
  popularMedia: Media[];
  user?: User | null;
  initialWatchList?: Media[];
}

export const MovieContent = ({ popularMedia, user, initialWatchList = [] }: MovieContentProps) => {
  const [everything, ] = useState<Media[]>(popularMedia);
  const [watchList, ] = useState<Media[]>(initialWatchList);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: isClient && isMobile ? 2 : 4, position: "relative", minHeight: 400 }}>
      <Box sx={{ mb: 2, position: "relative", zIndex: 1 }}>
        <SearchBox user={user} />
      </Box>
      <TabsWrapper user={user} watchList={watchList} allContent={everything} />

    </Container>
  );
};

export default MovieContent;
