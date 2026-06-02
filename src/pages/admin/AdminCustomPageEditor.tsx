import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import { useAuthToken } from "@/auth/AuthContext";
import {
  customPagesApi,
  type CustomBlock,
  type CustomPagePublic,
} from "@/api/customPages";
import { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";
import PreviewFrame from "@/components/admin/PreviewFrame";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import BlockListEditor, {
  BLOCK_TYPES,
  defaultDataFor,
  newBlockId,
} from "@/components/admin/BlockListEditor";
import AddToNavDialog from "@/components/admin/AddToNavDialog";

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

export default function AdminCustomPageEditor() {
  const { id = "" } = useParams();
  const token = useAuthToken();
  const navigate = useNavigate();

  const [page, setPage] = useState<CustomPagePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // editable mirror
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [blocks, setBlocks] = useState<CustomBlock[]>([]);
  const [seoDesc, setSeoDesc] = useState("");
  const [seoOg, setSeoOg] = useState("");
  const [addAnchor, setAddAnchor] = useState<null | HTMLElement>(null);
  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const dirty = useMemo(() => {
    if (!page) return false;
    return (
      title !== page.title ||
      slug !== page.slug ||
      status !== page.status ||
      seoDesc !== (page.seo?.description || "") ||
      seoOg !== (page.seo?.ogImage || "") ||
      JSON.stringify(blocks) !== JSON.stringify(page.blocks)
    );
  }, [page, title, slug, status, seoDesc, seoOg, blocks]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const guardedNavigate = (to: string) => {
    if (dirty && !window.confirm("You have unsaved changes. Discard them?")) return;
    navigate(to);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await customPagesApi.get(token, id);
        if (cancelled) return;
        setPage(p);
        setTitle(p.title);
        setSlug(p.slug);
        setStatus(p.status);
        setBlocks(p.blocks);
        setSeoDesc(p.seo?.description || "");
        setSeoOg(p.seo?.ogImage || "");
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const slugValid = useMemo(() => SLUG_RE.test(slug), [slug]);

  const save = async () => {
    if (!page) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await customPagesApi.update(token, page.id, {
        title: title.trim(),
        slug: slug.trim(),
        status,
        blocks,
        seo: { description: seoDesc, ogImage: seoOg },
      });
      setPage(updated);
      setTitle(updated.title);
      setSlug(updated.slug);
      setStatus(updated.status);
      setBlocks(updated.blocks);
      setToast("Saved");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addBlock = (type: string) => {
    setBlocks((bs) => [...bs, { id: newBlockId(), type, data: defaultDataFor(type) }]);
    setAddAnchor(null);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }
  if (!page) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Page not found.</Alert>
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
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={() => guardedNavigate("/admin/pages-custom")} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {title || "(untitled)"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              /{slug || "—"} · {status}
              {page.updated_at
                ? ` · saved ${new Date(page.updated_at).toLocaleString()}`
                : ""}
              {dirty ? " · unsaved changes" : ""}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={status === "published" ? "Add this page to the site navigation" : "Publish to enable"}>
            <span>
              <Button
                size="small"
                variant="outlined"
                startIcon={<MenuBookOutlinedIcon />}
                onClick={() => setNavDialogOpen(true)}
                disabled={status !== "published" || !slugValid}
              >
                Add to nav
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={status === "published" ? "Open public page" : "Publish to enable"}>
            <span>
              <IconButton
                size="small"
                component="a"
                href={`/${slug}`}
                target="_blank"
                rel="noreferrer"
                disabled={status !== "published"}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={save}
            disabled={saving || !title.trim() || !slugValid}
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
        <Stack spacing={2}>
          <CollapsibleSection title="Page settings" defaultOpen>
            <TextRow label="Title" value={title} onChange={setTitle} />
            <TextRow
              label="Slug"
              value={slug}
              onChange={setSlug}
              helperText={
                slugValid
                  ? `Public URL: /${slug}`
                  : "Lowercase letters, digits, and hyphens; must start with letter/digit."
              }
            />
            <TextField
              select
              size="small"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              sx={{ maxWidth: 240 }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={status === "published"}
                  onChange={(_, c) => setStatus(c ? "published" : "draft")}
                />
              }
              label="Publish"
            />
          </CollapsibleSection>

          <CollapsibleSection title="SEO">
            <TextRow
              label="Meta description"
              value={seoDesc}
              onChange={setSeoDesc}
              multiline
            />
            <TextRow
              label="Open Graph image URL"
              value={seoOg}
              onChange={setSeoOg}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Blocks" defaultOpen>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                {blocks.length} block{blocks.length === 1 ? "" : "s"}
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={(e) => setAddAnchor(e.currentTarget)}
              >
                Add block
              </Button>
              <Menu
                anchorEl={addAnchor}
                open={!!addAnchor}
                onClose={() => setAddAnchor(null)}
              >
                {BLOCK_TYPES.map((t) => (
                  <MenuItem key={t.value} onClick={() => addBlock(t.value)}>
                    {t.label}
                  </MenuItem>
                ))}
              </Menu>
            </Stack>
            <BlockListEditor blocks={blocks} onChange={setBlocks} />
          </CollapsibleSection>
        </Stack>

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
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ToggleButtonGroup
              size="small"
              exclusive
              value={previewMode}
              onChange={(_, v) => v && setPreviewMode(v)}
              sx={{ mb: 1, bgcolor: "background.paper" }}
            >
              <ToggleButton value="desktop">
                <DesktopWindowsOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} /> Desktop
              </ToggleButton>
              <ToggleButton value="mobile">
                <PhoneIphoneOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} /> Mobile
              </ToggleButton>
            </ToggleButtonGroup>
            <Box
              sx={{
                bgcolor: "background.default",
                boxShadow: 2,
                borderRadius: 1,
                overflow: "hidden",
                width: previewMode === "mobile" ? 390 : "100%",
                maxWidth: 1200,
                flex: 1,
                transition: "width 200ms ease",
              }}
            >
              <PreviewFrame width="100%" height="100%">
                <BlockRenderer blocks={blocks} />
              </PreviewFrame>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setToast(null)} variant="filled">
          {toast}
        </Alert>
      </Snackbar>

      <AddToNavDialog
        open={navDialogOpen}
        onClose={() => setNavDialogOpen(false)}
        defaultLabel={title || slug}
        path={`/${slug}`}
        onAdded={() => setToast("Added to navigation")}
      />
    </Box>
  );
}
