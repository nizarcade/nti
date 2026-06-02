import { Card, CardContent, Container, Grid, Typography, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SectionHeading from "@/components/ui/SectionHeading";
import { getIconComponent } from "@/components/icons/registry";
import type { GetInvolvedContent } from "@/content/getInvolvedDefaults";

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function GetInvolvedView({ content }: { content: GetInvolvedContent }) {
  const { intro, options } = content;
  return (
    <Container sx={{ py: { xs: 8, md: 12 } }}>
      <SectionHeading align={intro.align} eyebrow={intro.eyebrow} title={intro.title} />
      {options.enabled && (
        <Grid container spacing={3}>
          {options.items.map((o, i) => {
            const Icon = getIconComponent(o.iconKey);
            const external = isExternal(o.ctaHref);
            return (
              <Grid item xs={12} md={4} key={`${o.title}-${i}`}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Icon fontSize="large" color={o.ctaColor} />
                      <Typography variant="h4" component="h3">{o.title}</Typography>
                      <Typography sx={{ color: "text.secondary" }}>{o.body}</Typography>
                      <Button
                        {...(external
                          ? { href: o.ctaHref, target: "_blank", rel: "noopener noreferrer" }
                          : { component: RouterLink, to: o.ctaHref })}
                        variant="contained"
                        color={o.ctaColor}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        {o.ctaLabel}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
