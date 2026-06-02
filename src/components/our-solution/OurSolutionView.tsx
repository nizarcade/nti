import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { getIconComponent } from "@/components/icons/registry";
import type { OurSolutionContent } from "@/content/ourSolutionDefaults";

export default function OurSolutionView({ content }: { content: OurSolutionContent }) {
  const { intro, pillars, ctaBand } = content;
  return (
    <>
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading eyebrow={intro.eyebrow} title={intro.title} subtitle={intro.subtitle} />
        {pillars.enabled && (
          <Grid container spacing={3}>
            {pillars.items.map((p, i) => {
              const Icon = getIconComponent(p.iconKey);
              return (
                <Grid item xs={12} sm={6} md={4} key={`${p.title}-${i}`}>
                  <Card sx={{ height: "100%", p: 1 }}>
                    <CardContent>
                      <Icon fontSize="large" color="primary" />
                      <Typography variant="h5" sx={{ mt: 1.5 }}>{p.title}</Typography>
                      <Typography sx={{ mt: 1, color: "text.secondary" }}>{p.body}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
      {ctaBand.enabled && <CtaBand title={ctaBand.title} body={ctaBand.body ?? undefined} />}
    </>
  );
}
