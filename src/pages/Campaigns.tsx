import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Seo from "@/components/ui/Seo";
import SectionHeading from "@/components/ui/SectionHeading";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { campaignsApi, type PublicCampaign } from "@/api/campaigns";

export default function Campaigns() {
  const [items, setItems] = useState<PublicCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    campaignsApi
      .list()
      .then((r) => setItems(r.items))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Seo
        title="Campaigns"
        description="Support a specific NTI fundraising campaign — your gift goes directly to the work you choose."
        pathname="/campaigns"
      />
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading
          eyebrow="Fundraising"
          title="Active campaigns"
          subtitle="Pick a campaign to support. Every contribution is tracked toward its goal — and you'll see exactly what your gift makes possible."
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : items.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No active campaigns right now.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              You can still support the work through a general donation.
            </Typography>
            <Button component={RouterLink} to="/donate" variant="contained" color="secondary">
              Donate to the General Fund
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {items.map((c) => (
              <Grid item xs={12} sm={6} md={4} key={c.id}>
                <CampaignCard c={c} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}


