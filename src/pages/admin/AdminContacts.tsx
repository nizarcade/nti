import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
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
import RefreshIcon from "@mui/icons-material/Refresh";
import ReplyIcon from "@mui/icons-material/Reply";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import { useAuthToken } from "@/auth/AuthContext";
import { adminApi, type AdminContact } from "@/api/admin";

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

function snippet(text: string, max = 90): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1) + "…";
}

export default function AdminContactsPage() {
  const token = useAuthToken();
  const [rows, setRows] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detail, setDetail] = useState<AdminContact | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await adminApi.contacts(token);
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
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.subject || "").toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q),
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
            Contacts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Inbound messages from the public contact form.
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          sx={{ px: { xs: 2, md: 3 }, py: 2 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
              All messages
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {loading
                ? "Loading…"
                : `${filtered.length} of ${rows.length} message${rows.length === 1 ? "" : "s"}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click any row to read the full message.
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
            placeholder="Search name, email, subject, body…"
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
          <Table size="small" sx={{ minWidth: 920 }}>
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
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Message</TableCell>
                <TableCell align="right">Received</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell colSpan={5}>
                      <Skeleton variant="text" height={28} />
                    </TableCell>
                  </TableRow>
                ))
              ) : pageRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{ py: 6, textAlign: "center", color: "text.secondary" }}
                  >
                    {rows.length === 0
                      ? "No contact messages yet."
                      : "No messages match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => setDetail(c)}
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
                          {initials(c.name)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {c.name}
                          </Typography>
                          <MuiLink
                            href={`mailto:${c.email}`}
                            onClick={(e) => e.stopPropagation()}
                            variant="caption"
                            color="text.secondary"
                            underline="hover"
                            noWrap
                          >
                            {c.email}
                          </MuiLink>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: c.subject ? "text.primary" : "text.secondary" }}
                        noWrap
                      >
                        {c.subject || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 480 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {snippet(c.message, 110)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={new Date(c.created_at).toLocaleString()}>
                        <Box>
                          <Typography variant="body2">{fmtDate(c.created_at)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fmtTime(c.created_at)}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View message">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetail(c);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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

              <Typography
                variant="h5"
                sx={{
                  mt: 2.5,
                  fontFamily: '"Lora", serif',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: detail.subject ? "text.primary" : "text.secondary",
                  fontStyle: detail.subject ? "normal" : "italic",
                }}
              >
                {detail.subject || "(No subject)"}
              </Typography>
            </Box>

            <Divider />

            <DialogContent sx={{ px: { xs: 3, md: 4 }, py: 3, bgcolor: "background.default" }}>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, md: 3 },
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
                    color: "text.primary",
                  }}
                >
                  {detail.message}
                </Typography>
              </Paper>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: { xs: 3, md: 4 }, py: 2, gap: 1 }}>
              <Button onClick={() => setDetail(null)} color="inherit">
                Close
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                startIcon={<EmailIcon />}
                href={`mailto:${detail.email}`}
                variant="outlined"
              >
                Email
              </Button>
              <Button
                startIcon={<ReplyIcon />}
                href={`mailto:${detail.email}?subject=${encodeURIComponent(
                  "Re: " + (detail.subject || "Your message to NTI"),
                )}`}
                variant="contained"
              >
                Reply
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
