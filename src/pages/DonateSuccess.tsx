import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassIcon from "@mui/icons-material/HourglassEmpty";
import Seo from "@/components/ui/Seo";
import { getDonationStatus, type DonationStatus } from "@/api/donations";

function fmtMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default function DonateSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<DonationStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    async function poll() {
      try {
        const r = await getDonationStatus(sessionId!);
        if (cancelled) return;
        setStatus(r);
        if (r.payment_status !== "paid" && attempts < 5) {
          attempts += 1;
          setTimeout(poll, 1500);
        } else {
          setLoading(false);
        }
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Could not verify payment.");
        setLoading(false);
      }
    }
    void poll();
    return () => { cancelled = true; };
  }, [sessionId]);

  const paid = status?.payment_status === "paid";

  return (
    <>
      <Seo title="Thank you" pathname="/donate/success" />
      <Container sx={{ py: { xs: 10, md: 14 }, textAlign: "center" }}>
        {loading ? (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress />
            <Typography sx={{ color: "text.secondary" }}>Confirming your payment…</Typography>
          </Stack>
        ) : paid ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 72, color: "success.main" }} />
            <Typography variant="h2" sx={{ mt: 2 }}>Thank you for your gift.</Typography>
            {status && status.amount_cents > 0 && (
              <Typography variant="h5" sx={{ mt: 1, color: "text.secondary" }}>
                {fmtMoney(status.amount_cents, status.currency.toUpperCase())} received.
              </Typography>
            )}
            <Typography sx={{ mt: 2, color: "text.secondary", maxWidth: 600, mx: "auto" }}>
              A receipt has been sent to your email. Your generosity helps NTI keep delivering
              structured, measurable impact across Kenya.
            </Typography>
          </>
        ) : (
          <>
            <HourglassIcon sx={{ fontSize: 72, color: "warning.main" }} />
            <Typography variant="h2" sx={{ mt: 2 }}>Payment processing</Typography>
            <Typography sx={{ mt: 2, color: "text.secondary", maxWidth: 600, mx: "auto" }}>
              We received your submission but haven't confirmed the charge yet. You'll receive
              a receipt by email shortly. If you don't, please contact us.
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 3, maxWidth: 600, mx: "auto" }}>{error}</Alert>}
          </>
        )}
        <Box sx={{ mt: 4 }}>
          <Button component={RouterLink} to="/" variant="contained">
            Back to home
          </Button>
        </Box>
      </Container>
    </>
  );
}
