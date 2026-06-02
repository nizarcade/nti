import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import SectionHeading from "@/components/ui/SectionHeading";
import Seo from "@/components/ui/Seo";
import {
  donationTiers,
  majorDonorTiers,
  monthlyPartnershipBullets,
  waysToGive,
} from "@/content/site";
import {
  createStripeIntent,
  type Designation,
  type Frequency,
} from "@/api/donations";
import { campaignsApi, type PublicCampaign } from "@/api/campaigns";
import PaypalButton from "@/components/donate/PaypalButton";

type Provider = "stripe" | "paypal";

const presets = [
  ...donationTiers.map((t) => t.amount),
  ...majorDonorTiers.map((t) => t.amount),
];

export default function Donate() {
  const [params, setParams] = useSearchParams();
  const campaignSlug = params.get("campaign") || undefined;
  const [campaign, setCampaign] = useState<PublicCampaign | null>(null);
  const [frequency, setFrequency] = useState<Frequency>("one_time");
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState<string>("");
  const [designation, setDesignation] = useState<Designation>("general");
  const [provider, setProvider] = useState<Provider>("stripe");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(params.get("anon") === "1");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!campaignSlug) {
      setCampaign(null);
      return;
    }
    campaignsApi
      .get(campaignSlug)
      .then((c) => {
        if (cancelled) return;
        setCampaign(c);
        // Sync designation to the campaign's designation so impact lines match.
        if (c.designation) setDesignation(c.designation as Designation);
      })
      .catch(() => {
        if (!cancelled) setCampaign(null);
      });
    return () => {
      cancelled = true;
    };
  }, [campaignSlug]);

  function clearCampaign() {
    const next = new URLSearchParams(params);
    next.delete("campaign");
    setParams(next, { replace: true });
  }

  const effectiveAmount = useMemo(() => {
    const c = parseFloat(custom);
    return Number.isFinite(c) && c > 0 ? Math.round(c) : amount;
  }, [amount, custom]);

  async function handleStripe() {
    setError(null);
    if (!donorEmail || !effectiveAmount) {
      setError("Please enter your email and a donation amount.");
      return;
    }
    setSubmitting(true);
    try {
      const r = await createStripeIntent({
        amount: effectiveAmount,
        frequency,
        designation,
        donor_name: donorName || undefined,
        donor_email: donorEmail,
        campaign_slug: campaignSlug,
        is_anonymous: isAnonymous,
      });
      window.location.href = r.checkout_url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const paypalReady = !!donorEmail && effectiveAmount > 0;

  return (
    <>
      <Seo
        title="Donate"
        description="Make a one-time or monthly gift to support NTI's programs across Kenya."
        pathname="/donate"
      />
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading
          eyebrow="Donate"
          title="Your gift fuels measurable outcomes."
          subtitle="All donations are stewarded responsibly and directed toward education access, maternal stability, and community empowerment."
        />

        {campaign && (
          <Alert
            severity="info"
            icon={false}
            sx={{ mb: 3, bgcolor: "#F8F5EE", color: "text.primary" }}
            action={
              <Button size="small" onClick={clearCampaign}>
                Donate generally instead
              </Button>
            }
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Donating to: {campaign.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {campaign.summary}
            </Typography>
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Frequency
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={frequency}
                  onChange={(_, v) => v && setFrequency(v)}
                  color="primary"
                  fullWidth
                >
                  <ToggleButton value="one_time">One-time</ToggleButton>
                  <ToggleButton value="monthly">Monthly</ToggleButton>
                </ToggleButtonGroup>

                {frequency === "monthly" && (
                  <Alert severity="info" icon={false} sx={{ mt: 2, bgcolor: "#F8F5EE", color: "text.primary" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Monthly Partnership — Builds Sustainability
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                      Consistency creates transformation. Monthly donors allow NTI to{" "}
                      {monthlyPartnershipBullets.map((b, i) => (
                        <span key={b}>
                          {i > 0 && ", "}
                          <strong>{b.toLowerCase()}</strong>
                        </span>
                      ))}
                      .
                    </Typography>
                  </Alert>
                )}

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Amount (USD)
                </Typography>
                <Grid container spacing={1.5}>
                  {presets.map((p) => (
                    <Grid item xs={4} sm={4} md={4} key={p}>
                      <Button
                        fullWidth
                        variant={amount === p && !custom ? "contained" : "outlined"}
                        color="primary"
                        onClick={() => {
                          setAmount(p);
                          setCustom("");
                        }}
                      >
                        ${p}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                <TextField
                  fullWidth
                  sx={{ mt: 2 }}
                  label="Custom amount"
                  type="number"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Designation
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value as Designation)}
                  SelectProps={{ native: true }}
                >
                  <option value="general">Where most needed (general fund)</option>
                  <option value="grace_bridge">Grace Bridge Initiative</option>
                  <option value="education">Education Support</option>
                  <option value="livelihood">Livelihood & Empowerment</option>
                </TextField>

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Your details
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Email (for receipt)"
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    fullWidth
                    required
                  />
                  {campaign && (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                      }
                      label="Show as Anonymous on the campaign donor wall"
                    />
                  )}
                </Stack>

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Payment method
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={provider}
                  onChange={(_, v) => v && setProvider(v)}
                  color="primary"
                  fullWidth
                >
                  {/* <ToggleButton value="stripe">Card · Stripe</ToggleButton> */}
                  <ToggleButton value="paypal">PayPal</ToggleButton>
                </ToggleButtonGroup>

                {error && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                  </Alert>
                )}

                {provider === "stripe" ? (
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 4 }}
                    disabled={submitting}
                    onClick={handleStripe}
                  >
                    {submitting
                      ? "Redirecting…"
                      : `Donate $${effectiveAmount}${frequency === "monthly" ? " / month" : ""}`}
                  </Button>
                ) : (
                  <Box sx={{ mt: 4 }}>
                    <PaypalButton
                      amount={effectiveAmount}
                      frequency={frequency}
                      designation={designation}
                      donorName={donorName || undefined}
                      donorEmail={donorEmail || undefined}
                      campaignSlug={campaignSlug}
                      isAnonymous={isAnonymous}
                      disabled={!paypalReady}
                      onError={(m) => setError(m)}
                    />
                    {!paypalReady && (
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Enter your email and amount to enable PayPal.
                      </Typography>
                    )}
                  </Box>
                )}

                <Typography variant="caption" sx={{ display: "block", mt: 2, color: "text.secondary" }}>
                  By donating you agree to our privacy policy and terms. Receipts are emailed
                  automatically.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 1 }}>
                <CardContent>
                  <Typography variant="h5">Your impact</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={2}>
                    {donationTiers.map((t) => (
                      <Box key={t.amount}>
                        <Typography variant="h6" sx={{ color: "primary.main" }}>
                          ${t.amount} — {t.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {t.body}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ p: 1 }}>
                <CardContent>
                  <Typography variant="h5">Major donor tiers</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={2}>
                    {majorDonorTiers.map((t) => (
                      <Box key={t.amount}>
                        <Typography variant="h6" sx={{ color: "secondary.dark" }}>
                          ${t.amount} — {t.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {t.body}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ p: 1 }}>
                <CardContent>
                  <Typography variant="h5">Ways to give</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1.5}>
                    {waysToGive.map((w) => (
                      <Box key={w.title}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {w.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {w.body}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Typography variant="caption" sx={{ display: "block", mt: 2, color: "text.secondary" }}>
                    For sponsorship, corporate, or church partnerships,{" "}
                    <a href="/contact">contact us</a>.
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
