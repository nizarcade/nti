import {
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import ProgramsView from "@/components/programs/ProgramsView";
import { programsDefaults, type ProgramsContent } from "@/content/programsDefaults";
import RepeaterList, {
  CollapsibleSection,
  TextRow,
} from "@/components/admin/RepeaterList";
import { IconPicker, StringListEditor } from "@/components/admin/inputs";

export default function AdminProgramsPage() {
  return (
    <PageContentAdmin<ProgramsContent>
      slug="programs"
      pageLabel="Programs page"
      defaults={programsDefaults}
      renderPreview={(c) => <ProgramsView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof ProgramsContent>(k: K, v: ProgramsContent[K]) =>
          setContent({ ...content, [k]: v });
        return (
          <>
            <CollapsibleSection title="SEO">
              <TextRow
                label="Title"
                value={content.seo.title}
                onChange={(v) => patch("seo", { ...content.seo, title: v })}
              />
              <TextRow
                label="Description"
                value={content.seo.description}
                multiline
                minRows={2}
                onChange={(v) => patch("seo", { ...content.seo, description: v })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Intro" defaultOpen>
              <TextRow
                label="Eyebrow"
                value={content.intro.eyebrow}
                onChange={(v) => patch("intro", { ...content.intro, eyebrow: v })}
              />
              <TextRow
                label="Title"
                value={content.intro.title}
                onChange={(v) => patch("intro", { ...content.intro, title: v })}
              />
              <TextRow
                label="Subtitle"
                value={content.intro.subtitle}
                multiline
                minRows={3}
                onChange={(v) => patch("intro", { ...content.intro, subtitle: v })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Program pillars">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.pillars.enabled}
                    onChange={(e) =>
                      patch("pillars", { ...content.pillars, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
              <RepeaterList
                label="Pillars"
                items={content.pillars.items}
                onChange={(items) => patch("pillars", { ...content.pillars, items })}
                blank={() => ({
                  slug: "",
                  title: "",
                  summary: "",
                  bullets: [],
                  iconKey: null,
                  linkHref: null,
                  linkLabel: null,
                })}
                addLabel="Add pillar"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <TextRow label="Slug" value={it.slug} onChange={(v) => on({ ...it, slug: v })} />
                      <IconPicker
                        value={it.iconKey}
                        onChange={(v) => on({ ...it, iconKey: v })}
                        allowNone
                      />
                    </Stack>
                    <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                    <TextRow
                      label="Summary"
                      value={it.summary}
                      multiline
                      minRows={2}
                      onChange={(v) => on({ ...it, summary: v })}
                    />
                    <Typography variant="subtitle2">Bullets</Typography>
                    <StringListEditor
                      label="bullet"
                      items={it.bullets}
                      onChange={(bullets) => on({ ...it, bullets })}
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <TextRow
                        label="Link label (optional)"
                        value={it.linkLabel ?? ""}
                        onChange={(v) => on({ ...it, linkLabel: v || null })}
                      />
                      <TextRow
                        label="Link href (optional)"
                        value={it.linkHref ?? ""}
                        onChange={(v) => on({ ...it, linkHref: v || null })}
                      />
                    </Stack>
                  </Stack>
                )}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Current focus callout">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.currentFocus.enabled}
                    onChange={(e) =>
                      patch("currentFocus", {
                        ...content.currentFocus,
                        enabled: e.target.checked,
                      })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Title"
                value={content.currentFocus.title}
                onChange={(v) => patch("currentFocus", { ...content.currentFocus, title: v })}
              />
              <TextRow
                label="Body"
                value={content.currentFocus.body}
                multiline
                minRows={4}
                onChange={(v) => patch("currentFocus", { ...content.currentFocus, body: v })}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextRow
                  label="CTA label (optional)"
                  value={content.currentFocus.ctaLabel ?? ""}
                  onChange={(v) =>
                    patch("currentFocus", { ...content.currentFocus, ctaLabel: v || null })
                  }
                />
                <TextRow
                  label="CTA href (optional)"
                  value={content.currentFocus.ctaHref ?? ""}
                  onChange={(v) =>
                    patch("currentFocus", { ...content.currentFocus, ctaHref: v || null })
                  }
                />
              </Stack>
            </CollapsibleSection>

            <CollapsibleSection title="Bottom CTA band">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.ctaBand.enabled}
                    onChange={(e) =>
                      patch("ctaBand", { ...content.ctaBand, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Title"
                value={content.ctaBand.title}
                onChange={(v) => patch("ctaBand", { ...content.ctaBand, title: v })}
              />
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
