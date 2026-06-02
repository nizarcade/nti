import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const base = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1E5A8A",
      dark: "#143E63",
      light: "#3F7BAE",
      contrastText: "#FAFAF7",
    },
    secondary: {
      main: "#C58A3F",
      dark: "#9F6E2E",
      light: "#D9A867",
      contrastText: "#1F2A37",
    },
    success: { main: "#3F8A5C" },
    background: {
      default: "#FAFAF7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2A37",
      secondary: "#52606D",
    },
    divider: "#E5E7EB",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Lora", Georgia, serif',
      fontWeight: 700,
      fontSize: "2.75rem",
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Lora", Georgia, serif',
      fontWeight: 700,
      fontSize: "2.15rem",
      lineHeight: 1.2,
      letterSpacing: "-0.015em",
    },
    h3: {
      fontFamily: '"Lora", Georgia, serif',
      fontWeight: 600,
      fontSize: "1.65rem",
      lineHeight: 1.25,
    },
    h4: {
      fontFamily: '"Lora", Georgia, serif',
      fontWeight: 600,
      fontSize: "1.35rem",
      lineHeight: 1.3,
    },
    h5: { fontWeight: 600, fontSize: "1.15rem", lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.4 },
    body1: { fontSize: "1rem", lineHeight: 1.65 },
    body2: { fontSize: "0.95rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "a:focus-visible, button:focus-visible": {
          outline: "2px solid #C58A3F",
          outlineOffset: 2,
          borderRadius: 4,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 20,
          borderRadius: 999,
        },
        containedSecondary: {
          color: "#1F2A37",
        },
      },
    },
    MuiAppBar: {
      defaultProps: { color: "inherit", elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "saturate(160%) blur(8px)",
          borderBottom: "1px solid #E5E7EB",
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #E5E7EB",
        },
      },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
    },
  },
});

export const theme = responsiveFontSizes(base);
