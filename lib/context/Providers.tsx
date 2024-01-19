"use client";
import { ThemeProvider } from "@mui/material";
import { AuthProvider } from "./auth-provider";
import { darkTheme } from "@/lib/shared/theme";
import { FC, ReactNode } from "react";

interface Props { children: ReactNode }

const Providers: FC<Props> = ({ children }: Props) => {
  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;