import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MobileDrawer from "./MobileDrawer";
import DonateButton from "@/components/ui/DonateButton";
import { useLayoutContent } from "@/hooks/useLayoutContent";
import type { LayoutContent, LayoutNavItem } from "@/content/layoutDefaults";

function DesktopNavItem({ item }: { item: LayoutNavItem }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { pathname } = useLocation();

  const active =
    pathname === item.to || pathname.startsWith(item.to + "/");

  const hasChildren = Boolean(item.children?.length);

  if (!hasChildren) {
    return (
      <Button
        component={RouterLink}
        to={item.to}
        color="inherit"
        sx={{
          px: 1.25,
          minWidth: "auto",
          textTransform: "none",
          whiteSpace: "nowrap",
          color: active ? "primary.main" : "text.primary",
          fontWeight: active ? 700 : 500,
        }}
      >
        {item.label}
      </Button>
    );
  }

  return (
    <>
      <Button
        color="inherit"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        aria-controls={anchor ? `nav-menu-${item.label}` : undefined}
        sx={{
          px: 1.25,
          minWidth: "auto",
          textTransform: "none",
          whiteSpace: "nowrap",
          color: active ? "primary.main" : "text.primary",
          fontWeight: active ? 700 : 500,
        }}
      >
        {item.label}
      </Button>

      <Menu
        id={`nav-menu-${item.label}`}
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        MenuListProps={{
          dense: true,
          "aria-label": `${item.label} submenu`,
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
              boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {item.children?.map((child) => (
          <MenuItem
            key={child.to}
            component={RouterLink}
            to={child.to}
            onClick={() => setAnchor(null)}
            sx={{
              py: 1.25,
              px: 2,
              fontSize: 14,
            }}
          >
            {child.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

type Props = {
  content?: LayoutContent;
};

export default function Header({ content }: Props = {}) {
  const fetched = useLayoutContent();
  const c = content ?? fetched.content;
  const { nav } = c;

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        component="header"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            component="nav"
            aria-label="Primary"
            sx={{
              minHeight: {
                xs: 72,
                md: 92,
              },
              gap: 2,
            }}
          >
            <Box
              component={RouterLink}
              to="/"
              aria-label="Northern Transformation Initiative home"
              sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                textDecoration: "none",
                mr: {
                  xs: 1,
                  md: 2,
                },
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Northern Transformation Initiative — Restoring hope"
                sx={{
                  display: "block",
                  width: {
                    xs: 175,
                    sm: 220,
                    md: 250,
                    lg: 275,
                  },
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }} />

            <Stack
              direction="row"
              spacing={0.25}
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {nav.items.map((item) => (
                <DesktopNavItem key={item.to} item={item} />
              ))}

              <Box sx={{ ml: 1.5 }}>
                <DonateButton />
              </Box>
            </Stack>

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: {
                  xs: "inline-flex",
                  md: "none",
                },
                ml: "auto",
              }}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={nav.items}
        brandName={nav.brandName}
      />
    </>
  );
}
