// src/user/Register.tsx
import React, { useState } from "react";
import { registerUser } from "./registerApi"; // à implémenter plus tard
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
import { Visibility, VisibilityOff, PersonAddAlt1 } from "@mui/icons-material";

export function Register() {
  const [error, setError] = useState({} as CustomError);
  const [session, setSession] = useState({} as Session);
  const [loading, setLoading] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const validateEmail = (val: string) =>
    !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(new CustomError(""));
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    const username = (data.get("username") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const password = (data.get("password") as string) ?? "";
    const confirm = (data.get("confirm") as string) ?? "";
    const accepted = !!data.get("terms");

    // Validations minimales côté client (dans l'esprit de Login.tsx)
    if (!username || !password) {
      setError(
        new CustomError("Veuillez saisir un identifiant et un mot de passe.")
      );
      setLoading(false);
      return;
    }
    if (!validateEmail(email ?? "")) {
      setError(new CustomError("Adresse e-mail invalide."));
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError(
        new CustomError("Le mot de passe doit contenir au moins 8 caractères.")
      );
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError(new CustomError("Les mots de passe ne correspondent pas."));
      setLoading(false);
      return;
    }
    if (!accepted) {
      setError(
        new CustomError("Veuillez accepter les conditions d’utilisation.")
      );
      setLoading(false);
      return;
    }

    // Appel API d'inscription (même pattern que loginUser de Login.tsx)
    registerUser(
      { user_id: -1, username, password, email },
      (result: Session) => {
        setSession(result);
        form.reset();
        setError(new CustomError(""));
        setLoading(false);
      },
      (registerError: CustomError) => {
        setError(
          registerError ?? new CustomError("Échec de création de compte.")
        );
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
        bgcolor: (t) =>
          t.palette.mode === "light" ? "#f5f7fb" : "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <PersonAddAlt1 color="primary" />
          <Typography variant="h5" fontWeight={700}>
            Créer un compte
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Renseignez vos informations pour accéder à votre espace.
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="Identifiant"
            autoComplete="username"
            fullWidth
            margin="normal"
            size="medium"
          />

          <TextField
            name="email"
            label="E-mail"
            type="email"
            autoComplete="email"
            fullWidth
            required // <== important
            margin="normal"
            size="medium"
          />

          <TextField
            name="password"
            label="Mot de passe"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            fullWidth
            margin="normal"
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPw
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    onClick={() => setShowPw((v) => !v)}
                    edge="end"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="Au moins 8 caractères."
          />

          <TextField
            name="confirm"
            label="Confirmer le mot de passe"
            type={showPw2 ? "text" : "password"}
            autoComplete="new-password"
            fullWidth
            margin="normal"
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPw2
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    onClick={() => setShowPw2((v) => !v)}
                    edge="end"
                  >
                    {showPw2 ? <VisibilityOff /> : <Visibility />}
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
            <FormControlLabel
              control={<Checkbox name="terms" />}
              label="J’accepte les conditions d’utilisation"
            />
          </Box>

          {error?.message && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}

          {session?.token && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Compte créé ! Connecté·e en tant que{" "}
              <strong>{session.username}</strong>
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
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 3, textAlign: "center" }}
        >
          En créant un compte, vous acceptez nos Conditions d’utilisation et
          notre Politique de confidentialité.
        </Typography>
      </Paper>
    </Box>
  );
}
