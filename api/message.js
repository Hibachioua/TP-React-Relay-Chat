// /api/message.js
import { sql } from "@vercel/postgres";
import { getConnecterUser, triggerNotConnected } from "../lib/session";

export const config = { runtime: "edge" };

export default async function handler(request) {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ code: "METHOD_NOT_ALLOWED" }), {
        status: 405,
        headers: { "content-type": "application/json" },
      });
    }

    const user = await getConnecterUser(request);
    if (!user) {
      // 401 uniforme avec tes autres endpoints
      return new Response(JSON.stringify({ code: "UNAUTHORIZED", message: "Session expired" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const { to, text } = await request.json(); // <-- important (et pas request.body)
    if (!to || !text || !text.trim()) {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "to + text requis" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const now = new Date().toISOString();

    // Deux modes: DM (to.kind === "user") ou salon (to.kind === "room")
    let row;
    if (to.kind === "user") {
      const toUserId = Number(to.id);
      const { rows } = await sql`
        INSERT INTO messages (from_user_id, to_user_id, room_id, text, created_at)
        VALUES (${user.id}, ${toUserId}, NULL, ${text.trim()}, ${now})
        RETURNING id, from_user_id, to_user_id, room_id, text, created_at;
      `;
      row = rows[0];
    } else if (to.kind === "room") {
      const roomId = String(to.id);
      const { rows } = await sql`
        INSERT INTO messages (from_user_id, to_user_id, room_id, text, created_at)
        VALUES (${user.id}, NULL, ${roomId}, ${text.trim()}, ${now})
        RETURNING id, from_user_id, to_user_id, room_id, text, created_at;
      `;
      row = rows[0];
    } else {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "to.kind invalide" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify(row), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("[message] error:", error);
    return new Response(JSON.stringify({ code: "INTERNAL_ERROR" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
