import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { UserRoomList } from "./UserRoomList";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { useChatStore } from "../store/chatStore";
import { getSession } from "../user/loginApi";
import { useNavigate } from "react-router-dom"; // Ajoutez cet import

export default function ChatLayout() {
  const { setSessionToken } = useChatStore();
  const navigate = useNavigate(); // Utilisez useNavigate

  useEffect(() => {
  const s = getSession();
  console.log("Session retrieval:", s);
  
  if (!s?.token) {
    console.error("No valid session found");
    navigate("/login");
    return;
  }

  setSessionToken(s.token);
}, [setSessionToken, navigate]);

  // Récupération du token avec vérification
  const token = useChatStore.getState().sessionToken ?? 
               getSession()?.token ?? 
               "";

  // Vérification finale du token
  if (!token) {
    return null; // Ou redirection
  }

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
      <UserRoomList token={token} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <MessageList />
        <MessageComposer token={token} />
      </Box>
    </Box>
  );
}