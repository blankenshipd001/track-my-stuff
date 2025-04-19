"use client";
import { ThemeProvider } from "@mui/material";

import { FC, ReactNode } from "react";
import { darkTheme } from "@utils/themes/theme";
import { AuthProvider } from "./AuthContext";

interface Props { children: ReactNode }

export const Providers: FC<Props> = ({ children }: Props) => {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};
