import { supabase } from './supabaseClient';

// ============================================================================
// SERVICIO DE SINCRONIZACIÓN NUBE CON SEGURIDAD EXTREMA
// ============================================================================

export const cloudSync = {
  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user || null;
    } catch (e) {
      return null;
    }
  },

  // ORACIONES: Cargar
  async fetchPrayers(localFallback) {
    const user = await this.getCurrentUser();
    if (!user) {
      return localFallback;
    }

    try {
      const { data, error } = await supabase
        .from('prayers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data && data.length > 0) ? data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        daysCount: p.days_count || 1,
        dateAdded: new Date(p.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: p.status,
        answeredDate: p.answered_date,
        testimony: p.testimony
      })) : localFallback;
    } catch (e) {
      console.warn("Fallo al consultar Supabase, usando local:", e);
      return localFallback;
    }
  },

  // ORACIONES: Crear
  async savePrayer(prayer) {
    const user = await this.getCurrentUser();
    if (!user) return prayer;

    try {
      const { data, error } = await supabase
        .from('prayers')
        .insert([{
          user_id: user.id,
          title: prayer.title,
          category: prayer.category,
          days_count: prayer.daysCount || 1,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return { ...prayer, id: data.id };
    } catch (e) {
      console.warn("Error guardando en Supabase:", e);
      return prayer;
    }
  },

  // ORACIONES: Marcar como milagro respondido
  async markAnswered(prayerId, testimony) {
    const user = await this.getCurrentUser();
    if (!user) return;

    try {
      await supabase
        .from('prayers')
        .update({
          status: 'answered',
          answered_date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          testimony: testimony
        })
        .eq('id', prayerId);
    } catch (e) {
      console.warn("Error actualizando en Supabase:", e);
    }
  },

  // ORACIONES: Eliminar
  async deletePrayer(prayerId) {
    const user = await this.getCurrentUser();
    if (!user) return;

    try {
      await supabase
        .from('prayers')
        .delete()
        .eq('id', prayerId);
    } catch (e) {
      console.warn("Error eliminando en Supabase:", e);
    }
  },

  // DIARIO: Guardar respuestas
  async saveJournalEntry(devotionalId, promptIndex, answerText) {
    const user = await this.getCurrentUser();
    if (!user) return;

    try {
      await supabase
        .from('journal_entries')
        .upsert({
          user_id: user.id,
          devotional_id: devotionalId,
          prompt_index: promptIndex,
          answer: answerText,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id, devotional_id, prompt_index'
        });
    } catch (e) {
      console.warn("Error guardando diario en Supabase:", e);
    }
  }
};
