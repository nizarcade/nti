import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import type { PublicCampaign } from "@/api/campaigns";
import { campaignImage } from "./placeholder";

function fmtMoney(cents: number, ccy = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (ccy || "USD").toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function CampaignCard({ c }: { c: PublicCampaign }) {
  const pct = Math.min(100, c.progress_pct);
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea component={RouterLink} to={`/c/${c.slug}`} sx={{ flex: 1 }}>
        <CardMedia
          component="img"
          image={campaignImage(c.hero_image_url)}
          alt=""
          sx={{ height: 180, objectFit: "cover" }}
        />
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            {c.featured && <Chip size="small" color="secondary" label="Featured" />}
            {c.status === "completed" && <Chip size="small" label="Goal reached" />}
            {c.is_ended && c.status !== "completed" && (
              <Chip size="small" color="warning" label="Ended" />
            )}
          </Stack>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {c.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {c.summary}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {fmtMoney(c.raised_cents, c.currency)} raised
            </Typography>
            <Typography variant="caption" color="text.secondary">
              of {fmtMoney(c.goal_cents, c.currency)} · {c.donors_count} donors
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
