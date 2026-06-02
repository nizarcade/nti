import { Box, Button, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import Seo from "@/components/ui/Seo";

export default function DonateCancel() {
  return (
    <>
      <Seo title="Donation cancelled" pathname="/donate/cancel" />
      <Container sx={{ py: { xs: 10, md: 14 }, textAlign: "center" }}>
        <InfoIcon sx={{ fontSize: 72, color: "secondary.main" }} />
        <Typography variant="h2" sx={{ mt: 2 }}>Donation cancelled.</Typography>
        <Typography sx={{ mt: 2, color: "text.secondary", maxWidth: 600, mx: "auto" }}>
          No charge was made. If you'd like to try again — or contribute a different amount —
          you can return to the donation page below.
        </Typography>
        <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button component={RouterLink} to="/donate" variant="contained">Try again</Button>
          <Button component={RouterLink} to="/" variant="outlined">Back to home</Button>
        </Box>
      </Container>
    </>
  );
}
