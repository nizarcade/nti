import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { booksDefaults, type BooksContent } from "@/content/booksDefaults";

export function useBooksContent(): { content: BooksContent; loading: boolean } {
  const [content, setContent] = useState<BooksContent>(booksDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<BooksContent>("books")
      .then((c) => {
        if (!cancelled) setContent({ ...booksDefaults, ...c });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { content, loading };
}
