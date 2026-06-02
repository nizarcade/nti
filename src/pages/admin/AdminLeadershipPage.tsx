import {
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import LeadershipView from "@/components/leadership/LeadershipView";
import { leadershipDefaults, type LeadershipContent } from "@/content/leadershipDefaults";
import RepeaterList, {
  CollapsibleSection,
  TextRow,
} from "@/components/admin/RepeaterList";
import { StringListEditor } from "@/components/admin/inputs";

export default function AdminLeadershipPage() {
  return (
    <PageContentAdmin<LeadershipContent>
      slug="leadership"
      pageLabel="Leadership page"
      defaults={leadershipDefaults}
      renderPreview={(c) => <LeadershipView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof LeadershipContent>(k: K, v: LeadershipContent[K]) =>
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
            </CollapsibleSection>

            <CollapsibleSection title="Featured leader">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.featured.enabled}
                    onChange={(e) =>
                      patch("featured", { ...content.featured, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Name"
                value={content.featured.name}
                onChange={(v) => patch("featured", { ...content.featured, name: v })}
              />
              <TextRow
                label="Role"
                value={content.featured.role}
                onChange={(v) => patch("featured", { ...content.featured, role: v })}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextRow
                  label="Initials (fallback when no photo)"
                  value={content.featured.initials ?? ""}
                  onChange={(v) =>
                    patch("featured", { ...content.featured, initials: v || null })
                  }
                />
                <TextRow
                  label="Photo URL (optional)"
                  value={content.featured.photoUrl ?? ""}
                  onChange={(v) =>
                    patch("featured", { ...content.featured, photoUrl: v || null })
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextRow
                  label="Phone (display)"
                  value={content.featured.phoneDisplay ?? ""}
                  onChange={(v) =>
                    patch("featured", { ...content.featured, phoneDisplay: v || null })
                  }
                />
                <TextRow
                  label="Phone (tel: link)"
                  value={content.featured.phoneTel ?? ""}
                  onChange={(v) =>
                    patch("featured", { ...content.featured, phoneTel: v || null })
                  }
                />
              </Stack>
              <Typography variant="subtitle2">Bio paragraphs</Typography>
              <StringListEditor
                label="paragraph"
                multiline
                items={content.featured.paragraphs}
                onChange={(items) =>
                  patch("featured", { ...content.featured, paragraphs: items })
                }
              />
            </CollapsibleSection>

            <CollapsibleSection title="Voice & quotes">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.voiceBlock.enabled}
                    onChange={(e) =>
                      patch("voiceBlock", { ...content.voiceBlock, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Eyebrow"
                value={content.voiceBlock.eyebrow}
                onChange={(v) => patch("voiceBlock", { ...content.voiceBlock, eyebrow: v })}
              />
              <TextRow
                label="Title"
                value={content.voiceBlock.title}
                onChange={(v) => patch("voiceBlock", { ...content.voiceBlock, title: v })}
              />
              <TextRow
                label="Intro paragraph"
                value={content.voiceBlock.intro}
                multiline
                minRows={3}
                onChange={(v) => patch("voiceBlock", { ...content.voiceBlock, intro: v })}
              />
              <RepeaterList
                label="Quotes"
                items={content.voiceBlock.quotes}
                onChange={(quotes) =>
                  patch("voiceBlock", { ...content.voiceBlock, quotes })
                }
                blank={() => ({ text: "", attribution: null })}
                addLabel="Add quote"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <TextRow
                      label="Quote text"
                      value={it.text}
                      multiline
                      minRows={3}
                      onChange={(v) => on({ ...it, text: v })}
                    />
                    <TextRow
                      label="Attribution (optional)"
                      value={it.attribution ?? ""}
                      onChange={(v) => on({ ...it, attribution: v || null })}
                    />
                  </Stack>
                )}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Leadership structure">
              <FormControlLabel
                control={
                  <Switch
                    checked={content.structure.enabled}
                    onChange={(e) =>
                      patch("structure", { ...content.structure, enabled: e.target.checked })
                    }
                  />
                }
                label="Enabled"
              />
              <TextRow
                label="Section title"
                value={content.structure.title}
                onChange={(v) => patch("structure", { ...content.structure, title: v })}
              />
              <RepeaterList
                label="Members"
                items={content.structure.members}
                onChange={(members) =>
                  patch("structure", { ...content.structure, members })
                }
                blank={() => ({ role: "", name: "", photoUrl: null, bioShort: null })}
                addLabel="Add member"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <TextRow label="Role" value={it.role} onChange={(v) => on({ ...it, role: v })} />
                    <TextRow label="Name" value={it.name} onChange={(v) => on({ ...it, name: v })} />
                    <TextRow
                      label="Photo URL (optional)"
                      value={it.photoUrl ?? ""}
                      onChange={(v) => on({ ...it, photoUrl: v || null })}
                    />
                    <TextRow
                      label="Short bio (optional)"
                      value={it.bioShort ?? ""}
                      multiline
                      minRows={2}
                      onChange={(v) => on({ ...it, bioShort: v || null })}
                    />
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
