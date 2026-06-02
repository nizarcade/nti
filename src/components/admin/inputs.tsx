import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ICON_KEYS } from "@/components/icons/registry";

export function IconPicker({
  value,
  onChange,
  allowNone = false,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  allowNone?: boolean;
}) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel>Icon</InputLabel>
      <Select
        label="Icon"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
      >
        {allowNone && <MenuItem value="">(none)</MenuItem>}
        {ICON_KEYS.map((k) => (
          <MenuItem key={k} value={k}>
            {k}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const update = (i: number, v: string) => {
    const next = items.slice();
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => {
    const next = items.slice();
    next.splice(i, 1);
    onChange(next);
  };
  return (
    <Box>
      <Stack spacing={1}>
        {items.map((it, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
            <TextField
              fullWidth
              size="small"
              value={it}
              placeholder={placeholder}
              multiline={multiline}
              minRows={multiline ? 2 : undefined}
              onChange={(e) => update(i, e.target.value)}
            />
            <IconButton size="small" color="error" onClick={() => remove(i)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button startIcon={<AddIcon />} size="small" sx={{ mt: 1 }} onClick={() => onChange([...items, ""])}>
        Add {label}
      </Button>
    </Box>
  );
}
