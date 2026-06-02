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
import GetInvolvedView from "@/components/get-involved/GetInvolvedView";
import { getInvolvedDefaults, type GetInvolvedContent } from "@/content/getInvolvedDefaults";
import RepeaterList, { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";
import { IconPicker } from "@/components/admin/inputs";

export default function AdminGetInvolvedPage() {
  return (
    <PageContentAdmin<GetInvolvedContent>
      slug="get-involved"
      pageLabel="Get Involved page"
      defaults={getInvolvedDefaults}
      renderPreview={(c) => <GetInvolvedView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof GetInvolvedContent>(k: K, v: GetInvolvedContent[K]) =>
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
              <FormControl size="small" fullWidth>
                <InputLabel>Alignment</InputLabel>
                <Select
                  label="Alignment"
                  value={content.intro.align}
                  onChange={(e) => patch("intro", { ...content.intro, align: e.target.value as "left" | "center" })}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                </Select>
              </FormControl>
            </CollapsibleSection>

            <CollapsibleSection title="Options">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.options.enabled}
                    onChange={(e) => patch("options", { ...content.options, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <RepeaterList
                label="Options"
                items={content.options.items}
                onChange={(items) => patch("options", { ...content.options, items })}
                blank={() => ({
                  iconKey: "favorite",
                  title: "",
                  body: "",
                  ctaLabel: "Learn more",
                  ctaHref: "/",
                  ctaColor: "primary" as const,
                })}
                addLabel="Add option"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <IconPicker value={it.iconKey} onChange={(v) => on({ ...it, iconKey: v ?? "favorite" })} />
                    <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                    <TextRow label="Body" value={it.body} multiline minRows={3} onChange={(v) => on({ ...it, body: v })} />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <TextRow label="CTA label" value={it.ctaLabel} onChange={(v) => on({ ...it, ctaLabel: v })} />
                      <TextRow label="CTA href" value={it.ctaHref} onChange={(v) => on({ ...it, ctaHref: v })} />
                    </Stack>
                    <FormControl size="small" fullWidth>
                      <InputLabel>CTA color</InputLabel>
                      <Select
                        label="CTA color"
                        value={it.ctaColor}
                        onChange={(e) => on({ ...it, ctaColor: e.target.value as "primary" | "secondary" })}
                      >
                        <MenuItem value="primary">Primary</MenuItem>
                        <MenuItem value="secondary">Secondary</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                )}
              />
            </CollapsibleSection>
          </>
        );
      }}
    />
  );
}
