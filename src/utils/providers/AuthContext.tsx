"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // or "next/router" in Pages Router
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase/firebase";
import nookies from "nookies";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });
        setUser(user);
      } else {
        setUser(null);
        nookies.destroy(undefined, "token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      nookies.set(undefined, "token", token, { path: "/" });
      setUser(user);
      router.refresh();
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      nookies.destroy(undefined, "token");
      setUser(null);
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};