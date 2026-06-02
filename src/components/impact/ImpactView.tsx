import { Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import type { ImpactContent } from "@/content/impactDefaults";

export default function ImpactView({ content }: { content: ImpactContent }) {
  const { intro, stats, documents, whyGiftMatters, ctaBand } = content;
  return (
    <>
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading eyebrow={intro.eyebrow} title={intro.title} subtitle={intro.subtitle} />

        {stats.enabled && stats.items.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.items.map((s, i) => (
              <Grid item xs={12} sm={4} key={`${s.label}-${i}`}>
                <Card sx={{ p: 3, textAlign: "center", height: "100%" }}>
                  <Typography variant="h2" sx={{ color: "primary.main", fontSize: { xs: "2rem", md: "2.5rem" } }}>
                    {s.value}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 1 }}>{s.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {documents.enabled && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
              {documents.title}
            </Typography>
            <Stack spacing={2}>
              {documents.items.map((d, i) => (
                <Card key={`${d.title}-${i}`}>
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <DescriptionIcon color="primary" />
                        <Box>
                          <Typography>{d.title}</Typography>
                          {d.year && (
                            <Typography variant="caption" color="text.secondary">
                              {d.year}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                      {d.status === "available" && d.fileUrl ? (
                        <Button
                          href={d.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                        >
                          Download
                        </Button>
                      ) : (
                        <Chip label="Coming soon" size="small" />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}

        {whyGiftMatters.enabled && (
          <Box sx={{ mt: 8, p: { xs: 3, md: 5 }, bgcolor: "#F2EEE6", borderRadius: 3 }}>
            <Typography variant="h4" component="h3">{whyGiftMatters.title}</Typography>
            <Typography sx={{ mt: 2, color: "text.secondary", maxWidth: 800, whiteSpace: "pre-line" }}>
              {whyGiftMatters.body}
            </Typography>
          </Box>
        )}
      </Container>
      {ctaBand.enabled && <CtaBand title={ctaBand.title} body={ctaBand.body ?? undefined} />}
    </>
  );
}
