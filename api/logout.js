import { Redis } from '@upstash/redis';
export const config = { runtime: 'edge' };
const redis = Redis.fromEnv();

export default async function handler(request) {
  try {
    // Récupère le token depuis l'en-tête Authorization: Bearer <token>
    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;

    if (!token) {
      return new Response(JSON.stringify({ code: 'NO_TOKEN', message: 'Token manquant' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    await redis.del(token);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ code: 'INTERNAL_ERROR' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
