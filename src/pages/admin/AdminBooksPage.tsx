import { Stack } from "@mui/material";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import BooksView from "@/components/books/BooksView";
import { booksDefaults, type BooksContent } from "@/content/booksDefaults";
import RepeaterList, {
  CollapsibleSection,
  TextRow,
} from "@/components/admin/RepeaterList";

export default function AdminBooksPage() {
  return (
    <PageContentAdmin<BooksContent>
      slug="books"
      pageLabel="Books page"
      defaults={booksDefaults}
      renderPreview={(c) => <BooksView content={c} />}
      renderEditor={({ content, setContent }) => {
        const patch = <K extends keyof BooksContent>(k: K, v: BooksContent[K]) =>
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

            <CollapsibleSection title="Books">
              <RepeaterList
                label="Books"
                items={content.books}
                onChange={(books) => patch("books", books)}
                blank={() => ({
                  title: "",
                  blurb: "",
                  coverImageUrl: null,
                  ctaLabel: null,
                  ctaUrl: null,
                  badge: null,
                })}
                addLabel="Add book"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <TextRow label="Title" value={it.title} onChange={(v) => on({ ...it, title: v })} />
                    <TextRow
                      label="Blurb"
                      value={it.blurb}
                      multiline
                      minRows={3}
                      onChange={(v) => on({ ...it, blurb: v })}
                    />
                    <TextRow
                      label="Cover image URL (optional)"
                      value={it.coverImageUrl ?? ""}
                      onChange={(v) => on({ ...it, coverImageUrl: v || null })}
                    />
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <TextRow
                        label="CTA label"
                        value={it.ctaLabel ?? ""}
                        onChange={(v) => on({ ...it, ctaLabel: v || null })}
                      />
                      <TextRow
                        label="CTA URL"
                        value={it.ctaUrl ?? ""}
                        onChange={(v) => on({ ...it, ctaUrl: v || null })}
                      />
                    </Stack>
                    <TextRow
                      label="Badge (e.g. 'Coming soon', 'Best-seller')"
                      value={it.badge ?? ""}
                      onChange={(v) => on({ ...it, badge: v || null })}
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
