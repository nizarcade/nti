import { apiGetAuth, apiPost } from "./client";

export type AdminUser = {
  id: string;
  username: string;
  email: string | null;
  role: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_at: string;
  user: AdminUser;
};

export const authApi = {
  login: (username: string, password: string) =>
    apiPost<TokenResponse>("/api/admin/auth/login", { username, password }),
  me: (token: string) => apiGetAuth<AdminUser>("/api/admin/auth/me", token),
};
