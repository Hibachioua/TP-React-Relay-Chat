// src/user/Logout.tsx
import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clearSession } from "./loginApi";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Se déconnecter
    </Button>
  );
}
