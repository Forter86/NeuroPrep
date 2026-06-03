"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth/users";
import { getSessionUser } from "@/lib/auth/sessionStorage";

export function useAuthUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getSessionUser());
  }, []);

  return user;
}
