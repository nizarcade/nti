import { FormControlLabel, Stack, Switch } from "@mui/material";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import OurSolutionView from "@/components/our-solution/OurSolutionView";
import { ourSolutionDefaults, type OurSolutionContent } from "@/content/ourSolutionDefaults";
import RepeaterList, { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";
import { IconPicker } from "@/components/admin/inputs";

export default function AdminOurSolutionPage() {
  return (
    <PageContentAdmin<OurSolutionContent>
      slug="our-solution"
      pageLabel="Our Solution page"
      defaults={ourSolutionDefaults}
      renderPreview={(c) => <OurSolutionView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof OurSolutionContent>(k: K, v: OurSolutionContent[K]) =>
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

            <CollapsibleSection title="Pillars">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.pillars.enabled}
                    onChange={(e) => patch("pillars", { ...content.pillars, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <RepeaterList
                label="Pillars"
                items={content.pillars.items}
                onChange={(items) => patch("pillars", { ...content.pillars, items })}
                blank={() => ({ iconKey: "groups", title: "", body: "" })}
                addLabel="Add pillar"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <IconPicker value={it.iconKey} onChange={(v) => on({ ...it, iconKey: v ?? "groups" })} />
                    <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                    <TextRow label="Body" value={it.body} multiline minRows={2} onChange={(v) => on({ ...it, body: v })} />
                  </Stack>
                )}
              />
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
