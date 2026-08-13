import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import SectionHeading from "@/components/ui/SectionHeading";
import Seo from "@/components/ui/Seo";

import {
  donationTiers,
  majorDonorTiers,
  waysToGive,
} from "@/content/site";

/*
 * NTI Stripe-hosted donation page
 *
 * Donations are processed directly by Stripe using a Stripe Payment Link.
 * No STRIPE_SECRET_KEY is required by the website.
 */

const STRIPE_DONATION_URL =
  "https://donate.stripe.com/5kQ4gy4YG8J8cP9gmW1Nu00";

type Designation =
  | "general"
  | "grace_bridge"
  | "education"
  | "livelihood";

const presets = [
  ...donationTiers.map((t) => t.amount),
  ...majorDonorTiers.map((t) => t.amount),
];

export default function Donate() {
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState<string>("");
  const [designation, setDesignation] =
    useState<Designation>("general");

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = useMemo(() => {
    const customAmount = parseFloat(custom);

    return Number.isFinite(customAmount) && customAmount > 0
      ? Math.round(customAmount)
      : amount;
  }, [amount, custom]);

  function handleStripe() {
    setError(null);

    if (!donorEmail) {
      setError("Please enter your email before continuing.");
      return;
    }

    if (!effectiveAmount || effectiveAmount < 5) {
      setError("Please enter a donation amount of at least $5.");
      return;
    }

    /*
     * Stripe's hosted Payment Link will securely collect
     * the donor's payment information.
     *
     * The website does NOT receive or store card information.
     */

    window.location.href = STRIPE_DONATION_URL;
  }

  return (
    <>
      <Seo
        title="Donate"
        description="Make a gift to support NTI's programs across Kenya."
        pathname="/donate"
      />

      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading
          eyebrow="Donate"
          title="Your gift fuels measurable outcomes."
          subtitle="All donations are stewarded responsibly and directed toward education access, maternal stability, and community empowerment."
        />

        <Grid container spacing={4}>
          {/* DONATION FORM */}

          <Grid item xs={12} md={7}>
            <Card>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Alert
                  severity="info"
                  icon={false}
                  sx={{
                    mb: 3,
                    bgcolor: "#F8F5EE",
                    color: "text.primary",
                  }}
                >
                  Donations are securely processed by Stripe.
                </Alert>

                {/* AMOUNT */}

                <Typography variant="h5" sx={{ mb: 2 }}>
                  Amount (USD)
                </Typography>

                <Grid container spacing={1.5}>
                  {presets.map((p) => (
                    <Grid item xs={4} sm={4} md={4} key={p}>
                      <Button
                        fullWidth
                        variant={
                          amount === p && !custom
                            ? "contained"
                            : "outlined"
                        }
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
                    startAdornment: (
                      <InputAdornment position="start">
                        $
                      </InputAdornment>
                    ),
                  }}
                />

                {/* DESIGNATION */}

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Designation
                </Typography>

                <TextField
                  select
                  fullWidth
                  value={designation}
                  onChange={(e) =>
                    setDesignation(
                      e.target.value as Designation
                    )
                  }
                  SelectProps={{ native: true }}
                >
                  <option value="general">
                    Where most needed (general fund)
                  </option>

                  <option value="grace_bridge">
                    Grace Bridge Initiative
                  </option>

                  <option value="education">
                    Education Support
                  </option>

                  <option value="livelihood">
                    Livelihood &amp; Empowerment
                  </option>
                </TextField>

                {/* DONOR DETAILS */}

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Your details
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="Full name"
                    value={donorName}
                    onChange={(e) =>
                      setDonorName(e.target.value)
                    }
                    fullWidth
                  />

                  <TextField
                    label="Email"
                    type="email"
                    value={donorEmail}
                    onChange={(e) =>
                      setDonorEmail(e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Stack>

                {/* PAYMENT */}

                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Payment method
                </Typography>

                <ToggleButtonGroup
                  exclusive
                  value="stripe"
                  color="primary"
                  fullWidth
                >
                  <ToggleButton value="stripe">
                    Card / Stripe
                  </ToggleButton>
                </ToggleButtonGroup>

                {error && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 4 }}
                  onClick={handleStripe}
                >
                  Donate ${effectiveAmount}
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 2,
                    color: "text.secondary",
                  }}
                >
                  You will be redirected to Stripe's secure
                  payment page to complete your donation.
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  By donating you agree to our privacy policy
                  and terms.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* IMPACT INFORMATION */}

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ p: 1 }}>
                <CardContent>
                  <Typography variant="h5">
                    Your impact
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={2}>
                    {donationTiers.map((t) => (
                      <Box key={t.amount}>
                        <Typography
                          variant="h6"
                          sx={{ color: "primary.main" }}
                        >
                          ${t.amount} — {t.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {t.body}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ p: 1 }}>
                <CardContent>
                  <Typography variant="h5">
                    Major donor tiers
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={2}>
                    {majorDonorTiers.map((t) => (
                      <Box key={t.amount}>
                        <Typography
                          variant="h6"
                          sx={{ color: "secondary.dark" }}
                        >
                          ${t.amount} — {t.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {t.body}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ p: 1 }}>
                <CardContent>
                  <Typography variant="h5">
                    Ways to give
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.5}>
                    {waysToGive.map((w) => (
                      <Box key={w.title}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700 }}
                        >
                          {w.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {w.body}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 2,
                      color: "text.secondary",
                    }}
                  >
                    For sponsorship, corporate, or church
                    partnerships,{" "}
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
