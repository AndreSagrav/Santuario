import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  Feather, 
  CheckCircle2, 
  Heart, 
  Clock, 
  MessageSquareHeart,
  Calendar,
  Compass,
  Check,
  X,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { WEEKS_DATA, DEVOTIONALS_DATA, getCurrentWeekIndex } from '../data/devotionalsData';
import { BIBLES_DATA } from '../data/biblesData';
import { generateCustomPrayer, askRuajAI } from '../services/aiService';
import { triggerAutoCloudSync } from '../services/cloudSyncService';
import SacredContentRenderer from '../utils/sacredFormatter';

const EMOTIONS = [
  { 
    id: 'ansioso', 
    label: 'Ansioso / Con Afán', 
    icon: '🌧️',
    targetDayIndex: 0, // Día 1
    verse: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios... Y la paz de Dios guardará vuestros corazones.',
    ref: 'Filipenses 4:6-7',
    rhema: 'El afán pretende que resuelvas el futuro con tus propias manos. La paz de Cristo es un centinela celestial apostado sobre tu mente. Suelta hoy la carga; Dios ya está en tu mañana.',
    actionLabel: 'Ver Devocional de Paz (Día 1)'
  },
  { 
    id: 'agradecido', 
    label: 'Agradecido / Con Gozo', 
    icon: '☀️',
    targetDayIndex: 1, // Día 2
    verse: 'Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosando.',
    ref: 'Salmos 23:5',
    rhema: 'La gratitud no niega la batalla, celebra la mesa que el Rey ha servido para ti en medio de ella. Tu copa rebosa de favor inmerecido.',
    actionLabel: 'Ver Devocional de Provisión (Día 2)'
  },
  { 
    id: 'cansado', 
    label: 'Fatigado / Sin Fuerzas', 
    icon: '🕊️',
    targetDayIndex: 2, // Día 3
    verse: 'Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas... los que esperan a Jehová levantarán alas como las águilas.',
    ref: 'Isaías 40:29, 31',
    rhema: 'No disimules tu agotamiento ante Dios. En Su altar ocurre el intercambio sagrado: entrega tu cansancio humano y recibe la fuerza sobrenatural de las águilas.',
    actionLabel: 'Ver Devocional de Renuevo (Día 3)'
  },
  { 
    id: 'direccion', 
    label: 'Buscando Dirección', 
    icon: '🧭',
    targetDayIndex: 4, // Día 5
    verse: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.',
    ref: 'Proverbios 3:5-6',
    rhema: 'La incertidumbre cesa cuando sueltas tu propio cálculo humano y te dejas caer con todo el peso en Sus brazos. Cuando buscas Su rostro, Él endereza tu vereda.',
    actionLabel: 'Ver Devocional de Sabiduría (Día 5)'
  },
  { 
    id: 'herido', 
    label: 'Necesitando Sanidad', 
    icon: '❤️‍🩹',
    targetDayIndex: 6, // Día 7
    verse: 'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente... con sus plumas te cubrirá, y debajo de sus alas estarás seguro.',
    ref: 'Salmos 91:1, 4',
    rhema: 'Tus lágrimas están contadas en la redoma del Padre. El Lugar Santísimo no es para los que nunca caen, sino para quienes corren a refugiarse bajo Sus alas sanadoras.',
    actionLabel: 'Ver Devocional de Refugio (Día 7)'
  }
];

