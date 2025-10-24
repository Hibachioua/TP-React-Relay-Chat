// src/chat/MessageList.tsx
import { useEffect, useMemo, useRef } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useChatStore } from "../store/chatStore";

export function MessageList() {
  const { messages, selected, users, meId } = useChatStore();
  const endRef = useRef<HTMLDivElement | null>(null);

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

  // auto-scroll en bas à chaque update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [current.length]);

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {header}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {!selected && (
          <Typography color="text.secondary">
            Choisis un destinataire à gauche.
          </Typography>
        )}
        {selected && current.length === 0 && (
          <Typography color="text.secondary">
            Aucun message pour l’instant.
          </Typography>
        )}

        {current.map((m) => {
          const isMine =
            m.from === "me" || (meId && String(m.from) === String(meId));
          const isRoom = selected?.kind === "room";
          // label émetteur
          let sender = "";
          if (isRoom) {
            if (isMine) {
              sender = useChatStore.getState().meName || "Moi";
            } else {
              const u = users.find((x) => String(x.user_id) === String(m.from));
              sender = u?.username || `Utilisateur ${m.from}`;
            }
          }

          return (
            <Box
              key={m.id}
              sx={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  px: 1.5,
                  py: 1,
                  maxWidth: "75%",
                  bgcolor: isMine ? "primary.main" : "grey.100",
                  color: isMine ? "primary.contrastText" : "text.primary",
                  borderRadius: 2,
                  borderTopLeftRadius: isMine ? 2 : 0,
                  borderTopRightRadius: isMine ? 0 : 2,
                }}
              >
                {/* ⬇️ Afficher l’émetteur pour les salons */}
                {isRoom && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      display: "block",
                      mb: 0.25,
                      textAlign: isMine ? "right" : "left",
                      opacity: 0.95,
                    }}
                  >
                    {sender}
                  </Typography>
                )}

                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.8,
                    display: "block",
                    mb: 0.5,
                    textAlign: isMine ? "right" : "left",
                  }}
                >
                  {new Date(m.at).toLocaleString()}
                </Typography>

                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {m.text}
                </Typography>
              </Paper>
            </Box>
          );
        })}

        <div ref={endRef} />
      </Box>
    </Box>
  );
}
