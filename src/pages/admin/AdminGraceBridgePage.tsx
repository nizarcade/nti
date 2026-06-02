import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch } from "@mui/material";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import GraceBridgeView from "@/components/grace-bridge/GraceBridgeView";
import { graceBridgeDefaults, type GraceBridgeContent } from "@/content/graceBridgeDefaults";
import RepeaterList, { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";
import { IconPicker } from "@/components/admin/inputs";

export default function AdminGraceBridgePage() {
  return (
    <PageContentAdmin<GraceBridgeContent>
      slug="grace-bridge"
      pageLabel="Grace Bridge page"
      defaults={graceBridgeDefaults}
      renderPreview={(c) => <GraceBridgeView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof GraceBridgeContent>(k: K, v: GraceBridgeContent[K]) =>
          setContent({ ...content, [k]: v });
        return (
          <>
            <CollapsibleSection title="SEO">
              <TextRow label="Title" value={content.seo.title} onChange={(v) => patch("seo", { ...content.seo, title: v })} />
              <TextRow label="Description" value={content.seo.description} multiline minRows={2} onChange={(v) => patch("seo", { ...content.seo, description: v })} />
            </CollapsibleSection>

            <CollapsibleSection title="Hero" defaultOpen>
              <TextRow label="Overline" value={content.hero.overline} onChange={(v) => patch("hero", { ...content.hero, overline: v })} />
              <TextRow label="Title" value={content.hero.title} onChange={(v) => patch("hero", { ...content.hero, title: v })} />
              <TextRow label="Subhead" value={content.hero.subhead} multiline minRows={3} onChange={(v) => patch("hero", { ...content.hero, subhead: v })} />
              <TextRow
                label="Background image URL (optional)"
                value={content.hero.backgroundImageUrl ?? ""}
                onChange={(v) => patch("hero", { ...content.hero, backgroundImageUrl: v || null })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Inspired by">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.inspiredBy.enabled}
                    onChange={(e) => patch("inspiredBy", { ...content.inspiredBy, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <TextRow label="Title" value={content.inspiredBy.title} onChange={(v) => patch("inspiredBy", { ...content.inspiredBy, title: v })} />
              <TextRow label="Body" value={content.inspiredBy.body} multiline minRows={5} onChange={(v) => patch("inspiredBy", { ...content.inspiredBy, body: v })} />
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
              <TextRow label="Section title" value={content.pillars.title} onChange={(v) => patch("pillars", { ...content.pillars, title: v })} />
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

            <CollapsibleSection title="Footer CTAs">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.footerCtas.enabled}
                    onChange={(e) => patch("footerCtas", { ...content.footerCtas, enabled: e.target.checked })}
                  />
                }
                label="Enabled"
              />
              <RepeaterList
                label="Buttons"
                items={content.footerCtas.buttons}
                onChange={(buttons) => patch("footerCtas", { ...content.footerCtas, buttons })}
                blank={() => ({ label: "", href: "/", variant: "outlined" as const })}
                addLabel="Add button"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <TextRow label="Label" value={it.label} onChange={(v) => on({ ...it, label: v })} />
                    <TextRow label="Href" value={it.href} onChange={(v) => on({ ...it, href: v })} />
                    <FormControl size="small" fullWidth>
                      <InputLabel>Variant</InputLabel>
                      <Select
                        label="Variant"
                        value={it.variant}
                        onChange={(e) => on({ ...it, variant: e.target.value as "outlined" | "contained" })}
                      >
                        <MenuItem value="outlined">Outlined</MenuItem>
                        <MenuItem value="contained">Contained</MenuItem>
                      </Select>
                    </FormControl>
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
