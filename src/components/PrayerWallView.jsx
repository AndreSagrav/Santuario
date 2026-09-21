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

  // Sincronización en LocalStorage
  useEffect(() => {
    localStorage.setItem("santuario_prayer_rep_v7", JSON.stringify(repentanceList));
  }, [repentanceList]);

  useEffect(() => {
    localStorage.setItem("santuario_prayer_grat_v7", JSON.stringify(gratitudeList));
  }, [gratitudeList]);

  useEffect(() => {
    localStorage.setItem("santuario_prayer_pet_v7", JSON.stringify(petitionsList));
  }, [petitionsList]);

  useEffect(() => {
    localStorage.setItem("santuario_prayer_spec_v7", JSON.stringify(specialList));
  }, [specialList]);

  useEffect(() => {
    localStorage.setItem("santuario_checked_prayer_ids_v7", JSON.stringify(checkedIds));
  }, [checkedIds]);

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
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 16px 80px' }} className="animate-fade-in">
      
      {/* =========================================================================
          BARRA DE CONTROLES SUPERIOR EN UNA SOLA FILA
         ========================================================================= */}
      <div style={{
        background: 'rgba(10, 13, 20, 0.95)',
        border: '1px solid var(--gold-400)',
        borderRadius: '10px',
        padding: '12px 18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Lema sagrado directo */}
        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--gold-200)', letterSpacing: '0.03em' }}>
          MI MAYOR PROPÓSITO DEBE SER ANHELARTE CADA DÍA MÁS
        </div>

        {/* Botones de acción alineados juntos a la par */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Iniciar Música (432Hz) */}
          <button
            onClick={toggleWorshipMusic}
            style={{
              padding: '7px 14px',
              borderRadius: '7px',
              background: isWorshipMusicPlaying ? 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)' : 'rgba(212,175,55,0.12)',
              border: isWorshipMusicPlaying ? '1px solid #ffffff' : '1px solid var(--gold-400)',
              color: isWorshipMusicPlaying ? '#07080c' : 'var(--gold-200)',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
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
            style={{ padding: '7px 15px', fontSize: '0.8rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Agregar Petición con IA</span>
          </button>

          {/* Desmarcar todas */}
          <button
            onClick={handleUncheckAll}
            style={{
              padding: '7px 12px',
              borderRadius: '7px',
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
              placeholder=""
              style={{
                width: '100%',
                minHeight: '65px',
                padding: '10px 14px',
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
                placeholder=""
                style={{
                  width: '100%',
                  padding: '8px 12px',
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
                      padding: '4px 10px',
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
                    padding: '6px 12px',
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
                  <span>{isPolishingWithAI ? 'Pulidadando...' : 'Pulir con IA'}</span>
                </button>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '6px 16px', fontSize: '0.8rem', fontWeight: '800' }}
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
          LAS 4 PESTAÑAS CANÓNICAS SUPERIORES
         ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '16px',
        borderBottom: '1.5px solid rgba(212,175,55,0.2)',
        paddingBottom: '10px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* 1. Arrepentimiento */}
          <button
            onClick={() => setActiveTab('arrepentimiento')}
            style={{
              padding: '9px 16px',
              borderRadius: '7px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'arrepentimiento' ? '800' : '600',
              background: activeTab === 'arrepentimiento' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'arrepentimiento' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'arrepentimiento' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>1. Arrepentimiento</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '1px 6px',
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
              borderRadius: '7px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'agradecimiento' ? '800' : '600',
              background: activeTab === 'agradecimiento' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'agradecimiento' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'agradecimiento' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>2. Agradecimiento</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '1px 6px',
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
              borderRadius: '7px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'peticiones' ? '800' : '600',
              background: activeTab === 'peticiones' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'peticiones' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'peticiones' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>3. Peticiones</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '1px 6px',
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
              borderRadius: '7px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'peticiones_especiales' ? '800' : '600',
              background: activeTab === 'peticiones_especiales' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'peticiones_especiales' ? '#07080c' : 'var(--gold-200)',
              border: activeTab === 'peticiones_especiales' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>4. Peticiones Especiales</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '1px 6px',
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
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Vaciar peticiones de esta sección"
          >
            <Trash2 size={13} />
            <span>Vaciar sección</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          BANNERS SAGRADOS POR CATEGORÍA
         ========================================================================= */}
      {activeTab === 'arrepentimiento' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          <div style={{
            background: 'linear-gradient(90deg, #d4af37 0%, #ffd700 50%, #d4af37 100%)',
            color: '#07080c',
            padding: '10px 16px',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '900',
            fontSize: '0.88rem',
            letterSpacing: '0.03em'
          }}>
            PERDONA MIS OFENSAS ASÍ COMO YO PERDONO A LOS QUE ME OFENDEN
          </div>
          <div style={{
            background: 'linear-gradient(90deg, #b8860b 0%, #d4af37 100%)',
            color: '#07080c',
            padding: '8px 16px',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: '900',
            fontSize: '0.84rem',
            letterSpacing: '0.03em'
          }}>
            DESEO DESPOJARME DE TODOS MIS ÍDOLOS
          </div>
        </div>
      )}

      {activeTab === 'agradecimiento' && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(15,23,42,0.8) 100%)',
          border: '1px solid var(--gold-400)',
          padding: '10px 16px',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '0.88rem',
          color: 'var(--gold-200)',
          marginBottom: '12px'
        }}>
          DAD GRACIAS EN TODO, PORQUE ESTA ES LA VOLUNTAD DE DIOS
        </div>
      )}

      {activeTab === 'peticiones' && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(15,23,42,0.8) 100%)',
          border: '1px solid var(--gold-400)',
          padding: '10px 16px',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '0.88rem',
          color: 'var(--gold-200)',
          marginBottom: '12px'
        }}>
          PEDID, Y SE OS DARÁ; BUSCAD, Y HALLARÉIS; LLAMAD, Y SE OS ABRIRÁ
        </div>
      )}

      {activeTab === 'peticiones_especiales' && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(15,23,42,0.8) 100%)',
          border: '1px solid var(--gold-400)',
          padding: '10px 16px',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: '800',
          fontSize: '0.88rem',
          color: 'var(--gold-200)',
          marginBottom: '12px'
        }}>
          PETICIONES ESPECIALES: ORACIÓN POR PERSONAS Y NECESIDADES
        </div>
      )}

      {/* =========================================================================
          CONTENIDO: LISTA EN FILAS AMPLIAS DE UNA SOLA COLUMNA
         ========================================================================= */}
      {currentItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          background: 'rgba(10, 13, 20, 0.6)',
          border: '1px dashed rgba(212,175,55,0.25)',
          borderRadius: '10px',
          color: 'var(--text-muted)'
        }}>
          <p style={{ margin: '0 0 10px', fontSize: '0.92rem' }}>
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
            style={{ padding: '7px 16px', fontSize: '0.8rem', fontWeight: '800' }}
          >
            <Plus size={14} />
            <span>Agregar petición</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentItems.map((item, idx) => {
            const isChecked = checkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  background: isChecked ? 'rgba(10, 13, 20, 0.6)' : 'rgba(13, 17, 26, 0.95)',
                  border: isChecked ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(212,175,55,0.22)',
                  borderRadius: '8px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  opacity: isChecked ? 0.75 : 1
                }}
              >
                {/* Texto de la petición */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--gold-400)', fontWeight: '800', width: '20px', flexShrink: 0 }}>
                    {idx + 1}.
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                    {item.person && (
                      <span style={{
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        color: '#07080c',
                        background: 'var(--gold-400)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        width: 'fit-content'
                      }}>
                        {item.person}
                      </span>
                    )}
                    <span style={{
                      fontSize: '0.94rem',
                      color: isChecked ? '#94a3b8' : '#ffffff',
                      fontWeight: '500',
                      lineHeight: 1.4,
                      textDecoration: isChecked ? 'line-through' : 'none'
                    }}>
                      {item.text}
                    </span>
                  </div>
                </div>

                {/* Botones de acción a la derecha: Solo el Check y el icono de Eliminar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {/* BOTÓN CHECK: ÚNICAMENTE EL CHECK, SIN TEXTO 'YA ORÉ' */}
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

                  {/* BOTÓN ELIMINAR PETICIÓN */}
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
            );
          })}
        </div>
      )}

    </div>
  );
}
