import React, { useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useChatStore } from "../store/chatStore";

export function MessageList() {
  const { messages, selected, users } = useChatStore();

  const current = useMemo(() => {
    if (!selected) return [];
    return messages
      .filter((m) => m.to.kind === selected.kind && m.to.id === selected.id)
      .sort((a, b) => a.at.localeCompare(b.at));
  }, [messages, selected]);

  const header = useMemo(() => {
    if (!selected) return "Sélectionnez un salon ou un utilisateur";
    if (selected.kind === "room") return `# ${selected.id}`;
    const u = users.find((x) => x.user_id === selected.id);
    return u ? u.username : "Conversation";
  }, [selected, users]);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={700}>{header}</Typography>
      </Box>
      <Box sx={{ flex: 1, p: 2, overflow: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
        {!selected && (
          <Typography color="text.secondary">Choisis un destinataire à gauche.</Typography>
        )}
        {selected && current.length === 0 && (
          <Typography color="text.secondary">Aucun message pour l’instant.</Typography>
        )}
        {current.map((m) => (
          <Paper key={m.id} variant="outlined" sx={{ p: 1.2 }}>
            <Typography variant="caption" color="text.secondary">{new Date(m.at).toLocaleString()}</Typography>
            <Typography sx={{ whiteSpace: "pre-wrap" }}>{m.text}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
