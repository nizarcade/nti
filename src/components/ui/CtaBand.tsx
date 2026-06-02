import { Box, Container, Stack, Typography } from "@mui/material";
import DonateButton from "@/components/ui/DonateButton";

type Props = {
  title: string;
  body?: string;
};

export default function CtaBand({ title, body }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: 720 }}>
            <Typography variant="h3" component="h2" sx={{ color: "inherit" }}>
              {title}
            </Typography>
            {body && (
              <Typography sx={{ mt: 1.5, color: "rgba(255,255,255,0.85)" }}>
                {body}
              </Typography>
            )}
          </Box>
          <DonateButton size="large" />
        </Stack>
      </Container>
    </Box>
  );
}
