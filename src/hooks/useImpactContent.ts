import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { impactDefaults, type ImpactContent } from "@/content/impactDefaults";

export function useImpactContent(): { content: ImpactContent; loading: boolean } {
  const [content, setContent] = useState<ImpactContent>(impactDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<ImpactContent>("impact")
      .then((c) => {
        if (!cancelled) setContent({ ...impactDefaults, ...c });
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
