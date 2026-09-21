-- ============================================================================
-- SANTUARIO - ESQUEMA DE SEGURIDAD EXTREMA Y POLÍTICAS RLS (PostgreSQL / Supabase)
-- ============================================================================
-- Este script implementa aislamiento estricto de datos multi-inquilino (Multi-tenant).
-- Ningún usuario puede ver, modificar o eliminar datos de otro usuario bajo ninguna circunstancia.

-- 1. TABLA DE PERFILES DE USUARIO
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en perfiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios solo pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios solo pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. TABLA DEL MURO DE ORACIÓN & MILAGROS
CREATE TABLE IF NOT EXISTS public.prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Fe',
  days_count INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'answered')),
  answered_date TEXT,
  testimony TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en oraciones
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aislamiento estricto: Solo el autor ve sus peticiones"
  ON public.prayers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Aislamiento estricto: Solo el autor crea peticiones para sí mismo"
  ON public.prayers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Aislamiento estricto: Solo el autor actualiza sus peticiones"
  ON public.prayers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Aislamiento estricto: Solo el autor elimina sus peticiones"
  ON public.prayers FOR DELETE
  USING (auth.uid() = user_id);

-- 3. TABLA DEL DIARIO DEL CORAZÓN (CONFIDENCIALIDAD TOTAL)
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  devotional_id TEXT NOT NULL,
  prompt_index INTEGER NOT NULL DEFAULT 0,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, devotional_id, prompt_index)
);

-- Habilitar RLS en diario del corazón
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aislamiento estricto: Diario 100% privado del autor"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Aislamiento estricto: Solo el autor inserta en su diario"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Aislamiento estricto: Solo el autor edita su diario"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Aislamiento estricto: Solo el autor borra su diario"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- 4. TRIGGER AUTOMÁTICO: Creación de perfil al registrarse nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices de alto rendimiento para consultas seguras
CREATE INDEX IF NOT EXISTS idx_prayers_user_id ON public.prayers(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON public.journal_entries(user_id);
