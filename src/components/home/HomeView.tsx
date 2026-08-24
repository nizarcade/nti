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

const HOME_PROGRAM_IMAGE =
  "/fd64fa29-7c5b-4639-b1aa-734349cd33b2.png";

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
    return (
      <DonateButton
        size={size}
        label={cta.label || "Donate"}
      />
    );
  }

  const sx = hero
    ? variant === "outlined"
      ? {
          borderColor: "rgba(255,255,255,0.7)",
          color: "#fff",
          "&:hover": {
            borderColor: "#fff",
            bgcolor: "rgba(255,255,255,0.08)",
          },
        }
      : {
          color: "#fff",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.08)",
          },
        }
    : undefined;

  return (
    <Button
      component={RouterLink}
      to={cta.href}
      variant={variant}
      size={size}
      endIcon={
        variant !== "text" ? <ArrowForwardIcon /> : undefined
      }
      sx={sx}
    >
      {cta.label}
    </Button>
  );
}

export default function HomeView({
  content,
}: {
  content: HomeContent;
}) {
  const [campaigns, setCampaigns] = useState<
    PublicCampaign[]
  >([]);

  useEffect(() => {
    if (!content.featuredCampaigns.enabled) {
      setCampaigns([]);
      return;
    }

    campaignsApi
      .list({
        limit: content.featuredCampaigns.limit,
      })
      .then((r) => setCampaigns(r.items))
      .catch(() => setCampaigns([]));
  }, [
    content.featuredCampaigns.enabled,
    content.featuredCampaigns.limit,
  ]);

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
      {/* HERO */}
      {hero.enabled && (
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            bgcolor: "#143E63",
            color: "#fff",
          }}
        >
          <Grid
            container
            sx={{
              minHeight: {
                xs: "auto",
                md: 650,
              },
            }}
          >
            {/* HERO CONTENT */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                background:
                  "linear-gradient(135deg, #143E63 0%, #1E5A8A 65%, #286E9F 100%)",
              }}
            >
              <Container
                sx={{
                  py: {
                    xs: 9,
                    md: 12,
                  },
                  pl: {
                    md: "max(24px, calc((100vw - 1200px) / 2))",
                  },
                }}
              >
                <Box
                  sx={{
                    maxWidth: 650,
                    pr: {
                      md: 5,
                    },
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#E7B66C",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                    }}
                  >
                    {hero.overline}
                  </Typography>

                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      mt: 1.5,
                      color: "#fff",
                      fontSize: {
                        xs: "2.7rem",
                        sm: "3.5rem",
                        md: "4rem",
                      },
                      lineHeight: 1.05,
                    }}
                  >
                    {renderHeadline(hero.headline)}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 3,
                      fontSize: {
                        xs: "1.05rem",
                        md: "1.2rem",
                      },
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.9)",
                      maxWidth: 590,
                    }}
                  >
                    {hero.subhead}
                  </Typography>

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={2}
                    sx={{
                      mt: 4,
                      alignItems: {
                        xs: "stretch",
                        sm: "center",
                      },
                    }}
                  >
                    <CtaButton
                      cta={hero.primaryCta}
                      variant="contained"
                      hero
                    />

                    {hero.secondaryCta && (
                      <CtaButton
                        cta={hero.secondaryCta}
                        variant="outlined"
                        hero
                      />
                    )}

                    {hero.tertiaryCta && (
                      <CtaButton
                        cta={hero.tertiaryCta}
                        variant="text"
                        hero
                      />
                    )}
                  </Stack>
                </Box>
              </Container>
            </Grid>

            {/* HERO IMAGE */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                position: "relative",
                minHeight: {
                  xs: 420,
                  md: 650,
                },
              }}
            >
              <Box
                component="img"
                src={
                  hero.backgroundImageUrl ||
                  HOME_PROGRAM_IMAGE
                }
                alt="Representative image of a child in Kenya"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: {
                    xs: "linear-gradient(180deg, rgba(20,62,99,0.08), rgba(20,62,99,0.28))",
                    md: "linear-gradient(90deg, rgba(20,62,99,0.28), rgba(20,62,99,0.02) 35%)",
                  },
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: 18,
                  right: 18,
                  bgcolor: "rgba(0,0,0,0.58)",
                  color: "#fff",
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                Representative image
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* PROGRAM PILLARS */}
      {pillars.enabled && (
        <Box
          sx={{
            bgcolor: "#FAFAF7",
          }}
        >
          <Container
            sx={{
              py: {
                xs: 8,
                md: 12,
              },
            }}
          >
            <SectionHeading
              align="center"
              eyebrow={pillars.eyebrow}
              title={pillars.title}
              subtitle={pillars.subtitle}
            />

            <Grid
              container
              spacing={3}
              sx={{ mt: 1 }}
            >
              {pillars.items.map((p, idx) => {
                const Icon = getIconComponent(
                  p.iconKey
                );

                return (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    key={`${p.title}-${idx}`}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        p: 1,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow:
                          "0 10px 35px rgba(20,62,99,0.06)",
                        transition:
                          "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform:
                            "translateY(-4px)",
                          boxShadow:
                            "0 16px 45px rgba(20,62,99,0.12)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            width: 58,
                            height: 58,
                            borderRadius: 2,
                            bgcolor:
                              "rgba(30,90,138,0.09)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <Icon
                            fontSize="large"
                            color="primary"
                          />
                        </Box>

                        <Typography
                          variant="h4"
                          component="h3"
                          sx={{ mt: 2.5 }}
                        >
                          {p.title}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1.5,
                            color:
                              "text.secondary",
                            lineHeight: 1.75,
                          }}
                        >
                          {p.body}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        </Box>
      )}

      {/* GRACE BRIDGE / FEATURED PROGRAM */}
      {graceBridge.enabled && (
        <Box
          sx={{
            bgcolor: "#F2EEE6",
          }}
        >
          <Container
            sx={{
              py: {
                xs: 8,
                md: 12,
              },
            }}
          >
            <Grid
              container
              spacing={{
                xs: 4,
                md: 7,
              }}
              alignItems="center"
            >
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow:
                      "0 18px 55px rgba(20,62,99,0.16)",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      graceBridge.imageUrl ||
                      HOME_PROGRAM_IMAGE
                    }
                    alt="Representative image supporting NTI's work with children"
                    sx={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3))",
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      bottom: 14,
                      left: 14,
                      bgcolor:
                        "rgba(0,0,0,0.58)",
                      color: "#fff",
                      px: 1.5,
                      py: 0.6,
                      borderRadius: 1,
                      fontSize: "0.7rem",
                    }}
                  >
                    Representative image
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "secondary.dark",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  {graceBridge.eyebrow}
                </Typography>

                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    mt: 1,
                    maxWidth: 600,
                  }}
                >
                  {graceBridge.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 2.5,
                    color: "text.secondary",
                    lineHeight: 1.8,
                    maxWidth: 620,
                  }}
                >
                  {graceBridge.body}
                </Typography>

                <Button
                  component={RouterLink}
                  to={graceBridge.cta.href}
                  variant="contained"
                  color="primary"
                  endIcon={
                    <ArrowForwardIcon />
                  }
                  sx={{
                    mt: 3.5,
                    px: 3,
                  }}
                >
                  {graceBridge.cta.label}
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* STATS */}
      {stats.enabled && (
        <Box
          sx={{
            bgcolor: "#143E63",
            color: "#fff",
          }}
        >
          <Container
            sx={{
              py: {
                xs: 7,
                md: 9,
              },
            }}
          >
            <Grid container spacing={3}>
              {stats.items.map((s, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={4}
                  key={`${s.label}-${idx}`}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 2,
                    }}
                  >
                    <Typography
                      variant="h2"
                      component="div"
                      sx={{
                        color: "#E7B66C",
                        fontWeight: 700,
                        fontSize: {
                          xs: "2.4rem",
                          md: "3rem",
                        },
                      }}
                    >
                      {s.value}
                    </Typography>

                    <Typography
                      sx={{
                        color:
                          "rgba(255,255,255,0.85)",
                        mt: 1,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* DONATION TIERS */}
      {donationTiers.enabled && (
        <Box
          sx={{
            bgcolor: "#FAFAF7",
          }}
        >
          <Container
            sx={{
              py: {
                xs: 8,
                md: 12,
              },
            }}
          >
            <SectionHeading
              align="center"
              eyebrow={donationTiers.eyebrow}
              title={donationTiers.title}
            />

            <Grid container spacing={3}>
              {donationTiers.items.map(
                (t, idx) => (
                  <Grid
                    item
                    xs={12}
                    md={4}
                    key={`${t.amount}-${idx}`}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        p: 1,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow:
                          "0 10px 35px rgba(20,62,99,0.06)",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h3"
                          component="div"
                          sx={{
                            color:
                              "secondary.dark",
                            fontWeight: 700,
                          }}
                        >
                          ${t.amount}
                        </Typography>

                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{ mt: 1 }}
                        >
                          {t.title}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1.5,
                            color:
                              "text.secondary",
                            lineHeight: 1.7,
                          }}
                        >
                          {t.body}
                        </Typography>

                        <DonateButton
                          label="Give now"
                          sx={{ mt: 3 }}
                          variant="outlined"
                          color="primary"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Container>
        </Box>
      )}

      {/* CAMPAIGNS */}
      {featuredCampaigns.enabled &&
        campaigns.length > 0 && (
          <Container
            sx={{
              py: {
                xs: 8,
                md: 12,
              },
            }}
          >
            <SectionHeading
              align="center"
              eyebrow={
                featuredCampaigns.eyebrow
              }
              title={featuredCampaigns.title}
              subtitle={
                featuredCampaigns.subtitle
              }
            />

            <Grid container spacing={3}>
              {campaigns.map((c) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={c.id}
                >
                  <CampaignCard c={c} />
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                textAlign: "center",
                mt: 4,
              }}
            >
              <Button
                component={RouterLink}
                to="/campaigns"
                variant="outlined"
                color="primary"
                endIcon={
                  <ArrowForwardIcon />
                }
              >
                See all campaigns
              </Button>
            </Box>
          </Container>
        )}

      {/* QUOTE */}
      {quote.enabled && (
        <Box
          sx={{
            bgcolor: "#F2EEE6",
          }}
        >
          <Container
            sx={{
              py: {
                xs: 8,
                md: 12,
              },
            }}
          >
            <Box
              sx={{
                maxWidth: 820,
                mx: "auto",
                textAlign: "center",
              }}
            >
              <FormatQuoteIcon
                sx={{
                  fontSize: 56,
                  color: "secondary.main",
                }}
              />

              <Typography
                variant="h3"
                component="blockquote"
                sx={{
                  fontFamily:
                    '"Lora", serif',
                  fontStyle: "italic",
                  color: "text.primary",
                  mt: 1,
                  lineHeight: 1.4,
                }}
              >
                “{quote.text}”
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                — {quote.attributionName},{" "}
                {quote.attributionRole}
              </Typography>
            </Box>
          </Container>
        </Box>
      )}

      {/* FINAL CTA */}
      {ctaBand.enabled && (
        <CtaBand
          title={ctaBand.title}
          body={
            ctaBand.body ?? undefined
          }
        />
      )}
    </>
  );
}
