import React, { useState } from "react";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";

export function Login() {
  const [error, setError] = useState({} as CustomError);
  const [session, setSession] = useState({} as Session);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(new CustomError(""));
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    // ⬇️ Un seul champ pour username OU email
    const identifier = (data.get("identifier") as string)?.trim();
    const password = (data.get("password") as string) ?? "";

    // Validation minimale côté client
    if (!identifier || !password) {
      setError(new CustomError("Veuillez saisir un identifiant (ou e-mail) et un mot de passe."));
      setLoading(false);
      return;
    }

    // ⬇️ Nouvelle signature: (identifier, password, onResult, onError)
    loginUser(
      identifier,
      password,
      (result: Session) => {
        setSession(result);
        form.reset();
        setError(new CustomError(""));
        setLoading(false);
      },
      (loginError: CustomError) => {
        setError(loginError ?? new CustomError("Échec de connexion."));
        setSession({} as Session);
        setLoading(false);
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        bgcolor: (t) => (t.palette.mode === "light" ? "#f5f7fb" : "background.default"),
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LockOutlined color="primary" />
          <Typography variant="h5" fontWeight={700}>
            Connexion
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Entrez votre identifiant <em>ou</em> e-mail et votre mot de passe.
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            name="identifier"                 // ⬅️ nom de champ unifié
            label="Identifiant ou e-mail"     // ⬅️ libellé explicite
            autoComplete="username"
            fullWidth
            margin="normal"
            size="medium"
          />

          <TextField
            name="password"
            label="Mot de passe"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            fullWidth
            margin="normal"
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPw ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPw((v) => !v)}
                    edge="end"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <FormControlLabel control={<Checkbox name="remember" />} label="Se souvenir de moi" />
            <Button size="small" variant="text">Mot de passe oublié ?</Button>
          </Box>

          {error?.message && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}

          {session?.token && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Connecté·e en tant que <strong>{session.username}</strong>
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.1, textTransform: "none", fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3, textAlign: "center" }}>
          En continuant, vous acceptez nos Conditions d’utilisation et notre Politique de confidentialité.
        </Typography>
      </Paper>
    </Box>
  );
}
