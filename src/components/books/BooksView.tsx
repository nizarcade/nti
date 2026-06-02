import { Box, Button, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SectionHeading from "@/components/ui/SectionHeading";
import type { BooksContent } from "@/content/booksDefaults";

export default function BooksView({ content }: { content: BooksContent }) {
  const { intro, books } = content;
  return (
    <Container sx={{ py: { xs: 8, md: 12 } }}>
      <SectionHeading eyebrow={intro.eyebrow} title={intro.title} subtitle={intro.subtitle} />
      <Grid container spacing={4}>
        {books.map((b, idx) => (
          <Grid item xs={12} md={6} key={`${b.title}-${idx}`}>
            <Card sx={{ height: "100%" }}>
              <Box
                sx={{
                  height: 240,
                  background: b.coverImageUrl
                    ? `url(${b.coverImageUrl}) center/cover no-repeat`
                    : "linear-gradient(135deg, #143E63 0%, #1E5A8A 60%, #C58A3F 100%)",
                  display: "grid",
                  placeItems: "center",
                  color: "#FAFAF7",
                  position: "relative",
                }}
              >
                {!b.coverImageUrl && <MenuBookIcon sx={{ fontSize: 72, opacity: 0.85 }} />}
                {b.badge && (
                  <Chip
                    label={b.badge}
                    color="secondary"
                    size="small"
                    sx={{ position: "absolute", top: 12, left: 12 }}
                  />
                )}
              </Box>
              <CardContent>
                <Typography variant="h4" component="h3">
                  {b.title}
                </Typography>
                <Typography sx={{ mt: 1.5, color: "text.secondary" }}>{b.blurb}</Typography>
                {b.ctaUrl && (
                  <Button
                    href={b.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    sx={{ mt: 3 }}
                  >
                    {b.ctaLabel || "View"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
