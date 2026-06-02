import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link as MuiLink,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import { useAuthToken } from "@/auth/AuthContext";
import { adminApi, type AdminVolunteer } from "@/api/admin";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function initials(name: string): string {
  const src = (name || "?").trim();
  if (!src) return "?";
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function splitSkills(skills: string): string[] {
  return skills
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function MetaField({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: "text.secondary",
          letterSpacing: 1,
          fontWeight: 700,
          display: "block",
          lineHeight: 1,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: muted ? "text.secondary" : "text.primary",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function AdminVolunteersPage() {
  const token = useAuthToken();
  const [rows, setRows] = useState<AdminVolunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detail, setDetail] = useState<AdminVolunteer | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await adminApi.volunteers(token);
      setRows(r.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.skills.toLowerCase().includes(q) ||
        (v.location || "").toLowerCase().includes(q) ||
        (v.availability || "").toLowerCase().includes(q),
    );
  }, [rows, query]);

  const pageRows = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 700 }}>
            Volunteers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            People who have offered their time and skills to NTI.
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card variant="outlined" sx={{ overflow: "hidden", borderRadius: 1 }}>
        {loading && <LinearProgress sx={{ height: 2 }} />}

        {/* Card header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          sx={{ px: { xs: 2, md: 3 }, py: 2 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
              All volunteers
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {loading
                ? "Loading…"
                : `${filtered.length} of ${rows.length} signup${rows.length === 1 ? "" : "s"}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click any row to view full skills and message.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
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

        {/* Toolbar */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          sx={{ px: { xs: 2, md: 3 }, py: 1.75, bgcolor: "background.default" }}
        >
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, skills, location…"
            sx={{ minWidth: { xs: "100%", md: 360 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
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
                <TableCell>Volunteer</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Skills</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell align="right">Signed up</TableCell>
                <TableCell align="right" />
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
                    {rows.length === 0
                      ? "No volunteer signups yet."
                      : "No volunteers match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((v) => {
                  const skills = splitSkills(v.skills);
                  const shown = skills.slice(0, 3);
                  const extra = skills.length - shown.length;
                  return (
                    <TableRow
                      key={v.id}
                      hover
                      onClick={() => setDetail(v)}
                      sx={{
                        cursor: "pointer",
                        "& td": { py: 1.5, borderColor: "divider" },
                        "&:last-of-type td": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: 13,
                              fontWeight: 700,
                              bgcolor: "primary.light",
                              color: "primary.contrastText",
                            }}
                          >
                            {initials(v.name)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {v.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <EmailIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                            <MuiLink
                              href={`mailto:${v.email}`}
                              onClick={(e) => e.stopPropagation()}
                              variant="body2"
                              underline="hover"
                              noWrap
                            >
                              {v.email}
                            </MuiLink>
                          </Stack>
                          {v.phone && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <PhoneIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                              <Typography variant="caption" color="text.secondary">
                                {v.phone}
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={v.location ? "text.primary" : "text.secondary"}>
                          {v.location || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {shown.map((s) => (
                            <Chip key={s} label={s} size="small" variant="outlined" />
                          ))}
                          {extra > 0 && (
                            <Chip label={`+${extra}`} size="small" color="primary" variant="outlined" />
                          )}
                          {shown.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              —
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={v.availability ? "text.primary" : "text.secondary"}>
                          {v.availability || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={new Date(v.created_at).toLocaleString()}>
                          <Box>
                            <Typography variant="body2">{fmtDate(v.created_at)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {fmtTime(v.created_at)}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetail(v);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
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

      <Dialog
        open={!!detail}
        onClose={() => setDetail(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1, overflow: "hidden" } }}
      >
        {detail && (
          <>
            {/* Header */}
            <Box sx={{ position: "relative", px: { xs: 3, md: 4 }, pt: 3, pb: 2 }}>
              <IconButton
                onClick={() => setDetail(null)}
                sx={{ position: "absolute", right: 12, top: 12 }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    fontWeight: 700,
                    fontSize: 18,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }}
                >
                  {initials(detail.name)}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
                    {detail.name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ color: "text.secondary", mt: 0.25 }}
                    divider={
                      <Box
                        component="span"
                        sx={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          bgcolor: "text.disabled",
                        }}
                      />
                    }
                  >
                    <MuiLink
                      href={`mailto:${detail.email}`}
                      variant="body2"
                      underline="hover"
                      color="inherit"
                      sx={{ fontWeight: 500 }}
                    >
                      {detail.email}
                    </MuiLink>
                    <Typography variant="body2">
                      Signed up{" "}
                      {new Date(detail.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider />

            <DialogContent sx={{ px: { xs: 3, md: 4 }, py: 3, bgcolor: "background.default" }}>
              <Stack spacing={2.5}>
                {/* Metadata grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <MetaField label="Phone" value={detail.phone || "—"} muted={!detail.phone} />
                  <MetaField
                    label="Location"
                    value={detail.location || "—"}
                    muted={!detail.location}
                  />
                  <MetaField
                    label="Availability"
                    value={detail.availability || "—"}
                    muted={!detail.availability}
                  />
                </Box>

                {/* Skills */}
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", letterSpacing: 1, fontWeight: 700 }}
                  >
                    Skills
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.75}
                    flexWrap="wrap"
                    sx={{ mt: 0.75 }}
                    useFlexGap
                  >
                    {splitSkills(detail.skills).map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        sx={{ fontWeight: 500, bgcolor: "background.paper" }}
                        variant="outlined"
                      />
                    ))}
                    {splitSkills(detail.skills).length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </Stack>
                </Box>

                {/* Message */}
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", letterSpacing: 1, fontWeight: 700 }}
                  >
                    Message
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 0.75,
                      p: { xs: 2, md: 2.5 },
                      borderRadius: 1,
                      borderLeft: 3,
                      borderLeftColor: "primary.main",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.65,
                        color: detail.message ? "text.primary" : "text.secondary",
                        fontStyle: detail.message ? "normal" : "italic",
                      }}
                    >
                      {detail.message || "No additional message provided."}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: { xs: 3, md: 4 }, py: 2, gap: 1 }}>
              <Button onClick={() => setDetail(null)} color="inherit">
                Close
              </Button>
              <Box sx={{ flex: 1 }} />
              {detail.phone && (
                <Button
                  startIcon={<PhoneIcon />}
                  href={`tel:${detail.phone}`}
                  variant="outlined"
                >
                  Call
                </Button>
              )}
              <Button
                startIcon={<EmailIcon />}
                href={`mailto:${detail.email}?subject=${encodeURIComponent(
                  "Volunteering with NTI",
                )}`}
                variant="contained"
              >
                Email
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
