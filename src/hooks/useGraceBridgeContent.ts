import { useEffect, useState } from "react";
import { pageContentApi } from "@/api/pageContent";
import { graceBridgeDefaults, type GraceBridgeContent } from "@/content/graceBridgeDefaults";

export function useGraceBridgeContent(): { content: GraceBridgeContent; loading: boolean } {
  const [content, setContent] = useState<GraceBridgeContent>(graceBridgeDefaults);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    pageContentApi
      .public<GraceBridgeContent>("grace-bridge")
      .then((c) => {
        if (!cancelled) setContent({ ...graceBridgeDefaults, ...c });
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
