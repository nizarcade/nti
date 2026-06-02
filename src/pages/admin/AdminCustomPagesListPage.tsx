import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeMosaicOutlinedIcon from "@mui/icons-material/AutoAwesomeMosaicOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { useAuthToken } from "@/auth/AuthContext";
import { customPagesApi, type CustomPageSummary } from "@/api/customPages";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export default function AdminCustomPagesListPage() {
  const token = useAuthToken();
  const navigate = useNavigate();
  const [rows, setRows] = useState<CustomPageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createSlugTouched, setCreateSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<CustomPageSummary | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, row: CustomPageSummary) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuAnchor(e.currentTarget);
    setMenuRow(row);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const reload = async () => {
    setLoading(true);
    try {
      const list = await customPagesApi.list(token);
      setRows(list);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onTitleChange = (v: string) => {
    setCreateTitle(v);
    if (!createSlugTouched) setCreateSlug(slugify(v));
  };

  const create = async () => {
    setBusy(true);
    try {
      const page = await customPagesApi.create(token, {
        title: createTitle.trim(),
        slug: createSlug.trim(),
      });
      setCreateOpen(false);
      setCreateTitle("");
      setCreateSlug("");
      setCreateSlugTouched(false);
      navigate(`/admin/pages-custom/${page.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async (row: CustomPageSummary) => {
    const proposed = `${row.slug}-copy`;
    const input = window.prompt("Slug for the copy:", proposed);
    if (!input) return;
    setBusy(true);
    try {
      const page = await customPagesApi.duplicate(token, row.id, { slug: input.trim() });
      setToast("Duplicated");
      navigate(`/admin/pages-custom/${page.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: CustomPageSummary) => {
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await customPagesApi.remove(token, row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      setToast("Deleted");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const slugValid = useMemo(
    () => /^[a-z0-9][a-z0-9-]*$/.test(createSlug),
    [createSlug],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) || r.slug.toLowerCase().includes(q),
    );
  }, [rows, query]);

  const publishedCount = useMemo(
    () => rows.filter((r) => r.status === "published").length,
    [rows],
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              width: 44,
              height: 44,
              borderRadius: 2,
            }}
            variant="rounded"
          >
            <AutoAwesomeMosaicOutlinedIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Custom pages
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Build standalone pages from reusable content blocks.
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack direction="row" spacing={1.5} sx={{ pr: 1 }}>
            <Stat label="Total" value={rows.length} />
            <Divider orientation="vertical" flexItem />
            <Stat label="Published" value={publishedCount} accent="success.main" />
          </Stack>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ borderRadius: 999, px: 2.5, fontWeight: 700, textTransform: "none" }}
          >
            New page
          </Button>
        </Stack>
      </Stack>

      {/* Search */}
      <TextField
        size="small"
        fullWidth
        placeholder="Search pages by title or slug…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 3, maxWidth: 420 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={148} />
            </Grid>
          ))}
        </Grid>
      ) : rows.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : filtered.length === 0 ? (
        <Box
          sx={{
            p: 5,
            textAlign: "center",
            color: "text.secondary",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          No pages match “{query}”.
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <PageCard
                row={r}
                onEdit={() => navigate(`/admin/pages-custom/${r.id}`)}
                onMenu={(e) => openMenu(e, r)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Per-card action menu */}
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          disabled={!menuRow || menuRow.status !== "published"}
          component="a"
          href={menuRow ? `/${menuRow.slug}` : undefined}
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
        >
          <OpenInNewIcon fontSize="small" sx={{ mr: 1.5 }} /> View public
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuRow) navigate(`/admin/pages-custom/${menuRow.id}`);
            closeMenu();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1.5 }} /> Edit
        </MenuItem>
        <MenuItem
          disabled={busy}
          onClick={() => {
            if (menuRow) void duplicate(menuRow);
            closeMenu();
          }}
        >
          <ContentCopyIcon fontSize="small" sx={{ mr: 1.5 }} /> Duplicate
        </MenuItem>
        <Divider />
        <MenuItem
          disabled={busy}
          onClick={() => {
            if (menuRow) void remove(menuRow);
            closeMenu();
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New page</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={createTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              autoFocus
            />
            <TextField
              label="Slug"
              fullWidth
              value={createSlug}
              onChange={(e) => {
                setCreateSlug(e.target.value);
                setCreateSlugTouched(true);
              }}
              helperText={
                slugValid
                  ? `Will be available at /${createSlug}`
                  : "Lowercase letters, digits, and hyphens. Must start with a letter or digit."
              }
              error={!!createSlug && !slugValid}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={create}
            disabled={busy || !createTitle.trim() || !slugValid}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
}

/* ---------- presentational helpers ---------- */

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <Box sx={{ textAlign: "right", lineHeight: 1 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 800, color: accent || "text.primary" }}>
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function PageCard({
  row,
  onEdit,
  onMenu,
}: {
  row: CustomPageSummary;
  onEdit: () => void;
  onMenu: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const published = row.status === "published";
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: "10px",
        position: "relative",
        transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 8px 24px -12px rgba(0,0,0,0.18)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <CardActionArea onClick={onEdit} sx={{ borderRadius: "10px" }}>
        <CardContent sx={{ p: 2.25 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                noWrap
                sx={{ fontWeight: 700, fontSize: 16, lineHeight: 1.25, mb: 0.25 }}
              >
                {row.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                }}
              >
                /{row.slug}
              </Typography>
            </Box>
            <Tooltip title="Actions">
              <IconButton size="small" onClick={onMenu} sx={{ ml: 1 }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
            <Chip
              size="small"
              icon={
                <CircleIcon
                  sx={{
                    fontSize: "10px !important",
                    color: published ? "success.main" : "text.disabled",
                  }}
                />
              }
              label={published ? "Published" : "Draft"}
              variant="outlined"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "capitalize",
                borderColor: published ? "success.light" : "divider",
                color: published ? "success.dark" : "text.secondary",
                "& .MuiChip-icon": { ml: 0.75 },
              }}
            />
            <Box sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.updated_at
                ? new Date(row.updated_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
              {row.updated_by ? ` · ${row.updated_by}` : ""}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 56,
          height: 56,
          bgcolor: "action.hover",
          color: "primary.main",
          mx: "auto",
          mb: 2,
          borderRadius: 2,
        }}
      >
        <AutoAwesomeMosaicOutlinedIcon />
      </Avatar>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
        No custom pages yet
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: "auto" }}>
        Compose landing pages, announcements, or campaigns from drag-and-drop blocks —
        no developer needed.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreate}
        sx={{ borderRadius: 999, px: 3, fontWeight: 700, textTransform: "none" }}
      >
        Create your first page
      </Button>
    </Box>
  );
}
