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
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { getIconComponent } from "@/components/icons/registry";
import type { ProgramsContent } from "@/content/programsDefaults";

export default function ProgramsView({
  content,
}: {
  content: ProgramsContent;
}) {
  const { intro, pillars, currentFocus, ctaBand } = content;

  return (
    <>
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading
          eyebrow={intro.eyebrow}
          title={intro.title}
          subtitle={intro.subtitle}
        />

        {pillars.enabled && (
          <Grid container spacing={3}>
            {pillars.items.map((p, idx) => {
              const Icon = p.iconKey
                ? getIconComponent(p.iconKey)
                : null;

              return (
                <Grid
                  item
                  xs={12}
                  md={4}
                  key={`${p.slug}-${idx}`}
                >
                  <Card sx={{ height: "100%" }}>
                    <CardContent sx={{ p: 3 }}>
                      {Icon && (
                        <Icon
                          color="primary"
                          fontSize="large"
                        />
                      )}

                      <Typography
                        variant="h4"
                        component="h3"
                        sx={{ mt: Icon ? 1.5 : 0 }}
                      >
                        {p.title}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 1.5,
                          color: "text.secondary",
                        }}
                      >
                        {p.summary}
                      </Typography>

                      <Stack spacing={1.25} sx={{ mt: 3 }}>
                        {p.bullets.map((b, i) => (
                          <Stack
                            key={i}
                            direction="row"
                            spacing={1.25}
                            alignItems="flex-start"
                          >
                            <CheckIcon
                              color="primary"
                              fontSize="small"
                            />

                            <Typography variant="body2">
                              {b}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>

                      {p.linkHref && (
                        <Button
                          component={RouterLink}
                          to={p.linkHref}
                          endIcon={<ArrowForwardIcon />}
                          sx={{ mt: 2 }}
                        >
                          {p.linkLabel || "Learn more"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {currentFocus.enabled && (
          <Box
            sx={{
              mt: 8,
              bgcolor: "#F2EEE6",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Grid container alignItems="stretch">
              {/* Bright Futures representative image */}
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    position: "relative",
                    height: {
                      xs: 320,
                      sm: 400,
                      md: "100%",
                    },
                    minHeight: { md: 430 },
                  }}
                >
                  <Box
                    component="img"
                    src="/fd64fa29-7c5b-4639-b1aa-734349cd33b2.png"
                    alt="Representative image of a Kenyan child"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      px: 1.5,
                      py: 0.6,
                      bgcolor: "rgba(0,0,0,0.62)",
                      color: "#fff",
                      borderRadius: 1,
                      fontSize: "0.72rem",
                    }}
                  >
                    Representative image
                  </Typography>
                </Box>
              </Grid>

              {/* Bright Futures text */}
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    p: {
                      xs: 3,
                      sm: 4,
                      md: 5,
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{
                      color: "secondary.dark",
                      fontWeight: 700,
                      letterSpacing: 1.5,
                    }}
                  >
                    Current Focus
                  </Typography>

                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ mt: 0.5 }}
                  >
                    {currentFocus.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2,
                      color: "text.secondary",
                      maxWidth: 720,
                    }}
                  >
                    {currentFocus.body}
                  </Typography>

                  {currentFocus.ctaHref && (
                    <Box>
                      <Button
                        component={RouterLink}
                        to={currentFocus.ctaHref}
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ mt: 3 }}
                      >
                        {currentFocus.ctaLabel || "Learn more"}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      {ctaBand.enabled && (
        <CtaBand
          title={ctaBand.title}
          body={ctaBand.body ?? undefined}
        />
      )}
    </>
  );
}
