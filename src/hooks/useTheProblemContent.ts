import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { theProblemDefaults, type TheProblemContent } from "@/content/theProblemDefaults";

export function useTheProblemContent(): { content: TheProblemContent; loading: boolean } {
  const [content, setContent] = useState<TheProblemContent>(theProblemDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<TheProblemContent>("the-problem")
      .then((c) => {
        if (!cancelled) setContent({ ...theProblemDefaults, ...c });
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
