import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { aboutDefaults, type AboutContent } from "@/content/aboutDefaults";

export function useAboutContent(): { content: AboutContent; loading: boolean } {
  const [content, setContent] = useState<AboutContent>(aboutDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<AboutContent>("about")
      .then((c) => {
        if (!cancelled) setContent({ ...aboutDefaults, ...c });
      })
      .catch(() => {
        /* keep defaults */
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
