import { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";
import DonateButton from "@/components/ui/DonateButton";
import Logo from "@/components/ui/Logo";
import type { LayoutNavItem } from "@/content/layoutDefaults";

type Props = {
  open: boolean;
  onClose: () => void;
  items: LayoutNavItem[];
  brandName: string;
};

export default function MobileDrawer({ open, onClose, items, brandName }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, display: "flex", flexDirection: "column", height: "100%" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Logo size={32} />
            <Box sx={{ fontFamily: '"Lora", serif', fontWeight: 700, color: "primary.main" }}>
              {brandName}
            </Box>
          </Stack>
          <IconButton onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        <List sx={{ flex: 1 }}>
          {items.map((item) => {
            const hasChildren = !!item.children?.length;
            const isOpen = expanded === item.to;
            return (
              <Box key={item.to}>
                {hasChildren ? (
                  <ListItemButton
                    onClick={() => setExpanded(isOpen ? null : item.to)}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    {isOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    component={RouterLink}
                    to={item.to}
                    onClick={onClose}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                )}
                {hasChildren && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {item.children!.map((c) => (
                        <ListItemButton
                          key={c.to}
                          component={RouterLink}
                          to={c.to}
                          onClick={onClose}
                          sx={{ pl: 4 }}
                        >
                          <ListItemText primary={c.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
        <Box sx={{ p: 2 }}>
          <DonateButton fullWidth onClick={onClose} />
        </Box>
      </Box>
    </Drawer>
  );
}
