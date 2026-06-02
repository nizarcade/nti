import { Box, Typography } from "@mui/material";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: Props) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 3, md: 4 }, maxWidth: align === "center" ? 760 : "none", mx: align === "center" ? "auto" : 0 }}>
      {eyebrow && (
        <Typography
          variant="overline"
          sx={{ color: "secondary.dark", fontWeight: 700, letterSpacing: "0.12em" }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h2" component="h2" sx={{ mt: eyebrow ? 0.5 : 0 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
