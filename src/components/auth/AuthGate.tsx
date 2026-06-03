"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth/users";
import { getSessionUser } from "@/lib/auth/sessionStorage";
import { LabProLoginForm } from "@/components/auth/LabProLoginForm";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getSessionUser());
    setReady(true);
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

  return <>{children}</>;
}
