/**
 * Santuario Devocional - Supabase Standalone Keep-Alive Script
 * Ejecuta este script con: node supabase-keepalive.mjs
 * O prográmalo en cron / GitHub Actions para ping cada 3 días.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://uqnimrjdtytefggkwhfv.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbmltcmpkdHl0ZWZnZ2t3aGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTc0MTQsImV4cCI6MjEwNTQ5MzQxNH0.wCxSsMVsfV9g4d8S-VjPVZmiKLerIuBvdVbMzRPdZQc';

async function runKeepAlive() {
  console.log(`[${new Date().toISOString()}] Enviando ping de keep-alive a Supabase...`);
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/health?apikey=${SUPABASE_ANON_KEY}`, {
      method: 'GET'
    });

    console.log(`[${new Date().toISOString()}] Respuesta de Supabase HTTP Status: ${res.status}`);
    if (res.status >= 200 && res.status < 400) {
      console.log('✅ Proyecto Supabase activo y saludable. No se suspenderá.');
    } else {
      console.warn('⚠️ Supabase respondió con código no estándar, pero la petición registró actividad en el proyecto.');
    }
  } catch (err) {
    console.error('❌ Error conectando a Supabase:', err.message);
  }
}

runKeepAlive();
