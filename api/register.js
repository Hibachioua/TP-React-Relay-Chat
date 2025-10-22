// /api/register.js
import { db } from '@vercel/postgres';
import { Redis } from '@upstash/redis';
import { arrayBufferToBase64, stringToArrayBuffer } from '../lib/base64';

export const config = { runtime: 'edge' };
const redis = Redis.fromEnv();

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export default async function handler(request) {
  try {
    if (request.method !== 'POST') {
      return json({ code: 'METHOD_NOT_ALLOWED', message: 'Use POST' }, 405);
    }

    const { username, password, email } = await request.json();

    // --- validations ---
    if (!username || !password || !email) {
      return json({ code: 'BAD_REQUEST', message: 'username, email et password sont requis' }, 400);
    }
    if (password.length < 8) {
      return json({ code: 'WEAK_PASSWORD', message: 'Mot de passe trop court (≥8)' }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ code: 'INVALID_EMAIL', message: 'Adresse e-mail invalide' }, 400);
    }

    // --- hash comme /api/login: SHA-256(username + password) -> base64 ---
    const hashBuf = await crypto.subtle.digest(
      'SHA-256',
      stringToArrayBuffer(username + password)
    );
    const hashed64 = arrayBufferToBase64(hashBuf);

    const client = await db.connect();

    // unicité username/email
    const { rowCount: userExists } = await client.sql`
      SELECT 1 FROM users WHERE username = ${username} LIMIT 1
    `;
    if (userExists > 0) {
      return json({ code: 'USERNAME_TAKEN', message: 'Identifiant déjà utilisé' }, 409);
    }
    const { rowCount: emailExists } = await client.sql`
      SELECT 1 FROM users WHERE email = ${email} LIMIT 1
    `;
    if (emailExists > 0) {
      return json({ code: 'EMAIL_TAKEN', message: 'Adresse e-mail déjà utilisée' }, 409);
    }

    // champs obligatoires du schéma
    const now = new Date();
    const createdOn = now.toISOString();
    const lastLogin = createdOn;
    const externalId = (crypto.randomUUID?.() || String(Math.random()).slice(2)).replaceAll('-', ''); // ≤ 32 chars

    // --- insertion conforme ---
    const { rows } = await client.sql`
      INSERT INTO users (username, password, email, created_on, last_login, external_id)
      VALUES (${username}, ${hashed64}, ${email}, ${createdOn}, ${lastLogin}, ${externalId})
      RETURNING user_id, username, email, external_id
    `;
    const row = rows[0];

    // --- session redis (1h) ---
    const token = (crypto.randomUUID?.() || String(Math.random()).slice(2)).replaceAll('-', '');
    await redis.set(token, { id: row.user_id, username: row.username }, { ex: 3600 });

    return json(
      {
        token,
        id: row.user_id,
        username: row.username,
        email: row.email,
        externalId: row.external_id,
      },
      201
    );
  } catch (e) {
    console.error('[register] error:', e);
    return json({ code: 'INTERNAL_ERROR', message: 'Une erreur est survenue.' }, 500);
  }
}
