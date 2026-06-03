export type AuthUser = {
  login: string;
  displayName: string;
};

export const AUTH_USERS: Record<string, string> = {
  ARTUR: "ARTUR",
  DENIS: "DENIS",
  ANTON: "ANTON",
  USER: "USER",
};

export function validateCredentials(login: string, password: string): AuthUser | null {
  const normalizedLogin = login.trim().toUpperCase();
  const normalizedPassword = password.trim().toUpperCase();

  if (!normalizedLogin || !normalizedPassword) return null;

  const expectedPassword = AUTH_USERS[normalizedLogin];
  if (!expectedPassword || expectedPassword !== normalizedPassword) return null;

  return {
    login: normalizedLogin,
    displayName: normalizedLogin.charAt(0) + normalizedLogin.slice(1).toLowerCase(),
  };
}
