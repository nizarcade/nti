import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { capturePaypalOrder, createPaypalOrder } from "@/api/donations";
import type { Designation, Frequency } from "@/api/donations";

type Props = {
  amount: number;
  frequency: Frequency;
  designation: Designation;
  donorName?: string;
  donorEmail?: string;
  campaignSlug?: string;
  isAnonymous?: boolean;
  disabled?: boolean;
  onError?: (msg: string) => void;
};

export default function PaypalButton({
  amount,
  frequency,
  designation,
  donorName,
  donorEmail,
  campaignSlug,
  isAnonymous,
  disabled,
  onError,
}: Props) {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const isSubscription = frequency === "monthly";

  if (!clientId) {
    return (
      <div style={{ fontSize: 14, color: "#52606D" }}>
        PayPal not configured — set <code>VITE_PAYPAL_CLIENT_ID</code> in <code>.env.local</code>.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: isSubscription ? "subscription" : "capture",
        vault: isSubscription ? true : undefined,
        components: "buttons",
      }}
    >
      <PayPalButtons
        disabled={disabled}
        style={{
          layout: "vertical",
          color: "gold",
          shape: "pill",
          label: isSubscription ? "subscribe" : "donate",
        }}
        forceReRender={[amount, designation, donorName, donorEmail, frequency, campaignSlug, isAnonymous]}
        createOrder={
          isSubscription
            ? undefined
            : async () => {
                try {
                  const r = await createPaypalOrder({
                    amount,
                    frequency,
                    designation,
                    donor_name: donorName,
                    donor_email: donorEmail,
                    campaign_slug: campaignSlug,
                    is_anonymous: isAnonymous,
                  });
                  return r.order_id;
                } catch (e: unknown) {
                  onError?.(e instanceof Error ? e.message : "PayPal order failed");
                  throw e;
                }
              }
        }
        createSubscription={
          isSubscription
            ? async () => {
                try {
                  const r = await createPaypalOrder({
                    amount,
                    frequency,
                    designation,
                    donor_name: donorName,
                    donor_email: donorEmail,
                    campaign_slug: campaignSlug,
                    is_anonymous: isAnonymous,
                  });
                  return r.order_id; // subscription id
                } catch (e: unknown) {
                  onError?.(e instanceof Error ? e.message : "PayPal subscription failed");
                  throw e;
                }
              }
            : undefined
        }
        onApprove={async (data) => {
          try {
            if (isSubscription) {
              // Subscription approval — PayPal has already activated it.
              navigate("/donate/success?provider=paypal&kind=subscription");
              return;
            }
            const r = await capturePaypalOrder(data.orderID);
            if (r.status === "COMPLETED") {
              navigate("/donate/success");
            } else {
              onError?.(`PayPal status: ${r.status}`);
            }
          } catch (e: unknown) {
            onError?.(e instanceof Error ? e.message : "Capture failed");
          }
        }}
        onCancel={() => navigate("/donate/cancel")}
        onError={(err) => onError?.(err?.toString() || "PayPal error")}
      />
    </PayPalScriptProvider>
  );
}
