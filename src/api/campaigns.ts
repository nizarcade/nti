import { apiGet } from "./client";

export type PublicCampaign = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  story_html: string;
  hero_image_url: string | null;
  goal_cents: number;
  currency: string;
  designation: string;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  featured: boolean;
  starts_at: string;
  ends_at: string | null;
  impact_items: { amount_cents: number; label: string }[] | null;
  raised_cents: number;
  donors_count: number;
  progress_pct: number;
  is_ended: boolean;
  share_url: string;
  created_at: string;
  updated_at: string;
  updates?: { id: string; title: string; body_html: string; created_at: string }[];
};

export type PublicDonor = {
  donor_name: string;
  amount_cents: number;
  currency: string;
  frequency: string;
  created_at: string;
};

export type PublicTopDonor = {
  donor_name: string;
  total_cents: number;
  currency: string;
  donations_count: number;
};

export const campaignsApi = {
  list: (opts?: { featured?: boolean; limit?: number; offset?: number }) => {
    const p = new URLSearchParams();
    if (opts?.featured !== undefined) p.set("featured", String(opts.featured));
    if (opts?.limit !== undefined) p.set("limit", String(opts.limit));
    if (opts?.offset !== undefined) p.set("offset", String(opts.offset));
    const qs = p.toString();
    return apiGet<{ total: number; items: PublicCampaign[] }>(
      `/api/campaigns${qs ? `?${qs}` : ""}`,
    );
  },
  get: (slug: string) => apiGet<PublicCampaign>(`/api/campaigns/${encodeURIComponent(slug)}`),
  donors: (slug: string, limit = 20) =>
    apiGet<{ items: PublicDonor[] }>(
      `/api/campaigns/${encodeURIComponent(slug)}/donors?limit=${limit}`,
    ),
  topDonors: (slug: string, limit = 3) =>
    apiGet<{ items: PublicTopDonor[] }>(
      `/api/campaigns/${encodeURIComponent(slug)}/top-donors?limit=${limit}`,
    ),
};
