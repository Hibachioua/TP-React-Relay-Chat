// src/chat/ChatLayout.tsx
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { UserRoomList } from "./UserRoomList";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { useChatStore } from "../store/chatStore";
import { getSession } from "../user/loginApi";
import { useNavigate } from "react-router-dom";

export default function ChatLayout() {
  const { setSessionToken, setMeId, setMeName } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    const s = getSession(); // { token, id, username, ... }
    if (!s?.token) {
      navigate("/login");
      return;
    }

    // Alimente le store
    setSessionToken(s.token);
    // ⚠️ ton backend renvoie "id", donc on l’utilise tel quel
    if (s.id != null) setMeId(String(s.id));
    if (s.username) setMeName(s.username);
  }, [setSessionToken, setMeId,setMeName, navigate]);

  // Source unique de vérité pour le token
  const token =
    useChatStore.getState().sessionToken ??
    getSession()?.token ??
    "";

  if (!token) return null;

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
      {/* Colonne gauche : salons + users */}
      <UserRoomList token={token} />
      {/* Colonne droite : messages + composer */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <MessageList />
        <MessageComposer />
      </Box>
    </Box>
  );
}
