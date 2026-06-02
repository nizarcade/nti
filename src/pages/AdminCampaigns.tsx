import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArchiveIcon from "@mui/icons-material/Archive";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkIcon from "@mui/icons-material/Link";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { adminApi, type Campaign, type CampaignInput, type ImpactItem } from "@/api/admin";
import { ApiError } from "@/api/client";
import { useAuthToken } from "@/auth/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";

const STATUSES: Campaign["status"][] = ["draft", "active", "paused", "completed", "archived"];
const DESIGNATIONS = ["general", "grace_bridge", "education", "livelihood"];

function fmtMoney(cents: number, ccy = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy }).format(cents / 100);
}

function blankInput(): CampaignInput {
  return {
    slug: "",
    title: "",
    summary: "",
    story_html: "",
    hero_image_url: "",
    goal_cents: 0,
    currency: "usd",
    designation: "general",
    status: "draft",
    featured: false,
    starts_at: null,
    ends_at: null,
    impact_items: [],
  };
}

function dollarsToCents(s: string): number {
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function centsToDollars(c: number): string {
  return (c / 100).toFixed(2);
}

export default function AdminCampaigns({ auth: authProp }: { auth?: string } = {}) {
  const ctxToken = useAuthToken();
  const auth = authProp ?? ctxToken;
  const [rows, setRows] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Campaign["status"]>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await adminApi.campaigns.list(auth, includeArchived);
      setRows(r.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [auth, includeArchived]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [query, statusFilter, includeArchived]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.designation.toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const pageRows = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  const totalRaisedCents = useMemo(
    () => filtered.reduce((s, c) => s + c.raised_cents, 0),
    [filtered],
  );

  async function downloadCsv(slug?: string) {
    try {
      const blob = await adminApi.exportCsv(auth, slug);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = slug ? `donations-${slug}.csv` : "donations-all.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }
  }

  async function archive(c: Campaign) {
    if (!confirm(`Archive "${c.title}"? Donors won't see it. Existing donations stay attributed.`)) return;
    try {
      await adminApi.campaigns.archive(auth, c.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Archive failed");
    }
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 700 }}>
            Campaigns
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, edit, and track fundraising campaigns.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            size="small"
            onClick={() => downloadCsv()}
          >
            CSV (all)
          </Button>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            size="small"
            onClick={() => setCreating(true)}
          >
            New campaign
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card variant="outlined" sx={{ overflow: "hidden", borderRadius: 1 }}>
        {loading && <LinearProgress sx={{ height: 2 }} />}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          sx={{ px: { xs: 2, md: 3 }, py: 2 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
              All campaigns
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {loading
                ? "Loading…"
                : `${filtered.length} of ${rows.length} campaign${rows.length === 1 ? "" : "s"}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fmtMoney(totalRaisedCents)} raised across the current view
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={includeArchived}
                  onChange={(e) => setIncludeArchived(e.target.checked)}
                />
              }
              label="Show archived"
              sx={{ mr: 0 }}
            />
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={load} disabled={loading} size="small">
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Divider />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          sx={{ px: { xs: 2, md: 3 }, py: 1.75, bgcolor: "background.default" }}
        >
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, slug, designation…"
            sx={{ minWidth: { xs: "100%", md: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            size="small"
            onChange={(_e, v) => v && setStatusFilter(v)}
          >
            <ToggleButton value="all">All</ToggleButton>
            {STATUSES.map((s) => (
              <ToggleButton key={s} value={s} sx={{ textTransform: "capitalize" }}>
                {s}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Divider />

        <TableContainer>
          <Table size="small" sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 700,
                    bgcolor: "background.default",
                    color: "text.secondary",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                  },
                }}
              >
                <TableCell>Title / slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell align="right">Donors</TableCell>
                <TableCell>Ends</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell colSpan={7}>
                      <Skeleton variant="text" height={28} />
                    </TableCell>
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ py: 6, textAlign: "center", color: "text.secondary" }}
                  >
                    {rows.length === 0 ? (
                      <>
                        No campaigns yet. Click <strong>New campaign</strong> to create one.
                      </>
                    ) : (
                      "No campaigns match your filters."
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{
                      "& td": { py: 1.5, borderColor: "divider" },
                      "&:last-of-type td": { border: 0 },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {c.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            /{c.slug}
                          </Typography>
                        </Box>
                        {c.featured && (
                          <Chip
                            size="small"
                            label="featured"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={c.status}
                        color={statusColor(c.status)}
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {c.designation.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 220 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(100, c.progress_pct)}
                            sx={{ height: 6, borderRadius: 4 }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ minWidth: 110, textAlign: "right", fontVariantNumeric: "tabular-nums" }}
                        >
                          {fmtMoney(c.raised_cents)} / {fmtMoney(c.goal_cents)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {c.donors_count}
                    </TableCell>
                    <TableCell>
                      {c.ends_at ? new Date(c.ends_at).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Copy share URL">
                        <IconButton
                          size="small"
                          onClick={() => {
                            void navigator.clipboard.writeText(c.share_url);
                          }}
                        >
                          <LinkIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download CSV for this campaign">
                        <IconButton size="small" onClick={() => downloadCsv(c.slug)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => setEditing(c)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {c.status !== "archived" && (
                        <Tooltip title="Archive">
                          <IconButton size="small" onClick={() => archive(c)}>
                            <ArchiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_e, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>

      {creating && (
        <CampaignDialog
          auth={auth}
          initial={blankInput()}
          mode="create"
          onClose={() => setCreating(false)}
          onSaved={async () => {
            setCreating(false);
            await load();
          }}
        />
      )}

      {editing && (
        <CampaignDialog
          auth={auth}
          initial={campaignToInput(editing)}
          mode="edit"
          idOrSlug={editing.id}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
        />
      )}
    </Box>
  );
}

function campaignToInput(c: Campaign): CampaignInput {
  return {
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    story_html: c.story_html,
    hero_image_url: c.hero_image_url ?? "",
    goal_cents: c.goal_cents,
    currency: c.currency,
    designation: c.designation,
    status: c.status,
    featured: c.featured,
    starts_at: c.starts_at,
    ends_at: c.ends_at,
    impact_items: c.impact_items ?? [],
  };
}

function statusColor(s: Campaign["status"]): "default" | "success" | "warning" | "info" | "error" {
  return (
    {
      draft: "default",
      active: "success",
      paused: "warning",
      completed: "info",
      archived: "error",
    } as const
  )[s];
}

function CampaignDialog({
  auth,
  initial,
  mode,
  idOrSlug,
  onClose,
  onSaved,
}: {
  auth: string;
  initial: CampaignInput;
  mode: "create" | "edit";
  idOrSlug?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CampaignInput>(initial);
  const [goalDollars, setGoalDollars] = useState(centsToDollars(initial.goal_cents ?? 0));
  const [impact, setImpact] = useState<ImpactItem[]>(initial.impact_items ?? []);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isEdit = mode === "edit";

  function set<K extends keyof CampaignInput>(k: K, v: CampaignInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function setImpactRow(idx: number, patch: Partial<ImpactItem>) {
    setImpact((arr) => arr.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  const validSlug = useMemo(() => /^[a-z0-9][a-z0-9-]*$/.test(form.slug), [form.slug]);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const payload: CampaignInput = {
        ...form,
        goal_cents: dollarsToCents(goalDollars),
        hero_image_url: form.hero_image_url || null,
        ends_at: form.ends_at || null,
        starts_at: form.starts_at || new Date().toISOString(),
        impact_items: impact.filter((i) => i.label.trim() && i.amount_cents >= 0),
      };
      if (isEdit && idOrSlug) {
        await adminApi.campaigns.update(auth, idOrSlug, payload);
      } else {
        await adminApi.campaigns.create(auth, payload);
      }
      onSaved();
    } catch (e) {
      if (e instanceof ApiError) {
        setErr(`${e.status}: ${e.message}`);
      } else {
        setErr(e instanceof Error ? e.message : "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
              {isEdit ? "Edit campaign" : "New campaign"}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.25 }} noWrap>
              {isEdit ? initial.title || "Untitled" : "Create a new campaign"}
            </Typography>
            {isEdit && (
              <Typography variant="caption" color="text.secondary">
                /{initial.slug}
              </Typography>
            )}
          </Box>
          {isEdit && form.status && (
            <Chip
              size="small"
              label={form.status}
              color={statusColor(form.status)}
              sx={{ textTransform: "capitalize", fontWeight: 600 }}
            />
          )}
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", top: 12, right: 12 }}
          aria-label="Close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ bgcolor: "background.default", py: 3 }}>
        {err && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr(null)}>
            {err}
          </Alert>
        )}

        <Stack spacing={2.5}>
          <FormSection
            title="Basics"
            description="The name, URL slug, and one-line summary donors see on campaign cards."
          >
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Title"
                  fullWidth
                  required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Grace Bridge — Q3 sponsorship drive"
                />
                <TextField
                  label="Slug"
                  required
                  fullWidth
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value.toLowerCase())}
                  disabled={isEdit}
                  error={!!form.slug && !validSlug}
                  helperText={
                    isEdit
                      ? "Slug is permanent once a campaign is published."
                      : validSlug || !form.slug
                        ? "Lowercase letters, digits, and hyphens."
                        : "Invalid slug — use only lowercase letters, digits, hyphens."
                  }
                  InputProps={{
                    startAdornment: <InputAdornment position="start">/c/</InputAdornment>,
                  }}
                />
              </Stack>
              <TextField
                label="Summary"
                fullWidth
                multiline
                rows={2}
                value={form.summary}
                onChange={(e) => set("summary", e.target.value)}
                inputProps={{ maxLength: 400 }}
                helperText={`${(form.summary ?? "").length}/400 · 1–2 sentences shown on cards and shares.`}
              />
            </Stack>
          </FormSection>

          <FormSection
            title="Story"
            description="The full pitch. Use headings, bullets, and links to keep it scannable."
          >
            <RichTextEditor
              value={form.story_html ?? ""}
              onChange={(html) => set("story_html", html)}
              placeholder="Tell the story of this campaign…"
              minHeight={260}
            />
          </FormSection>

          <FormSection
            title="Hero image"
            description="The banner image shown at the top of the campaign page and in social shares. Recommended 1600×900."
          >
            <HeroImageUploader
              auth={auth}
              value={form.hero_image_url ?? ""}
              onChange={(v) => set("hero_image_url", v)}
            />
          </FormSection>

          <FormSection
            title="Goal & schedule"
            description="Fundraising target and the campaign's run window."
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Goal"
                type="number"
                fullWidth
                value={goalDollars}
                onChange={(e) => setGoalDollars(e.target.value)}
                inputProps={{ min: 0, step: 100 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                }}
                helperText="Set 0 for an open-ended drive."
              />
              <TextField
                label="Starts at"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={toLocal(form.starts_at)}
                onChange={(e) => set("starts_at", fromLocal(e.target.value))}
                helperText="Defaults to now if blank."
              />
              <TextField
                label="Ends at"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={toLocal(form.ends_at)}
                onChange={(e) => set("ends_at", fromLocal(e.target.value))}
                helperText="Auto-completes after this date."
              />
            </Stack>
          </FormSection>

          <FormSection
            title="Visibility"
            description="Control who sees the campaign and where it appears."
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={form.status ?? "draft"}
                  label="Status"
                  onChange={(e) => set("status", e.target.value as Campaign["status"])}
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Only <em>active</em> and <em>completed</em> campaigns are public.
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Designation</InputLabel>
                <Select
                  value={form.designation ?? "general"}
                  label="Designation"
                  onChange={(e) => set("designation", e.target.value as string)}
                >
                  {DESIGNATIONS.map((d) => (
                    <MenuItem key={d} value={d} sx={{ textTransform: "capitalize" }}>
                      {d.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Routes donations to the right fund.</FormHelperText>
              </FormControl>
              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  px: 2,
                  py: 1.25,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: 56,
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Featured
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Show on the home page.
                  </Typography>
                </Box>
                <Switch
                  checked={!!form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
              </Paper>
            </Stack>
          </FormSection>

          <FormSection
            title="Impact breakdown"
            description="Optional. Concrete gift levels shown under the donate buttons (e.g. “$50 = 6 months of pads”)."
          >
            <Stack spacing={1.25}>
              {impact.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No impact items yet.
                </Typography>
              )}
              {impact.map((it, i) => (
                <Stack key={i} direction="row" spacing={1.25} alignItems="flex-start">
                  <TextField
                    label="USD"
                    type="number"
                    size="small"
                    sx={{ width: 130 }}
                    value={centsToDollars(it.amount_cents)}
                    onChange={(e) =>
                      setImpactRow(i, { amount_cents: dollarsToCents(e.target.value) })
                    }
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                  <TextField
                    label="What this gift does"
                    size="small"
                    fullWidth
                    value={it.label}
                    onChange={(e) => setImpactRow(i, { label: e.target.value })}
                    placeholder="e.g. 1 month of sanitary pads for one girl"
                  />
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setImpact((arr) => arr.filter((_, j) => j !== i))}
                      sx={{ mt: 0.5 }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ))}
              <Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setImpact((arr) => [...arr, { amount_cents: 0, label: "" }])}
                  startIcon={<AddIcon />}
                >
                  Add impact item
                </Button>
              </Box>
            </Stack>
          </FormSection>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Box sx={{ flex: 1 }}>
          {(!form.title || !validSlug) && (
            <Typography variant="caption" color="text.secondary">
              {!form.title ? "Title is required." : "Fix the slug to continue."}
            </Typography>
          )}
        </Box>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={save}
          disabled={saving || !form.title || !validSlug}
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create campaign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Paper>
  );
}

function toLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromLocal(v: string): string | null {
  if (!v) return null;
  return new Date(v).toISOString();
}

function HeroImageUploader({
  auth,
  value,
  onChange,
}: {
  auth: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) {
      setErr("Please pick an image file (JPEG, PNG, WEBP, GIF).");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setErr("Image must be 5 MB or less.");
      return;
    }
    setErr(null);
    setUploading(true);
    try {
      const r = await adminApi.uploadImage(auth, f);
      onChange(r.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          maxHeight: 280,
          borderRadius: 2,
          border: 2,
          borderStyle: value ? "solid" : "dashed",
          borderColor: dragOver ? "primary.main" : "divider",
          bgcolor: value ? "transparent" : "action.hover",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 120ms ease, background-color 120ms ease",
          cursor: value ? "default" : "pointer",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
      >
        {value ? (
          <>
            <Box
              component="img"
              src={value}
              alt="Hero preview"
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: 12,
                right: 12,
              }}
            >
              <Button
                component="label"
                variant="contained"
                size="small"
                disabled={uploading}
                startIcon={<UploadFileIcon />}
                sx={{ bgcolor: "rgba(0,0,0,0.7)", "&:hover": { bgcolor: "rgba(0,0,0,0.85)" } }}
              >
                {uploading ? "Uploading…" : "Replace"}
                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    void handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => onChange("")}
                sx={{ bgcolor: "rgba(211,47,47,0.9)" }}
              >
                Remove
              </Button>
            </Stack>
          </>
        ) : (
          <Box
            component="label"
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              cursor: "pointer",
              color: "text.secondary",
            }}
          >
            <ImageOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {uploading ? "Uploading…" : "Click to upload or drag & drop"}
            </Typography>
            <Typography variant="caption">
              JPEG, PNG, WEBP or GIF · up to 5 MB
            </Typography>
            <input
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                void handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </Box>
        )}
      </Box>
      <TextField
        label="…or paste an image URL"
        size="small"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://…  or  /uploads/…"
      />
      {err && (
        <Typography variant="caption" color="error">
          {err}
        </Typography>
      )}
    </Stack>
  );
}
