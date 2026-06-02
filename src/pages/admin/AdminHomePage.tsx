import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { useAuthToken } from "@/auth/AuthContext";
import { pageContentApi } from "@/api/pageContent";
import { homeDefaults, type HomeContent } from "@/content/homeDefaults";
import { ICON_KEYS } from "@/components/icons/registry";
import HomeView from "@/components/home/HomeView";
import PreviewFrame from "@/components/admin/PreviewFrame";
import RepeaterList, {
  CollapsibleSection,
  TextRow,
} from "@/components/admin/RepeaterList";

function CtaEditor({
  value,
  onChange,
  allowDonate = false,
}: {
  value: HomeContent["hero"]["primaryCta"];
  onChange: (v: HomeContent["hero"]["primaryCta"]) => void;
  allowDonate?: boolean;
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
      <TextField
        label="Button label"
        value={value.label}
        size="small"
        fullWidth
        onChange={(e) => onChange({ ...value, label: e.target.value })}
      />
      <TextField
        label="Link"
        value={value.href}
        size="small"
        fullWidth
        onChange={(e) => onChange({ ...value, href: e.target.value })}
      />
      {allowDonate && (
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Kind</InputLabel>
          <Select
            label="Kind"
            value={value.kind}
            onChange={(e) =>
              onChange({ ...value, kind: e.target.value as "link" | "donate" })
            }
          >
            <MenuItem value="link">Link</MenuItem>
            <MenuItem value="donate">Donate</MenuItem>
          </Select>
        </FormControl>
      )}
    </Stack>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel>Icon</InputLabel>
      <Select label="Icon" value={value} onChange={(e) => onChange(e.target.value)}>
        {ICON_KEYS.map((k) => (
          <MenuItem key={k} value={k}>
            {k}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function AdminHomePage() {
  const token = useAuthToken();
  const [content, setContent] = useState<HomeContent>(homeDefaults);
  const [meta, setMeta] = useState<{ updated_at: string | null; updated_by: string | null }>({
    updated_at: null,
    updated_by: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await pageContentApi.admin("home", token);
        if (cancelled) return;
        setContent({ ...homeDefaults, ...(r.data as HomeContent) });
        setMeta({ updated_at: r.updated_at, updated_by: r.updated_by });
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const patch = <K extends keyof HomeContent>(key: K, value: HomeContent[K]) => {
    setContent((c) => ({ ...c, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await pageContentApi.save("home", token, content);
      setContent({ ...homeDefaults, ...(r.data as HomeContent) });
      setMeta({ updated_at: r.updated_at, updated_by: r.updated_by });
      setToast("Saved");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset Home page content to defaults? This cannot be undone.")) return;
    setSaving(true);
    try {
      const r = await pageContentApi.reset("home", token);
      setContent({ ...homeDefaults, ...(r.data as HomeContent) });
      setMeta({ updated_at: r.updated_at, updated_by: r.updated_by });
      setToast("Reset to defaults");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{
          mb: 3,
          position: "sticky",
          top: 0,
          zIndex: 5,
          bgcolor: "background.default",
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Home page
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {meta.updated_at
              ? `Last updated ${new Date(meta.updated_at).toLocaleString()}${
                  meta.updated_by ? ` by ${meta.updated_by}` : ""
                }`
              : "Showing defaults — not yet saved."}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButtonGroup
            value={viewport}
            exclusive
            size="small"
            onChange={(_, v) => v && setViewport(v)}
            sx={{ display: { xs: "none", lg: "inline-flex" } }}
          >
            <ToggleButton value="desktop" aria-label="Desktop">
              <DesktopWindowsIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="mobile" aria-label="Mobile">
              <PhoneIphoneIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={reset}
            disabled={saving}
            size="small"
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={save}
            disabled={saving}
            size="small"
          >
            Save
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(420px, 540px) 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box>
          <Stack spacing={2}>
        {/* SEO */}
        <CollapsibleSection title="SEO">
          <TextRow
            label="Title"
            value={content.seo.title}
            onChange={(v) => patch("seo", { ...content.seo, title: v })}
          />
          <TextRow
            label="Description"
            value={content.seo.description}
            multiline
            minRows={2}
            onChange={(v) => patch("seo", { ...content.seo, description: v })}
          />
        </CollapsibleSection>

        {/* Hero */}
        <CollapsibleSection title="Hero" defaultOpen>
          <FormControlLabel
            control={
              <Switch
                checked={content.hero.enabled}
                onChange={(e) =>
                  patch("hero", { ...content.hero, enabled: e.target.checked })
                }
              />
            }
            label="Enabled"
          />
          <TextRow
            label="Overline (small text above the headline)"
            value={content.hero.overline}
            onChange={(v) => patch("hero", { ...content.hero, overline: v })}
          />
          <TextRow
            label="Headline (use new lines for line breaks)"
            value={content.hero.headline}
            multiline
            minRows={3}
            onChange={(v) => patch("hero", { ...content.hero, headline: v })}
          />
          <TextRow
            label="Subhead"
            value={content.hero.subhead}
            multiline
            minRows={3}
            onChange={(v) => patch("hero", { ...content.hero, subhead: v })}
          />
          <TextRow
            label="Background image URL (optional)"
            value={content.hero.backgroundImageUrl ?? ""}
            onChange={(v) =>
              patch("hero", { ...content.hero, backgroundImageUrl: v || null })
            }
          />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Primary CTA</Typography>
          <CtaEditor
            allowDonate
            value={content.hero.primaryCta}
            onChange={(v) => patch("hero", { ...content.hero, primaryCta: v })}
          />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Secondary CTA (optional)</Typography>
          <CtaEditor
            value={content.hero.secondaryCta ?? { label: "", href: "", kind: "link" }}
            onChange={(v) =>
              patch("hero", {
                ...content.hero,
                secondaryCta: v.label || v.href ? v : null,
              })
            }
          />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Tertiary CTA (optional)</Typography>
          <CtaEditor
            value={content.hero.tertiaryCta ?? { label: "", href: "", kind: "link" }}
            onChange={(v) =>
              patch("hero", {
                ...content.hero,
                tertiaryCta: v.label || v.href ? v : null,
              })
            }
          />
        </CollapsibleSection>

        {/* Pillars */}
        <CollapsibleSection title="Mission pillars">
          <FormControlLabel
            control={
              <Switch
                checked={content.pillars.enabled}
                onChange={(e) =>
                  patch("pillars", { ...content.pillars, enabled: e.target.checked })
                }
              />
            }
            label="Enabled"
          />
          <TextRow
            label="Eyebrow"
            value={content.pillars.eyebrow}
            onChange={(v) => patch("pillars", { ...content.pillars, eyebrow: v })}
          />
          <TextRow
            label="Title"
            value={content.pillars.title}
            onChange={(v) => patch("pillars", { ...content.pillars, title: v })}
          />
          <TextRow
            label="Subtitle"
            value={content.pillars.subtitle}
            multiline
            minRows={2}
            onChange={(v) => patch("pillars", { ...content.pillars, subtitle: v })}
          />
          <RepeaterList
            label="Pillar cards"
            items={content.pillars.items}
            onChange={(items) => patch("pillars", { ...content.pillars, items })}
            blank={() => ({ iconKey: "groups", title: "", body: "" })}
            addLabel="Add pillar"
            renderItem={(it, on) => (
              <Stack spacing={1.5}>
                <IconPicker value={it.iconKey} onChange={(v) => on({ ...it, iconKey: v })} />
                <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                <TextRow
                  label="Body"
                  value={it.body}
                  multiline
                  minRows={2}
                  onChange={(v) => on({ ...it, body: v })}
                />
              </Stack>
            )}
          />
        </CollapsibleSection>

        {/* Grace Bridge teaser */}
        <CollapsibleSection title="Grace Bridge teaser">
          <FormControlLabel
            control={
              <Switch
                checked={content.graceBridge.enabled}
                onChange={(e) =>
                  patch("graceBridge", { ...content.graceBridge, enabled: e.target.checked })
                }
              />
            }
            label="Enabled"
          />
          <TextRow
            label="Eyebrow"
            value={content.graceBridge.eyebrow}
            onChange={(v) => patch("graceBridge", { ...content.graceBridge, eyebrow: v })}
          />
          <TextRow
            label="Title"
            value={content.graceBridge.title}
            onChange={(v) => patch("graceBridge", { ...content.graceBridge, title: v })}
          />
          <TextRow
            label="Body"
            value={content.graceBridge.body}
            multiline
            minRows={4}
            onChange={(v) => patch("graceBridge", { ...content.graceBridge, body: v })}
          />
          <TextRow
            label="Overlay text (used when no image)"
            value={content.graceBridge.overlayText ?? ""}
            onChange={(v) =>
              patch("graceBridge", { ...content.graceBridge, overlayText: v || null })
            }
          />
          <TextRow
            label="Image URL (optional)"
            value={content.graceBridge.imageUrl ?? ""}
            onChange={(v) => patch("graceBridge", { ...content.graceBridge, imageUrl: v || null })}
          />
          <Typography variant="subtitle2" sx={{ mt: 1 }}>CTA</Typography>
          <CtaEditor
            value={content.graceBridge.cta}
            onChange={(v) => patch("graceBridge", { ...content.graceBridge, cta: v })}
          />
        </CollapsibleSection>

        {/* Stats */}
        <CollapsibleSection title="Impact stats">
          <FormControlLabel
            control={
              <Switch
                checked={content.stats.enabled}
                onChange={(e) => patch("stats", { ...content.stats, enabled: e.target.checked })}
              />
            }
            label="Enabled"
          />
          <RepeaterList
            label="Stats"
            items={content.stats.items}
            onChange={(items) => patch("stats", { ...content.stats, items })}
            blank={() => ({ value: "", label: "" })}
            addLabel="Add stat"
            renderItem={(it, on) => (
              <Stack spacing={1.5}>
                <TextRow
                  label="Value (e.g. 15+, 2026, 3)"
                  value={it.value}
                  onChange={(v) => on({ ...it, value: v })}
                />
                <TextRow label="Label" value={it.label} onChange={(v) => on({ ...it, label: v })} />
              </Stack>
            )}
          />
        </CollapsibleSection>

        {/* Donation tiers */}
        <CollapsibleSection title="Donation tiers">
          <FormControlLabel
            control={
              <Switch
                checked={content.donationTiers.enabled}
                onChange={(e) =>
                  patch("donationTiers", { ...content.donationTiers, enabled: e.target.checked })
                }
              />
            }
            label="Enabled"
          />
          <TextRow
            label="Eyebrow"
            value={content.donationTiers.eyebrow}
            onChange={(v) => patch("donationTiers", { ...content.donationTiers, eyebrow: v })}
          />
          <TextRow
            label="Title"
            value={content.donationTiers.title}
            onChange={(v) => patch("donationTiers", { ...content.donationTiers, title: v })}
          />
          <RepeaterList
            label="Tiers"
            items={content.donationTiers.items}
            onChange={(items) => patch("donationTiers", { ...content.donationTiers, items })}
            blank={() => ({ amount: 25, title: "", body: "" })}
            addLabel="Add tier"
            renderItem={(it, on) => (
              <Stack spacing={1.5}>
                <TextField
                  label="Amount (USD)"
                  type="number"
                  size="small"
                  value={it.amount}
                  onChange={(e) =>
                    on({ ...it, amount: Math.max(1, parseInt(e.target.value || "0", 10) || 0) })
                  }
                />
                <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                <TextRow
                  label="Body"
                  value={it.body}
                  multiline
                  minRows={2}
                  onChange={(v) => on({ ...it, body: v })}
                />
              </Stack>
            )}
          />
        </CollapsibleSection>

        {/* Featured campaigns */}
        <CollapsibleSection title="Featured campaigns">
          <FormControlLabel
            control={
              <Switch
                checked={content.featuredCampaigns.enabled}
                onChange={(e) =>
                  patch("featuredCampaigns", {
                    ...content.featuredCampaigns,
                    enabled: e.target.checked,
                  })
                }
              />
            }
            label="Enabled"
          />
          <TextRow
            label="Eyebrow"
            value={content.featuredCampaigns.eyebrow}
            onChange={(v) =>
              patch("featuredCampaigns", { ...content.featuredCampaigns, eyebrow: v })
            }
          />
          <TextRow
            label="Title"
            value={content.featuredCampaigns.title}
            onChange={(v) =>
              patch("featuredCampaigns", { ...content.featuredCampaigns, title: v })
            }
          />
          <TextRow
            label="Subtitle"
            value={content.featuredCampaigns.subtitle}
            multiline
            minRows={2}
            onChange={(v) =>
              patch("featuredCampaigns", { ...content.featuredCampaigns, subtitle: v })
            }
          />
          <TextField
            label="How many to show"
            type="number"
            size="small"
            value={content.featuredCampaigns.limit}
            onChange={(e) =>
              patch("featuredCampaigns", {
                ...content.featuredCampaigns,
                limit: Math.max(1, Math.min(12, parseInt(e.target.value || "1", 10) || 1)),
              })
            }
            sx={{ maxWidth: 200 }}
          />
        </CollapsibleSection>

        {/* Quote */}
        <CollapsibleSection title="Quote">
          <FormControlLabel
            control={
              <Switch
                checked={content.quote.enabled}
                onChange={(e) => patch("quote", { ...content.quote, enabled: e.target.checked })}
              />
            }
            label="Enabled"
          />
          <TextRow
            label="Quote text"
            value={content.quote.text}
            multiline
            minRows={3}
            onChange={(v) => patch("quote", { ...content.quote, text: v })}
          />
          <TextRow
            label="Attribution name"
            value={content.quote.attributionName}
            onChange={(v) => patch("quote", { ...content.quote, attributionName: v })}
          />
          <TextRow
            label="Attribution role"
            value={content.quote.attributionRole}
            onChange={(v) => patch("quote", { ...content.quote, attributionRole: v })}
          />
        </CollapsibleSection>

        {/* CTA Band */}
        <CollapsibleSection title="Bottom CTA band">
          <FormControlLabel
            control={
              <Switch
                checked={content.ctaBand.enabled}
                onChange={(e) =>
                  patch("ctaBand", { ...content.ctaBand, enabled: e.target.checked })
                }
              />
            }
            label="Enabled"
          />
          <TextRow
            label="Title"
            value={content.ctaBand.title}
            onChange={(v) => patch("ctaBand", { ...content.ctaBand, title: v })}
          />
          <TextRow
            label="Body (optional)"
            value={content.ctaBand.body ?? ""}
            multiline
            minRows={2}
            onChange={(v) => patch("ctaBand", { ...content.ctaBand, body: v || null })}
          />
        </CollapsibleSection>
          </Stack>
        </Box>

        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            position: "sticky",
            top: 80,
            alignSelf: "start",
            maxHeight: "calc(100vh - 96px)",
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: "text.secondary", display: "block", mb: 1 }}
          >
            Live preview
          </Typography>
          <Box
            sx={{
              bgcolor: "#eef1f4",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 1.5,
              height: "calc(100vh - 130px)",
              overflow: "auto",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.default",
                boxShadow: 2,
                borderRadius: 1,
                overflow: "hidden",
                width: viewport === "mobile" ? 390 : "100%",
                maxWidth: viewport === "mobile" ? 390 : 1200,
                transition: "width 200ms ease",
              }}
            >
              <PreviewFrame width="100%" height="calc(100vh - 162px)">
                <HomeView content={content} />
              </PreviewFrame>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setToast(null)} variant="filled">
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
