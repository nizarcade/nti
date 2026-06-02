import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3030,
    host: true,
    // When running behind the docker proxy on nti.localhost:3030 the HMR
    // websocket has to reach the browser through the proxy on the same port.
    hmr: {
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) || 3030,
    },
  },
});
