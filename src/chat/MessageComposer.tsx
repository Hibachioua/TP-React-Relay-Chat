import React, { useState } from "react";
import { Box, IconButton, Paper, TextField, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useChatStore } from "../store/chatStore";

type Props = { token: string };

export function MessageComposer({ token }: Props) {
  const { selected, addMessage } = useChatStore();
  const [text, setText] = useState("");

  const disabled = !selected || text.trim().length === 0;

  const send = async () => {
    if (!selected) return;

    // Appel backend d’envoi (ex: /api/message)
    // Ton backend current message.js lit le body et TODO: save
    const res = await fetch("/api/message", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`, // 🔐 IMPORTANT
      },
      body: JSON.stringify({
        to: selected,
        text,
      }),
    });

    if (res.status === 401) {
      alert("Session expirée (401). Reconnecte-toi.");
      return;
    }
    if (!res.ok) {
      const t = await res.text();
      alert(`Erreur envoi: ${res.status} ${t}`);
      return;
    }

    // Optimistic UI
    addMessage({
      id: crypto.randomUUID(),
      from: "me", // ou l’id utilisateur courant si tu l’as
      to: selected,
      text: text.trim(),
      at: new Date().toISOString(),
    });
    setText("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) send();
    }
  };

  return (
    <Paper square sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={selected ? "Écrire un message…" : "Sélectionnez une conversation…"}
          multiline
          maxRows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Tooltip title="Envoyer">
          <span>
            <IconButton color="primary" onClick={send} disabled={disabled}>
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
}
