import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DonateButton from "@/components/ui/DonateButton";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { campaignsApi, type PublicCampaign } from "@/api/campaigns";
import { getIconComponent } from "@/components/icons/registry";
import type { Cta, HomeContent } from "@/content/homeDefaults";

function renderHeadline(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

function CtaButton({
  cta,
  variant = "outlined",
  size = "large",
  hero = false,
}: {
  cta: Cta;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  hero?: boolean;
}) {
  if (cta.kind === "donate") {
    return <DonateButton size={size} label={cta.label || "Donate"} />;
  }
  const sx = hero
    ? variant === "outlined"
      ? {
          borderColor: "rgba(255,255,255,0.6)",
          color: "#fff",
          "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
        }
      : { color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }
    : undefined;
  return (
    <Button
      component={RouterLink}
      to={cta.href}
      variant={variant}
      size={size}
      endIcon={variant !== "text" ? <ArrowForwardIcon /> : undefined}
      sx={sx}
    >
      {cta.label}
    </Button>
  );
}

export default function HomeView({ content }: { content: HomeContent }) {
  const [campaigns, setCampaigns] = useState<PublicCampaign[]>([]);
  useEffect(() => {
    if (!content.featuredCampaigns.enabled) {
      setCampaigns([]);
      return;
    }
    campaignsApi
      .list({ limit: content.featuredCampaigns.limit })
      .then((r) => setCampaigns(r.items))
      .catch(() => setCampaigns([]));
  }, [content.featuredCampaigns.enabled, content.featuredCampaigns.limit]);

  const {
    hero,
    pillars,
    graceBridge,
    stats,
    donationTiers,
    featuredCampaigns,
    quote,
    ctaBand,
  } = content;

  return (
    <>
      {hero.enabled && (
        <Box
          sx={{
            position: "relative",
            color: "#FAFAF7",
            bgcolor: "primary.dark",
            backgroundImage: hero.backgroundImageUrl
              ? `linear-gradient(120deg, rgba(20,62,99,0.78), rgba(30,90,138,0.6)), url(${hero.backgroundImageUrl})`
              : "linear-gradient(120deg, rgba(20,62,99,0.92) 0%, rgba(30,90,138,0.85) 60%, rgba(197,138,63,0.55) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            py: { xs: 10, md: 16 },
          }}
        >
          <Container>
            <Box sx={{ maxWidth: 760 }}>
              <Typography
                variant="overline"
                sx={{ color: "secondary.light", letterSpacing: "0.16em" }}
              >
                {hero.overline}
              </Typography>
              <Typography variant="h1" component="h1" sx={{ mt: 1.5, color: "inherit" }}>
                {renderHeadline(hero.headline)}
              </Typography>
              <Typography
                sx={{
                  mt: 3,
                  fontSize: { xs: "1.05rem", md: "1.2rem" },
                  color: "rgba(255,255,255,0.92)",
                  maxWidth: 640,
                }}
              >
                {hero.subhead}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
                <CtaButton cta={hero.primaryCta} variant="contained" hero />
                {hero.secondaryCta && (
                  <CtaButton cta={hero.secondaryCta} variant="outlined" hero />
                )}
                {hero.tertiaryCta && (
                  <CtaButton cta={hero.tertiaryCta} variant="text" hero />
                )}
              </Stack>
            </Box>
          </Container>
        </Box>
      )}

      {pillars.enabled && (
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <SectionHeading
            align="center"
            eyebrow={pillars.eyebrow}
            title={pillars.title}
            subtitle={pillars.subtitle}
          />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {pillars.items.map((p, idx) => {
              const Icon = getIconComponent(p.iconKey);
              return (
                <Grid item xs={12} md={4} key={`${p.title}-${idx}`}>
                  <Card sx={{ height: "100%", p: 1 }}>
                    <CardContent>
                      <Icon fontSize="large" color="primary" />
                      <Typography variant="h4" component="h3" sx={{ mt: 2 }}>
                        {p.title}
                      </Typography>
                      <Typography sx={{ mt: 1.5, color: "text.secondary" }}>{p.body}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}

      {graceBridge.enabled && (
        <Box sx={{ bgcolor: "#F2EEE6" }}>
          <Container sx={{ py: { xs: 8, md: 12 } }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    borderRadius: 3,
                    aspectRatio: "4 / 3",
                    background: graceBridge.imageUrl
                      ? `url(${graceBridge.imageUrl}) center/cover no-repeat`
                      : "linear-gradient(135deg, #1E5A8A 0%, #3F7BAE 60%, #C58A3F 100%)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {graceBridge.overlayText && !graceBridge.imageUrl && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        color: "rgba(255,255,255,0.85)",
                        fontFamily: '"Lora", serif',
                        fontSize: 28,
                        textAlign: "center",
                        p: 4,
                      }}
                    >
                      {graceBridge.overlayText}
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="overline"
                  sx={{ color: "secondary.dark", fontWeight: 700, letterSpacing: "0.12em" }}
                >
                  {graceBridge.eyebrow}
                </Typography>
                <Typography variant="h2" component="h2" sx={{ mt: 1 }}>
                  {graceBridge.title}
                </Typography>
                <Typography sx={{ mt: 2, color: "text.secondary" }}>{graceBridge.body}</Typography>
                <Button
                  component={RouterLink}
                  to={graceBridge.cta.href}
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 3 }}
                >
                  {graceBridge.cta.label}
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {stats.enabled && (
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Grid container spacing={3}>
            {stats.items.map((s, idx) => (
              <Grid item xs={12} sm={4} key={`${s.label}-${idx}`}>
                <Card sx={{ p: 3, textAlign: "center", height: "100%" }}>
                  <Typography
                    variant="h2"
                    component="div"
                    sx={{ color: "primary.main", fontSize: { xs: "2.25rem", md: "2.75rem" } }}
                  >
                    {s.value}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 1 }}>{s.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {donationTiers.enabled && (
        <Box sx={{ bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}>
          <Container sx={{ py: { xs: 8, md: 12 } }}>
            <SectionHeading
              align="center"
              eyebrow={donationTiers.eyebrow}
              title={donationTiers.title}
            />
            <Grid container spacing={3}>
              {donationTiers.items.map((t, idx) => (
                <Grid item xs={12} md={4} key={`${t.amount}-${idx}`}>
                  <Card sx={{ height: "100%", p: 1 }}>
                    <CardContent>
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{ color: "secondary.dark", fontWeight: 700 }}
                      >
                        ${t.amount}
                      </Typography>
                      <Typography variant="h5" component="h3" sx={{ mt: 1 }}>
                        {t.title}
                      </Typography>
                      <Typography sx={{ mt: 1.5, color: "text.secondary" }}>{t.body}</Typography>
                      <DonateButton
                        label="Give now"
                        sx={{ mt: 3 }}
                        variant="outlined"
                        color="primary"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {featuredCampaigns.enabled && campaigns.length > 0 && (
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <SectionHeading
            align="center"
            eyebrow={featuredCampaigns.eyebrow}
            title={featuredCampaigns.title}
            subtitle={featuredCampaigns.subtitle}
          />
          <Grid container spacing={3}>
            {campaigns.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <CampaignCard c={c} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              component={RouterLink}
              to="/campaigns"
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              See all campaigns
            </Button>
          </Box>
        </Container>
      )}

      {quote.enabled && (
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ maxWidth: 820, mx: "auto", textAlign: "center" }}>
            <FormatQuoteIcon sx={{ fontSize: 56, color: "secondary.main" }} />
            <Typography
              variant="h3"
              component="blockquote"
              sx={{ fontFamily: '"Lora", serif', fontStyle: "italic", color: "text.primary", mt: 1 }}
            >
              “{quote.text}”
            </Typography>
            <Typography sx={{ mt: 3, color: "text.secondary" }}>
              — {quote.attributionName}, {quote.attributionRole}
            </Typography>
          </Box>
        </Container>
      )}

      {ctaBand.enabled && (
        <CtaBand title={ctaBand.title} body={ctaBand.body ?? undefined} />
      )}
    </>
  );
}
