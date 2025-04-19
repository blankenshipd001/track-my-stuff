"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface AuthUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

interface SSRAuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const SSRAuthContext = createContext<SSRAuthContextType>({
  user: null,
  loading: true,
});

export const useSSRAuth = () => useContext(SSRAuthContext);

interface ProviderProps {
  initialUser: AuthUser | null;
  children: React.ReactNode;
}

export const SSRAuthProvider: React.FC<ProviderProps> = ({ initialUser, children }) => {
  const [user] = useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <SSRAuthContext.Provider value={{ user, loading }}>
      {children}
    </SSRAuthContext.Provider>
  );
};