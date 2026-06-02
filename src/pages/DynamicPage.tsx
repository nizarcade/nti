import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Seo from "@/components/ui/Seo";
import NotFound from "@/pages/NotFound";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { customPagesApi, type CustomPagePublic } from "@/api/customPages";
import { ApiError } from "@/api/client";

export default function DynamicPage() {
  const { slug = "" } = useParams();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "ok"; page: CustomPagePublic }
    | { kind: "missing" }
    | { kind: "error"; message: string }
  >({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });
    customPagesApi
      .public(slug)
      .then((page) => {
        if (!cancelled) setState({ kind: "ok", page });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setState({ kind: "missing" });
        } else {
          setState({
            kind: "error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.kind === "loading") {
    return (
      <Box sx={{ minHeight: "50vh", display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (state.kind === "missing") return <NotFound />;
  if (state.kind === "error") {
    return (
      <Box sx={{ py: 8, textAlign: "center", color: "error.main" }}>
        Failed to load page: {state.message}
      </Box>
    );
  }
  const { page } = state;
  return (
    <>
      <Seo
        title={page.title}
        description={page.seo?.description}
        pathname={`/${page.slug}`}
        image={page.seo?.ogImage}
      />
      <BlockRenderer blocks={page.blocks} />
    </>
  );
}
