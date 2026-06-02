import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import DOMPurify from "dompurify";
import type { CustomBlock } from "@/api/customPages";
import { getIconComponent } from "@/components/icons/registry";

type RenderProps<T> = { data: T };

function HeroBlock({
  data,
}: RenderProps<{
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaTo?: string;
  image?: string;
}>) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: data.image
          ? `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${data.image}) center/cover no-repeat`
          : (t) => t.palette.background.default,
        color: data.image ? "common.white" : "text.primary",
      }}
    >
      <Container>
        <Stack spacing={2} maxWidth={760}>
          {data.eyebrow ? (
            <Typography
              variant="overline"
              sx={{ letterSpacing: "0.16em", opacity: 0.85 }}
            >
              {data.eyebrow}
            </Typography>
          ) : null}
          <Typography
            variant="h2"
            sx={{ fontFamily: '"Lora", serif', fontWeight: 700, lineHeight: 1.15 }}
          >
            {data.title}
          </Typography>
          {data.subtitle ? (
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              {data.subtitle}
            </Typography>
          ) : null}
          {data.ctaLabel && data.ctaTo ? (
            <Box>
              <Button
                component={RouterLink}
                to={data.ctaTo}
                variant="contained"
                size="large"
                color="primary"
              >
                {data.ctaLabel}
              </Button>
            </Box>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

function RichTextBlock({ data }: RenderProps<{ html?: string }>) {
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Box
        sx={{
          "& h1, & h2, & h3": { fontFamily: '"Lora", serif', fontWeight: 700, mt: 4, mb: 2 },
          "& p": { my: 1.5, lineHeight: 1.75 },
          "& ul, & ol": { pl: 4, my: 1.5 },
          "& a": { color: "primary.main" },
          "& blockquote": {
            borderLeft: 4,
            borderColor: "primary.main",
            pl: 2,
            color: "text.secondary",
            my: 2,
          },
          maxWidth: 800,
          mx: "auto",
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(data.html || "", { USE_PROFILES: { html: true } }),
        }}
      />
    </Container>
  );
}

function ImageTextBlock({
  data,
}: RenderProps<{
  image?: string;
  side?: "left" | "right";
  title?: string;
  body?: string;
}>) {
  const reverse = data.side === "right";
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"
        direction={reverse ? "row-reverse" : "row"}
      >
        <Grid item xs={12} md={6}>
          {data.image ? (
            <Box
              component="img"
              src={data.image}
              alt=""
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 3,
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                aspectRatio: "4 / 3",
                bgcolor: "action.hover",
                borderRadius: 2,
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {data.title ? (
              <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 700 }}>
                {data.title}
              </Typography>
            ) : null}
            {data.body ? (
              <Typography variant="body1" sx={{ lineHeight: 1.75 }}>
                {data.body}
              </Typography>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

function FeatureGridBlock({
  data,
}: RenderProps<{
  title?: string;
  items?: { iconKey?: string; title?: string; body?: string }[];
}>) {
  const items = data.items ?? [];
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 8 } }}>
      {data.title ? (
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Lora", serif',
            fontWeight: 700,
            textAlign: "center",
            mb: 5,
          }}
        >
          {data.title}
        </Typography>
      ) : null}
      <Grid container spacing={3}>
        {items.map((it, i) => {
          const Icon = getIconComponent(it.iconKey);
          return (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Stack
                spacing={1.5}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Icon sx={{ fontSize: 36, color: "primary.main" }} />
                {it.title ? (
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {it.title}
                  </Typography>
                ) : null}
                {it.body ? (
                  <Typography variant="body2" color="text.secondary">
                    {it.body}
                  </Typography>
                ) : null}
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

function QuoteBlock({
  data,
}: RenderProps<{ text?: string; attribution?: string }>) {
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Box
        sx={{
          maxWidth: 760,
          mx: "auto",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Lora", serif',
            fontStyle: "italic",
            lineHeight: 1.5,
          }}
        >
          “{data.text}”
        </Typography>
        {data.attribution ? (
          <Typography
            variant="overline"
            sx={{ display: "block", mt: 2, letterSpacing: "0.12em", color: "text.secondary" }}
          >
            — {data.attribution}
          </Typography>
        ) : null}
      </Box>
    </Container>
  );
}

function CTABlock({
  data,
}: RenderProps<{
  title?: string;
  body?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}>) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Container>
        <Stack spacing={2} alignItems="center" textAlign="center">
          {data.title ? (
            <Typography
              variant="h4"
              sx={{ fontFamily: '"Lora", serif', fontWeight: 700 }}
            >
              {data.title}
            </Typography>
          ) : null}
          {data.body ? (
            <Typography variant="body1" sx={{ maxWidth: 640, opacity: 0.92 }}>
              {data.body}
            </Typography>
          ) : null}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }}>
            {data.primaryLabel && data.primaryTo ? (
              <Button
                component={RouterLink}
                to={data.primaryTo}
                variant="contained"
                color="secondary"
                size="large"
              >
                {data.primaryLabel}
              </Button>
            ) : null}
            {data.secondaryLabel && data.secondaryTo ? (
              <Button
                component={RouterLink}
                to={data.secondaryTo}
                variant="outlined"
                size="large"
                sx={{ color: "common.white", borderColor: "common.white" }}
              >
                {data.secondaryLabel}
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function FAQBlock({ data }: RenderProps<{ items?: { q?: string; a?: string }[] }>) {
  const items = data.items ?? [];
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 8 }, maxWidth: 800 }}>
      <Stack spacing={3}>
        {items.map((it, i) => (
          <Box key={i}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {it.q}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {it.a}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}

function extractYouTubeId(raw: string): string | null {
  const s = raw.trim();
  // If a full <iframe ...> was pasted, grab the src first.
  const iframeMatch = s.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  const candidate = iframeMatch ? iframeMatch[1] : s;
  // Try common YouTube URL shapes.
  const patterns = [
    /[?&]v=([\w-]{6,})/, // watch?v=ID
    /youtu\.be\/([\w-]{6,})/, // short link
    /\/embed\/([\w-]{6,})/, // embed/ID
    /\/shorts\/([\w-]{6,})/, // shorts/ID
    /\/v\/([\w-]{6,})/, // legacy /v/ID
  ];
  for (const re of patterns) {
    const m = candidate.match(re);
    if (m) return m[1];
  }
  // Bare 11-char id?
  if (/^[\w-]{11}$/.test(candidate)) return candidate;
  return null;
}

function EmbedBlock({
  data,
}: RenderProps<{ kind?: "youtube" | "raw"; value?: string }>) {
  if (!data.value) return null;
  if (data.kind === "youtube") {
    const id = extractYouTubeId(data.value);
    if (!id) {
      return (
        <Container component="section" sx={{ py: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              color: "text.secondary",
              textAlign: "center",
              fontSize: 14,
            }}
          >
            Couldn’t detect a YouTube video id. Paste a watch URL, share link, or 11-char id.
          </Box>
        </Container>
      );
    }
    return (
      <Container component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            position: "relative",
            pb: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${id}`}
            title="Embedded video"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </Box>
      </Container>
    );
  }
  // raw HTML — sanitized
  return (
    <Container component="section" sx={{ py: { xs: 6, md: 8 } }}>
      <Box
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(data.value, { USE_PROFILES: { html: true } }),
        }}
      />
    </Container>
  );
}

const BLOCKS: Record<string, (props: { data: any }) => JSX.Element | null> = {
  hero: HeroBlock,
  richText: RichTextBlock,
  imageText: ImageTextBlock,
  featureGrid: FeatureGridBlock,
  quote: QuoteBlock,
  cta: CTABlock,
  faq: FAQBlock,
  embed: EmbedBlock,
};

export default function BlockRenderer({ blocks }: { blocks: CustomBlock[] }) {
  return (
    <>
      {blocks.map((b) => {
        const C = BLOCKS[b.type];
        if (!C) return null;
        return <C key={b.id} data={b.data} />;
      })}
    </>
  );
}
