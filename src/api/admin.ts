import { apiAuthJson, apiDownloadAuth, apiGetAuth, apiPostAuth, apiUploadAuth } from "./client";

export type AdminStats = {
  donations_count: number;
  donations_total_cents: number;
  donations_pending: number;
  contacts_count: number;
  volunteers_count: number;
};

export type AnalyticsBucket = "day" | "week" | "month" | "year";

export type AnalyticsPoint = {
  bucket: string; // ISO datetime, period start
  total_cents: number;
  count: number;
};

export type AnalyticsResponse = {
  bucket: AnalyticsBucket;
  points: number;
  range_start: string;
  range_end: string;
  pending_count: number;
  series: AnalyticsPoint[];
};

export type AdminDonation = {
  id: string;
  provider: string;
  provider_ref: string;
  donor_name: string | null;
  donor_email: string | null;
  amount_cents: number;
  currency: string;
  frequency: string;
  designation: string;
  status: string;
  created_at: string;
};

export type AdminContact = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export type AdminVolunteer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  skills: string;
  availability: string | null;
  message: string | null;
  created_at: string;
};

type Page<T> = { total: number; items: T[] };

export type ImpactItem = { amount_cents: number; label: string };

export type Campaign = {
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
  impact_items: ImpactItem[] | null;
  raised_cents: number;
  donors_count: number;
  progress_pct: number;
  is_ended: boolean;
  share_url: string;
  created_at: string;
  updated_at: string;
};

export type CampaignInput = {
  slug: string;
  title: string;
  summary?: string;
  story_html?: string;
  hero_image_url?: string | null;
  goal_cents?: number;
  currency?: string;
  designation?: string;
  status?: Campaign["status"];
  featured?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  impact_items?: ImpactItem[] | null;
};

export const adminApi = {
  stats: (auth: string) => apiGetAuth<AdminStats>("/api/admin/stats", auth),
  analytics: (auth: string, bucket: AnalyticsBucket, points?: number) => {
    const p = new URLSearchParams({ bucket });
    if (points !== undefined) p.set("points", String(points));
    return apiGetAuth<AnalyticsResponse>(`/api/admin/analytics?${p.toString()}`, auth);
  },
  donations: (auth: string) =>
    apiGetAuth<Page<AdminDonation>>("/api/admin/donations?limit=200", auth),
  contacts: (auth: string) =>
    apiGetAuth<Page<AdminContact>>("/api/admin/contacts?limit=200", auth),
  volunteers: (auth: string) =>
    apiGetAuth<Page<AdminVolunteer>>("/api/admin/volunteers?limit=200", auth),
  reconcile: (auth: string) =>
    apiPostAuth<{ processed: number; worker: { running: boolean; last_run: string | null } }>(
      "/api/admin/reconcile",
      auth,
    ),
  campaigns: {
    list: (auth: string, includeArchived = false) =>
      apiGetAuth<{ items: Campaign[] }>(
        `/api/admin/campaigns?include_archived=${includeArchived}`,
        auth,
      ),
    create: (auth: string, body: CampaignInput) =>
      apiPostAuth<Campaign>("/api/admin/campaigns", auth, body),
    update: (auth: string, idOrSlug: string, body: Partial<CampaignInput>) =>
      apiAuthJson<Campaign>("PATCH", `/api/admin/campaigns/${idOrSlug}`, auth, body),
    archive: (auth: string, idOrSlug: string) =>
      apiAuthJson<void>("DELETE", `/api/admin/campaigns/${idOrSlug}`, auth),
    postUpdate: (auth: string, idOrSlug: string, body: { title: string; body_html: string }) =>
      apiPostAuth<{ id: string; title: string; body_html: string; created_at: string }>(
        `/api/admin/campaigns/${idOrSlug}/updates`,
        auth,
        body,
      ),
  },
  exportCsv: async (auth: string, campaignSlug?: string) => {
    const qs = campaignSlug ? `?campaign_slug=${encodeURIComponent(campaignSlug)}` : "";
    return apiDownloadAuth(`/api/admin/donations.csv${qs}`, auth);
  },
  uploadImage: (auth: string, file: File) =>
    apiUploadAuth<{ url: string; filename: string; size: number }>(
      "/api/admin/uploads/image",
      auth,
      file,
    ),
};
