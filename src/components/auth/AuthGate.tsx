"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth/types";
import { apiLogout, apiMe, apiRefresh } from "@/lib/auth/client";
import { AuthContext } from "@/lib/auth/AuthContext";
import { LabProLoginForm } from "@/components/auth/LabProLoginForm";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let current = await apiMe();
      if (!current) current = await apiRefresh();
      if (!cancelled) {
        setUser(current);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  if (!ready) {
    return <div className="min-h-full flex-1 bg-white" aria-hidden />;
  }

  if (!user) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <LabProLoginForm onSuccess={setUser} />
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
}
