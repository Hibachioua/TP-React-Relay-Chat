// /api/login.js
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

    const { identifier, password } = await request.json(); // 👈 remplace username par identifier
    if (!identifier || !password) {
      return json({ code: 'BAD_REQUEST', message: 'identifiant et mot de passe requis' }, 400);
    }

    const client = await db.connect();

    // 1) On récupère l’utilisateur par username OU email
    const { rows, rowCount } = await client.sql`
      SELECT user_id, username, email, password
      FROM users
      WHERE username = ${identifier} OR email = ${identifier}
      LIMIT 1
    `;
    if (rowCount !== 1) {
      return json({ code: 'UNAUTHORIZED', message: 'Identifiant ou mot de passe incorrect' }, 401);
    }

    const user = rows[0];

    // 2) Re-hash avec le username stocké (pas l’identifier saisi)
    const hashBuf = await crypto.subtle.digest(
      'SHA-256',
      stringToArrayBuffer(user.username + password)
    );
    const hashed64 = arrayBufferToBase64(hashBuf);

    if (hashed64 !== user.password) {
      return json({ code: 'UNAUTHORIZED', message: 'Identifiant ou mot de passe incorrect' }, 401);
    }

    // 3) OK → MAJ last_login + création session
    await client.sql`UPDATE users SET last_login = NOW() WHERE user_id = ${user.user_id}`;

    const token = (crypto.randomUUID?.() || String(Math.random()).slice(2)).replaceAll('-', '');
    await redis.set(token, { id: user.user_id, username: user.username }, { ex: 3600 });

    return json({
      token,
      id: user.user_id,
      username: user.username,
      email: user.email,
      externalId: null,
    });
  } catch (e) {
    console.error('[login] error:', e);
    return json({ code: 'INTERNAL_ERROR', message: 'Une erreur est survenue.' }, 500);
  }
}
