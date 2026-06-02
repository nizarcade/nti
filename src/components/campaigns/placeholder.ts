/**
 * Default hero image used when a campaign has no `hero_image_url`.
 * The file lives under `public/` so Vite serves it from the site root.
 */
export const CAMPAIGN_PLACEHOLDER_IMAGE = "/campaign-placeholder.png";

export function campaignImage(url: string | null | undefined): string {
  return url && url.trim() !== "" ? url : CAMPAIGN_PLACEHOLDER_IMAGE;
}
