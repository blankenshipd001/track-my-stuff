"use client";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth-provider";
import { FC, ReactNode } from "react";
import { darkTheme } from "@utils/themes/theme";

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
