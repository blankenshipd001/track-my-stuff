"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, useTheme, useMediaQuery } from "@mui/material";
import { SearchBox } from "@components/search";
import { getContent } from "@/utils/api/contentApi";
import { Media } from "@/data-models/media.interface";
import TabsWrapper from "../panels/tab-wrapper";
interface MovieContentProps {
  popularMedia: Media[];
  user?: { uid: string; email?: string } | null;
}

export const MovieContent = ({ popularMedia, user }: MovieContentProps) => {
  const router = useRouter();

  const [everything, setEverything] = useState<Media[]>([]);
  const [watchList, setWatchList] = useState<Media[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    getContent(user.uid)
      .then((data: Media[]) => setWatchList(data))
      .catch(() => router.push("/"));
  }, [user]);

  useEffect(() => {
    setEverything(popularMedia);
  }, [popularMedia]);

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
