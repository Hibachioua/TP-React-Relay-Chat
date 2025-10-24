import React, { useState } from "react";
import { Box, IconButton, Paper, TextField, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useChatStore } from "../store/chatStore";
// ⬅️ MessageComposer.tsx est dans src/chat, donc:
import { sendMessageAPI, fetchMessagesAPI } from "./messageApi";

export function MessageComposer() {
  const [text, setText] = useState("");
  const { selected, addMessage, setMessagesFor, sessionToken } = useChatStore();

  const onSend = async () => {
    if (!selected || !text.trim() || !sessionToken) return;

    const sentText = text.trim();

    // optimistic
    const tempId = `temp:${crypto.randomUUID()}`;
    addMessage({
      id: tempId,
      from: "me",
      to: selected,
      text: sentText,
      at: new Date().toISOString(),
    });
    setText("");

    try {
      await sendMessageAPI(sessionToken, selected, sentText);
      const rows = await fetchMessagesAPI(sessionToken, selected);
      const mapped = rows.map((r) => ({
        id: String(r.id),
        from: String(r.from_user_id),
        to: selected,
        text: r.text,
        at: new Date(r.created_at).toISOString(),
      }));
      setMessagesFor(selected, mapped);
    } catch (e) {
      console.error("send failed", e);
      const rows = await fetchMessagesAPI(sessionToken, selected);
      const mapped = rows.map((r) => ({
        id: String(r.id),
        from: String(r.from_user_id),
        to: selected,
        text: r.text,
        at: new Date(r.created_at).toISOString(),
      }));
      setMessagesFor(selected, mapped);
    }
  };

  // Enter envoie, Shift+Enter fait un retour à la ligne
 const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    onSend();
  }
};

  const disabled = !selected || !text.trim() || !sessionToken;

  return (
    <Paper square sx={{ p: 1, borderTop: 1, borderColor: "divider" }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={
            selected ? "Écrire un message…" : "Sélectionnez une conversation…"
          }
          multiline
          maxRows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Tooltip title="Envoyer">
          <span>
            <IconButton color="primary" onClick={onSend} disabled={disabled}>
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
}
