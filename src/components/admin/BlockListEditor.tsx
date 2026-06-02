import { Box, Button, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ContentCopyIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";
import { IconPicker } from "@/components/admin/inputs";
import RichTextEditor from "@/components/RichTextEditor";
import type { CustomBlock } from "@/api/customPages";

export const BLOCK_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "richText", label: "Rich text" },
  { value: "imageText", label: "Image + text" },
  { value: "featureGrid", label: "Feature grid" },
  { value: "quote", label: "Quote" },
  { value: "cta", label: "Call to action" },
  { value: "faq", label: "FAQ" },
  { value: "embed", label: "Embed (YouTube / HTML)" },
] as const;

export function newBlockId(): string {
  return `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultDataFor(type: string): Record<string, unknown> {
  switch (type) {
    case "hero":
      return { title: "New section", subtitle: "" };
    case "richText":
      return { html: "" };
    case "imageText":
      return { image: "", side: "left", title: "", body: "" };
    case "featureGrid":
      return { title: "", items: [] };
    case "quote":
      return { text: "", attribution: "" };
    case "cta":
      return {
        title: "",
        body: "",
        primaryLabel: "",
        primaryTo: "",
        secondaryLabel: "",
        secondaryTo: "",
      };
    case "faq":
      return { items: [] };
    case "embed":
      return { kind: "youtube", value: "" };
    default:
      return {};
  }
}

type PatchFn = (data: Record<string, unknown>) => void;

// --- per-block editors ----------------------------------------------------

function HeroEditor({ data, patch }: { data: any; patch: PatchFn }) {
  return (
    <Stack spacing={1.5}>
      <TextRow label="Eyebrow" value={data.eyebrow ?? ""} onChange={(v) => patch({ ...data, eyebrow: v })} />
      <TextRow label="Title" value={data.title ?? ""} onChange={(v) => patch({ ...data, title: v })} />
      <TextRow label="Subtitle" value={data.subtitle ?? ""} onChange={(v) => patch({ ...data, subtitle: v })} multiline />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextRow label="CTA label" value={data.ctaLabel ?? ""} onChange={(v) => patch({ ...data, ctaLabel: v })} />
        <TextRow label="CTA path" value={data.ctaTo ?? ""} onChange={(v) => patch({ ...data, ctaTo: v })} />
      </Stack>
      <TextRow label="Background image URL" value={data.image ?? ""} onChange={(v) => patch({ ...data, image: v })} />
    </Stack>
  );
}

function RichTextEditorBlock({ data, patch }: { data: any; patch: PatchFn }) {
  return (
    <RichTextEditor
      value={data.html ?? ""}
      onChange={(html) => patch({ ...data, html })}
      placeholder="Write the section body…"
    />
  );
}

function ImageTextEditor({ data, patch }: { data: any; patch: PatchFn }) {
  return (
    <Stack spacing={1.5}>
      <TextRow label="Image URL" value={data.image ?? ""} onChange={(v) => patch({ ...data, image: v })} />
      <TextField
        select
        size="small"
        label="Image position"
        value={data.side ?? "left"}
        onChange={(e) => patch({ ...data, side: e.target.value })}
        sx={{ maxWidth: 200 }}
      >
        <MenuItem value="left">Left</MenuItem>
        <MenuItem value="right">Right</MenuItem>
      </TextField>
      <TextRow label="Title" value={data.title ?? ""} onChange={(v) => patch({ ...data, title: v })} />
      <TextRow label="Body" value={data.body ?? ""} onChange={(v) => patch({ ...data, body: v })} multiline minRows={3} />
    </Stack>
  );
}

function FeatureGridEditor({ data, patch }: { data: any; patch: PatchFn }) {
  const items: any[] = Array.isArray(data.items) ? data.items : [];
  const setItems = (next: any[]) => patch({ ...data, items: next });
  const updateItem = (i: number, v: any) => {
    const next = items.slice();
    next[i] = v;
    setItems(next);
  };
  return (
    <Stack spacing={1.5}>
      <TextRow label="Section title (optional)" value={data.title ?? ""} onChange={(v) => patch({ ...data, title: v })} />
      <Stack spacing={1.5}>
        {items.map((it, i) => (
          <Box
            key={i}
            sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1.5 }}
          >
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Item {i + 1}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" disabled={i === 0} onClick={() => {
                    const next = items.slice();
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    setItems(next);
                  }}>
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" disabled={i === items.length - 1} onClick={() => {
                    const next = items.slice();
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    setItems(next);
                  }}>
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => {
                    const next = items.slice();
                    next.splice(i, 1);
                    setItems(next);
                  }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
              <IconPicker
                value={it.iconKey ?? null}
                onChange={(v) => updateItem(i, { ...it, iconKey: v ?? "" })}
                allowNone
              />
              <TextRow label="Title" value={it.title ?? ""} onChange={(v) => updateItem(i, { ...it, title: v })} />
              <TextRow label="Body" value={it.body ?? ""} onChange={(v) => updateItem(i, { ...it, body: v })} multiline minRows={2} />
            </Stack>
          </Box>
        ))}
      </Stack>
      <Button size="small" onClick={() => setItems([...items, { iconKey: "", title: "", body: "" }])}>
        + Add item
      </Button>
    </Stack>
  );
}

function QuoteEditor({ data, patch }: { data: any; patch: PatchFn }) {
  return (
    <Stack spacing={1.5}>
      <TextRow label="Quote" value={data.text ?? ""} onChange={(v) => patch({ ...data, text: v })} multiline minRows={3} />
      <TextRow label="Attribution" value={data.attribution ?? ""} onChange={(v) => patch({ ...data, attribution: v })} />
    </Stack>
  );
}

function CTAEditor({ data, patch }: { data: any; patch: PatchFn }) {
  return (
    <Stack spacing={1.5}>
      <TextRow label="Title" value={data.title ?? ""} onChange={(v) => patch({ ...data, title: v })} />
      <TextRow label="Body" value={data.body ?? ""} onChange={(v) => patch({ ...data, body: v })} multiline minRows={2} />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextRow label="Primary label" value={data.primaryLabel ?? ""} onChange={(v) => patch({ ...data, primaryLabel: v })} />
        <TextRow label="Primary path" value={data.primaryTo ?? ""} onChange={(v) => patch({ ...data, primaryTo: v })} />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextRow label="Secondary label" value={data.secondaryLabel ?? ""} onChange={(v) => patch({ ...data, secondaryLabel: v })} />
        <TextRow label="Secondary path" value={data.secondaryTo ?? ""} onChange={(v) => patch({ ...data, secondaryTo: v })} />
      </Stack>
    </Stack>
  );
}

function FAQEditor({ data, patch }: { data: any; patch: PatchFn }) {
  const items: any[] = Array.isArray(data.items) ? data.items : [];
  const setItems = (next: any[]) => patch({ ...data, items: next });
  return (
    <Stack spacing={1.5}>
      {items.map((it, i) => (
        <Box key={i} sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 1.5 }}>
          <Stack spacing={1.25}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">Q&A {i + 1}</Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" disabled={i === 0} onClick={() => {
                  const next = items.slice();
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  setItems(next);
                }}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" disabled={i === items.length - 1} onClick={() => {
                  const next = items.slice();
                  [next[i + 1], next[i]] = [next[i], next[i + 1]];
                  setItems(next);
                }}>
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => {
                  const next = items.slice();
                  next.splice(i, 1);
                  setItems(next);
                }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
            <TextRow label="Question" value={it.q ?? ""} onChange={(v) => {
              const next = items.slice();
              next[i] = { ...it, q: v };
              setItems(next);
            }} />
            <TextRow label="Answer" value={it.a ?? ""} multiline minRows={2} onChange={(v) => {
              const next = items.slice();
              next[i] = { ...it, a: v };
              setItems(next);
            }} />
          </Stack>
        </Box>
      ))}
      <Button size="small" onClick={() => setItems([...items, { q: "", a: "" }])}>
        + Add Q&A
      </Button>
    </Stack>
  );
}

function EmbedEditor({ data, patch }: { data: any; patch: PatchFn }) {
  return (
    <Stack spacing={1.5}>
      <TextField
        select
        size="small"
        label="Kind"
        value={data.kind ?? "youtube"}
        onChange={(e) => patch({ ...data, kind: e.target.value })}
        sx={{ maxWidth: 240 }}
      >
        <MenuItem value="youtube">YouTube</MenuItem>
        <MenuItem value="raw">Raw HTML</MenuItem>
      </TextField>
      <TextRow
        label={data.kind === "youtube" ? "YouTube URL or video ID" : "Raw HTML"}
        value={data.value ?? ""}
        onChange={(v) => patch({ ...data, value: v })}
        multiline={data.kind !== "youtube"}
        minRows={data.kind !== "youtube" ? 4 : undefined}
      />
    </Stack>
  );
}

const EDITORS: Record<string, (p: { data: any; patch: PatchFn }) => JSX.Element> = {
  hero: HeroEditor,
  richText: RichTextEditorBlock,
  imageText: ImageTextEditor,
  featureGrid: FeatureGridEditor,
  quote: QuoteEditor,
  cta: CTAEditor,
  faq: FAQEditor,
  embed: EmbedEditor,
};

// --- block list -----------------------------------------------------------

export default function BlockListEditor({
  blocks,
  onChange,
}: {
  blocks: CustomBlock[];
  onChange: (next: CustomBlock[]) => void;
}) {
  const patchBlock = (i: number, data: Record<string, unknown>) => {
    const next = blocks.slice();
    next[i] = { ...next[i], data };
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = blocks.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const duplicate = (i: number) => {
    const src = blocks[i];
    const next = blocks.slice();
    next.splice(i + 1, 0, { ...src, id: newBlockId(), data: JSON.parse(JSON.stringify(src.data)) });
    onChange(next);
  };
  const remove = (i: number) => {
    if (!window.confirm("Delete this block?")) return;
    const next = blocks.slice();
    next.splice(i, 1);
    onChange(next);
  };

  return (
    <Stack spacing={1.5}>
      {blocks.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            color: "text.secondary",
          }}
        >
          No blocks yet. Use the buttons above to add one.
        </Box>
      ) : null}
      {blocks.map((b, i) => {
        const def = BLOCK_TYPES.find((t) => t.value === b.type);
        const Editor = EDITORS[b.type];
        const title = `${def?.label ?? b.type}`;
        return (
          <Box
            key={b.id}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: 1.5,
                py: 1,
                bgcolor: "action.hover",
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {i + 1}. {title}
              </Typography>
              <Stack direction="row" spacing={0.25}>
                <Tooltip title="Move up">
                  <span>
                    <IconButton size="small" disabled={i === 0} onClick={() => move(i, -1)}>
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Move down">
                  <span>
                    <IconButton size="small" disabled={i === blocks.length - 1} onClick={() => move(i, 1)}>
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Duplicate">
                  <IconButton size="small" onClick={() => duplicate(i)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => remove(i)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
            <Box sx={{ p: 1.5 }}>
              {Editor ? (
                <Editor data={b.data} patch={(d) => patchBlock(i, d)} />
              ) : (
                <Typography color="text.secondary">Unknown block type: {b.type}</Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

// Use CollapsibleSection re-export so editor page imports stay tight.
export { CollapsibleSection };
