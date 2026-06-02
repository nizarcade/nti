import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { layoutDefaults, type LayoutContent } from "@/content/layoutDefaults";

export function useLayoutContent(): { content: LayoutContent; loading: boolean } {
  const [content, setContent] = useState<LayoutContent>(layoutDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<LayoutContent>("layout")
      .then((c) => {
        if (!cancelled) setContent({ ...layoutDefaults, ...c });
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
