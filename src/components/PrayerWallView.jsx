import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  RotateCcw, 
  Music, 
  Volume2, 
  Check, 
  Trash2, 
  X 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_REPENTANCE, 
  INITIAL_GRATITUDE, 
  INITIAL_PETITIONS, 
  INITIAL_SPECIAL_PETITIONS 
} from '../data/userPrayerData';
import { enhanceAndClassifyPrayer } from '../services/aiService';
import { sacredAudio } from '../services/sacredAudioEngine';
import { SOUNDSCAPES_DATA } from '../data/soundscapesData';
import { triggerAutoCloudSync } from '../services/cloudSyncService';

export default function PrayerWallView() {
  // Las 4 Categorías canónicas exclusivas del usuario:
  // 'arrepentimiento' | 'agradecimiento' | 'peticiones' | 'peticiones_especiales'
  const [activeTab, setActiveTab] = useState('arrepentimiento');

  // Estado persistente con las peticiones del usuario
  const [repentanceList, setRepentanceList] = useState(() => {
    const saved = localStorage.getItem("santuario_prayer_rep_v7");
    return saved ? JSON.parse(saved) : INITIAL_REPENTANCE;
  });

  const [gratitudeList, setGratitudeList] = useState(() => {
    const saved = localStorage.getItem("santuario_prayer_grat_v7");
    return saved ? JSON.parse(saved) : INITIAL_GRATITUDE;
  });

  const [petitionsList, setPetitionsList] = useState(() => {
    const saved = localStorage.getItem("santuario_prayer_pet_v7");
    return saved ? JSON.parse(saved) : INITIAL_PETITIONS;
  });

  const [specialList, setSpecialList] = useState(() => {
    const saved = localStorage.getItem("santuario_prayer_spec_v7");
    return saved ? JSON.parse(saved) : INITIAL_SPECIAL_PETITIONS;
  });

  // Lista de IDs marcados (con el check)
  const [checkedIds, setCheckedIds] = useState(() => {
    const saved = localStorage.getItem("santuario_checked_prayer_ids_v7");
    return saved ? JSON.parse(saved) : [];
  });

  // Estado del reproductor musical continuo de adoración
  const [isWorshipMusicPlaying, setIsWorshipMusicPlaying] = useState(false);

  // Formulario / Modal para Agregar Petición con IA
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [inputRawText, setInputRawText] = useState('');
  const [inputPerson, setInputPerson] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Peticiones');
  const [isPolishingWithAI, setIsPolishingWithAI] = useState(false);
  const [polishingFeedback, setPolishingFeedback] = useState('');

  // Sincronización en LocalStorage y Supabase Cloud
  useEffect(() => {
    localStorage.setItem("santuario_prayer_rep_v7", JSON.stringify(repentanceList));
    triggerAutoCloudSync();
  }, [repentanceList]);

  useEffect(() => {
    localStorage.setItem("santuario_prayer_grat_v7", JSON.stringify(gratitudeList));
    triggerAutoCloudSync();
  }, [gratitudeList]);

  useEffect(() => {
    localStorage.setItem("santuario_prayer_pet_v7", JSON.stringify(petitionsList));
    triggerAutoCloudSync();
  }, [petitionsList]);

  useEffect(() => {
    localStorage.setItem("santuario_prayer_spec_v7", JSON.stringify(specialList));
    triggerAutoCloudSync();
  }, [specialList]);

  useEffect(() => {
    localStorage.setItem("santuario_checked_prayer_ids_v7", JSON.stringify(checkedIds));
    triggerAutoCloudSync();
  }, [checkedIds]);

  // Escuchar cuando Supabase descarga los datos en este u otro dispositivo
  useEffect(() => {
    const handleCloudSync = (e) => {
      const cloud = e.detail;
      if (cloud && cloud.prayers) {
        if (cloud.prayers.repentance) setRepentanceList(cloud.prayers.repentance);
        if (cloud.prayers.gratitude) setGratitudeList(cloud.prayers.gratitude);
        if (cloud.prayers.petitions) setPetitionsList(cloud.prayers.petitions);
        if (cloud.prayers.special) setSpecialList(cloud.prayers.special);
        if (Array.isArray(cloud.prayers.checkedIds)) setCheckedIds(cloud.prayers.checkedIds);
      }
    };
    window.addEventListener('santuario-cloud-synced', handleCloudSync);
    return () => window.removeEventListener('santuario-cloud-synced', handleCloudSync);
  }, []);

  // Reproducción musical de fondo (432 Hz)
  const toggleWorshipMusic = () => {
    if (isWorshipMusicPlaying) {
      sacredAudio.stopSacredTone();
      setIsWorshipMusicPlaying(false);
    } else {
      sacredAudio.playSacredTone(SOUNDSCAPES_DATA.nativeSacredTones[0]);
      setIsWorshipMusicPlaying(true);
    }
  };

  // Marcar / Desmarcar con el Check individual
  const handleToggleCheck = (id, e) => {
    if (e) e.stopPropagation();

    setCheckedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#ffd700', '#d4af37', '#4ade80']
        });
        return [...prev, id];
      }
    });
  };

  // Desmarcar todas las oraciones
  const handleUncheckAll = () => {
    setCheckedIds([]);
  };

  // Eliminar una petición específica de la lista
  const handleDeleteItem = (category, id, e) => {
    if (e) e.stopPropagation();
    if (category === 'arrepentimiento') {
      setRepentanceList(prev => prev.filter(x => x.id !== id));
    } else if (category === 'agradecimiento') {
      setGratitudeList(prev => prev.filter(x => x.id !== id));
    } else if (category === 'peticiones') {
      setPetitionsList(prev => prev.filter(x => x.id !== id));
    } else if (category === 'peticiones_especiales') {
      setSpecialList(prev => prev.filter(x => x.id !== id));
    }
    setCheckedIds(prev => prev.filter(x => x !== id));
  };

  // Vaciar toda la categoría activa
  const handleClearCurrentCategory = () => {
    if (confirm("¿Deseas vaciar las peticiones de esta sección?")) {
      if (activeTab === 'arrepentimiento') setRepentanceList([]);
      else if (activeTab === 'agradecimiento') setGratitudeList([]);
      else if (activeTab === 'peticiones') setPetitionsList([]);
      else if (activeTab === 'peticiones_especiales') setSpecialList([]);
    }
  };

  // Motor Inteligente con IA: Realce de redacción y clasificación
  const handlePolishAndCategorize = async () => {
    if (!inputRawText.trim()) return;
    setIsPolishingWithAI(true);
    setPolishingFeedback('Pulido de redacción y clasificación en proceso...');

    try {
      const result = await enhanceAndClassifyPrayer({ rawText: inputRawText });
      if (result) {
        setInputRawText(result.polishedText);
        if (result.category) setSelectedCategory(result.category);
        if (result.recommendedPerson) setInputPerson(result.recommendedPerson);
        setPolishingFeedback(`✓ Clasificada en: ${result.category}`);
      }
    } catch (e) {
      setPolishingFeedback('Se mantuvo el texto ingresado.');
    } finally {
      setIsPolishingWithAI(false);
      setTimeout(() => setPolishingFeedback(''), 4000);
    }
  };

  // Guardar nueva petición
  const handleSaveNewPrayer = (e) => {
    e.preventDefault();
    if (!inputRawText.trim()) return;

    const newId = `prayer-${Date.now()}`;
    const newText = inputRawText.trim();

    if (selectedCategory === 'Arrepentimiento') {
      setRepentanceList(prev => [{ id: newId, text: newText }, ...prev]);
      setActiveTab('arrepentimiento');
    } else if (selectedCategory === 'Agradecimiento') {
      setGratitudeList(prev => [{ id: newId, text: newText }, ...prev]);
      setActiveTab('agradecimiento');
    } else if (selectedCategory === 'Peticiones Especiales') {
      setSpecialList(prev => [{
        id: newId,
        person: inputPerson.trim() || "Petición Especial",
        text: newText
      }, ...prev]);
      setActiveTab('peticiones_especiales');
    } else {
      setPetitionsList(prev => [{ id: newId, text: newText }, ...prev]);
      setActiveTab('peticiones');
    }

    setInputRawText('');
    setInputPerson('');
    setIsAddingNew(false);
  };

  // Obtener items de la pestaña activa
  let currentItems = [];
  if (activeTab === 'arrepentimiento') currentItems = repentanceList;
  else if (activeTab === 'agradecimiento') currentItems = gratitudeList;
  else if (activeTab === 'peticiones') currentItems = petitionsList;
  else if (activeTab === 'peticiones_especiales') currentItems = specialList;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(12px, 2.5vw, 24px) clamp(10px, 2vw, 20px) 90px' }} className="animate-fade-in">
      
      {/* =========================================================================
          BARRA DE CONTROLES SUPERIOR (RESPONSIVA & ELEGANTE)
         ========================================================================= */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 20, 31, 0.95) 0%, rgba(10, 13, 20, 0.95) 100%)',
        border: '1px solid var(--border-gold-subtle)',
        borderRadius: '14px',
        padding: 'clamp(10px, 2vw, 16px) clamp(12px, 2.5vw, 20px)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
      }}>
        {/* Lema sagrado directo */}
        <div style={{ 
          fontSize: 'clamp(0.8rem, 2vw, 0.92rem)', 
          fontWeight: '800', 
          color: 'var(--gold-200)', 
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} color="var(--gold-400)" />
          <span>MI MAYOR PROPÓSITO DEBE SER ANHELARTE CADA DÍA MÁS</span>
        </div>

        {/* Botones de acción alineados juntos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Iniciar Música (432Hz) */}
          <button
            onClick={toggleWorshipMusic}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: isWorshipMusicPlaying ? 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)' : 'rgba(212,175,55,0.12)',
              border: isWorshipMusicPlaying ? '1px solid #ffffff' : '1px solid var(--gold-400)',
              color: isWorshipMusicPlaying ? '#07080c' : 'var(--gold-200)',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title="Música devocional 432 Hz"
          >
            {isWorshipMusicPlaying ? <Volume2 size={15} /> : <Music size={15} />}
            <span>{isWorshipMusicPlaying ? 'Música activa' : 'Música (432Hz)'}</span>
          </button>

          {/* Agregar Petición con IA */}
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="btn-gold"
            style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Agregar Petición con IA</span>
          </button>

          {/* Desmarcar todas */}
          <button
            onClick={handleUncheckAll}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Desmarcar todos los checks"
          >
            <RotateCcw size={14} />
            <span>Desmarcar todas</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          FORMULARIO PARA AGREGAR PETICIÓN CON IA (SIN LEYENDAS PRE-RELLENADAS)
         ========================================================================= */}
      {isAddingNew && (
        <div className="sacred-panel animate-fade-in" style={{ padding: '16px 20px', marginBottom: '18px', border: '1.5px solid var(--gold-400)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--gold-400)" />
              <h4 className="font-cinzel" style={{ margin: 0, fontSize: '0.98rem', color: 'var(--gold-200)', fontWeight: '800' }}>
                Nueva Petición con Realce & Auto-Clasificación
              </h4>
            </div>
            <button
              onClick={() => setIsAddingNew(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveNewPrayer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              value={inputRawText}
              onChange={(e) => setInputRawText(e.target.value)}
              placeholder="Escribe tu petición aquí..."
              style={{
                width: '100%',
                minHeight: '75px',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#ffffff',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />

            {selectedCategory === 'Peticiones Especiales' && (
              <input
                type="text"
                value={inputPerson}
                onChange={(e) => setInputPerson(e.target.value)}
                placeholder="Nombre de la persona o motivo específico..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '7px',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: '#ffffff',
                  fontSize: '0.86rem'
                }}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Categoría:</span>
                {['Arrepentimiento', 'Agradecimiento', 'Peticiones', 'Peticiones Especiales'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: selectedCategory === cat ? '800' : '500',
                      background: selectedCategory === cat ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.03)',
                      border: selectedCategory === cat ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
                      color: selectedCategory === cat ? 'var(--gold-200)' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePolishAndCategorize}
                  disabled={isPolishingWithAI || !inputRawText.trim()}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid var(--gold-400)',
                    color: 'var(--gold-200)',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: inputRawText.trim() ? 'pointer' : 'not-allowed',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={13} className={isPolishingWithAI ? "animate-spin" : ""} />
                  <span>{isPolishingWithAI ? 'Perfeccionando...' : 'Pulir con IA'}</span>
                </button>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '7px 18px', fontSize: '0.82rem', fontWeight: '800' }}
                >
                  Guardar
                </button>
              </div>
            </div>

            {polishingFeedback && (
              <span style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: '600' }}>
                {polishingFeedback}
              </span>
            )}
          </form>
        </div>
      )}

      {/* =========================================================================
          LAS 4 PESTAÑAS CANÓNICAS SUPERIORES (ADAPTABLES & DESLIZABLES EN MÓVIL)
         ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px',
        borderBottom: '1.5px solid rgba(212,175,55,0.2)',
        paddingBottom: '12px'
      }}>
        <div className="no-scrollbar" style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto',
          maxWidth: '100%',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* 1. Arrepentimiento */}
          <button
            onClick={() => setActiveTab('arrepentimiento')}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'arrepentimiento' ? '800' : '600',
              background: activeTab === 'arrepentimiento' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'arrepentimiento' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'arrepentimiento' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: activeTab === 'arrepentimiento' ? '0 2px 14px rgba(212,175,55,0.35)' : 'none'
            }}
          >
            <span>1. Arrepentimiento</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: '9999px',
              background: activeTab === 'arrepentimiento' ? 'rgba(0,0,0,0.3)' : 'rgba(212,175,55,0.18)',
              color: activeTab === 'arrepentimiento' ? '#ffffff' : 'var(--gold-300)',
              fontWeight: '800'
            }}>
              {repentanceList.length}
            </span>
          </button>

          {/* 2. Agradecimiento */}
          <button
            onClick={() => setActiveTab('agradecimiento')}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'agradecimiento' ? '800' : '600',
              background: activeTab === 'agradecimiento' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'agradecimiento' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'agradecimiento' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: activeTab === 'agradecimiento' ? '0 2px 14px rgba(212,175,55,0.35)' : 'none'
            }}
          >
            <span>2. Agradecimiento</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: '9999px',
              background: activeTab === 'agradecimiento' ? 'rgba(0,0,0,0.3)' : 'rgba(212,175,55,0.18)',
              color: activeTab === 'agradecimiento' ? '#ffffff' : 'var(--gold-300)',
              fontWeight: '800'
            }}>
              {gratitudeList.length}
            </span>
          </button>

          {/* 3. Peticiones */}
          <button
            onClick={() => setActiveTab('peticiones')}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'peticiones' ? '800' : '600',
              background: activeTab === 'peticiones' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'peticiones' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'peticiones' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: activeTab === 'peticiones' ? '0 2px 14px rgba(212,175,55,0.35)' : 'none'
            }}
          >
            <span>3. Peticiones</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: '9999px',
              background: activeTab === 'peticiones' ? 'rgba(0,0,0,0.3)' : 'rgba(212,175,55,0.18)',
              color: activeTab === 'peticiones' ? '#ffffff' : 'var(--gold-300)',
              fontWeight: '800'
            }}>
              {petitionsList.length}
            </span>
          </button>

          {/* 4. Peticiones Especiales */}
          <button
            onClick={() => setActiveTab('peticiones_especiales')}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'peticiones_especiales' ? '800' : '600',
              background: activeTab === 'peticiones_especiales' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'peticiones_especiales' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'peticiones_especiales' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: activeTab === 'peticiones_especiales' ? '0 2px 14px rgba(212,175,55,0.35)' : 'none'
            }}
          >
            <span>4. Peticiones Especiales</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: '9999px',
              background: activeTab === 'peticiones_especiales' ? 'rgba(0,0,0,0.3)' : 'rgba(212,175,55,0.18)',
              color: activeTab === 'peticiones_especiales' ? '#ffffff' : 'var(--gold-300)',
              fontWeight: '800'
            }}>
              {specialList.length}
            </span>
          </button>
        </div>

        {/* Vaciar lista de la pestaña activa si el usuario lo desea */}
        {currentItems.length > 0 && (
          <button
            onClick={handleClearCurrentCategory}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              fontSize: '0.76rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Vaciar peticiones de esta sección"
          >
            <Trash2 size={13} />
            <span>Vaciar sección</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          BANNERS SAGRADOS ELEGANTES (CRISTAL OBSIDIANA & REALCE DORADO)
         ========================================================================= */}
      {activeTab === 'arrepentimiento' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(15,20,32,0.92) 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '12px',
          padding: '14px 20px',
          textAlign: 'center',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
          marginBottom: '16px'
        }}>
          <div className="font-cinzel" style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            fontWeight: '800',
            color: 'var(--gold-200)',
            letterSpacing: '0.04em'
          }}>
            ✦ PERDONA MIS OFENSAS ASÍ COMO YO PERDONO A LOS QUE ME OFENDEN ✦
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-300)', marginTop: '4px', fontStyle: 'italic' }}>
            Deseo despojarme de todos mis ídolos y consagrar mi corazón al Altísimo
          </div>
        </div>
      )}

      {activeTab === 'agradecimiento' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(15,20,32,0.92) 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '12px',
          padding: '14px 20px',
          textAlign: 'center',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
          marginBottom: '16px'
        }}>
          <div className="font-cinzel" style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            fontWeight: '800',
            color: 'var(--gold-200)',
            letterSpacing: '0.04em'
          }}>
            ✦ DAD GRACIAS EN TODO, PORQUE ESTA ES LA VOLUNTAD DE DIOS ✦
          </div>
        </div>
      )}

      {activeTab === 'peticiones' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(15,20,32,0.92) 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '12px',
          padding: '14px 20px',
          textAlign: 'center',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
          marginBottom: '16px'
        }}>
          <div className="font-cinzel" style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            fontWeight: '800',
            color: 'var(--gold-200)',
            letterSpacing: '0.04em'
          }}>
            ✦ PEDID, Y SE OS DARÁ; BUSCAD, Y HALLARÉIS; LLAMAD, Y SE OS ABRIRÁ ✦
          </div>
        </div>
      )}

      {activeTab === 'peticiones_especiales' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(15,20,32,0.92) 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '12px',
          padding: '14px 20px',
          textAlign: 'center',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
          marginBottom: '16px'
        }}>
          <div className="font-cinzel" style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
            fontWeight: '800',
            color: 'var(--gold-200)',
            letterSpacing: '0.04em'
          }}>
            ✦ PETICIONES ESPECIALES: CLAMOR INTERCESOR POR PERSONAS Y NECESIDADES ✦
          </div>
        </div>
      )}

      {/* =========================================================================
          CONTENIDO: GRILLA RESPONSIVA DE TARJETAS SAGRADAS (1 COL MÓVIL, 2 TABLET, 3 ESCRITORIO)
         ========================================================================= */}
      {currentItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          background: 'rgba(10, 13, 20, 0.6)',
          border: '1px dashed rgba(212,175,55,0.25)',
          borderRadius: '14px',
          color: 'var(--text-muted)'
        }}>
          <p style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>
            No hay peticiones en esta sección.
          </p>
          <button
            onClick={() => {
              setIsAddingNew(true);
              if (activeTab === 'arrepentimiento') setSelectedCategory('Arrepentimiento');
              else if (activeTab === 'agradecimiento') setSelectedCategory('Agradecimiento');
              else if (activeTab === 'peticiones') setSelectedCategory('Peticiones');
              else if (activeTab === 'peticiones_especiales') setSelectedCategory('Peticiones Especiales');
            }}
            className="btn-gold"
            style={{ padding: '8px 18px', fontSize: '0.84rem', fontWeight: '800' }}
          >
            <Plus size={15} />
            <span>Agregar primera petición</span>
          </button>
        </div>
      ) : (
        <div className="prayer-grid">
          {currentItems.map((item, idx) => {
            const isChecked = checkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleToggleCheck(item.id)}
                style={{
                  background: isChecked ? 'rgba(10, 13, 20, 0.65)' : 'rgba(14, 18, 28, 0.92)',
                  border: isChecked ? '1px solid rgba(74, 222, 128, 0.35)' : '1px solid rgba(212,175,55,0.22)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isChecked ? 'none' : '0 4px 16px rgba(0,0,0,0.3)',
                  opacity: isChecked ? 0.72 : 1,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                {/* Cabecera de la tarjeta: Número y persona si aplica */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '0.74rem', 
                    color: isChecked ? '#4ade80' : 'var(--gold-400)', 
                    fontWeight: '800',
                    background: isChecked ? 'rgba(74,222,128,0.1)' : 'rgba(212,175,55,0.12)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: isChecked ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(212,175,55,0.2)'
                  }}>
                    #{idx + 1}
                  </span>

                  {item.person && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      color: '#07080c',
                      background: 'var(--gold-400)',
                      padding: '2px 8px',
                      borderRadius: '5px'
                    }}>
                      {item.person}
                    </span>
                  )}
                </div>

                {/* Texto de la petición */}
                <div style={{ 
                  fontSize: '0.94rem',
                  color: isChecked ? '#94a3b8' : '#ffffff',
                  fontWeight: '500',
                  lineHeight: 1.5,
                  textDecoration: isChecked ? 'line-through' : 'none',
                  flex: 1
                }}>
                  {item.text}
                </div>

                {/* Pie de la tarjeta: Estado y Botones de acción */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '8px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '10px'
                }}>
                  <span style={{ fontSize: '0.74rem', color: isChecked ? '#4ade80' : 'var(--text-dim)', fontWeight: '600' }}>
                    {isChecked ? '✓ Oración completada' : 'En intercesión'}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    {/* BOTÓN CHECK */}
                    <button
                      onClick={(e) => handleToggleCheck(item.id, e)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isChecked ? 'rgba(74, 222, 128, 0.25)' : 'rgba(212,175,55,0.12)',
                        border: isChecked ? '1.5px solid #4ade80' : '1.5px solid var(--gold-400)',
                        color: isChecked ? '#4ade80' : 'var(--gold-200)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      title={isChecked ? "Desmarcar" : "Marcar con check"}
                    >
                      <Check size={16} strokeWidth={2.6} />
                    </button>

                    {/* BOTÓN ELIMINAR */}
                    <button
                      onClick={(e) => handleDeleteItem(activeTab, item.id, e)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#f87171',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      title="Eliminar esta petición"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
