import { apiPost } from "./client";

export type Frequency = "one_time" | "monthly";
export type Designation = "general" | "grace_bridge" | "education" | "livelihood";

export type DonationIntentIn = {
  amount: number;
  frequency: Frequency;
  designation: Designation;
  donor_name?: string;
  donor_email?: string;
  campaign_slug?: string;
  is_anonymous?: boolean;
};

export type DonationIntentOut = {
  checkout_url: string;
  session_id: string;
};

export async function createStripeIntent(body: DonationIntentIn) {
  return apiPost<DonationIntentOut>("/api/donations/intent", body);
}

export async function createPaypalOrder(body: DonationIntentIn) {
  return apiPost<{ order_id: string; approve_url?: string; kind: "order" | "subscription" }>(
    "/api/donations/paypal/create",
    body,
  );
}

export async function capturePaypalOrder(order_id: string) {
  return apiPost<{ status: string }>("/api/donations/paypal/capture", { order_id });
}

export type DonationStatus = {
  session_id: string;
  payment_status: "paid" | "unpaid" | "no_payment_required" | null;
  amount_cents: number;
  currency: string;
  status: string;
};

export async function getDonationStatus(session_id: string) {
  const { apiGet } = await import("./client");
  return apiGet<DonationStatus>(`/api/donations/status?session_id=${encodeURIComponent(session_id)}`);
}

export type ContactIn = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function sendContact(body: ContactIn) {
  return apiPost<{ status: string }>("/api/contact", body);
}

export type VolunteerIn = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string;
  availability?: string;
  message?: string;
};

export async function sendVolunteer(body: VolunteerIn) {
  return apiPost<{ status: string }>("/api/volunteer", body);
}
