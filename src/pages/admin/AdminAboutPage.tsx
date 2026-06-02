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
import { aboutDefaults, type AboutContent, type GovernanceChip } from "@/content/aboutDefaults";
import { ICON_KEYS } from "@/components/icons/registry";
import AboutView from "@/components/about/AboutView";
import PreviewFrame from "@/components/admin/PreviewFrame";
import RepeaterList, {
  CollapsibleSection,
  TextRow,
} from "@/components/admin/RepeaterList";

export default function AdminAboutPage() {
  const token = useAuthToken();
  const [content, setContent] = useState<AboutContent>(aboutDefaults);
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
        const r = await pageContentApi.admin("about", token);
        if (cancelled) return;
        setContent({ ...aboutDefaults, ...(r.data as AboutContent) });
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

  const patch = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) =>
    setContent((c) => ({ ...c, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await pageContentApi.save("about", token, content);
      setContent({ ...aboutDefaults, ...(r.data as AboutContent) });
      setMeta({ updated_at: r.updated_at, updated_by: r.updated_by });
      setToast("Saved");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset About page content to defaults? This cannot be undone.")) return;
    setSaving(true);
    try {
      const r = await pageContentApi.reset("about", token);
      setContent({ ...aboutDefaults, ...(r.data as AboutContent) });
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
            About page
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

            <CollapsibleSection title="Intro" defaultOpen>
              <TextRow
                label="Eyebrow"
                value={content.intro.eyebrow}
                onChange={(v) => patch("intro", { ...content.intro, eyebrow: v })}
              />
              <TextRow
                label="Title"
                value={content.intro.title}
                onChange={(v) => patch("intro", { ...content.intro, title: v })}
              />
              <TextRow
                label="Subtitle"
                value={content.intro.subtitle}
                multiline
                minRows={3}
                onChange={(v) => patch("intro", { ...content.intro, subtitle: v })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Mission callout">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.mission.enabled}
                    onChange={(e) =>
                      patch("mission", { ...content.mission, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Overline"
                value={content.mission.overline}
                onChange={(v) => patch("mission", { ...content.mission, overline: v })}
              />
              <TextRow
                label="Statement"
                value={content.mission.statement}
                multiline
                minRows={3}
                onChange={(v) => patch("mission", { ...content.mission, statement: v })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="History & Vision">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.historyVision.enabled}
                    onChange={(e) =>
                      patch("historyVision", {
                        ...content.historyVision,
                        enabled: e.target.checked,
                      })
                    }
                  />
                }
                label="Enabled"
              />
              <Typography variant="subtitle2">History</Typography>
              <TextRow
                label="Title"
                value={content.historyVision.history.title}
                onChange={(v) =>
                  patch("historyVision", {
                    ...content.historyVision,
                    history: { ...content.historyVision.history, title: v },
                  })
                }
              />
              <TextRow
                label="Body"
                value={content.historyVision.history.body}
                multiline
                minRows={4}
                onChange={(v) =>
                  patch("historyVision", {
                    ...content.historyVision,
                    history: { ...content.historyVision.history, body: v },
                  })
                }
              />
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Vision
              </Typography>
              <TextRow
                label="Title"
                value={content.historyVision.vision.title}
                onChange={(v) =>
                  patch("historyVision", {
                    ...content.historyVision,
                    vision: { ...content.historyVision.vision, title: v },
                  })
                }
              />
              <TextRow
                label="Body"
                value={content.historyVision.vision.body}
                multiline
                minRows={4}
                onChange={(v) =>
                  patch("historyVision", {
                    ...content.historyVision,
                    vision: { ...content.historyVision.vision, body: v },
                  })
                }
              />
            </CollapsibleSection>

            <CollapsibleSection title="Values">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.values.enabled}
                    onChange={(e) =>
                      patch("values", { ...content.values, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Section title"
                value={content.values.title}
                onChange={(v) => patch("values", { ...content.values, title: v })}
              />
              <RepeaterList
                label="Value cards"
                items={content.values.items}
                onChange={(items) => patch("values", { ...content.values, items })}
                blank={() => ({ iconKey: "check", title: "", body: "" })}
                addLabel="Add value"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <FormControl size="small" fullWidth>
                      <InputLabel>Icon</InputLabel>
                      <Select
                        label="Icon"
                        value={it.iconKey}
                        onChange={(e) => on({ ...it, iconKey: e.target.value })}
                      >
                        {ICON_KEYS.map((k) => (
                          <MenuItem key={k} value={k}>
                            {k}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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

            <CollapsibleSection title="Governance">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.governance.enabled}
                    onChange={(e) =>
                      patch("governance", {
                        ...content.governance,
                        enabled: e.target.checked,
                      })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Title"
                value={content.governance.title}
                onChange={(v) => patch("governance", { ...content.governance, title: v })}
              />
              <TextRow
                label="Subtitle"
                value={content.governance.subtitle}
                multiline
                minRows={2}
                onChange={(v) => patch("governance", { ...content.governance, subtitle: v })}
              />
              <RepeaterList<GovernanceChip>
                label="Chips"
                items={content.governance.chips}
                onChange={(chips) => patch("governance", { ...content.governance, chips })}
                blank={() => ({ label: "", emphasis: "default" as const })}
                addLabel="Add chip"
                renderItem={(it, on) => (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <TextRow label="Label" value={it.label} onChange={(v) => on({ ...it, label: v })} />
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Emphasis</InputLabel>
                      <Select
                        label="Emphasis"
                        value={it.emphasis}
                        onChange={(e) =>
                          on({ ...it, emphasis: e.target.value as "primary" | "default" })
                        }
                      >
                        <MenuItem value="default">Default</MenuItem>
                        <MenuItem value="primary">Primary</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                )}
              />
            </CollapsibleSection>

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
          <Typography variant="overline" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
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
                <AboutView content={content} />
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
