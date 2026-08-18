import { Container, Typography, Stack } from "@mui/material";
import SectionHeading from "@/components/ui/SectionHeading";
import Seo from "@/components/ui/Seo";

export default function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy" pathname="/privacy" />

      <Container sx={{ py: { xs: 8, md: 12 }, maxWidth: "md !important" }}>
        <SectionHeading eyebrow="Legal" title="Privacy Policy" />

        <Stack spacing={3} sx={{ color: "text.secondary" }}>
          <Typography>
            Northern Transformation Initiative (NTI) collects personal information you
            voluntarily provide — such as your name, email, and donation details — solely to
            process donations, send receipts, and communicate about our programs.
          </Typography>

          <Typography>
            Payment processing is handled by Stripe. NTI does not store full card
            numbers. We use cookies only for essential site functionality and, with consent,
            for privacy-friendly analytics.
          </Typography>

          <Typography>
            You may request access to, correction of, or deletion of your personal data at any
            time by emailing info@northerntransformationinitiative.org.
          </Typography>

          <Typography variant="caption">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Stack>
      </Container>
    </>
  );
}
