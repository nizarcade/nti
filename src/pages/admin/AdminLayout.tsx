import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivismOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import CampaignIcon from "@mui/icons-material/CampaignOutlined";
import HomeWorkIcon from "@mui/icons-material/HomeWorkOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";
import AutoAwesomeMosaicOutlinedIcon from "@mui/icons-material/AutoAwesomeMosaicOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import Logo from "@/components/ui/Logo";
import Seo from "@/components/ui/Seo";

const DRAWER_WIDTH = 248;

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
};

type SubGroup = { heading: string; items: NavItem[] };

type Section = {
  heading: string;
  items?: NavItem[];
  subgroups?: SubGroup[];
};

const sections: Section[] = [
  {
    heading: "Dashboard",
    items: [{ to: "/admin", label: "Overview", icon: <DashboardIcon />, exact: true }],
  },
  {
    heading: "Manage",
    items: [
      { to: "/admin/campaigns", label: "Campaigns", icon: <CampaignIcon /> },
      { to: "/admin/donations", label: "Donations", icon: <VolunteerActivismIcon /> },
      { to: "/admin/contacts", label: "Contacts", icon: <MailOutlineIcon /> },
      { to: "/admin/volunteers", label: "Volunteers", icon: <GroupsIcon /> },
    ],
  },
  {
    heading: "Pages",
    items: [
      { to: "/admin/pages/home", label: "Home", icon: <HomeWorkIcon /> },
      { to: "/admin/pages/about", label: "About", icon: <InfoOutlinedIcon /> },
      { to: "/admin/pages/programs", label: "Programs", icon: <ListAltOutlinedIcon /> },
      { to: "/admin/pages/get-involved", label: "Get Involved", icon: <HandshakeOutlinedIcon /> },
      { to: "/admin/pages/impact", label: "Impact & Transparency", icon: <InsightsOutlinedIcon /> },
      { to: "/admin/pages-custom", label: "Custom pages", icon: <AutoAwesomeMosaicOutlinedIcon /> },
    ],
    subgroups: [
      {
        heading: "About",
        items: [
          { to: "/admin/pages/leadership", label: "Leadership", icon: <PeopleAltOutlinedIcon /> },
          { to: "/admin/pages/books", label: "Books", icon: <MenuBookOutlinedIcon /> },
        ],
      },
      {
        heading: "Grace Bridge",
        items: [
          { to: "/admin/pages/grace-bridge", label: "Overview", icon: <FavoriteBorderIcon /> },
          { to: "/admin/pages/the-problem", label: "The Problem", icon: <ReportProblemOutlinedIcon /> },
          { to: "/admin/pages/our-solution", label: "Our Solution", icon: <LightbulbOutlinedIcon /> },
        ],
      },
    ],
  },
  {
    heading: "Global",
    items: [
      { to: "/admin/pages/layout", label: "Header & Footer", icon: <ViewQuiltOutlinedIcon /> },
    ],
  },
];

