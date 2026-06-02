import { Container, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Seo from "@/components/ui/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <Container sx={{ py: { xs: 12, md: 16 }, textAlign: "center" }}>
        <Typography variant="h1" sx={{ color: "primary.main" }}>404</Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>We couldn't find that page.</Typography>
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          The page may have moved or never existed. Let's get you back home.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button component={RouterLink} to="/" variant="contained">Back to home</Button>
        </Box>
      </Container>
    </>
  );
}
