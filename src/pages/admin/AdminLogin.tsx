import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/auth/AuthContext";
import { ApiError } from "@/api/client";
import Seo from "@/components/ui/Seo";
import Logo from "@/components/ui/Logo";

export default function AdminLogin() {
  const { token, login } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (token) {
    const from = (loc.state as { from?: string } | null)?.from || "/admin";
    return <Navigate to={from} replace />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username.trim(), password);
      const from = (loc.state as { from?: string } | null)?.from || "/admin";
      navigate(from, { replace: true });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setError("Invalid username or password.");
      else setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Seo title="Admin sign in" pathname="/admin/login" />
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", bgcolor: "background.default" }}>
        <Container maxWidth="xs">
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Logo size={32} />
                <Box>
                  <Typography variant="h5" sx={{ fontFamily: '"Lora", serif', fontWeight: 700 }}>
                    NTI Admin
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sign in to continue
                  </Typography>
                </Box>
              </Stack>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Box component="form" onSubmit={submit}>
                <Stack spacing={2}>
                  <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                    autoComplete="username"
                  />
                  <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <Button type="submit" variant="contained" size="large" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
