import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { ourSolutionDefaults, type OurSolutionContent } from "@/content/ourSolutionDefaults";

export function useOurSolutionContent(): { content: OurSolutionContent; loading: boolean } {
  const [content, setContent] = useState<OurSolutionContent>(ourSolutionDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<OurSolutionContent>("our-solution")
      .then((c) => {
        if (!cancelled) setContent({ ...ourSolutionDefaults, ...c });
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
