import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveSession } from "./loginApi";
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
  const [error, setError] = useState<CustomError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setError(null);
    setIsLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    const identifier = (data.get("identifier") as string)?.trim();
    const password = (data.get("password") as string)?.trim() ?? "";

    if (!identifier || !password) {
      setError(new CustomError("Veuillez saisir un identifiant et un mot de passe."));
      setIsLoading(false);
      return;
    }

    loginUser(
      identifier,
      password,
    
      (result: Session) => {
        try {
                    saveSession(result);
          
          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("username", result.username);
          
          
          form.reset();
          
          setIsLoading(false);
          navigate("/chat");
        } catch (e) {
          setError(new CustomError("Erreur technique lors de la connexion."));
          setIsLoading(false);
        }
      },
      
      (loginError: CustomError) => {
        setError(loginError ?? new CustomError("Échec de connexion."));
        setIsLoading(false);
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
        {/* En-tête du formulaire */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LockOutlined color="primary" />
          <Typography variant="h5" fontWeight={700}>
            Connexion
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Entrez votre identifiant <em>ou</em> e-mail et votre mot de passe.
        </Typography>

        {/* Formulaire */}
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            name="identifier"
            label="Identifiant ou e-mail"
            autoComplete="username"
            fullWidth
            margin="normal"
            size="medium"
            required
          />

          <TextField
            name="password"
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            fullWidth
            margin="normal"
            size="medium"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword(prev => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Options supplémentaires */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <FormControlLabel 
              control={<Checkbox name="remember" />} 
              label="Se souvenir de moi" 
            />
            <Button size="small" variant="text">
              Mot de passe oublié ?
            </Button>
          </Box>

          {/* Gestion des erreurs */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.message}
            </Alert>
          )}

          {/* Bouton de connexion */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ 
              mt: 3, 
              py: 1.1, 
              textTransform: "none", 
              fontWeight: 600 
            }}
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </Box>

        {/* Conditions d'utilisation */}
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: "block", 
            mt: 3, 
            textAlign: "center" 
          }}
        >
          En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
        </Typography>
      </Paper>
    </Box>
  );
}