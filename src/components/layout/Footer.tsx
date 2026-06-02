import { Box, Container, Grid, Stack, Typography, Link, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmailIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import { useLayoutContent } from "@/hooks/useLayoutContent";
import type { LayoutContent } from "@/content/layoutDefaults";

type Props = { content?: LayoutContent };

export default function Footer({ content }: Props = {}) {
  const fetched = useLayoutContent();
  const c = content ?? fetched.content;
  const { footer } = c;
  const year = new Date().getFullYear();
  const copyright = footer.copyright.replace("{year}", String(year));

  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 8, md: 12 },
        bgcolor: "#0E2A40",
        color: "#E8EEF4",
      }}
    >
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', mb: 1.5 }}>
              {footer.brandName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#B7C4D1", maxWidth: 360 }}>
              {footer.brandBlurb}
            </Typography>
          </Grid>

          {footer.columns.map((col, i) => (
            <Grid item xs={12} sm={6} md={2} key={`${col.heading}-${i}`}>
              <Typography variant="overline" sx={{ color: "#B7C4D1" }}>
                {col.heading}
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {col.links.map((l, j) => (
                  <FooterLink key={`${l.to}-${j}`} to={l.to}>
                    {l.label}
                  </FooterLink>
                ))}
              </Stack>
            </Grid>
          ))}

          <Grid item xs={12} md={4}>
            <Typography variant="overline" sx={{ color: "#B7C4D1" }}>
              Contact
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 1 }}>
              <Stack direction="row" spacing={1.25} alignItems="flex-start">
                <PlaceIcon fontSize="small" />
                <Typography variant="body2" sx={{ color: "#B7C4D1" }}>
                  U.S. Office <br /> {footer.contact.usOfficeLine} ·{" "}
                  <Link href={`tel:${footer.contact.usPhoneTel}`} color="inherit">
                    {footer.contact.usPhoneDisplay}
                  </Link>
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <EmailIcon fontSize="small" />
                <Link href={`mailto:${footer.contact.email}`} color="inherit">
                  {footer.contact.email}
                </Link>
              </Stack>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <PhoneIcon fontSize="small" />
                <Link href={`tel:${footer.contact.kePhoneTel}`} color="inherit">
                  {footer.contact.kePhoneDisplay}
                </Link>
              </Stack>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {footer.contact.keAddress}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", my: 4 }} />
        <Typography
          variant="caption"
          component="p"
          sx={{ color: "#9BAAB8", display: "block", mb: 2, lineHeight: 1.6 }}
        >
          {footer.legalDisclosure}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Typography variant="body2" sx={{ color: "#B7C4D1" }}>
            {copyright}
          </Typography>
          <Stack direction="row" spacing={3}>
            {footer.bottomLinks.map((l, i) => (
              <FooterLink key={`${l.to}-${i}`} to={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      component={RouterLink}
      to={to}
      color="inherit"
      sx={{ color: "#E8EEF4", "&:hover": { color: "#fff" } }}
    >
      {children}
    </Link>
  );
}
