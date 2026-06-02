import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { getIconComponent } from "@/components/icons/registry";
import type { ProgramsContent } from "@/content/programsDefaults";

export default function ProgramsView({ content }: { content: ProgramsContent }) {
  const { intro, pillars, currentFocus, ctaBand } = content;
  return (
    <>
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading eyebrow={intro.eyebrow} title={intro.title} subtitle={intro.subtitle} />

        {pillars.enabled && (
          <Grid container spacing={3}>
            {pillars.items.map((p, idx) => {
              const Icon = p.iconKey ? getIconComponent(p.iconKey) : null;
              return (
                <Grid item xs={12} md={4} key={`${p.slug}-${idx}`}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent sx={{ p: 3 }}>
                      {Icon && <Icon color="primary" fontSize="large" />}
                      <Typography variant="h4" component="h3" sx={{ mt: Icon ? 1.5 : 0 }}>
                        {p.title}
                      </Typography>
                      <Typography sx={{ mt: 1.5, color: "text.secondary" }}>{p.summary}</Typography>
                      <Stack spacing={1.25} sx={{ mt: 3 }}>
                        {p.bullets.map((b, i) => (
                          <Stack key={i} direction="row" spacing={1.25} alignItems="flex-start">
                            <CheckIcon color="primary" fontSize="small" />
                            <Typography variant="body2">{b}</Typography>
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
          <Box sx={{ mt: 8, p: 4, bgcolor: "#F2EEE6", borderRadius: 3 }}>
            <Typography variant="h4" component="h2">
              {currentFocus.title}
            </Typography>
            <Typography sx={{ mt: 2, color: "text.secondary", maxWidth: 720 }}>
              {currentFocus.body}
            </Typography>
            {currentFocus.ctaHref && (
              <Button
                component={RouterLink}
                to={currentFocus.ctaHref}
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 3 }}
              >
                {currentFocus.ctaLabel || "Learn more"}
              </Button>
            )}
          </Box>
        )}
      </Container>
      {ctaBand.enabled && <CtaBand title={ctaBand.title} body={ctaBand.body ?? undefined} />}
    </>
  );
}