function itemIsActive(it: NavItem, pathname: string) {
  return it.exact
    ? pathname === it.to
    : pathname === it.to || pathname.startsWith(it.to + "/");
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const sectionHasActive = (s: Section): boolean => {
    if (s.items?.some((it) => itemIsActive(it, loc.pathname))) return true;
    if (s.subgroups?.some((g) => g.items.some((it) => itemIsActive(it, loc.pathname)))) return true;
    return false;
  };
  const subgroupHasActive = (g: SubGroup) =>
    g.items.some((it) => itemIsActive(it, loc.pathname));

  const initialOpen = useMemo(() => {
    const o: Record<string, boolean> = {};
    for (const s of sections) o[s.heading] = sectionHasActive(s);
    // Always show Dashboard expanded
    o["Dashboard"] = true;
    return o;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(initialOpen);

  // Auto-expand the section containing the current route after navigation.
  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const s of sections) if (sectionHasActive(s)) next[s.heading] = true;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  const toggleSection = (h: string) =>
    setOpenSections((p) => ({ ...p, [h]: !p[h] }));

  const renderItem = (it: NavItem, opts?: { branch?: boolean; isLast?: boolean }) => {
    const active = itemIsActive(it, loc.pathname);
    const branch = opts?.branch;
    const isLast = opts?.isLast;
    return (
      <ListItemButton
        key={it.to}
        component={NavLink}
        to={it.to}
        end={it.exact}
        onClick={() => setOpen(false)}
        disableRipple
        sx={{
          position: "relative",
          borderRadius: 1.25,
          mb: 0.25,
          py: 0.75,
          pl: branch ? 3.75 : 2,
          color: active ? "primary.main" : "text.primary",
          bgcolor: active ? "action.selected" : "transparent",
          transition: "background-color 140ms ease, color 140ms ease, transform 140ms ease",
          "&:hover": {
            bgcolor: active ? "action.selected" : "action.hover",
            transform: branch ? "translateX(1px)" : "none",
          },
          ...(branch && {
            // Curved connector: vertical down the left, smoothly bending right to the icon.
            "&::before": {
              content: '""',
              position: "absolute",
              left: 14,
              top: 0,
              width: 14,
              height: "50%",
              borderLeft: "1.5px solid",
              borderBottom: "1.5px solid",
              borderColor: active ? "primary.light" : "divider",
              borderBottomLeftRadius: 12,
              opacity: active ? 1 : 0.85,
              transition: "border-color 140ms ease, opacity 140ms ease",
            },
            // Continuation of the trunk below the row (unless this is the last child).
            ...(!isLast && {
              "&::after": {
                content: '""',
                position: "absolute",
                left: 14,
                top: "50%",
                bottom: -2,
                borderLeft: "1.5px solid",
                borderColor: "divider",
                opacity: 0.85,
              },
            }),
          }),
          ...(!branch &&
            active && {
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 8,
                bottom: 8,
                width: 3,
                borderRadius: 4,
                bgcolor: "primary.main",
              },
            }),
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 30,
            color: active ? "primary.main" : "text.secondary",
            "& svg": { fontSize: branch ? 18 : 20 },
          }}
        >
          {it.icon}
        </ListItemIcon>
        <ListItemText
          primary={it.label}
          primaryTypographyProps={{
            fontSize: branch ? 13 : 14,
            fontWeight: active ? 700 : 500,
          }}
        />
      </ListItemButton>
    );
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      {/* Brand */}
      <Toolbar
        disableGutters
        sx={{
          px: 2.25,
          minHeight: 64,
          gap: 1.25,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Logo size={30} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: 0.2 }}
            noWrap
          >
            NTI Bridge
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 1,
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            Admin console
          </Typography>
        </Box>
      </Toolbar>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1.25, py: 1.25 }}>
        {sections.map((section) => {
          const expanded = openSections[section.heading] ?? false;
          const hasActive = sectionHasActive(section);
          return (
            <Box key={section.heading} sx={{ mb: 0.75 }}>
              <ListItemButton
                onClick={() => toggleSection(section.heading)}
                disableRipple
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    flex: 1,
                    color: hasActive ? "primary.main" : "text.secondary",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    lineHeight: 1.6,
                  }}
                >
                  {section.heading}
                </Typography>
                {expanded ? (
                  <ExpandLessIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                )}
              </ListItemButton>
              <Collapse in={expanded} timeout={180} unmountOnExit>
                <List disablePadding sx={{ mt: 0.25 }}>
                  {section.items?.map((it) => renderItem(it))}
                </List>
                {section.subgroups?.map((g) => {
                  const gActive = subgroupHasActive(g);
                  return (
                    <Box key={g.heading} sx={{ mt: 1.25, ml: 1.5, position: "relative" }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{ px: 1.25, pb: 0.25 }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: gActive ? "primary.main" : "divider",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: gActive ? "primary.main" : "text.secondary",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: 1.1,
                            textTransform: "uppercase",
                          }}
                        >
                          {g.heading}
                        </Typography>
                      </Stack>
                      <List disablePadding>
                        {g.items.map((it, i) =>
                          renderItem(it, {
                            branch: true,
                            isLast: i === g.items.length - 1,
                          }),
                        )}
                      </List>
                    </Box>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}
      </Box>

      <Divider />

      {/* User card */}
      <Box sx={{ p: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{
            px: 1,
            py: 1,
            borderRadius: 1,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {(user?.username || "?").slice(0, 1).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {user?.username || "—"}
            </Typography>
            <Chip
              label={user?.role || "admin"}
              size="small"
              sx={{
                height: 16,
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                bgcolor: "action.selected",
                color: "text.secondary",
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          </Box>
          <Tooltip title="Open public site">
            <IconButton size="small" component="a" href="/" target="_blank" rel="noopener">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton
              size="small"
              onClick={() => {
                logout();
                navigate("/admin/login", { replace: true });
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <>
      <Seo title="Admin" pathname="/admin" />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Mobile app bar */}
        <AppBar
          position="fixed"
          color="default"
          elevation={0}
          sx={{
            display: { md: "none" },
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Toolbar>
            <IconButton onClick={() => setOpen(true)} edge="start" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Logo size={24} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, ml: 1.25, letterSpacing: 0.2 }}
            >
              NTI Bridge
            </Typography>
            <Typography
              variant="caption"
              sx={{
                ml: 1,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 600,
              }}
            >
              Admin
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              borderRight: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            pt: { xs: 9, md: 4 },
            pb: 6,
            px: { xs: 2, md: 4 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
