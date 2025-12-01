import type { Target } from "../store/chatStore";

export type RawRow = {
  id: string | number;
  from_user_id: string | number;
  to_user_id?: string | number | null;
  room_id?: string | null;
  text: string;
  created_at: string; 
};

export async function fetchMessagesAPI(
  token: string,
  target: Target
): Promise<RawRow[]> {
  const url = `/api/messages?kind=${target.kind}&id=${target.id}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GET /api/messages ${res.status}`);
  return res.json();
}

export async function sendMessageAPI(
  token: string,
  target: Target,
  text: string
): Promise<RawRow> {
  const res = await fetch("/api/message", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ to: target, text }),
  });
  if (!res.ok) throw new Error(`POST /api/message ${res.status}`);
  return res.json();
}
