import { useEffect, useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Snackbar,
  Stack,
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
import PreviewFrame from "@/components/admin/PreviewFrame";

type Props<T> = {
  slug: string;
  pageLabel: string;
  defaults: T;
  renderEditor: (state: { content: T; setContent: (next: T) => void }) => ReactNode;
  renderPreview: (content: T) => ReactNode;
};

export default function PageContentAdmin<T>({
  slug,
  pageLabel,
  defaults,
  renderEditor,
  renderPreview,
}: Props<T>) {
  const token = useAuthToken();
  const [content, setContent] = useState<T>(defaults);
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
        const r = await pageContentApi.admin(slug, token);
        if (cancelled) return;
        setContent({ ...defaults, ...(r.data as T) });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, slug]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await pageContentApi.save(slug, token, content);
      setContent({ ...defaults, ...(r.data as T) });
      setMeta({ updated_at: r.updated_at, updated_by: r.updated_by });
      setToast("Saved");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm(`Reset ${pageLabel} content to defaults? This cannot be undone.`)) return;
    setSaving(true);
    try {
      const r = await pageContentApi.reset(slug, token);
      setContent({ ...defaults, ...(r.data as T) });
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
            {pageLabel}
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
          <Stack spacing={2}>{renderEditor({ content, setContent })}</Stack>
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
                {renderPreview(content)}
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
