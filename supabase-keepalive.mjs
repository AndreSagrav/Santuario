/**
 * Santuario Devocional - Supabase Standalone Keep-Alive Script
 * Ejecuta: node supabase-keepalive.mjs
 * Corre consultas reales a Postgres y Auth para evitar pausado por inactividad.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uqnimrjdtytefggkwhfv.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbmltcmpkdHl0ZWZnZ2t3aGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTc0MTQsImV4cCI6MjEwNTQ5MzQxNH0.wCxSsMVsfV9g4d8S-VjPVZmiKLerIuBvdVbMzRPdZQc';

async function pingEndpoint(name, url, headers = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'GET', headers });
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${name} -> Status ${res.status} (${ms}ms)`);
    return res.status;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error en ${name}:`, err.message);
    return 500;
  }
}

async function runKeepAlive() {
  console.log(`[${new Date().toISOString()}] Iniciando Keep-Alive para: ${SUPABASE_URL}`);

  // 1. Ping a la base de datos (PostgREST / PostgreSQL) - Esto cuenta como actividad DB
  await pingEndpoint('Database (PostgREST root)', `${SUPABASE_URL}/rest/v1/`, {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`
  });

  await pingEndpoint('Database (Profiles query)', `${SUPABASE_URL}/rest/v1/profiles?select=count`, {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Prefer: 'count=exact'
  });

  // 2. Ping a Auth service
  await pingEndpoint('Auth Service', `${SUPABASE_URL}/auth/v1/health?apikey=${SUPABASE_ANON_KEY}`);

  console.log(`[${new Date().toISOString()}] ✅ Ciclo de Keep-Alive completado.`);
}

runKeepAlive();
