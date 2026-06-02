import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuthToken } from "@/auth/AuthContext";
import { pageContentApi } from "@/api/pageContent";
import { layoutDefaults, type LayoutContent, type LayoutNavItem } from "@/content/layoutDefaults";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultLabel: string;
  path: string;
  onAdded: () => void;
};

export default function AddToNavDialog({ open, onClose, defaultLabel, path, onAdded }: Props) {
  const token = useAuthToken();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<LayoutContent | null>(null);

  const [label, setLabel] = useState(defaultLabel);
  const [mode, setMode] = useState<"top" | "child">("top");
  const [parentIdx, setParentIdx] = useState<number>(-1);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setLabel(defaultLabel);
    setMode("top");
    setParentIdx(-1);
    pageContentApi
      .admin("layout", token)
      .then((r) => {
        setLayout({ ...layoutDefaults, ...(r.data as LayoutContent) });
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [open, token, defaultLabel]);

  const submit = async () => {
    if (!layout) return;
    setSaving(true);
    setError(null);
    try {
      const next: LayoutContent = {
        ...layout,
        nav: { ...layout.nav, items: layout.nav.items.map((it) => ({ ...it, children: [...it.children] })) },
      };
      const newLeaf: { label: string; to: string } = { label: label.trim() || defaultLabel, to: path };
      if (mode === "top") {
        next.nav.items.push({ ...newLeaf, children: [] } as LayoutNavItem);
      } else {
        if (parentIdx < 0 || parentIdx >= next.nav.items.length) {
          throw new Error("Pick a parent menu");
        }
        next.nav.items[parentIdx].children.push(newLeaf);
      }
      await pageContentApi.save("layout", token, next);
      onAdded();
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add to navigation</DialogTitle>
      <DialogContent>
        {loading ? (
          <LinearProgress sx={{ mt: 2 }} />
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Links to <code>{path}</code>
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Nav label"
              size="small"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
              fullWidth
            />
            <RadioGroup value={mode} onChange={(_, v) => setMode(v as "top" | "child")}>
              <FormControlLabel value="top" control={<Radio />} label="Add as a top-level item" />
              <FormControlLabel value="child" control={<Radio />} label="Add under an existing menu" />
            </RadioGroup>
            {mode === "child" && (
              <TextField
                select
                size="small"
                label="Parent menu"
                value={parentIdx}
                onChange={(e) => setParentIdx(Number(e.target.value))}
                fullWidth
              >
                <MenuItem value={-1}>— pick one —</MenuItem>
                {layout?.nav.items.map((it, i) => (
                  <MenuItem key={i} value={i}>
                    {it.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={
            saving ||
            loading ||
            !label.trim() ||
            (mode === "child" && parentIdx < 0)
          }
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
