import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import SectionHeading from "@/components/ui/SectionHeading";
import type { LeadershipContent } from "@/content/leadershipDefaults";

export default function LeadershipView({
  content,
}: {
  content: LeadershipContent;
}) {
  const { intro, featured, voiceBlock, structure } = content;

  return (
    <Container sx={{ py: { xs: 8, md: 12 } }}>
      <SectionHeading eyebrow={intro.eyebrow} title={intro.title} />

      {featured.enabled && (
        <Card sx={{ p: { xs: 2, md: 4 } }}>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Avatar
                  variant="rounded"
                  src="/adan-muktar.jpg"
                  alt={featured.name}
                  sx={{
                    width: "100%",
                    height: { xs: 340, sm: 420, md: 360 },
                    bgcolor: "primary.main",
                    borderRadius: 2,
                    objectFit: "cover",

                    "& img": {
                      objectFit: "cover",
                      objectPosition: "center 18%",
                      width: "100%",
                      height: "100%",
                    },
                  }}
                >
                  {featured.initials ??
                    featured.name.slice(0, 2).toUpperCase()}
                </Avatar>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h3" component="h2">
                  {featured.name}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ color: "secondary.dark", mt: 0.5 }}
                >
                  {featured.role}
                </Typography>

                {featured.phoneDisplay && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 1.5 }}
                  >
                    <PhoneIcon fontSize="small" color="action" />

                    <Link
                      href={`tel:${
                        featured.phoneTel ?? featured.phoneDisplay
                      }`}
                      color="inherit"
                    >
                      {featured.phoneDisplay}
                    </Link>
                  </Stack>
                )}

                {featured.paragraphs.map((p, idx) => (
                  <Typography
                    key={idx}
                    sx={{
                      mt: idx === 0 ? 2.5 : 2,
                      color: "text.secondary",
                    }}
                  >
                    {p}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {voiceBlock.enabled && (
        <Box sx={{ mt: 8 }}>
          <SectionHeading
            eyebrow={voiceBlock.eyebrow}
            title={voiceBlock.title}
          />

          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 820,
            }}
          >
            {voiceBlock.intro}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {voiceBlock.quotes.map((q, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Card
                  sx={{
                    height: "100%",
                    p: 1,
                    bgcolor: "#F8F5EE",
                  }}
                >
                  <CardContent>
                    <FormatQuoteIcon
                      sx={{
                        fontSize: 40,
                        color: "secondary.main",
                      }}
                    />

                    <Typography
                      component="blockquote"
                      sx={{
                        mt: 1,
                        fontFamily: '"Lora", serif',
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                      }}
                    >
                      “{q.text}”
                    </Typography>

                    {q.attribution && (
                      <Typography
                        sx={{
                          mt: 1.5,
                          color: "text.secondary",
                        }}
                      >
                        — {q.attribution}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {structure.enabled && (
        <Box sx={{ mt: 8 }}>
          <SectionHeading title={structure.title} />

          <Grid container spacing={3}>
            {structure.members.map((p, idx) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`${p.role}-${idx}`}
              >
                <Card sx={{ p: 1 }}>
                  <CardContent>
                    {p.photoUrl && (
                      <Avatar
                        src={p.photoUrl}
                        alt={p.name}
                        sx={{
                          width: 64,
                          height: 64,
                          mb: 1.5,
                        }}
                      />
                    )}

                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary" }}
                    >
                      {p.role}
                    </Typography>

                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      {p.name}
                    </Typography>

                    {p.bioShort && (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "text.secondary",
                        }}
                        variant="body2"
                      >
                        {p.bioShort}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
