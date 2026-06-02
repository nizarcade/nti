import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import SectionHeading from "@/components/ui/SectionHeading";
import Seo from "@/components/ui/Seo";
import { sendContact } from "@/api/donations";
import { siteContact } from "@/content/site";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await sendContact({
        name: form.name,
        email: form.email,
        subject: form.subject || undefined,
        message: form.message,
      });
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Seo title="Contact" description="Reach NTI in Nairobi, Kenya or Boston, MA." pathname="/contact" />
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading
          eyebrow="Contact"
          title="We'd be glad to hear from you."
          subtitle="For partnership inquiries, volunteer interest, or general questions — send a note."
        />
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box component="form" onSubmit={submit}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Your name"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    <TextField
                      label="Subject"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                    />
                    <TextField
                      label="Message"
                      multiline
                      minRows={5}
                      required
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                    {status === "sent" && (
                      <Alert severity="success">Thanks — we'll be in touch soon.</Alert>
                    )}
                    {status === "error" && (
                      <Alert severity="error">Something went wrong. Please try again.</Alert>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={status === "submitting"}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      {status === "submitting" ? "Sending…" : "Send message"}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5">Kenya Office</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1.5}>
                    <PlaceIcon color="primary" />
                    <Typography>{siteContact.keAddress}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5}>
                    <EmailIcon color="primary" />
                    <Link href={`mailto:${siteContact.email}`}>{siteContact.email}</Link>
                  </Stack>
                  <Stack direction="row" spacing={1.5}>
                    <PhoneIcon color="primary" />
                    <Link href={`tel:${siteContact.kePhoneTel}`}>{siteContact.kePhoneDisplay}</Link>
                  </Stack>
                </Stack>

                <Typography variant="h5" sx={{ mt: 4 }}>U.S. Office</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1.5}>
                    <PlaceIcon color="primary" />
                    <Typography>{siteContact.usOffice}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5}>
                    <PhoneIcon color="primary" />
                    <Link href={`tel:${siteContact.usPhoneTel}`}>{siteContact.usPhoneDisplay}</Link>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
