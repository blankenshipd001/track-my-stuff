import { useAuth } from "@/utils/providers/AuthContext";

export const useCurrentUser = () => {
  const { user, loading, login, logout } = useAuth();

  return { user, loading, login, logout };
};