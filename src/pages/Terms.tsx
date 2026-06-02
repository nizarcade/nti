import { Container, Stack, Typography } from "@mui/material";
import SectionHeading from "@/components/ui/SectionHeading";
import Seo from "@/components/ui/Seo";

export default function Terms() {
  return (
    <>
      <Seo title="Terms" pathname="/terms" />
      <Container sx={{ py: { xs: 8, md: 12 }, maxWidth: "md !important" }}>
        <SectionHeading eyebrow="Legal" title="Donor Terms" />
        <Stack spacing={3} sx={{ color: "text.secondary" }}>
          <Typography>
            All donations to NTI are voluntary and used to support our charitable programs.
            Donations are generally non-refundable except in cases of error; please email
            info@ntiafrica.org within 30 days to request a refund review.
          </Typography>
          <Typography>
            Monthly partnerships continue until cancelled. You may cancel any recurring
            donation at any time by emailing info@ntiafrica.org.
          </Typography>
          <Typography>
            NTI does not provide goods or services in exchange for donations. Tax
            deductibility depends on your jurisdiction and applicable registration status.
          </Typography>
        </Stack>
      </Container>
    </>
  );
}