export default function DevotionalView({ onOpenBible, onConsultAI }) {
  // Gestión de Semanas del Ciclo Devocional
  const [allWeeks, setAllWeeks] = useState(() => {
    const custom = localStorage.getItem('santuario_custom_weeks');
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        return [...WEEKS_DATA, ...parsed];
      } catch (e) {}
    }
    return WEEKS_DATA;
  });

  const [activeWeekId, setActiveWeekId] = useState(() => {
    return localStorage.getItem('santuario_active_week') || WEEKS_DATA[getCurrentWeekIndex()]?.id || 'semana-1';
  });

  const activeWeek = allWeeks.find(w => w.id === activeWeekId) || allWeeks[0];
  const weekDevotionals = activeWeek.days;

  const [selectedDevoId, setSelectedDevoId] = useState(weekDevotionals[0]?.id || 'devo-1');
  const [userEmotion, setUserEmotion] = useState('ansioso');
  const [activeDevoTab, setActiveDevoTab] = useState('revelation'); // 'revelation' | 'prayer' | 'journal'
  const [journalAnswers, setJournalAnswers] = useState({});
  const [isSavedPrompt, setIsSavedPrompt] = useState(false);
  const [customPrayer, setCustomPrayer] = useState(null);
  const [isGeneratingPrayer, setIsGeneratingPrayer] = useState(false);

  // Modal para Generar Nueva Semana con Ruaj IA
  const [isNewWeekModalOpen, setIsNewWeekModalOpen] = useState(false);
  const [aiWeekTopic, setAiWeekTopic] = useState('');
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);

  const devo = weekDevotionals.find(d => d.id === selectedDevoId) || weekDevotionals[0];
  const linkedPassage = BIBLES_DATA.find(p => p.id === devo.passageId);
  const currentEmotion = EMOTIONS.find(e => e.id === userEmotion);

  // Cargar respuestas de diario desde localStorage
  useEffect(() => {
    if (!devo) return;
    const saved = localStorage.getItem(`journal_${devo.id}`);
    if (saved) {
      try {
        setJournalAnswers(JSON.parse(saved));
      } catch (e) {}
    } else {
      setJournalAnswers({});
    }
    setCustomPrayer(null);
  }, [devo?.id]);

  // Escuchar sincronización universal desde Supabase
  useEffect(() => {
    const handleCloudSync = (e) => {
      const cloud = e.detail;
      if (cloud) {
        if (cloud.customWeeks && Array.isArray(cloud.customWeeks)) {
          setAllWeeks([...WEEKS_DATA, ...cloud.customWeeks]);
        }
        if (cloud.activeWeek) {
          setActiveWeekId(cloud.activeWeek);
        }
        if (devo && cloud.journalEntries && cloud.journalEntries[`journal_${devo.id}`]) {
          const ans = cloud.journalEntries[`journal_${devo.id}`];
          setJournalAnswers(typeof ans === 'string' ? JSON.parse(ans) : ans);
        }
      }
    };
    window.addEventListener('santuario-cloud-synced', handleCloudSync);
    return () => window.removeEventListener('santuario-cloud-synced', handleCloudSync);
  }, [devo?.id]);

  const handleSelectWeek = (weekId) => {
    setActiveWeekId(weekId);
    localStorage.setItem('santuario_active_week', weekId);
    triggerAutoCloudSync(1200);
    const targetW = allWeeks.find(w => w.id === weekId) || allWeeks[0];
    if (targetW && targetW.days.length > 0) {
      setSelectedDevoId(targetW.days[0].id);
    }
  };

  const handleSelectEmotion = (emotionId) => {
    setUserEmotion(emotionId);
    const matchedEmotion = EMOTIONS.find(e => e.id === emotionId);
    if (matchedEmotion) {
      // 1. Buscar en la semana activa un devocional con emotionTarget coincidente
      let targetDay = weekDevotionals.find(d => d.emotionTarget === emotionId);
      // 2. Si no hay coincidencia exacta por texto, usar su targetDayIndex
      if (!targetDay && typeof matchedEmotion.targetDayIndex === 'number') {
        targetDay = weekDevotionals[matchedEmotion.targetDayIndex] || weekDevotionals[0];
      }
      if (targetDay) {
        setSelectedDevoId(targetDay.id);
      }
    }
  };

  const handleSaveJournal = () => {
    localStorage.setItem(`journal_${devo.id}`, JSON.stringify(journalAnswers));
    triggerAutoCloudSync();
    setIsSavedPrompt(true);
    setTimeout(() => setIsSavedPrompt(false), 2000);
  };

  const handleGeneratePersonalPrayer = async () => {
    setIsGeneratingPrayer(true);
    try {
      const prayer = await generateCustomPrayer({
        need: journalAnswers[0] || (currentEmotion ? currentEmotion.rhema : "Paz y dirección en mi corazón hoy"),
        emotion: userEmotion,
        devotionTitle: devo.title
      });
      setCustomPrayer(prayer);
      const prayerElem = document.getElementById('prayer-section');
      if (prayerElem) prayerElem.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPrayer(false);
    }
  };

  // Generar nueva semana devocional de 7 días con Ruaj IA
  const handleGenerateAiWeek = async () => {
    setIsGeneratingWeek(true);
    const topic = aiWeekTopic.trim() || "Crecimiento Espiritual, Victoria y Fe Inquebrantable";
    const nextWeekNumber = allWeeks.length + 1;
    const prompt = `Actúa como maestro teológico y guía espiritual bíblico.
Genera un plan devocional completo de 7 días consecutivos sobre el tema: "${topic}".
REGLAS:
- Responde ÚNICAMENTE con un JSON válido, sin bloques de código markdown, sin texto antes ni después.
- Formato exacto:
{
  "id": "semana-ai-${Date.now()}",
  "weekNumber": ${nextWeekNumber},
  "title": "Semana ${nextWeekNumber}: ${topic}",
  "description": "Plan devocional de 7 días guiado por el Espíritu sobre ${topic}.",
  "theme": "${topic}",
  "days": [
    {
      "id": "devo-ai-${nextWeekNumber}-1",
      "day": "Día 1",
      "weekNumber": ${nextWeekNumber},
      "title": "Título profundo Día 1",
      "subtitle": "Subtítulo revelador",
      "passageId": "salmo-23",
      "highlightVerse": "Texto bíblico clave",
      "highlightRef": "Referencia Bíblica (ej. Filipenses 4:7)",
      "category": "Paz & Fe",
      "durationMinutes": 8,
      "reflection": "Reflexión espiritual de 3 párrafos con exégesis y aplicación práctica.",
      "journalPrompts": ["Pregunta de examen 1", "Pregunta de examen 2"],
      "guidedPrayer": "Oración pastoral guiada y ungida."
    }
    // ... así sucesivamente para Día 2, Día 3, Día 4, Día 5, Día 6, Día 7
  ]
}`;

    try {
      const raw = await askRuajAI({ question: prompt, mood: 'Investigación Académica & Crítica Textual' });
      const cleanJson = raw.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
        const updatedWeeks = [...allWeeks, parsed];
        setAllWeeks(updatedWeeks);
        const customOnly = updatedWeeks.filter(w => !WEEKS_DATA.some(bw => bw.id === w.id));
        localStorage.setItem('santuario_custom_weeks', JSON.stringify(customOnly));
        setActiveWeekId(parsed.id);
        localStorage.setItem('santuario_active_week', parsed.id);
        triggerAutoCloudSync();
        setSelectedDevoId(parsed.days[0].id);
        setIsNewWeekModalOpen(false);
        setAiWeekTopic('');
      }
    } catch (err) {
      console.error("Error al generar semana con IA:", err);
    } finally {
      setIsGeneratingWeek(false);
    }
  };

  const currentIndex = weekDevotionals.findIndex(d => d.id === selectedDevoId);
  const handlePrevDay = () => {
    if (currentIndex > 0) {
      setSelectedDevoId(weekDevotionals[currentIndex - 1].id);
    }
  };
  const handleNextDay = () => {
    if (currentIndex < weekDevotionals.length - 1) {
      setSelectedDevoId(weekDevotionals[currentIndex + 1].id);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(12px, 2.5vw, 24px) clamp(10px, 2vw, 20px) 90px' }} className="animate-fade-in">
      
      {/* =========================================================================
          1. BANNER SAGRADO DE IDENTIDAD & SELECTOR DE ESTADO DE ÁNIMO
         ========================================================================= */}
      <div className="sacred-panel" style={{ 
        padding: 'clamp(14px, 2.5vw, 24px)', 
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: 'clamp(44px, 6vw, 60px)',
              height: 'clamp(44px, 6vw, 60px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(0,0,0,0.6) 80%)',
              border: '2px solid var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(212,175,55,0.3)',
              flexShrink: 0
            }}>
              <Flame size={28} color="var(--gold-400)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="sacred-badge" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  ✦ ENCUENTRO SAGRADO DIARIO ✦
                </span>
              </div>
              <h1 className="font-cinzel gold-text-gradient" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.85rem)', fontWeight: '800', margin: 0, letterSpacing: '0.04em' }}>
                SANTUARIO — ESPACIO DE INTIMIDAD
              </h1>
              <p style={{ fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                Acalla el ruido terrenal, alimenta tu espíritu con la Palabra viva y renueva tus fuerzas en Su presencia.
              </p>
            </div>
          </div>

          {/* Selector de Ánimo Emocional (Carrusel fluido en móvil, flex en escritorio) */}
          <div style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tu estado hoy:
            </span>
            <div className="no-scrollbar" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              overflowX: 'auto',
              paddingBottom: '4px',
              WebkitOverflowScrolling: 'touch'
            }}>
              {EMOTIONS.map((emo) => (
                <button
                  key={emo.id}
                  onClick={() => handleSelectEmotion(emo.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: userEmotion === emo.id ? '800' : '500',
                    border: userEmotion === emo.id ? '1.5px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.08)',
                    background: userEmotion === emo.id ? 'rgba(212,175,55,0.24)' : 'rgba(255,255,255,0.03)',
                    color: userEmotion === emo.id ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    boxShadow: userEmotion === emo.id ? '0 0 16px rgba(212,175,55,0.45)' : 'none'
                  }}
                >
                  <span>{emo.icon}</span>
                  <span>{emo.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CÁPSULA DE MINISTRACIÓN VIVA Y PALABRA RHEMA PARA TU ESTADO HOY */}
        {currentEmotion && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(10,13,20,0.85) 100%)',
            border: '1.5px solid var(--gold-400)',
            borderRadius: '14px',
            padding: 'clamp(12px, 2vw, 18px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 4px 25px rgba(212,175,55,0.15)'
          }} className="animate-fade-in">
            <div style={{ flex: '1 1 340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.2rem' }}>{currentEmotion.icon}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ministración Inmediata para tu Alma • Estado: {currentEmotion.label}
                </span>
              </div>
              <div style={{ fontSize: '0.94rem', color: '#ffffff', fontStyle: 'italic', marginBottom: '4px', lineHeight: 1.5 }}>
                "{currentEmotion.verse}" <span style={{ color: 'var(--gold-300)', fontWeight: '700', fontStyle: 'normal', fontSize: '0.86rem' }}>({currentEmotion.ref})</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                <strong>Palabra Rhema:</strong> {currentEmotion.rhema}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const targetDay = weekDevotionals[currentEmotion.targetDayIndex] || weekDevotionals[0];
                  setSelectedDevoId(targetDay.id);
                  const elem = document.getElementById('devotional-content-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gold"
                style={{
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={14} />
                <span>{currentEmotion.actionLabel}</span>
              </button>

              <button
                onClick={handleGeneratePersonalPrayer}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  color: 'var(--gold-200)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} />
                <span>{isGeneratingPrayer ? "Orando..." : "Orar por este estado con IA"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. SELECTOR DE SEMANA Y CICLO ESPIRITUAL (CAMBIO CADA SEMANA O LIBRE)
         ========================================================================= */}
      <div style={{
        background: 'rgba(16, 20, 31, 0.65)',
        border: '1px solid var(--border-gold-subtle)',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span className="sacred-badge" style={{ fontSize: '0.74rem' }}>
                ✦ PLAN ESPIRITUAL • 4 SEMANAS CONTINUAS (28 DÍAS) ✦
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--gold-300)' }}>
                (Rotación semanal automática cada 7 días o selección libre)
              </span>
            </div>
            <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
              {activeWeek.title}
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '3px 0 0', maxWidth: '850px' }}>
              {activeWeek.description}
            </p>
          </div>

          {/* Selector de Semanas 1 a 4 + Botón Nueva Semana IA */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {allWeeks.map((w, idx) => {
              const isCurrentWeek = w.id === activeWeekId;
              return (
                <button
                  key={w.id}
                  onClick={() => handleSelectWeek(w.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: isCurrentWeek ? '800' : '600',
                    background: isCurrentWeek
                      ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)'
                      : 'rgba(255,255,255,0.03)',
                    color: isCurrentWeek ? '#07080c' : 'var(--text-muted)',
                    border: isCurrentWeek ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.18)',
                    cursor: 'pointer',
                    boxShadow: isCurrentWeek ? '0 0 14px rgba(212,175,55,0.45)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Semana {idx + 1}
                </button>
              );
            })}

            <button
              onClick={() => setIsNewWeekModalOpen(true)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                background: 'rgba(212,175,55,0.15)',
                border: '1px dashed var(--gold-400)',
                color: 'var(--gold-200)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Crear una nueva semana devocional de 7 días con Ruaj IA"
            >
              <Sparkles size={13} />
              <span>+ Nueva Semana IA</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. SELECTOR DE LOS 7 DÍAS DE LA SEMANA ACTIVA
         ========================================================================= */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="sacred-badge" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
              {activeWeek.title.split(':')[0]} • 7 Días de Altar
            </span>
            <span style={{ fontSize: '0.86rem', color: 'var(--gold-300)', fontWeight: '700' }}>
              {devo.day} de {weekDevotionals.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrevDay}
              disabled={currentIndex === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: currentIndex === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.12)',
                border: currentIndex === 0 ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(212,175,55,0.3)',
                color: currentIndex === 0 ? '#52525b' : 'var(--gold-200)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Día Anterior
            </button>
            <button
              onClick={handleNextDay}
              disabled={currentIndex === weekDevotionals.length - 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: currentIndex === weekDevotionals.length - 1 ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.12)',
                border: currentIndex === weekDevotionals.length - 1 ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(212,175,55,0.3)',
                color: currentIndex === weekDevotionals.length - 1 ? '#52525b' : 'var(--gold-200)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: currentIndex === weekDevotionals.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Día Siguiente →
            </button>
          </div>
        </div>

        {/* Rejilla Compacta y Elegante de los 7 Días de la Semana Activa (1 Fila Equilibrada en Desktop, Deslizable en Móvil) */}
        <div className="weekly-days-grid">
          {weekDevotionals.map((item, idx) => {
            const isSelected = item.id === selectedDevoId;
            const isRecommendedForEmotion = currentEmotion && currentEmotion.targetDayIndex === idx;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedDevoId(item.id)}
                className={isSelected ? "sacred-panel-active" : "sacred-panel"}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  border: isSelected 
                    ? '1.5px solid var(--gold-400)' 
                    : isRecommendedForEmotion 
                      ? '1px dashed var(--gold-400)' 
                      : '1px solid var(--border-gold-subtle)',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.08) 100%)' 
                    : isRecommendedForEmotion
                      ? 'rgba(212,175,55,0.06)'
                      : 'var(--surface-glass)',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(212,175,55,0.3)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  position: 'relative'
                }}
              >
                {/* Cabecera compacta: Badge de día y Categoría */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: '8px', 
                  width: '100%' 
                }}>
                  <span 
                    className="sacred-badge" 
                    style={{ 
                      fontSize: '0.72rem', 
                      padding: '2px 8px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    {item.day}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '0.7rem', 
                      color: isSelected ? 'var(--gold-300)' : 'var(--text-muted)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'right',
                      maxWidth: '140px'
                    }}
                    title={item.category}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Título en 1-2 líneas conciso */}
                <div style={{ 
                  fontWeight: '700', 
                  fontSize: '0.92rem', 
                  color: isSelected ? 'var(--gold-200)' : '#ffffff', 
                  lineHeight: '1.3'
                }}>
                  {item.title}
                </div>

                {/* Recomendación activa según estado de ánimo */}
                {isRecommendedForEmotion && (
                  <div style={{
                    fontSize: '0.68rem',
                    color: 'var(--gold-300)',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px'
                  }}>
                    <span>★ Recomendado para tu estado</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          4. ENCABEZADO PANORÁMICO COMPACTO DEL DEVOCIONAL ACTIVO
         ========================================================================= */}
      <div id="devotional-content-section" className="sacred-panel" style={{ padding: '24px 30px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="sacred-badge" style={{ fontSize: '0.78rem', padding: '3px 10px' }}>
              {devo.day} • {devo.category}
            </span>
            {currentEmotion && (
              <span className="sacred-badge" style={{ fontSize: '0.76rem', padding: '3px 10px', background: 'rgba(212,175,55,0.25)', border: '1px solid var(--gold-400)', color: '#ffffff' }}>
                {currentEmotion.icon} Pasaje activo para: {currentEmotion.label}
              </span>
            )}
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <Clock size={15} color="var(--gold-400)" /> {devo.durationMinutes} minutos de intimidad
          </span>
        </div>
        
        <h2 className="font-cinzel gold-text-gradient" style={{ 
          fontSize: '2rem', 
          fontWeight: '800', 
          lineHeight: '1.3', 
          marginBottom: '6px',
          letterSpacing: '0.03em'
        }}>
          {devo.title}
        </h2>
        <p style={{ fontSize: '1.02rem', color: '#c4cbde', lineHeight: '1.5', margin: 0, maxWidth: '1050px' }}>
          {devo.subtitle}
        </p>
      </div>

      {/* =========================================================================
          4.1 VERSÍCULO MAESTRO CONCISO Y NOBLE
         ========================================================================= */}
      <div className="scripture-quote-box" style={{ margin: '0 0 22px 0', padding: '24px 32px' }}>
        {currentEmotion && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '5px', background: 'rgba(212,175,55,0.18)', border: '1px solid var(--gold-400)', marginBottom: '12px' }}>
            <span style={{ fontSize: '1rem' }}>{currentEmotion.icon}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--gold-200)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Cita Bíblica ministrando tu estado: {currentEmotion.label}
            </span>
          </div>
        )}
        <p className="font-scripture" style={{ fontSize: '1.75rem', lineHeight: '1.5', fontStyle: 'italic', color: '#fffef9', marginBottom: '16px' }}>
          "{devo.highlightVerse}"
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid rgba(212,175,55,0.22)', paddingTop: '14px' }}>
          <div className="font-cinzel" style={{ fontSize: '1.05rem', color: 'var(--gold-300)', fontWeight: '700', letterSpacing: '0.05em' }}>
            — {devo.highlightRef} (Reina-Valera 1960)
          </div>
          <button
            onClick={() => onOpenBible(devo.passageId)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <BookOpen size={15} />
            <span>Explorar en Multi-Versiones</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          5. SELECTOR DE PESTAÑAS DEL ESTUDIO (RESPONSIVO & COMPACTO)
         ========================================================================= */}
      <div className="no-scrollbar" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-gold-subtle)',
        paddingBottom: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <button
          onClick={() => setActiveDevoTab('revelation')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            fontSize: '0.86rem',
            fontWeight: activeDevoTab === 'revelation' ? '800' : '600',
            background: activeDevoTab === 'revelation' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
            color: activeDevoTab === 'revelation' ? '#07080c' : 'var(--text-muted)',
            border: activeDevoTab === 'revelation' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: activeDevoTab === 'revelation' ? '0 0 16px rgba(212,175,55,0.4)' : 'none'
          }}
        >
          <Flame size={16} />
          <span>1. Luz & Exégesis</span>
        </button>

        <button
          onClick={() => setActiveDevoTab('prayer')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            fontSize: '0.86rem',
            fontWeight: activeDevoTab === 'prayer' ? '800' : '600',
            background: activeDevoTab === 'prayer' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
            color: activeDevoTab === 'prayer' ? '#07080c' : 'var(--text-muted)',
            border: activeDevoTab === 'prayer' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: activeDevoTab === 'prayer' ? '0 0 16px rgba(212,175,55,0.4)' : 'none'
          }}
        >
          <MessageSquareHeart size={16} />
          <span>2. Altar de Oración {customPrayer ? '(✦ Revelada)' : ''}</span>
        </button>

        <button
          onClick={() => setActiveDevoTab('journal')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            fontSize: '0.86rem',
            fontWeight: activeDevoTab === 'journal' ? '800' : '600',
            background: activeDevoTab === 'journal' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
            color: activeDevoTab === 'journal' ? '#07080c' : 'var(--text-muted)',
            border: activeDevoTab === 'journal' ? '1.5px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: activeDevoTab === 'journal' ? '0 0 16px rgba(212,175,55,0.4)' : 'none'
          }}
        >
          <Feather size={16} />
          <span>3. Diario del Corazón ({devo.journalPrompts.length})</span>
        </button>
      </div>

      {/* =========================================================================
          6. CONTENIDO ACTIVO SEGÚN PESTAÑA (CERO SOBRECARGA VISUAL)
         ========================================================================= */}
      
      {/* PESTAÑA 1: EXÉGESIS & REVELACIÓN TEOLÓGICA */}
      {activeDevoTab === 'revelation' && (
        <div className="sacred-panel animate-fade-in" style={{ padding: '30px 36px', fontSize: '1.08rem', lineHeight: '1.85' }}>
          <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame size={22} color="var(--gold-400)" />
            Luz de la Palabra & Revelación
          </h3>
          
          <div style={{ maxWidth: '1150px' }}>
            {devo.reflection.split('\n\n').map((paragraph, idx) => (
              <p key={idx} style={{ marginBottom: '18px', color: '#e2e7f4' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Acceso al Mentor Teológico */}
          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              ¿Deseas desglosar raíces en hebreo/griego o profundizar con el consejero teológico sobre este pasaje?
            </div>
            <button
              onClick={() => onConsultAI({ passage: linkedPassage, mood: userEmotion })}
              className="btn-gold"
              style={{ fontSize: '0.88rem', padding: '9px 20px' }}
            >
              <Sparkles size={15} />
              <span>Consultar al Mentor Teológico</span>
            </button>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: ALTAR DE ORACIÓN & CLAMOR */}
      {activeDevoTab === 'prayer' && (
        <div className="sacred-panel animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-400)' }}>
              <MessageSquareHeart size={22} />
            </div>
            <div>
              <h3 className="font-cinzel" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--gold-200)', margin: 0 }}>
                Oración del Altar
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Proclama en voz alta con fe inquebrantable
              </p>
            </div>
          </div>

          <div style={{ 
            background: 'rgba(9,10,15,0.65)', 
            border: '1px solid rgba(212,175,55,0.25)', 
            borderRadius: 'var(--radius-md)', 
            padding: '24px', 
            fontStyle: 'italic', 
            fontSize: '1.08rem', 
            lineHeight: '1.8', 
            color: '#f6f0dd',
            marginBottom: '20px'
          }}>
            {customPrayer ? (
              <div>
                <span className="sacred-badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  ✦ Oración Revelada para tu Corazón ✦
                </span>
                <SacredContentRenderer content={customPrayer} />
              </div>
            ) : (
              <p>{devo.guidedPrayer}</p>
            )}
          </div>

          <button
            onClick={handleGeneratePersonalPrayer}
            disabled={isGeneratingPrayer}
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: '0.94rem' }}
          >
            <Sparkles size={17} />
            <span>{isGeneratingPrayer ? 'Buscando revelación y paz...' : 'Formular Oración Personalizada con Ruaj IA'}</span>
          </button>
        </div>
      )}

      {/* PESTAÑA 3: DIARIO DEL CORAZÓN */}
      {activeDevoTab === 'journal' && (
        <div className="sacred-panel animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-400)' }}>
              <Feather size={22} />
            </div>
            <div>
              <h3 className="font-cinzel" style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--gold-200)', margin: 0 }}>
                Diario del Corazón
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Registra lo que Dios habla a tu espíritu hoy
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {devo.journalPrompts.map((prompt, pIdx) => (
              <div key={pIdx}>
                <label style={{ display: 'block', fontSize: '0.94rem', color: '#cbd5e8', marginBottom: '8px', fontWeight: '600', lineHeight: '1.45' }}>
                  {pIdx + 1}. {prompt}
                </label>
                <textarea
                  className="sacred-textarea"
                  placeholder="Escribe tu reflexión con sinceridad..."
                  value={journalAnswers[pIdx] || ''}
                  onChange={(e) => setJournalAnswers({ ...journalAnswers, [pIdx]: e.target.value })}
                  style={{ minHeight: '90px', fontSize: '0.95rem' }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={handleSaveJournal}
              className="btn-gold"
              style={{ fontSize: '0.9rem', padding: '10px 22px' }}
            >
              <CheckCircle2 size={16} />
              <span>Guardar en mi Diario</span>
            </button>
            {isSavedPrompt && (
              <span style={{ fontSize: '0.86rem', color: '#4ade80', fontWeight: '600' }}>
                ✓ Guardado en tu Diario & Nube Supabase
              </span>
            )}
          </div>
        </div>
      )}

      {/* MODAL PORTAL: GENERAR NUEVA SEMANA DEVOCIONAL CON RUAJ IA */}
      {isNewWeekModalOpen && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 12, 0.82)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '30px 20px',
            overflowY: 'auto'
          }}
          onClick={() => !isGeneratingWeek && setIsNewWeekModalOpen(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(180deg, #111522 0%, #0a0d15 100%)',
              border: '1.5px solid var(--gold-400)',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.15)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '9999px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-500)', fontSize: '0.75rem', color: 'var(--gold-300)', fontWeight: '700', marginBottom: '8px' }}>
                  <Sparkles size={13} />
                  <span>RUAJ IA • GENERADOR DE PLANES DEVOCIONALES</span>
                </div>
                <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
                  Diseñar Nueva Semana (7 Días)
                </h3>
              </div>
              <button
                onClick={() => setIsNewWeekModalOpen(false)}
                disabled={isGeneratingWeek}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'var(--text-muted)',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#cbd5e8', lineHeight: 1.6, marginBottom: '20px' }}>
              ¿Qué proceso espiritual o necesidad deseas atravesar? Ruaj IA construirá una semana completa de <strong>7 días consecutivos</strong> con pasajes bíblicos, exégesis, reflexiones teológicas, preguntas de diario y oraciones sacerdotales.
            </p>

            {/* Sugerencias Rápidas */}
            <div style={{ marginBottom: '18px' }}>
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                Temas sugeridos:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  "Sanidad Interior y Perdón",
                  "Guerra Espiritual y Armadura de Dios",
                  "Prosperidad Bíblica y Mayordomía",
                  "Intimidad con el Espíritu Santo",
                  "Fe para Conquistar Imposibles"
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setAiWeekTopic(sug)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      background: aiWeekTopic === sug ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.04)',
                      border: aiWeekTopic === sug ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
                      color: aiWeekTopic === sug ? '#ffffff' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Input del Tema */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-200)', fontWeight: '700', marginBottom: '8px' }}>
                Tema o Enfoque de la Semana:
              </label>
              <input
                type="text"
                className="sacred-input"
                placeholder="Ej. Superar el duelo y la soledad con Cristo..."
                value={aiWeekTopic}
                onChange={(e) => setAiWeekTopic(e.target.value)}
                disabled={isGeneratingWeek}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(5,7,12,0.85)',
                  border: '1px solid var(--border-gold-subtle)',
                  color: '#ffffff',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsNewWeekModalOpen(false)}
                disabled={isGeneratingWeek}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleGenerateAiWeek}
                disabled={isGeneratingWeek}
                className="btn-gold"
                style={{
                  padding: '10px 22px',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={16} />
                <span>{isGeneratingWeek ? "Estructurando 7 Días con Ruaj IA..." : "Generar Plan de 7 Días"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
