"use client";
import { ThemeProvider } from "@mui/material";

import { FC, ReactNode } from "react";
import { darkTheme } from "@utils/themes/theme";

interface Props {
  children: ReactNode;
}

export const Providers: FC<Props> = ({ children }: Props) => {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
};
