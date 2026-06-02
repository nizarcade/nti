import { useEffect, useMemo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAuthToken } from "@/auth/AuthContext";
import { customPagesApi } from "@/api/customPages";

// Hand-crafted, hard-coded public routes (kept in sync with src/App.tsx).
const STATIC_ROUTES: string[] = [
  "/",
  "/about",
  "/about/leadership",
  "/about/books",
  "/programs",
  "/programs/grace-bridge",
  "/programs/grace-bridge/problem",
  "/programs/grace-bridge/solution",
  "/impact",
  "/get-involved",
  "/volunteer",
  "/donate",
  "/campaigns",
  "/contact",
  "/privacy",
  "/terms",
];

export function usePathSuggestions(): string[] {
  const token = useAuthToken();
  const [customSlugs, setCustomSlugs] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    customPagesApi
      .list(token)
      .then((rows) => {
        if (cancelled) return;
        setCustomSlugs(
          rows
            .filter((r) => r.status === "published")
            .map((r) => `/${r.slug}`),
        );
      })
      .catch(() => {
        /* non-fatal — picker just falls back to static list */
      });
    return () => {
      cancelled = true;
    };
  }, [token]);
  return useMemo(
    () => Array.from(new Set([...STATIC_ROUTES, ...customSlugs])).sort(),
    [customSlugs],
  );
}

export function PathPicker({
  label = "Path",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = usePathSuggestions();
  return (
    <Autocomplete
      freeSolo
      fullWidth
      size="small"
      options={options}
      value={value}
      onChange={(_, v) => onChange((v as string) ?? "")}
      onInputChange={(_, v) => onChange(v)}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
