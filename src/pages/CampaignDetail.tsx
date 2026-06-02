import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import DOMPurify from "dompurify";
import Seo from "@/components/ui/Seo";
import { campaignsApi, type PublicCampaign, type PublicDonor, type PublicTopDonor } from "@/api/campaigns";
import { campaignImage } from "@/components/campaigns/placeholder";

function fmtMoney(cents: number, ccy = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: ccy.toUpperCase() || "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CampaignDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [c, setC] = useState<PublicCampaign | null>(null);
  const [donors, setDonors] = useState<PublicDonor[]>([]);
  const [topDonors, setTopDonors] = useState<PublicTopDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      campaignsApi.get(slug),
      campaignsApi.donors(slug),
      campaignsApi.topDonors(slug, 3),
    ])
      .then(([camp, dl, td]) => {
        setC(camp);
        setDonors(dl.items);
        setTopDonors(td.items);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="text.secondary">Loading campaign…</Typography>
      </Container>
    );
  }

  if (error || !c) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Campaign not found
        </Typography>
        <Button onClick={() => navigate("/campaigns")} variant="outlined">
          See all campaigns
        </Button>
      </Container>
    );
  }

  const pct = Math.min(100, c.progress_pct);
  const overflow = c.raised_cents > c.goal_cents;
  const shareUrl = c.share_url || window.location.href;
  const shareText = `${c.title} — ${c.summary}`;

  function copyShare() {
    void navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  }

  return (
    <>
      <Seo
        title={c.title}
        description={c.summary}
        pathname={`/c/${c.slug}`}
        image={c.hero_image_url ?? undefined}
      />
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box
              component="img"
              src={campaignImage(c.hero_image_url)}
              alt=""
              sx={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                borderRadius: 2,
                mb: 3,
              }}
            />

            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {c.featured && <Chip size="small" color="secondary" label="Featured" />}
              {c.status === "completed" && <Chip size="small" label="Goal reached" color="success" />}
              {c.is_ended && c.status !== "completed" && (
                <Chip size="small" color="warning" label="Ended" />
              )}
              <Chip size="small" variant="outlined" label={c.designation.replace(/_/g, " ")} />
            </Stack>

            <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
              {c.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {c.summary}
            </Typography>

            {c.story_html && (
              <Box
                sx={{
                  "& p": { my: 1.25, lineHeight: 1.7 },
                  "& h2": { fontSize: "1.6rem", mt: 4, mb: 1.5, fontWeight: 600 },
                  "& h3": { fontSize: "1.3rem", mt: 3, mb: 1, fontWeight: 600 },
                  "& ul, & ol": { pl: 3.5, my: 1 },
                  "& blockquote": {
                    borderLeft: 3,
                    borderColor: "primary.main",
                    pl: 2,
                    color: "text.secondary",
                    my: 2,
                  },
                  "& a": { color: "primary.main" },
                  "& img": { maxWidth: "100%", height: "auto", borderRadius: 1, my: 2 },
                }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(c.story_html, { USE_PROFILES: { html: true } }),
                }}
              />
            )}

            {c.updates && c.updates.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Updates
                </Typography>
                <Stack spacing={2}>
                  {c.updates.map((u) => (
                    <Card key={u.id} variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          {fmtDate(u.created_at)}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 0.5, mb: 1 }}>
                          {u.title}
                        </Typography>
                        <Box
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(u.body_html, { USE_PROFILES: { html: true } }),
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {fmtMoney(c.raised_cents, c.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  raised of {fmtMoney(c.goal_cents, c.currency)} goal · {c.donors_count}{" "}
                  donor{c.donors_count === 1 ? "" : "s"}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{ height: 10, borderRadius: 5, mb: 2 }}
                />
                {overflow && (
                  <Alert severity="success" sx={{ mb: 2 }} icon={false}>
                    🎉 Goal exceeded — every extra gift expands the program.
                  </Alert>
                )}

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to={`/donate?campaign=${encodeURIComponent(c.slug)}`}
                  sx={{ mb: 1 }}
                >
                  Donate to this campaign
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant="text"
                  component={RouterLink}
                  to={`/donate?campaign=${encodeURIComponent(c.slug)}&freq=monthly`}
                  sx={{ mb: 2 }}
                >
                  Become a monthly partner
                </Button>

                {c.impact_items && c.impact_items.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      What your gift does
                    </Typography>
                    <Stack spacing={1.25}>
                      {c.impact_items.map((it, i) => (
                        <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                          <Chip
                            size="small"
                            color="primary"
                            label={fmtMoney(it.amount_cents, c.currency)}
                            sx={{ minWidth: 56, fontWeight: 700 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {it.label}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Share
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Copy link">
                    <IconButton size="small" onClick={copyShare}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share on Facebook">
                    <IconButton
                      size="small"
                      component="a"
                      target="_blank"
                      rel="noopener"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    >
                      <FacebookIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share on X">
                    <IconButton
                      size="small"
                      component="a"
                      target="_blank"
                      rel="noopener"
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    >
                      <XIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share on WhatsApp">
                    <IconButton
                      size="small"
                      component="a"
                      target="_blank"
                      rel="noopener"
                      href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    >
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share by email">
                    <IconButton
                      size="small"
                      component="a"
                      href={`mailto:?subject=${encodeURIComponent(c.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`}
                    >
                      <EmailIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {topDonors.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Top contributors
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 1 }}>
                      {topDonors.map((d, i) => (
                        <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: 12,
                              bgcolor:
                                i === 0
                                  ? "warning.main"
                                  : i === 1
                                    ? "grey.500"
                                    : "warning.dark",
                              color: "common.white",
                              fontWeight: 700,
                            }}
                          >
                            {i + 1}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                              {d.donor_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {fmtMoney(d.total_cents, d.currency)}
                              {d.donations_count > 1 ? ` · ${d.donations_count} gifts` : ""}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}

                {donors.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Recent donors
                    </Typography>
                    <Stack spacing={1}>
                      {donors.slice(0, 8).map((d, i) => (
                        <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                            {(d.donor_name || "A")[0]}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap>
                              {d.donor_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {fmtMoney(d.amount_cents, d.currency)}
                              {d.frequency === "monthly" ? " · monthly" : ""} ·{" "}
                              {fmtDate(d.created_at)}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={copied}
        autoHideDuration={2200}
        onClose={() => setCopied(false)}
        message="Link copied to clipboard"
      />
    </>
  );
}
