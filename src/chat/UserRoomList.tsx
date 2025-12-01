import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, List, ListItemButton, ListItemText, Typography, Alert } from "@mui/material";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useChatStore } from "../store/chatStore";
import { fetchUsers } from "../user/userAPI";
import { useNavigate } from "react-router-dom";
import { fetchMessagesAPI } from "./messageApi";

type Props = { token: string };

export function UserRoomList({ token }: Props) {
  const { users, setUsers, rooms, setRooms, selected, select, setMessagesFor } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const openTarget = async (t: { kind: "user" | "room"; id: string }) => {
    select(t);
    try {
      const rows = await fetchMessagesAPI(token, t);
      const mapped = rows.map((r: any) => ({
        id: String(r.id),
        from: String(r.from_user_id),
        to: t,
        text: r.text,
        at: new Date(r.created_at).toISOString(),
      }));
      setMessagesFor(t, mapped);
    } catch (e) {
      console.error("load thread failed", e);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      if (!token) return;
      setLoading(true);
      setError(undefined);
      try {
        const fetchedUsers = await fetchUsers(token);
        if (mounted) {
          setUsers(fetchedUsers);
          setRooms([
            { id: "general", name: "Général" },
            { id: "random", name: "Random" },
          ]);
        }
      } catch (e: any) {
        if (e.message === "Session expired") navigate("/login");
        else setError(e.message ?? "Erreur inconnue lors du chargement des utilisateurs");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadUsers();
    return () => { mounted = false; };
  }, [token, setUsers, setRooms, navigate]);

  const userItems = useMemo(() => users, [users]);

  return (
    <Box sx={{ width: 300, borderRight: 1, borderColor: "divider", height: "100%", overflow: "auto" }}>
      <Box sx={{ p: 2 }}>
        {loading && <Typography sx={{ p: 1 }}>Chargement…</Typography>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="subtitle2" color="text.secondary">Salons</Typography>
        <List dense>
          {rooms.map((r) => (
            <ListItemButton
              key={r.id}
              selected={selected?.kind === "room" && selected.id === r.id}
              onClick={() => openTarget({ kind: "room", id: r.id })}
            >
              <GroupOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle2" color="text.secondary">Utilisateurs</Typography>
        <List dense>
          {userItems.map((u) => (
            <ListItemButton
              key={u.user_id}
              selected={selected?.kind === "user" && selected.id === u.user_id}
              // ⬇️ 3) utiliser openTarget
              onClick={() => openTarget({ kind: "user", id: u.user_id })}
            >
              <PersonOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary={u.username} secondary={u.last_login && `vu ${u.last_login}`} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}
