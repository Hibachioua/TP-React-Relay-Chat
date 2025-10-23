import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, List, ListItemButton, ListItemText, Typography, Alert } from "@mui/material";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useChatStore } from "../store/chatStore";
import { fetchUsers } from "../user/userAPI";
import { useNavigate } from "react-router-dom"; // Importez useNavigate

type Props = {
  token: string;
};

export function UserRoomList({ token }: Props) {
  const { users, setUsers, rooms, setRooms, selected, select } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate(); // Utilisez useNavigate

  useEffect(() => {
    let mounted = true;
    
    const loadUsers = async () => {
      if (!token) {
        console.error("No token provided");
        return;
      }

      setLoading(true);
      setError(undefined);

      try {
        const fetchedUsers = await fetchUsers(token);
        
        if (mounted) {
          setUsers(fetchedUsers);
          // Salons statiques pour démarrer
          setRooms([
            { id: "general", name: "Général" },
            { id: "random", name: "Random" },
          ]);
          setError(undefined);
        }
      } catch (e: any) {
        console.error("Erreur lors du chargement des utilisateurs:", e);
        
        if (e.message === "Session expired") {
          // Redirection explicite en cas d'expiration de session
          navigate("/login");
        } else {
          setError(e.message ?? "Erreur inconnue lors du chargement des utilisateurs");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [token, setUsers, setRooms, navigate]);

  const userItems = useMemo(() => users, [users]);

  return (
    <Box sx={{ width: 300, borderRight: 1, borderColor: "divider", height: "100%", overflow: "auto" }}>
      <Box sx={{ p: 2 }}>
        {/* Gestion des états de chargement et d'erreur */}
        {loading && <Typography sx={{ p: 1 }}>Chargement…</Typography>}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Liste des salons */}
        <Typography variant="subtitle2" color="text.secondary">Salons</Typography>
        <List dense>
          {rooms.map((r) => (
            <ListItemButton
              key={r.id}
              selected={selected?.kind === "room" && selected.id === r.id}
              onClick={() => select({ kind: "room", id: r.id })}
            >
              <GroupOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText primary={r.name} />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Liste des utilisateurs */}
        <Typography variant="subtitle2" color="text.secondary">Utilisateurs</Typography>
        <List dense>
          {userItems.map((u) => (
            <ListItemButton
              key={u.user_id}
              selected={selected?.kind === "user" && selected.id === u.user_id}
              onClick={() => select({ kind: "user", id: u.user_id })}
            >
              <PersonOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              <ListItemText 
                primary={u.username} 
                secondary={u.last_login && `vu ${u.last_login}`} 
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
}