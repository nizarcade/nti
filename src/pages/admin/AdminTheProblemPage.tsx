import { FormControlLabel, Stack, Switch } from "@mui/material";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import TheProblemView from "@/components/the-problem/TheProblemView";
import { theProblemDefaults, type TheProblemContent } from "@/content/theProblemDefaults";
import RepeaterList, { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";

export default function AdminTheProblemPage() {
  return (
    <PageContentAdmin<TheProblemContent>
      slug="the-problem"
      pageLabel="The Problem page"
      defaults={theProblemDefaults}
      renderPreview={(c) => <TheProblemView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof TheProblemContent>(k: K, v: TheProblemContent[K]) =>
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
            </CollapsibleSection>

            <CollapsibleSection title="Issues">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.issues.enabled}
                    onChange={(e) => patch("issues", { ...content.issues, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <RepeaterList
                label="Issues"
                items={content.issues.items}
                onChange={(items) => patch("issues", { ...content.issues, items })}
                blank={() => ({ title: "", body: "" })}
                addLabel="Add issue"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                    <TextRow label="Body" value={it.body} multiline minRows={3} onChange={(v) => on({ ...it, body: v })} />
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
