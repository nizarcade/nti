import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
} from "@mui/material";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import ImpactView from "@/components/impact/ImpactView";
import { impactDefaults, type ImpactContent } from "@/content/impactDefaults";
import RepeaterList, { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";

export default function AdminImpactPage() {
  return (
    <PageContentAdmin<ImpactContent>
      slug="impact"
      pageLabel="Impact & Transparency page"
      defaults={impactDefaults}
      renderPreview={(c) => <ImpactView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof ImpactContent>(k: K, v: ImpactContent[K]) =>
          setContent({ ...content, [k]: v });
        return (
          <>
            <CollapsibleSection title="SEO">
              <TextRow label="Title" value={content.seo.title} onChange={(v) => patch("seo", { ...content.seo, title: v })} />
              <TextRow label="Description" value={content.seo.description} multiline minRows={2} onChange={(v) => patch("seo", { ...content.seo, description: v })} />
            </CollapsibleSection>

            <CollapsibleSection title="Intro" defaultOpen>
              <TextRow label="Eyebrow" value={content.intro.eyebrow} onChange={(v) => patch("intro", { ...content.intro, eyebrow: v })} />
              <TextRow label="Title" value={content.intro.title} onChange={(v) => patch("intro", { ...content.intro, title: v })} />
              <TextRow label="Subtitle" value={content.intro.subtitle} multiline minRows={3} onChange={(v) => patch("intro", { ...content.intro, subtitle: v })} />
            </CollapsibleSection>

            <CollapsibleSection title="Stats">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.stats.enabled}
                    onChange={(e) => patch("stats", { ...content.stats, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <RepeaterList
                label="Stats"
                items={content.stats.items}
                onChange={(items) => patch("stats", { ...content.stats, items })}
                blank={() => ({ value: "", label: "" })}
                addLabel="Add stat"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <TextRow label="Value" value={it.value} onChange={(v) => on({ ...it, value: v })} />
                    <TextRow label="Label" value={it.label} onChange={(v) => on({ ...it, label: v })} />
                  </Stack>
                )}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Documents">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.documents.enabled}
                    onChange={(e) => patch("documents", { ...content.documents, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <TextRow label="Section title" value={content.documents.title} onChange={(v) => patch("documents", { ...content.documents, title: v })} />
              <RepeaterList
                label="Documents"
                items={content.documents.items}
                onChange={(items) => patch("documents", { ...content.documents, items })}
                blank={() => ({ title: "", status: "coming-soon" as const, fileUrl: null, year: null })}
                addLabel="Add document"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label="Status"
                          value={it.status}
                          onChange={(e) =>
                            on({ ...it, status: e.target.value as "available" | "coming-soon" })
                          }
                        >
                          <MenuItem value="available">Available</MenuItem>
                          <MenuItem value="coming-soon">Coming soon</MenuItem>
                        </Select>
                      </FormControl>
                      <TextRow
                        label="Year (optional)"
                        value={it.year != null ? String(it.year) : ""}
                        onChange={(v) => {
                          const n = parseInt(v, 10);
                          on({ ...it, year: Number.isFinite(n) ? n : null });
                        }}
                      />
                    </Stack>
                    {it.status === "available" && (
                      <TextRow
                        label="File URL"
                        value={it.fileUrl ?? ""}
                        onChange={(v) => on({ ...it, fileUrl: v || null })}
                      />
                    )}
                  </Stack>
                )}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Why your gift matters">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.whyGiftMatters.enabled}
                    onChange={(e) => patch("whyGiftMatters", { ...content.whyGiftMatters, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <TextRow label="Title" value={content.whyGiftMatters.title} onChange={(v) => patch("whyGiftMatters", { ...content.whyGiftMatters, title: v })} />
              <TextRow label="Body" value={content.whyGiftMatters.body} multiline minRows={5} onChange={(v) => patch("whyGiftMatters", { ...content.whyGiftMatters, body: v })} />
            </CollapsibleSection>

            <CollapsibleSection title="CTA band">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.ctaBand.enabled}
                    onChange={(e) => patch("ctaBand", { ...content.ctaBand, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <TextRow label="Title" value={content.ctaBand.title} onChange={(v) => patch("ctaBand", { ...content.ctaBand, title: v })} />
              <TextRow
                label="Body (optional)"
                value={content.ctaBand.body ?? ""}
                multiline
                minRows={2}
                onChange={(v) => patch("ctaBand", { ...content.ctaBand, body: v || null })}
              />
            </CollapsibleSection>
          </>
        );
      }}
    />
  );
}
