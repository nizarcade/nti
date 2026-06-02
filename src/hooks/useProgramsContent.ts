import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { programsDefaults, type ProgramsContent } from "@/content/programsDefaults";

export function useProgramsContent(): { content: ProgramsContent; loading: boolean } {
  const [content, setContent] = useState<ProgramsContent>(programsDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<ProgramsContent>("programs")
      .then((c) => {
        if (!cancelled) setContent({ ...programsDefaults, ...c });
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
