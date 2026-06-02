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
import Logo from "@/components/ui/Logo";
import { useLayoutContent } from "@/hooks/useLayoutContent";
import type { LayoutContent, LayoutNavItem } from "@/content/layoutDefaults";

function DesktopNavItem({ item }: { item: LayoutNavItem }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { pathname } = useLocation();
  const active = pathname === item.to || pathname.startsWith(item.to + "/");
  const hasChildren = !!item.children?.length;

  if (!hasChildren) {
    return (
      <Button
        component={RouterLink}
        to={item.to}
        color="inherit"
        sx={{
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
        MenuListProps={{ dense: true, "aria-label": `${item.label} submenu` }}
      >
        {item.children.map((c) => (
          <MenuItem key={c.to} component={RouterLink} to={c.to} onClick={() => setAnchor(null)}>
            {c.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

type Props = { content?: LayoutContent };

export default function Header({ content }: Props = {}) {
  const fetched = useLayoutContent();
  const c = content ?? fetched.content;
  const { nav } = c;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky" component="header">
        <Container>
          <Toolbar
            disableGutters
            sx={{ minHeight: { xs: 64, md: 76 } }}
            component="nav"
            aria-label="Primary"
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                textDecoration: "none",
                color: "inherit",
                mr: 2,
              }}
            >
              <Logo size={36} />
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Box sx={{ fontFamily: '"Lora", serif', fontWeight: 700, fontSize: 18, lineHeight: 1, color: "primary.main" }}>
                  {nav.brandName}
                </Box>
                <Box sx={{ fontSize: 11, color: "text.secondary", letterSpacing: "0.04em" }}>
                  {nav.brandTagline}
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {nav.items.map((item) => (
                <DesktopNavItem key={item.to} item={item} />
              ))}
              <Box sx={{ ml: 1 }}>
                <DonateButton />
              </Box>
            </Stack>

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              aria-label="Open navigation menu"
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
