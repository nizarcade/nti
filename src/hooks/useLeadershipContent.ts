import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { leadershipDefaults, type LeadershipContent } from "@/content/leadershipDefaults";

export function useLeadershipContent(): { content: LeadershipContent; loading: boolean } {
  const [content, setContent] = useState<LeadershipContent>(leadershipDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<LeadershipContent>("leadership")
      .then((c) => {
        if (!cancelled) setContent({ ...leadershipDefaults, ...c });
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
