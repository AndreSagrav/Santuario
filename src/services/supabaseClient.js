import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uqnimrjdtytefggkwhfv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbmltcmpkdHl0ZWZnZ2t3aGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTc0MTQsImV4cCI6MjEwNTQ5MzQxNH0.wCxSsMVsfV9g4d8S-VjPVZmiKLerIuBvdVbMzRPdZQc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
