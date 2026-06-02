import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@/theme";

type Props = {
  width: number | string;
  height: number | string;
  children: ReactNode;
};

export default function PreviewFrame({ width, height, children }: Props) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [cache, setCache] = useState<ReturnType<typeof createCache> | null>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const setup = () => {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;
      if (!doc || !win) return;
      // Ensure viewport meta so MUI breakpoints behave on iframe width
      if (!doc.querySelector('meta[name="viewport"]')) {
        const meta = doc.createElement("meta");
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1";
        doc.head.appendChild(meta);
      }
      // Copy parent <link rel=stylesheet> and <style> tags so fonts/global CSS apply
      const parentHead = document.head;
      parentHead
        .querySelectorAll('link[rel="stylesheet"], style[data-vite-dev-id], style[data-emotion]')
        .forEach((node) => {
          const clone = node.cloneNode(true);
          doc.head.appendChild(clone);
        });
      doc.body.style.margin = "0";
      doc.body.style.background = "#fff";
      const c = createCache({ key: "mui-preview", container: doc.head });
      setCache(c);
      setMountNode(doc.body);
    };
    if (iframe.contentDocument?.readyState === "complete") {
      setup();
    } else {
      iframe.addEventListener("load", setup);
      return () => iframe.removeEventListener("load", setup);
    }
  }, []);

  return (
    <iframe
      ref={ref}
      title="Preview"
      style={{
        width,
        height,
        border: 0,
        background: "#fff",
        display: "block",
        transition: "width 200ms ease",
      }}
    >
      {mountNode && cache &&
        createPortal(
          <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </CacheProvider>,
          mountNode
        )}
    </iframe>
  );
}
