import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

/**
 * NavBar principale de l’application
 * - Utilise Material UI
 * - Fournit la navigation entre Login et Register
 */
export function NavBar() {
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      color="primary"
      sx={{
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.background.paper,
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {/* Logo ou titre */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
          <IconButton color="inherit" edge="start" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            MyApp
          </Typography>
        </Box>

        {/* Liens de navigation */}
        <Button color="inherit" component={RouterLink} to="/login">
          Connexion
        </Button>
        <Button color="inherit" component={RouterLink} to="/register">
          Inscription
        </Button>
      </Toolbar>
    </AppBar>
  );
}
