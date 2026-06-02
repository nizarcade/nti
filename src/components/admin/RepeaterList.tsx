import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

type Props<T> = {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  renderItem: (item: T, onItemChange: (next: T) => void, index: number) => React.ReactNode;
  addLabel?: string;
};

export default function RepeaterList<T>({
  label,
  items,
  onChange,
  blank,
  renderItem,
  addLabel = "Add item",
}: Props<T>) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = items.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };
  const remove = (i: number) => {
    const next = items.slice();
    next.splice(i, 1);
    onChange(next);
  };
  const update = (i: number, value: T) => {
    const next = items.slice();
    next[i] = value;
    onChange(next);
  };
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
        {label}
      </Typography>
      <Stack spacing={2}>
        {items.map((it, i) => (
          <Box
            key={i}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
              position: "relative",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                #{i + 1}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={() => move(i, i - 1)} disabled={i === 0}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => move(i, i + 1)}
                  disabled={i === items.length - 1}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => remove(i)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
            {renderItem(it, (v) => update(i, v), i)}
          </Box>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => onChange([...items, blank()])}>
        {addLabel}
      </Button>
    </Box>
  );
}

export function TextRow({
  label,
  value,
  onChange,
  multiline,
  minRows,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  minRows?: number;
  helperText?: string;
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      multiline={multiline}
      minRows={minRows}
      helperText={helperText}
      size="small"
    />
  );
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, overflow: "hidden" }}>
      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: open ? "action.selected" : "background.paper",
          cursor: "pointer",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {open ? "Hide" : "Edit"}
        </Typography>
      </Box>
      {open && (
        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2}>{children}</Stack>
        </Box>
      )}
    </Box>
  );
}
