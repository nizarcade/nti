import { useState } from "react";
import { AppBar, Box, Collapse, Container, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PageContentAdmin from "@/components/admin/PageContentAdmin";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/ui/Logo";
import DonateButton from "@/components/ui/DonateButton";
import { layoutDefaults, type LayoutContent } from "@/content/layoutDefaults";
import RepeaterList, { CollapsibleSection, TextRow } from "@/components/admin/RepeaterList";
import { PathPicker } from "@/components/admin/PathPicker";

function HeaderPreview({ nav }: { nav: LayoutContent["nav"] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <AppBar position="static" color="default" elevation={1} component="header">
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1.5,
            minHeight: 64,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <Logo size={36} />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontFamily: '"Lora", serif',
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: 1.2,
                  color: "primary.main",
                }}
              >
                {nav.brandName}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{ color: "text.secondary", letterSpacing: "0.04em", display: "block" }}
              >
                {nav.brandTagline}
              </Typography>
            </Box>
          </Box>

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1.5,
              rowGap: 0.5,
            }}
          >
            {nav.items.map((item) => (
              <Box
                key={item.to}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.25,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.primary",
                  px: 0.5,
                  py: 0.75,
                }}
              >
                <span>{item.label}</span>
                {item.children?.length ? (
                  <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
                ) : null}
              </Box>
            ))}
            <DonateButton />
          </Box>

          {/* Mobile cluster */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <DonateButton />
            <IconButton
              aria-label={mobileOpen ? "close menu" : "open menu"}
              edge="end"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Mobile inline panel (no portal — works inside the preview iframe) */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Collapse in={mobileOpen} unmountOnExit>
            <Stack
              divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}
              sx={{ pb: 1 }}
            >
              {nav.items.map((item) => {
                const hasChildren = !!item.children?.length;
                const isOpen = expanded === item.to;
                return (
                  <Box key={item.to}>
                    <Box
                      onClick={() =>
                        hasChildren
                          ? setExpanded(isOpen ? null : item.to)
                          : setMobileOpen(false)
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.25,
                        px: 0.5,
                        fontSize: 15,
                        fontWeight: 500,
                        color: "text.primary",
                        cursor: "pointer",
                      }}
                    >
                      <span>{item.label}</span>
                      {hasChildren ? (
                        isOpen ? (
                          <ExpandLessIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <ExpandMoreIcon sx={{ fontSize: 20 }} />
                        )
                      ) : null}
                    </Box>
                    {hasChildren ? (
                      <Collapse in={isOpen} unmountOnExit>
                        <Stack sx={{ pl: 2, pb: 1 }}>
                          {item.children!.map((ch) => (
                            <Box
                              key={ch.to}
                              onClick={() => setMobileOpen(false)}
                              sx={{
                                py: 0.75,
                                px: 0.5,
                                fontSize: 14,
                                color: "text.secondary",
                                cursor: "pointer",
                              }}
                            >
                              {ch.label}
                            </Box>
                          ))}
                        </Stack>
                      </Collapse>
                    ) : null}
                  </Box>
                );
              })}
            </Stack>
          </Collapse>
        </Box>
      </Container>
    </AppBar>
  );
}

function LayoutChromePreview({ content }: { content: LayoutContent }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <HeaderPreview nav={content.nav} />
      <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
        — page content —
      </Box>
      <Footer content={content} />
    </Box>
  );
}

