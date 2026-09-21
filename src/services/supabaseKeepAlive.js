import { supabase } from './supabaseClient';

// ============================================================================
// SUPABASE KEEP-ALIVE SYSTEM
// Previene que el proyecto de Supabase (Free Tier) se congele o suspenda
// por inactividad tras 7 días sin peticiones.
// ============================================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uqnimrjdtytefggkwhfv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbmltcmpkdHl0ZWZnZ2t3aGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTc0MTQsImV4cCI6MjEwNTQ5MzQxNH0.wCxSsMVsfV9g4d8S-VjPVZmiKLerIuBvdVbMzRPdZQc';

/**
 * Realiza un ping ligero al API REST de Supabase para registrar actividad del proyecto
 */
export const pingSupabaseKeepAlive = async () => {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/health?apikey=${SUPABASE_ANON_KEY}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    const isHealthy = res.status >= 200 && res.status < 400;
    const timestamp = new Date().toISOString();
    localStorage.setItem('santuario_supabase_last_ping', timestamp);
    return { success: isHealthy, status: res.status, timestamp };
  } catch (err) {
    console.warn('Keep-alive ping fallback via client:', err);
    try {
      await supabase.auth.getSession();
      const timestamp = new Date().toISOString();
      localStorage.setItem('santuario_supabase_last_ping', timestamp);
      return { success: true, timestamp };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

/**
 * Inicia el temporizador de keep-alive en segundo plano (cada 4 horas)
 */
export const initSupabaseKeepAlive = () => {
  // Ping inmediato al montar
  pingSupabaseKeepAlive();

  // Ping recurrente cada 4 horas (14,400,000 ms)
  const FOUR_HOURS = 4 * 60 * 60 * 1000;
  const intervalId = setInterval(() => {
    pingSupabaseKeepAlive();
  }, FOUR_HOURS);

  return () => clearInterval(intervalId);
};
