"use client";
import { ThemeProvider } from "@mui/material";

import { FC, ReactNode } from "react";
import { darkTheme } from "@utils/themes/theme";
import EmotionCache from "./EmotionCache";

interface Props {
  children: ReactNode;
}

export const Providers: FC<Props> = ({ children }: Props) => {
  return (
    <EmotionCache>
      <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
    </EmotionCache>
  );
};
