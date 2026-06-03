"use client";

import { useAuth } from "@/lib/auth/AuthContext";

export function useAuthUser() {
  return useAuth().user;
}
