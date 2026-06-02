import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncIcon from "@mui/icons-material/Sync";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FavoriteIcon from "@mui/icons-material/FavoriteOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuthToken } from "@/auth/AuthContext";
import {
  adminApi,
  type AdminStats,
  type AnalyticsBucket,
  type AnalyticsResponse,
} from "@/api/admin";

function fmtMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function fmtMoneyShort(cents: number): string {
  const v = cents / 100;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

const BUCKET_LABELS: Record<AnalyticsBucket, string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  year: "Yearly",
};

const BUCKET_UNIT: Record<AnalyticsBucket, string> = {
  day: "days",
  week: "weeks",
  month: "months",
  year: "years",
};

function formatBucketLabel(iso: string, bucket: AnalyticsBucket): string {
  const d = new Date(iso);
  switch (bucket) {
    case "day":
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    case "week":
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    case "month":
      return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
    case "year":
      return String(d.getFullYear());
  }
}

export default function AdminOverview() {
  const token = useAuthToken();
  const theme = useTheme();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reconciling, setReconciling] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const [bucket, setBucket] = useState<AnalyticsBucket>("day");
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsErr, setAnalyticsErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await adminApi.stats(token);
      setStats(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadAnalytics = useCallback(
    async (b: AnalyticsBucket) => {
      setAnalyticsLoading(true);
      setAnalyticsErr(null);
      try {
        const a = await adminApi.analytics(token, b);
        setAnalytics(a);
      } catch (e) {
        setAnalyticsErr(e instanceof Error ? e.message : "Failed to load analytics.");
      } finally {
        setAnalyticsLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void loadAnalytics(bucket);
  }, [loadAnalytics, bucket]);

  async function reconcile() {
    setReconciling(true);
    setInfo(null);
    try {
      const r = await adminApi.reconcile(token);
      setInfo(
        r.processed === 0
          ? "No pending donations to check."
          : `Checked ${r.processed} pending donation(s) with Stripe.`,
      );
      await load();
      await loadAnalytics(bucket);
    } catch (e) {
      setInfo(e instanceof Error ? e.message : "Reconcile failed.");
    } finally {
      setReconciling(false);
    }
  }

  function refreshAll() {
    void load();
    void loadAnalytics(bucket);
  }

  const chartData = useMemo(() => {
    if (!analytics) return [];
    return analytics.series.map((p) => ({
      label: formatBucketLabel(p.bucket, analytics.bucket),
      amount: p.total_cents / 100,
      count: p.count,
    }));
  }, [analytics]);

  const periodTotal = useMemo(
    () => (analytics ? analytics.series.reduce((s, p) => s + p.total_cents, 0) : 0),
    [analytics],
  );
  const periodCount = useMemo(
    () => (analytics ? analytics.series.reduce((s, p) => s + p.count, 0) : 0),
    [analytics],
  );
  const periodAvg = periodCount > 0 ? Math.round(periodTotal / periodCount) : 0;
  const bestPoint = useMemo(() => {
    if (!analytics || analytics.series.length === 0) return null;
    return analytics.series.reduce(
      (best, p) => (p.total_cents > best.total_cents ? p : best),
      analytics.series[0],
    );
  }, [analytics]);

  const anyLoading = loading || analyticsLoading || reconciling;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", position: "relative" }}>
      <Box sx={{ position: "absolute", top: -8, left: 0, right: 0, height: 3 }}>
        {anyLoading && <LinearProgress />}
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: '"Lora", serif', fontWeight: 700 }}>
            Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Key metrics across the platform.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<SyncIcon />}
            onClick={reconcile}
            disabled={reconciling || loading}
            variant="outlined"
            size="small"
          >
            {reconciling ? "Checking…" : "Check pending"}
          </Button>
          <Tooltip title="Refresh">
            <span>
              <IconButton onClick={refreshAll} disabled={anyLoading}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {info && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setInfo(null)}>
          {info}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {loading || !stats ? (
          <>
            <StatCardSkeleton accent />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total raised"
              value={fmtMoney(stats.donations_total_cents)}
              sub="All-time donations"
              icon={<AttachMoneyIcon />}
              accent
            />
            <StatCard
              label="Donations"
              value={String(stats.donations_count)}
              sub="Successful gifts"
              icon={<FavoriteIcon />}
              tone="success"
            />
            <StatCard
              label="Pending"
              value={String(stats.donations_pending)}
              sub="Awaiting confirmation"
              icon={<HourglassEmptyIcon />}
              tone="warning"
            />
            <StatCard
              label="Contacts"
              value={String(stats.contacts_count)}
              sub="Inbound messages"
              icon={<MailOutlineIcon />}
              tone="info"
            />
            <StatCard
              label="Volunteers"
              value={String(stats.volunteers_count)}
              sub="Signups"
              icon={<PeopleOutlineIcon />}
              tone="secondary"
            />
          </>
        )}
      </Grid>

      <Card sx={{ mb: 3, overflow: "hidden" }}>
        {analyticsLoading && <LinearProgress sx={{ height: 2 }} />}
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="overline" color="text.secondary">
                Donation analytics
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {BUCKET_LABELS[bucket]} donations
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {analytics
                  ? `Last ${analytics.points} ${BUCKET_UNIT[bucket]}`
                  : "Loading…"}
              </Typography>
            </Box>
            <ToggleButtonGroup
              value={bucket}
              exclusive
              size="small"
              onChange={(_e, v) => {
                if (v) setBucket(v as AnalyticsBucket);
              }}
            >
              <ToggleButton value="day">Daily</ToggleButton>
              <ToggleButton value="week">Weekly</ToggleButton>
              <ToggleButton value="month">Monthly</ToggleButton>
              <ToggleButton value="year">Yearly</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={3}>
              <MiniMetric
                loading={analyticsLoading}
                label="Period total"
                value={fmtMoney(periodTotal)}
                icon={<TrendingUpIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MiniMetric
                loading={analyticsLoading}
                label="Donations"
                value={String(periodCount)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MiniMetric
                loading={analyticsLoading}
                label="Average gift"
                value={periodAvg > 0 ? fmtMoney(periodAvg) : "—"}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <MiniMetric
                loading={analyticsLoading}
                label="Best period"
                value={
                  bestPoint && bestPoint.total_cents > 0
                    ? `${fmtMoneyShort(bestPoint.total_cents)} · ${formatBucketLabel(
                        bestPoint.bucket,
                        bucket,
                      )}`
                    : "—"
                }
              />
            </Grid>
          </Grid>

          {analyticsErr && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {analyticsErr}
            </Alert>
          )}

          <Box sx={{ width: "100%", height: 320 }}>
            {analyticsLoading && !analytics ? (
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 1 }} />
            ) : chartData.length === 0 ? (
              <EmptyChart text="No donations in this period yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="amountFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v: number) => fmtMoneyShort(v * 100)}
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                    width={56}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                    width={36}
                    allowDecimals={false}
                  />
                  <RTooltip
                    formatter={(value, name) => {
                      const v = typeof value === "number" ? value : Number(value ?? 0);
                      if (name === "Amount") return [fmtMoney(v * 100), name];
                      return [v, name];
                    }}
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    name="Amount"
                    stroke={theme.palette.primary.main}
                    fill="url(#amountFill)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="count"
                    name="Donations"
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card>
        {analyticsLoading && <LinearProgress sx={{ height: 2 }} />}
        <CardContent>
          <Typography variant="overline" color="text.secondary">
            Donation volume
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 2 }}>
            Donations per {bucket}
          </Typography>
          <Box sx={{ width: "100%", height: 220 }}>
            {analyticsLoading && !analytics ? (
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
            ) : chartData.length === 0 ? (
              <EmptyChart text="No data." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={theme.palette.divider} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                    width={36}
                    allowDecimals={false}
                  />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[3],
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Donations"
                    fill={theme.palette.secondary.main}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

type StatTone = "primary" | "success" | "warning" | "info" | "secondary";

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  tone = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accent?: boolean;
  tone?: StatTone;
}) {
  const palette = `${tone}.main`;
  const paletteSoft = `${tone}.light`;
  return (
    <Grid item xs={12} sm={6} md={2.4}>
      <Card
        variant="outlined"
        sx={{
          position: "relative",
          height: "100%",
          borderRadius: 1,
          overflow: "hidden",
          transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 3,
            borderColor: accent ? "primary.main" : paletteSoft,
          },
          bgcolor: accent ? "primary.main" : "background.paper",
          color: accent ? "primary.contrastText" : "text.primary",
          borderColor: accent ? "primary.main" : "divider",
        }}
      >
        {!accent && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 3,
              bgcolor: palette,
            }}
          />
        )}
        <Box sx={{ p: 2.25, pl: accent ? 2.25 : 2.5 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 1,
                color: accent ? "rgba(255,255,255,0.85)" : "text.secondary",
                lineHeight: 1,
              }}
            >
              {label}
            </Typography>
            {icon && (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: accent ? "rgba(255,255,255,0.16)" : paletteSoft,
                  color: accent ? "primary.contrastText" : palette,
                  "& svg": { fontSize: 18 },
                }}
              >
                {icon}
              </Box>
            )}
          </Stack>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 26, md: 28 },
              lineHeight: 1.1,
              color: accent ? "inherit" : "text.primary",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </Typography>
          {sub && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                color: accent ? "rgba(255,255,255,0.78)" : "text.secondary",
              }}
            >
              {sub}
            </Typography>
          )}
        </Box>
      </Card>
    </Grid>
  );
}

function StatCardSkeleton({ accent }: { accent?: boolean }) {
  return (
    <Grid item xs={12} sm={6} md={2.4}>
      <Card
        variant="outlined"
        sx={{
          position: "relative",
          height: "100%",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: accent ? "primary.main" : "background.paper",
          borderColor: accent ? "primary.main" : "divider",
        }}
      >
        <Box sx={{ p: 2.25 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Skeleton variant="text" width={80} height={14} />
            <Skeleton variant="circular" width={32} height={32} />
          </Stack>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="50%" height={14} />
        </Box>
      </Card>
    </Grid>
  );
}

function MiniMetric({
  label,
  value,
  loading,
  icon,
}: {
  label: string;
  value: string;
  loading?: boolean;
  icon?: ReactNode;
}) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1.5,
        px: 2,
        py: 1.25,
        height: "100%",
      }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: "text.secondary" }}>
        {icon}
        <Typography variant="caption">{label}</Typography>
      </Stack>
      {loading ? (
        <Skeleton variant="text" width="70%" height={28} />
      ) : (
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

function EmptyChart({ text }: { text: string }) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}
