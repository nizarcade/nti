import { apiAuthJson, apiGet, apiGetAuth, apiPostAuth } from "./client";

export type PageMeta = {
  data: unknown;
  updated_at: string | null;
  updated_by: string | null;
};

export const pageContentApi = {
  public: <T>(slug: string) => apiGet<T>(`/api/site/pages/${slug}`),
  admin: (slug: string, token: string) =>
    apiGetAuth<PageMeta>(`/api/admin/pages/${slug}`, token),
  save: (slug: string, token: string, data: unknown) =>
    apiAuthJson<PageMeta>("PUT", `/api/admin/pages/${slug}`, token, data),
  reset: (slug: string, token: string) =>
    apiPostAuth<PageMeta>(`/api/admin/pages/${slug}/reset`, token, {}),
};
