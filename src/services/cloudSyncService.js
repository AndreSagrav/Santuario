import { supabase } from './supabaseClient';
import { getAllApiKeys, loadKeysFromCloud } from './cloudKeysService';

// ============================================================================
// SERVICIO DE SINCRONIZACIÓN UNIVERSAL EN LA NUBE (SUPABASE)
// Garantiza que el usuario pueda abrir su Santuario desde su Tablet, Celular
// o cualquier computadora y ver ABSOLUTAMENTE TODO sin perder ningún dato.
// ============================================================================

let debounceTimer = null;
let isSyncing = false;

/**
 * Recopila todo el estado del usuario localmente
 */
export const collectLocalState = () => {
  // 1. Oraciones del Muro
  const repentance = JSON.parse(localStorage.getItem('santuario_prayer_rep_v7') || 'null');
  const gratitude = JSON.parse(localStorage.getItem('santuario_prayer_grat_v7') || 'null');
  const petitions = JSON.parse(localStorage.getItem('santuario_prayer_pet_v7') || 'null');
  const special = JSON.parse(localStorage.getItem('santuario_prayer_spec_v7') || 'null');
  const checkedIds = JSON.parse(localStorage.getItem('santuario_checked_prayer_ids_v7') || '[]');

  // 2. Diario del Corazón (todas las claves journal_*)
  const journalEntries = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('journal_')) {
      try {
        journalEntries[key] = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        journalEntries[key] = localStorage.getItem(key);
      }
    }
  }

  // 3. Semanas Devocionales Creadas y Semana Activa
  const customWeeks = JSON.parse(localStorage.getItem('santuario_custom_weeks') || '[]');
  const activeWeek = localStorage.getItem('santuario_active_week') || 'semana-1';

  // 4. Claves API Multi-Proveedor
  const apiKeys = getAllApiKeys();

  return {
    prayers: {
      repentance,
      gratitude,
      petitions,
      special,
      checkedIds
    },
    journalEntries,
    customWeeks,
    activeWeek,
    apiKeys,
    lastSyncedAt: new Date().toISOString()
  };
};

/**
 * Guarda y sube todo el estado completo a Supabase Cloud
 */
export const pushFullStateToSupabase = async (providedUser = null) => {
  if (isSyncing) return { success: false, reason: 'in-progress' };
  
  try {
    isSyncing = true;
    let user = providedUser;
    if (!user) {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    }

    if (!user) {
      isSyncing = false;
      return { success: false, reason: 'no-user' };
    }

    const state = collectLocalState();

    // Guardar en user_metadata de Supabase Auth (Persistencia nube inmediata sin depender de tablas SQL)
    const { error } = await supabase.auth.updateUser({
      data: {
        santuario_cloud_state: state,
        api_keys: state.apiKeys,
        santuario_last_sync: state.lastSyncedAt
      }
    });

    if (error) throw error;

    isSyncing = false;
    // Notificar a la interfaz del éxito
    window.dispatchEvent(new CustomEvent('santuario-cloud-save-success', { detail: state.lastSyncedAt }));
    return { success: true, timestamp: state.lastSyncedAt };
  } catch (err) {
    isSyncing = false;
    console.warn('Aviso de sincronización Supabase:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Descarga todo el estado desde Supabase y lo restaura localmente
 */
export const pullFullStateFromSupabase = async (user) => {
  if (!user || !user.user_metadata?.santuario_cloud_state) {
    return false;
  }

  try {
    const cloud = user.user_metadata.santuario_cloud_state;

    // 1. Restaurar Muro de Oración si viene en la nube
    if (cloud.prayers) {
      if (cloud.prayers.repentance) {
        localStorage.setItem('santuario_prayer_rep_v7', JSON.stringify(cloud.prayers.repentance));
      }
      if (cloud.prayers.gratitude) {
        localStorage.setItem('santuario_prayer_grat_v7', JSON.stringify(cloud.prayers.gratitude));
      }
      if (cloud.prayers.petitions) {
        localStorage.setItem('santuario_prayer_pet_v7', JSON.stringify(cloud.prayers.petitions));
      }
      if (cloud.prayers.special) {
        localStorage.setItem('santuario_prayer_spec_v7', JSON.stringify(cloud.prayers.special));
      }
      if (Array.isArray(cloud.prayers.checkedIds)) {
        localStorage.setItem('santuario_checked_prayer_ids_v7', JSON.stringify(cloud.prayers.checkedIds));
      }
    }

    // 2. Restaurar Diario del Corazón
    if (cloud.journalEntries && typeof cloud.journalEntries === 'object') {
      Object.entries(cloud.journalEntries).forEach(([k, v]) => {
        localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
      });
    }

    // 3. Restaurar Semanas Creadas y Semana Activa
    if (cloud.customWeeks && Array.isArray(cloud.customWeeks)) {
      localStorage.setItem('santuario_custom_weeks', JSON.stringify(cloud.customWeeks));
    }
    if (cloud.activeWeek) {
      localStorage.setItem('santuario_active_week', cloud.activeWeek);
    }

    // 4. Restaurar Claves API
    if (cloud.apiKeys) {
      await loadKeysFromCloud(user);
    }

    // 5. Emitir evento para que toda la interfaz se actualice de inmediato
    window.dispatchEvent(new CustomEvent('santuario-cloud-synced', { detail: cloud }));
    return true;
  } catch (err) {
    console.error('Error restaurando estado desde Supabase:', err);
    return false;
  }
};

/**
 * Programa una sincronización automática con debounce para evitar llamadas excesivas
 */
export const triggerAutoCloudSync = (delay = 800) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    pushFullStateToSupabase();
  }, delay);
};
