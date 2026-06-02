import { apiAuthJson, apiGet, apiGetAuth, apiPostAuth } from "./client";

// Keep block shapes loose on the client — the server is the source of truth
// for validation. Renderer narrows per `type`.
export type CustomBlock = {
  id: string;
  type: string;
  data: Record<string, unknown>;
};

export type CustomPagePublic = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  blocks: CustomBlock[];
  seo: { description?: string; ogImage?: string };
  created_at: string | null;
  updated_at: string | null;
  updated_by: string | null;
};

export type CustomPageSummary = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  updated_at: string | null;
  updated_by: string | null;
};

export type CustomPageUpdate = {
  slug?: string;
  title?: string;
  status?: "draft" | "published";
  blocks?: CustomBlock[];
  seo?: { description?: string; ogImage?: string };
};

export const customPagesApi = {
  public: (slug: string) =>
    apiGet<CustomPagePublic>(`/api/site/pages-custom/${slug}`),
  list: (token: string) =>
    apiGetAuth<CustomPageSummary[]>("/api/admin/pages-custom", token),
  create: (token: string, body: { slug: string; title: string }) =>
    apiPostAuth<CustomPagePublic>("/api/admin/pages-custom", token, body),
  get: (token: string, id: string) =>
    apiGetAuth<CustomPagePublic>(`/api/admin/pages-custom/${id}`, token),
  update: (token: string, id: string, body: CustomPageUpdate) =>
    apiAuthJson<CustomPagePublic>("PUT", `/api/admin/pages-custom/${id}`, token, body),
  duplicate: (token: string, id: string, body: { slug: string; title?: string }) =>
    apiPostAuth<CustomPagePublic>(
      `/api/admin/pages-custom/${id}/duplicate`,
      token,
      body,
    ),
  remove: (token: string, id: string) =>
    apiAuthJson<void>("DELETE", `/api/admin/pages-custom/${id}`, token),
};
