import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SectionHeading from "@/components/ui/SectionHeading";
import Seo from "@/components/ui/Seo";
import { sendVolunteer } from "@/api/donations";

export default function Volunteer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    availability: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await sendVolunteer({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        location: form.location || undefined,
        skills: form.skills,
        availability: form.availability || undefined,
        message: form.message || undefined,
      });

      setStatus("sent");

      setForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        skills: "",
        availability: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Seo
        title="Volunteer"
        description="Volunteer your skills with NTI — mentorship, training, content, finance, design, or in-country support in Kenya."
        pathname="/volunteer"
      />

      <Container sx={{ py: { xs: 8, md: 12 } }} maxWidth="md">
        <SectionHeading
          align="center"
          eyebrow="Volunteer"
          title="Lend your skills."
          subtitle="Tell us what you can offer and how you'd like to engage — remote or in-country in Kenya."
        />

        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box
              component="form"
              onSubmit={submit}
              aria-label="Volunteer signup form"
            >
              <Stack spacing={2.5}>
                <TextField
                  label="Full name"
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
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />

                <TextField
                  label="City / Country"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                />

                <TextField
                  label="Skills & background"
                  required
                  multiline
                  minRows={3}
                  helperText="E.g. teaching, mentoring, finance, design, healthcare, project management."
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                />

                <TextField
                  label="Availability"
                  helperText="Hours per week, remote vs in-country, dates."
                  value={form.availability}
                  onChange={(e) => update("availability", e.target.value)}
                />

                <TextField
                  label="Anything else?"
                  multiline
                  minRows={3}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                />

                {status === "sent" && (
                  <Alert severity="success">
                    Thank you — we'll review your details and be in touch.
                  </Alert>
                )}

                {status === "error" && (
                  <Alert severity="error">
                    Something went wrong. Please try again.
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={status === "submitting"}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {status === "submitting" ? "Sending…" : "Submit"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Typography
          sx={{ mt: 4, color: "text.secondary" }}
          variant="body2"
        >
          Prefer email? Write to{" "}
          <a href="mailto:info@northerntransformationinitiative.org">
            info@northerntransformationinitiative.org
          </a>.
        </Typography>
      </Container>
    </>
  );
}
