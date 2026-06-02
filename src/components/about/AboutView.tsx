import { Box, Container, Grid, Stack, Typography, Card, CardContent, Chip } from "@mui/material";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { getIconComponent } from "@/components/icons/registry";
import type { AboutContent } from "@/content/aboutDefaults";

export default function AboutView({ content }: { content: AboutContent }) {
  const { intro, mission, historyVision, values, governance, ctaBand } = content;
  return (
    <>
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading eyebrow={intro.eyebrow} title={intro.title} subtitle={intro.subtitle} />

        {mission.enabled && (
          <Box
            sx={{
              mt: 2,
              p: { xs: 3, md: 4 },
              borderLeft: "4px solid",
              borderColor: "secondary.main",
              bgcolor: "#F8F5EE",
              borderRadius: 1,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "secondary.dark", fontWeight: 700, letterSpacing: "0.12em" }}
            >
              {mission.overline}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ mt: 1, fontFamily: '"Lora", serif', fontStyle: "italic", color: "text.primary" }}
            >
              {mission.statement}
            </Typography>
          </Box>
        )}

        {historyVision.enabled && (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h3">
                {historyVision.history.title}
              </Typography>
              <Typography sx={{ mt: 2, color: "text.secondary" }}>
                {historyVision.history.body}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h3">
                {historyVision.vision.title}
              </Typography>
              <Typography sx={{ mt: 2, color: "text.secondary" }}>
                {historyVision.vision.body}
              </Typography>
            </Grid>
          </Grid>
        )}

        {values.enabled && (
          <Box sx={{ mt: 8 }}>
            <SectionHeading title={values.title} />
            <Grid container spacing={3}>
              {values.items.map((v, idx) => {
                const Icon = getIconComponent(v.iconKey);
                return (
                  <Grid item xs={12} sm={6} md={3} key={`${v.title}-${idx}`}>
                    <Card sx={{ height: "100%", p: 1 }}>
                      <CardContent>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Icon color="primary" />
                          <Typography variant="h5">{v.title}</Typography>
                        </Stack>
                        <Typography sx={{ mt: 1.5, color: "text.secondary" }}>{v.body}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {governance.enabled && (
          <Box sx={{ mt: 8 }}>
            <SectionHeading title={governance.title} subtitle={governance.subtitle} />
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {governance.chips.map((c, idx) => (
                <Chip
                  key={`${c.label}-${idx}`}
                  label={c.label}
                  color={c.emphasis === "primary" ? "primary" : "default"}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}
      </Container>
      {ctaBand.enabled && <CtaBand title={ctaBand.title} body={ctaBand.body ?? undefined} />}
    </>
  );
}
