// src/components/NavBar.tsx
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar, Toolbar, Button, Box, Typography, useTheme, IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { getSession } from "../user/loginApi";
import Logout from "../user/Logout"; // ⬅️ import default

export function NavBar() {
  const theme = useTheme();
  const [session, setSession] = useState(getSession());

  useEffect(() => {
    const onChange = () => setSession(getSession());
    window.addEventListener("session-changed", onChange);
    return () => window.removeEventListener("session-changed", onChange);
  }, []);

  const isLogged = !!session?.token;

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
          <IconButton color="inherit" edge="start" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            MyApp
          </Typography>
        </Box>

        {isLogged ? (
          <>
            <Typography sx={{ mr: 2 }}>
              Bonjour <strong>{session?.username}</strong>
            </Typography>
            <Logout />
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">
              Connexion
            </Button>
            <Button color="inherit" component={RouterLink} to="/register">
              Inscription
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
