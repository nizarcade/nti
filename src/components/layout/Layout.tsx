import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <a
        href="#main"
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          zIndex: 9999,
          background: "#1E5A8A",
          color: "white",
          padding: "10px 16px",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "8px";
          e.currentTarget.style.top = "8px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
        }}
      >
        Skip to content
      </a>
      <Header />
      <Box component="main" id="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
