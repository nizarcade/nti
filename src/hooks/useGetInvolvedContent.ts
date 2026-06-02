import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { getInvolvedDefaults, type GetInvolvedContent } from "@/content/getInvolvedDefaults";

export function useGetInvolvedContent(): { content: GetInvolvedContent; loading: boolean } {
  const [content, setContent] = useState<GetInvolvedContent>(getInvolvedDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<GetInvolvedContent>("get-involved")
      .then((c) => {
        if (!cancelled) setContent({ ...getInvolvedDefaults, ...c });
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
