import { supabase } from './supabaseClient';
import { getProviderKeys, saveProviderKey } from './aiService';

const STORAGE_KEYS = {
  GEMINI: "santuario_theology_gemini_key",
  GROQ: "santuario_theology_groq_key",
  OPENROUTER: "santuario_theology_openrouter_key",
  NVIDIA: "santuario_theology_nvidia_key"
};

/**
 * Obtiene todas las claves configuradas actualmente
 */
export const getAllApiKeys = () => {
  return getProviderKeys();
};

/**
 * Guarda las claves en localStorage y, si el usuario está autenticado, las sincroniza en Supabase Cloud.
 */
export const saveAndSyncAllApiKeys = async (keys, currentUser = null) => {
  // 1. Guardar localmente
  if (keys.gemini !== undefined) saveProviderKey('gemini', keys.gemini);
  if (keys.groq !== undefined) saveProviderKey('groq', keys.groq);
  if (keys.openrouter !== undefined) saveProviderKey('openrouter', keys.openrouter);
  if (keys.nvidia !== undefined) saveProviderKey('nvidia', keys.nvidia);

  // 2. Si hay sesión de usuario, sincronizar en la nube de Supabase
  let syncedToCloud = false;
  try {
    const userToSync = currentUser || (await supabase.auth.getUser()).data?.user;
    if (userToSync) {
      const { error } = await supabase.auth.updateUser({
        data: {
          api_keys: {
            gemini: keys.gemini || '',
            groq: keys.groq || '',
            openrouter: keys.openrouter || '',
            nvidia: keys.nvidia || ''
          }
        }
      });
      if (!error) {
        syncedToCloud = true;
      }
    }
  } catch (err) {
    console.warn('No se pudo sincronizar claves en la nube de Supabase:', err);
  }

  return { success: true, syncedToCloud };
};

/**
 * Carga las claves desde Supabase al iniciar sesión y las respalda en localStorage
 */
export const loadKeysFromCloud = async (user) => {
  if (!user || !user.user_metadata?.api_keys) return null;

  const cloudKeys = user.user_metadata.api_keys;
  let updated = false;

  if (cloudKeys.gemini) {
    saveProviderKey('gemini', cloudKeys.gemini);
    updated = true;
  }
  if (cloudKeys.groq) {
    saveProviderKey('groq', cloudKeys.groq);
    updated = true;
  }
  if (cloudKeys.openrouter) {
    saveProviderKey('openrouter', cloudKeys.openrouter);
    updated = true;
  }
  if (cloudKeys.nvidia) {
    saveProviderKey('nvidia', cloudKeys.nvidia);
    updated = true;
  }

  return updated ? cloudKeys : null;
};
