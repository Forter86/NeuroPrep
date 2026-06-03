"use client";

import { createContext, useContext } from "react";
import type { AuthUser } from "@/lib/auth/users";

export type AuthContextValue = {
  user: AuthUser | null;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  logout: () => {},
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
