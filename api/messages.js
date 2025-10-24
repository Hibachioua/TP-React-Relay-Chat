// /api/messages.js
import { sql } from "@vercel/postgres";
import { getConnecterUser } from "../lib/session";

export const config = { runtime: "edge" };

export default async function handler(request) {
  try {
    if (request.method !== "GET") {
      return new Response(JSON.stringify({ code: "METHOD_NOT_ALLOWED" }), {
        status: 405,
        headers: { "content-type": "application/json" },
      });
    }

    const me = await getConnecterUser(request);
    if (!me) {
      return new Response(JSON.stringify({ code: "UNAUTHORIZED", message: "Session expired" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind"); // "user" | "room"
    const id = searchParams.get("id");     // user_id ou room_id

    if (!kind || !id) {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "kind & id requis" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    let rows = [];
    if (kind === "user") {
      const peer = Number(id);
      const res = await sql`
        SELECT id, from_user_id, to_user_id, room_id, text, created_at
        FROM messages
        WHERE
          (from_user_id = ${me.id} AND to_user_id = ${peer})
          OR
          (from_user_id = ${peer} AND to_user_id = ${me.id})
        ORDER BY created_at ASC;
      `;
      rows = res.rows;
    } else if (kind === "room") {
      const room = String(id);
      const res = await sql`
        SELECT id, from_user_id, to_user_id, room_id, text, created_at
        FROM messages
        WHERE room_id = ${room}
        ORDER BY created_at ASC;
      `;
      rows = res.rows;
    } else {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "kind invalide" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error("[messages] error:", e);
    return new Response(JSON.stringify({ code: "INTERNAL_ERROR" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
