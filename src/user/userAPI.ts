import { clearSession } from "../user/loginApi";
/**
 * Types publics d'utilisateur, correspondant exactement
 * à la réponse de ton endpoint /api/users
 *
 * (select user_id, username, TO_CHAR(last_login, ...) as last_login)
 */
export type PublicUser = {
  user_id: string;
  username: string;
  last_login: string;
};

/**
 * Récupère la liste des utilisateurs publics depuis l'API.
 * 
 * ⚠️ Important :
 *  - Nécessite que l'utilisateur soit connecté.
 *  - Le token de session doit être ajouté dans le header :
 *      Authorization: Bearer <token>
 *
 * En cas d'erreur 401 "UNAUTHORIZED", cela signifie que
 * le token est manquant ou invalide (session expirée).
 */
export async function fetchUsers(token: string): Promise<PublicUser[]> {
  try {
    const res = await fetch("/api/users", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("Fetch users response status:", res.status);

    if (res.status === 401) {
      console.error("Unauthorized: Token might be invalid");
      clearSession();
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText || "Unknown error");
      console.error("fetchUsers failed:", res.status, text);
      throw new Error(`Failed to fetch users: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data as PublicUser[];
  } catch (error) {
    console.error("fetchUsers error:", error);
    throw error;
  }
}
export async function fetchMessages(token: string, kind: "user" | "room", id: string | number) {
  const res = await fetch(`/api/messages?kind=${kind}&id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error("Session expired");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // [{id, from_user_id, to_user_id, room_id, text, created_at}, ...]
}
