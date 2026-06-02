import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthToken } from "@/auth/AuthContext";
import { adminApi, type AdminDonation } from "@/api/admin";

function fmtMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "USD").toUpperCase(),
  }).format(cents / 100);
}

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

function statusColor(s: string): "default" | "success" | "warning" | "error" {
  if (["succeeded", "completed", "captured"].includes(s)) return "success";
  if (s === "pending") return "warning";
  if (["failed", "canceled", "cancelled"].includes(s)) return "error";
  return "default";
}

type StatusFilter = "all" | "succeeded" | "pending" | "failed";

function matchesStatus(status: string, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "succeeded") return ["succeeded", "completed", "captured"].includes(status);
  if (filter === "pending") return status === "pending";
  if (filter === "failed") return ["failed", "canceled", "cancelled"].includes(status);
  return true;
}

function initials(name: string | null, email: string | null): string {
  const src = (name || email || "?").trim();
  if (!src) return "?";
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default function AdminDonationsPage() {
  const token = useAuthToken();
  const [rows, setRows] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await adminApi.donations(token);
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
  }, [query, status]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((d) => {
      if (!matchesStatus(d.status, status)) return false;
      if (!q) return true;
      return (
        (d.donor_name || "").toLowerCase().includes(q) ||
        (d.donor_email || "").toLowerCase().includes(q) ||
        d.provider_ref.toLowerCase().includes(q) ||
        d.designation.toLowerCase().includes(q) ||
        d.provider.toLowerCase().includes(q)
      );
    });
  }, [rows, query, status]);

  const filteredTotalCents = useMemo(
    () =>
      filtered
        .filter((d) => ["succeeded", "completed", "captured"].includes(d.status))
        .reduce((s, d) => s + d.amount_cents, 0),
    [filtered],
  );

  const pageRows = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  async function downloadCsv() {
    try {
      const blob = await adminApi.exportCsv(token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    }
  }

  function copyRef(ref: string) {
    void navigator.clipboard.writeText(ref);
    setCopied(ref);
    window.setTimeout(() => setCopied((c) => (c === ref ? null : c)), 1500);
  }

  const statusCounts = useMemo(() => {
    const c = { all: rows.length, succeeded: 0, pending: 0, failed: 0 };
    for (const d of rows) {
      if (["succeeded", "completed", "captured"].includes(d.status)) c.succeeded++;
      else if (d.status === "pending") c.pending++;
      else if (["failed", "canceled", "cancelled"].includes(d.status)) c.failed++;
    }
    return c;
  }, [rows]);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 700 }}>
            Donations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review, filter, and export every donation processed through NTI Bridge.
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

        {/* Card header: title + summary + actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          sx={{ px: { xs: 2, md: 3 }, py: 2 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
              All donations
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {loading
                ? "Loading…"
                : `${filtered.length} of ${rows.length} record${rows.length === 1 ? "" : "s"}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {fmtMoney(filteredTotalCents)} successful in current view
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              startIcon={<DownloadIcon />}
              onClick={downloadCsv}
              size="small"
              variant="outlined"
            >
              Export CSV
            </Button>
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

        {/* Filters toolbar */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.75,
            bgcolor: "background.default",
          }}
        >
          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search donor, email, ref…"
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
            value={status}
            exclusive
            size="small"
            onChange={(_e, v) => v && setStatus(v as StatusFilter)}
          >
            <ToggleButton value="all">All ({statusCounts.all})</ToggleButton>
            <ToggleButton value="succeeded">Succeeded ({statusCounts.succeeded})</ToggleButton>
            <ToggleButton value="pending">Pending ({statusCounts.pending})</ToggleButton>
            <ToggleButton value="failed">Failed ({statusCounts.failed})</ToggleButton>
          </ToggleButtonGroup>
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
                <TableCell>Donor</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Frequency</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Provider · ref</TableCell>
                <TableCell align="right">Date</TableCell>
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
                    {rows.length === 0 ? "No donations yet." : "No donations match your filters."}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((d) => (
                  <TableRow
                    key={d.id}
                    hover
                    sx={{
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
                          {initials(d.donor_name, d.donor_email)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                            {d.donor_name || "Anonymous"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {d.donor_email || "—"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {fmtMoney(d.amount_cents, d.currency)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={d.frequency === "monthly" ? "Monthly" : "One-time"}
                      />
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {d.designation.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={d.status}
                        color={statusColor(d.status)}
                        sx={{ textTransform: "capitalize", fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={d.provider}
                          sx={{ textTransform: "capitalize" }}
                        />
                        <Tooltip title={copied === d.provider_ref ? "Copied" : d.provider_ref}>
                          <IconButton size="small" onClick={() => copyRef(d.provider_ref)}>
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Box
                          component="code"
                          sx={{
                            fontSize: 11,
                            color: "text.secondary",
                            maxWidth: 140,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                          }}
                        >
                          {d.provider_ref}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={new Date(d.created_at).toLocaleString()}>
                        <Box>
                          <Typography variant="body2">{fmtDate(d.created_at)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fmtTime(d.created_at)}
                          </Typography>
                        </Box>
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
          sx={{ borderTop: 0 }}
        />
      </Card>
    </Box>
  );
}