export default function AdminLayoutContentPage() {
  return (
    <PageContentAdmin<LayoutContent>
      slug="layout"
      pageLabel="Site layout (header + footer)"
      defaults={layoutDefaults}
      renderPreview={(c) => <LayoutChromePreview content={c} />}
      renderEditor={({ content, setContent }) => {
        const patchNav = (v: LayoutContent["nav"]) => setContent({ ...content, nav: v });
        const patchFooter = (v: LayoutContent["footer"]) =>
          setContent({ ...content, footer: v });
        const { nav, footer } = content;
        return (
          <>
            <CollapsibleSection title="Header — brand" defaultOpen>
              <TextRow
                label="Brand name (short)"
                value={nav.brandName}
                onChange={(v) => patchNav({ ...nav, brandName: v })}
              />
              <TextRow
                label="Brand tagline"
                value={nav.brandTagline}
                onChange={(v) => patchNav({ ...nav, brandTagline: v })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Header — nav items">
              <RepeaterList
                label="Top-level items"
                items={nav.items}
                onChange={(items) => patchNav({ ...nav, items })}
                blank={() => ({ label: "New", to: "/", children: [] })}
                addLabel="Add nav item"
                renderItem={(it, on) => (
                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <TextRow label="Label" value={it.label} onChange={(v) => on({ ...it, label: v })} />
                      <PathPicker value={it.to} onChange={(v) => on({ ...it, to: v })} />
                    </Stack>
                    <RepeaterList
                      label="Dropdown items (leave empty for a plain link)"
                      items={it.children}
                      onChange={(children) => on({ ...it, children })}
                      blank={() => ({ label: "", to: "/" })}
                      addLabel="Add sub-item"
                      renderItem={(ch, onCh) => (
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                          <TextRow
                            label="Label"
                            value={ch.label}
                            onChange={(v) => onCh({ ...ch, label: v })}
                          />
                          <PathPicker
                            value={ch.to}
                            onChange={(v) => onCh({ ...ch, to: v })}
                          />
                        </Stack>
                      )}
                    />
                  </Stack>
                )}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Footer — brand block">
              <TextRow
                label="Footer brand name"
                value={footer.brandName}
                onChange={(v) => patchFooter({ ...footer, brandName: v })}
              />
              <TextRow
                label="Brand blurb"
                value={footer.brandBlurb}
                multiline
                minRows={3}
                onChange={(v) => patchFooter({ ...footer, brandBlurb: v })}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Footer — link columns">
              <RepeaterList
                label="Columns"
                items={footer.columns}
                onChange={(columns) => patchFooter({ ...footer, columns })}
                blank={() => ({ heading: "Column", links: [] })}
                addLabel="Add column"
                renderItem={(col, on) => (
                  <Stack spacing={1.5}>
                    <TextRow
                      label="Heading"
                      value={col.heading}
                      onChange={(v) => on({ ...col, heading: v })}
                    />
                    <RepeaterList
                      label="Links"
                      items={col.links}
                      onChange={(links) => on({ ...col, links })}
                      blank={() => ({ label: "", to: "/" })}
                      addLabel="Add link"
                      renderItem={(l, onL) => (
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                          <TextRow label="Label" value={l.label} onChange={(v) => onL({ ...l, label: v })} />
                          <TextRow label="Path" value={l.to} onChange={(v) => onL({ ...l, to: v })} />
                        </Stack>
                      )}
                    />
                  </Stack>
                )}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Footer — contact">
              <TextRow
                label="U.S. office line"
                value={footer.contact.usOfficeLine}
                onChange={(v) =>
                  patchFooter({ ...footer, contact: { ...footer.contact, usOfficeLine: v } })
                }
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextRow
                  label="U.S. phone (display)"
                  value={footer.contact.usPhoneDisplay}
                  onChange={(v) =>
                    patchFooter({ ...footer, contact: { ...footer.contact, usPhoneDisplay: v } })
                  }
                />
                <TextRow
                  label="U.S. phone (tel link)"
                  value={footer.contact.usPhoneTel}
                  onChange={(v) =>
                    patchFooter({ ...footer, contact: { ...footer.contact, usPhoneTel: v } })
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextRow
                  label="Kenya phone (display)"
                  value={footer.contact.kePhoneDisplay}
                  onChange={(v) =>
                    patchFooter({ ...footer, contact: { ...footer.contact, kePhoneDisplay: v } })
                  }
                />
                <TextRow
                  label="Kenya phone (tel link)"
                  value={footer.contact.kePhoneTel}
                  onChange={(v) =>
                    patchFooter({ ...footer, contact: { ...footer.contact, kePhoneTel: v } })
                  }
                />
              </Stack>
              <TextRow
                label="Email"
                value={footer.contact.email}
                onChange={(v) =>
                  patchFooter({ ...footer, contact: { ...footer.contact, email: v } })
                }
              />
              <TextRow
                label="Kenya address (multi-line)"
                value={footer.contact.keAddress}
                multiline
                minRows={2}
                onChange={(v) =>
                  patchFooter({ ...footer, contact: { ...footer.contact, keAddress: v } })
                }
              />
            </CollapsibleSection>

            <CollapsibleSection title="Footer — legal & bottom">
              <TextRow
                label="Legal disclosure"
                value={footer.legalDisclosure}
                multiline
                minRows={4}
                onChange={(v) => patchFooter({ ...footer, legalDisclosure: v })}
              />
              <TextRow
                label="Copyright (use {year} for current year)"
                value={footer.copyright}
                onChange={(v) => patchFooter({ ...footer, copyright: v })}
              />
              <RepeaterList
                label="Bottom links"
                items={footer.bottomLinks}
                onChange={(bottomLinks) => patchFooter({ ...footer, bottomLinks })}
                blank={() => ({ label: "", to: "/" })}
                addLabel="Add link"
                renderItem={(l, on) => (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <TextRow label="Label" value={l.label} onChange={(v) => on({ ...l, label: v })} />
                    <TextRow label="Path" value={l.to} onChange={(v) => on({ ...l, to: v })} />
                  </Stack>
                )}
              />
            </CollapsibleSection>
          </>
        );
      }}
    />
  );
}
