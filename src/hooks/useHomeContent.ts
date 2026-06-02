import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { homeDefaults, type HomeContent } from "@/content/homeDefaults";

export function useHomeContent(): { content: HomeContent; loading: boolean } {
  const [content, setContent] = useState<HomeContent>(homeDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<HomeContent>("home")
      .then((c) => {
        if (!cancelled) setContent({ ...homeDefaults, ...c });
      })
      .catch(() => {
        /* fall back to defaults */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return { content, loading };
}
