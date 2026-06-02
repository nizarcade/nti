import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { getIconComponent } from "@/components/icons/registry";
import type { GraceBridgeContent } from "@/content/graceBridgeDefaults";

export default function GraceBridgeView({ content }: { content: GraceBridgeContent }) {
  const { hero, inspiredBy, pillars, footerCtas, ctaBand } = content;
  const heroBg = hero.backgroundImageUrl
    ? `linear-gradient(120deg, rgba(20,62,99,0.85), rgba(30,90,138,0.7)), url(${hero.backgroundImageUrl}) center/cover no-repeat`
    : "linear-gradient(120deg, rgba(20,62,99,0.92) 0%, rgba(30,90,138,0.82) 60%, rgba(197,138,63,0.65) 100%)";
  return (
    <>
      <Box sx={{ color: "#FAFAF7", background: heroBg, py: { xs: 10, md: 14 } }}>
        <Container>
          <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: "0.16em" }}>
            {hero.overline}
          </Typography>
          <Typography variant="h1" component="h1" sx={{ mt: 1.5, color: "inherit" }}>
            {hero.title}
          </Typography>
          <Typography sx={{ mt: 2.5, fontSize: { xs: "1.05rem", md: "1.2rem" }, maxWidth: 720, color: "rgba(255,255,255,0.92)" }}>
            {hero.subhead}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 8, md: 12 } }}>
        {inspiredBy.enabled && (
          <>
            <SectionHeading title={inspiredBy.title} />
            <Typography sx={{ color: "text.secondary", maxWidth: 820, whiteSpace: "pre-line" }}>
              {inspiredBy.body}
            </Typography>
          </>
        )}

        {pillars.enabled && (
          <Box sx={{ mt: 8 }}>
            <SectionHeading title={pillars.title} />
            <Grid container spacing={3}>
              {pillars.items.map((p, i) => {
                const Icon = getIconComponent(p.iconKey);
                return (
                  <Grid item xs={12} sm={6} md={4} key={`${p.title}-${i}`}>
                    <Card sx={{ height: "100%", p: 1 }}>
                      <CardContent>
                        <Icon color="primary" fontSize="large" />
                        <Typography variant="h5" sx={{ mt: 1.5 }}>{p.title}</Typography>
                        <Typography sx={{ mt: 1, color: "text.secondary" }}>{p.body}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {footerCtas.enabled && footerCtas.buttons.length > 0 && (
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 6 }}>
            {footerCtas.buttons.map((b, i) => (
              <Button
                key={`${b.label}-${i}`}
                component={RouterLink}
                to={b.href}
                variant={b.variant}
                endIcon={<ArrowForwardIcon />}
              >
                {b.label}
              </Button>
            ))}
          </Stack>
        )}
      </Container>

      {ctaBand.enabled && <CtaBand title={ctaBand.title} body={ctaBand.body ?? undefined} />}
    </>
  );
}
