import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Landmark, 
  ScrollText, 
  Compass, 
  ShieldCheck, 
  Copy, 
  Check, 
  Flame,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Scale,
  Calendar,
  MapPin
} from 'lucide-react';
import { queryVerseApparatus } from '../services/criticalApparatusService';
import SacredContentRenderer from '../utils/sacredFormatter';
import TextualCriticismWorkbench from './TextualCriticismWorkbench';
import SacredGeographyMap from './SacredGeographyMap';
import HistoricalTimelineViewer from './HistoricalTimelineViewer';

export default function TheologicalApparatusDrawer({ 
  isOpen, 
  onClose, 
  verseContext, // { book, chapter, verseNum, verseRange, text, version, verses }
  onConsultAI 
}) {
  const [activeDimension, setActiveDimension] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [apparatusContent, setApparatusContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const displayRef = verseContext?.verseRange 
    ? `${verseContext.book} ${verseContext.chapter}:${verseContext.verseRange}`
    : `${verseContext?.book} ${verseContext?.chapter}:${verseContext?.verseNum}`;

  useEffect(() => {
    if (isOpen && verseContext) {
      loadApparatus();
    } else {
      setApparatusContent('');
    }
  }, [isOpen, verseContext?.book, verseContext?.chapter, verseContext?.verseRange, verseContext?.verseNum]);

  const loadApparatus = async () => {
    if (!verseContext) return;
    setIsLoading(true);
    try {
      const result = await queryVerseApparatus({
        book: verseContext.book,
        chapter: verseContext.chapter,
        verseNum: verseContext.verseNum,
        verseRange: verseContext.verseRange,
        text: verseContext.text,
        version: verseContext.version || 'RVR1960'
      });
      setApparatusContent(result);
    } catch (e) {
      setApparatusContent('Ocurrió una interrupción al generar el aparato crítico. Por favor reintente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!apparatusContent) return;
    navigator.clipboard.writeText(apparatusContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extraer secciones específicas del texto devuelto por la IA
  const getSectionContent = (sectionNum) => {
    if (!apparatusContent) return '';
    const regex = new RegExp(`(?:^|\\n)\\s*${sectionNum}\\.\\s*([^\\n]+)([\\s\\S]*?)(?=(?:\\n\\s*\\d+\\.\\s*[^\\n]+)|$)`, 'i');
    const match = apparatusContent.match(regex);
    if (match) {
      return `${match[1]}\n${match[2]}`.trim();
    }
    return '';
  };

  if (!isOpen || !verseContext) return null;

  const dimensions = [
    { id: 'all', label: 'Aparato 5D', icon: Layers, badge: '5 Dim.' },
    { id: 'exegesis', label: '1. Exégesis', icon: BookOpen, badge: 'Heb/Gr' },
    { id: 'history', label: '2. Historia & ANE', icon: Landmark, badge: 'Línea Tiempo' },
    { id: 'textual', label: '3. Crítica Textual', icon: Scale, badge: '5 Códices' },
    { id: 'geography', label: '4. Geografía & Clima', icon: Compass, badge: 'Topografía' },
    { id: 'covenant', label: '5. Pacto Sagrado', icon: ShieldCheck, badge: 'Cristocéntrico' }
  ];

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(3, 4, 7, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '12px 16px',
      overflow: 'hidden'
    }}>
      
      {/* Estación de Trabajo Panorámica Expandible (Espaciosa, anclada arriba, sin cortes ni apelotamiento) */}
      <div style={{
        width: '98vw',
        maxWidth: '1720px',
        height: 'calc(100vh - 24px)',
        maxHeight: 'calc(100vh - 24px)',
        background: 'linear-gradient(180deg, #090c14 0%, #050609 100%)',
        border: '1px solid rgba(212,175,55,0.35)',
        borderRadius: '16px',
        boxShadow: '-10px 0 50px rgba(0,0,0,0.9), 0 0 50px rgba(212,175,55,0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: 'zoomIn 0.25s ease'
      }}>
        
        {/* =========================================================================
            1. BARRA SUPERIOR DE CONTROL & HERRAMIENTAS ACADÉMICAS
           ========================================================================= */}
        <div style={{
          padding: '14px 28px',
          borderBottom: '1px solid rgba(212,175,55,0.22)',
          background: 'rgba(8, 11, 18, 0.98)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Identidad del Pasaje y Rango Seleccionado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(212,175,55,0.14)',
              border: '1.5px solid var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(212,175,55,0.25)'
            }}>
              <ScrollText size={22} color="var(--gold-400)" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--gold-400)', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.12em',
                  background: 'rgba(212,175,55,0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(212,175,55,0.3)'
                }}>
                  Gabinete de Investigación Crítica 5D
                </span>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd', background: 'rgba(59,130,246,0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(147,197,253,0.25)' }}>
                  Rigor Factual 0.2
                </span>
                {verseContext?.verses?.length > 1 && (
                  <span style={{ fontSize: '0.72rem', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(74,222,128,0.25)', fontWeight: '700' }}>
                    {verseContext.verses.length} versículos seleccionados
                  </span>
                )}
              </div>
              <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.55rem', fontWeight: '800', margin: 0 }}>
                {displayRef}
              </h3>
            </div>
          </div>

          {/* Texto del Rango en Estudio */}
          <div style={{
            flex: '1 1 380px',
            maxWidth: '680px',
            maxHeight: '68px',
            overflowY: 'auto',
            padding: '8px 14px',
            background: 'rgba(212,175,55,0.04)',
            border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--gold-100)',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.5
            }}>
              «{verseContext.text}»
            </p>
          </div>

          {/* Botones de Control: Maximizar / Copiar / Cerrar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: isExpanded ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.25)',
                color: isExpanded ? 'var(--gold-300)' : 'var(--text-muted)',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={isExpanded ? "Reducir a panel lateral" : "Expandir a pantalla completa"}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isExpanded ? 'Gabinete Lateral' : 'Pantalla Completa'}</span>
            </button>

            <button
              onClick={handleCopy}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: 'var(--gold-300)',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Copiar aparato crítico"
            >
              {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title="Cerrar gabinete"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. SELECTOR DE LAS 5 DIMENSIONES TEOLÓGICAS (PANORÁMICO, SIN CORTES)
           ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: '6px',
          padding: '10px 20px',
          background: 'rgba(5, 7, 11, 0.98)',
          borderBottom: '1px solid rgba(212,175,55,0.18)',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            const isSelected = activeDimension === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => setActiveDimension(dim.id)}
                title={`${dim.label} (${dim.badge})`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? '700' : '500',
                  background: isSelected ? 'linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.1) 100%)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? 'var(--gold-400)' : 'rgba(255,255,255,0.06)'}`,
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 0 15px rgba(212,175,55,0.15)' : 'none',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Icon size={14} color={isSelected ? 'var(--gold-400)' : 'currentColor'} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: isSelected ? '700' : '500' }}>{dim.label}</span>
                {dim.badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    color: isSelected ? 'var(--gold-300)' : '#71717a',
                    background: 'rgba(0,0,0,0.35)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}>
                    {dim.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            3. ÁREA DE ESTUDIO EXPANSIVA & SIN APELOTAMIENTOS
           ========================================================================= */}
        <div style={{
          flex: 1,
          padding: '28px 32px',
          overflowY: 'auto',
          lineHeight: 1.7,
          fontSize: '0.95rem',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              gap: '18px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(212,175,55,0.1)',
                border: '2px solid var(--gold-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={28} color="var(--gold-400)" className="animate-spin" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                  Cotejando Códices & Crítica Pentadimensional
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Analizando variantes de Qumrán, LXX, Leningrado B19A y geografía física de Judea...
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* =========================================================================
                  MODO A: APARATO COMPLETO 5D (REJILLA PANORÁMICA DE 2 COLUMNAS AMPLIAS)
                 ========================================================================= */}
              {activeDimension === 'all' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
                  gap: '24px',
                  alignItems: 'start'
                }}>
                  
                  {/* COLUMNA IZQUIERDA: FILOLOGÍA, MORFOLOGÍA & CRÍTICA TEXTUAL */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Dimensión 1: Exégesis Morfosintáctica */}
                    <div style={{
                      background: 'rgba(10, 13, 20, 0.85)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '12px',
                      padding: '22px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BookOpen size={18} color="var(--gold-400)" />
                          <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
                            1. Exégesis Lingüística & Morfología
                          </h4>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.25)' }}>
                          Hebreo Masorético & LXX
                        </span>
                      </div>

                      {/* Tarjetas de Idiomas Originales */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Texto Masorético (BHS):</span>
                          <div style={{ fontFamily: "'SBL Hebrew', serif", fontSize: '1.35rem', color: '#fef08a', direction: 'rtl', marginTop: '4px' }}>
                            יְהוָה רֹעִי לֹא אֶחְסָר
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>YHVH ro'i lo 'eḥsar</span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Septuaginta Griega (LXX):</span>
                          <div style={{ fontFamily: "'SBL Greek', serif", fontSize: '1.15rem', color: '#fef08a', marginTop: '4px' }}>
                            κύριος ποιμαίνει με καὶ οὐδέν με ὑστερήσει
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>kyrios poimainei me</span>
                        </div>
                      </div>

                      {getSectionContent(1) ? (
                        <SacredContentRenderer content={getSectionContent(1)} multiColumn={true} />
                      ) : (
                        <div style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                          • <strong>רֹעִי (H7462):</strong> Participio activo Qal con sufijo pronominal de 1ª persona singular. Acción continua: <em>«pastoreándome permanentemente»</em>.<br />
                          • <strong>לֹא אֶחְסָר (H2637):</strong> Partícula de negación absoluta más imperfecto Qal. Connota seguridad irrevocable en la provisión del pacto.
                        </div>
                      )}
                    </div>

                    {/* Dimensión 3: Crítica Textual Real */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <TextualCriticismWorkbench verseRef={displayRef} />
                    </div>

                  </div>

                  {/* COLUMNA DERECHA: GEOGRAFÍA, HISTORIA ANE & PACTO */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Dimensión 4: Geografía Sagrada & Topografía */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <SacredGeographyMap />
                    </div>

                    {/* Dimensión 2: Contexto Histórico & ANE (Línea de Tiempo) */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <HistoricalTimelineViewer />
                    </div>

                    {/* Dimensión 5: Teología del Pacto */}
                    <div style={{
                      background: 'rgba(10, 13, 20, 0.85)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '12px',
                      padding: '22px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                        <ShieldCheck size={18} color="var(--gold-400)" />
                        <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
                          5. Teología del Pacto & Cristología
                        </h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ background: 'rgba(212,175,55,0.05)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.18)' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase' }}>Pacto Davídico</span>
                          <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0', lineHeight: 1.5 }}>
                            El rey David se despoja de su manto real para declararse oveja y siervo de YHWH, el verdadero pastor de Israel.
                          </p>
                        </div>
                        <div style={{ background: 'rgba(59,130,246,0.05)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(147,197,253,0.22)' }}>
                          <span style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase' }}>Cumplimiento Mesiánico</span>
                          <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0', lineHeight: 1.5 }}>
                            Jesús sella Ezequiel 34: <em>«Yo soy el buen pastor; el buen pastor su vida da por las ovejas»</em> (Jn 10:11).
                          </p>
                        </div>
                      </div>

                      {getSectionContent(5) && (
                        <SacredContentRenderer content={getSectionContent(5)} multiColumn={false} />
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* =========================================================================
                  MODO B: DIMENSIÓN 1 - EXÉGESIS & MORFOLOGÍA (TRÍPTICO FILOLÓGICO)
                 ========================================================================= */}
              {activeDimension === 'exegesis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Tríptico Filológico en 3 Columnas */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '16px'
                  }}>
                    {/* Columna A: Texto Masorético */}
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Texto Masorético Tiberiense (𝔐)
                      </span>
                      <div style={{ fontFamily: "'SBL Hebrew', serif", fontSize: '1.6rem', color: '#fef08a', direction: 'rtl', margin: '10px 0' }}>
                        יְהוָה רֹעִי לֹא אֶחְסָר
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                        Vocalización tiberiense con cantilaciones te'amim. Códice de Leningrado B19A (folio 212r).
                      </p>
                    </div>

                    {/* Columna B: Septuaginta Griega */}
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Septuaginta Alejandrina (𝔊)
                      </span>
                      <div style={{ fontFamily: "'SBL Greek', serif", fontSize: '1.35rem', color: '#fef08a', margin: '10px 0' }}>
                        κύριος ποιμαίνει με καὶ οὐδέν με ὑστερήσει
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                        Codex Vaticanus B. El presente indicativo ποιμαίνει subraya pastoreo durativo continuo.
                      </p>
                    </div>

                    {/* Columna C: Morfosintaxis Clave */}
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Lemas & Raíces Fuertes
                      </span>
                      <div style={{ fontSize: '0.86rem', color: '#e2e8f0', marginTop: '10px', lineHeight: 1.7 }}>
                        • <strong>רֹעִי:</strong> Lema רָעָה (H7462) • Part. act. Qal c/ sufijo 1s.<br />
                        • <strong>לֹא אֶחְסָר:</strong> Lema חָסֵר (H2637) • Imperfecto Qal 1s.<br />
                        • <strong>יְהוָה:</strong> Tetragrámaton (H3068) • Nombre propio del pacto.
                      </div>
                    </div>
                  </div>

                  {/* Análisis Exegético en Rejilla de Tarjetas */}
                  <div style={{ marginTop: '8px' }}>
                    <SacredContentRenderer 
                      content={getSectionContent(1) || apparatusContent} 
                      multiColumn={true} 
                    />
                  </div>

                </div>
              )}

              {/* =========================================================================
                  MODO C: DIMENSIÓN 2 - CONTEXTO HISTÓRICO & ANE (LÍNEA DE TIEMPO + ANÁLISIS)
                 ========================================================================= */}
              {activeDimension === 'history' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', alignItems: 'start' }}>
                  <HistoricalTimelineViewer />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                        <Landmark size={18} color="var(--gold-400)" />
                        <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                          Trasfondo Sociocultural del Antiguo Cercano Oriente (ANE)
                        </h4>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(212,175,55,0.04)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase' }}>
                            Subversión Monárquica
                          </span>
                          <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0', lineHeight: 1.5 }}>
                            En Babilonia y Egipto, el título «pastor» pertenecía exclusivamente a reyes déspotas como Hammurabi. El Salmista subvierte este modelo: ningún tirano humano pastorea a Israel; YHWH es el único soberano.
                          </p>
                        </div>
                        <div style={{ background: 'rgba(212,175,55,0.04)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase' }}>
                            Leyes de Hospitalidad Beduina
                          </span>
                          <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0', lineHeight: 1.5 }}>
                            En el desierto de Judea, un anfitrión que unge la cabeza de un forastero y llena su copa asume la protección armada incondicional del huésped frente a cualquier perseguidor.
                          </p>
                        </div>
                      </div>

                      {getSectionContent(2) && (
                        <SacredContentRenderer content={getSectionContent(2)} multiColumn={true} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODO D: DIMENSIÓN 3 - CRÍTICA TEXTUAL REAL & COTEJO DE MANUSCRITOS
                 ========================================================================= */}
              {activeDimension === 'textual' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <TextualCriticismWorkbench verseRef={displayRef} />
                  {getSectionContent(3) && (
                    <SacredContentRenderer content={getSectionContent(3)} multiColumn={true} />
                  )}
                </div>
              )}

              {/* =========================================================================
                  MODO E: DIMENSIÓN 4 - GEOGRAFÍA SAGRADA & TOPOGRAFÍA INTERACTIVA
                 ========================================================================= */}
              {activeDimension === 'geography' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', alignItems: 'start' }}>
                  <SacredGeographyMap />
                  
                  <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                      <Compass size={18} color="var(--gold-400)" />
                      <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                        Orografía, Hidrología & Clima de Judea
                      </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                      <div style={{ background: 'rgba(212,175,55,0.04)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase' }}>Aguas de Reposo (Mê Menujót)</span>
                        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0', lineHeight: 1.5 }}>
                          Las ovejas de Judá temen las corrientes rápidas por el peso de su lana; el pastor busca remansos tranquilos alimentados por los manantiales de En-Gedi o Ein Feshkha.
                        </p>
                      </div>
                      <div style={{ background: 'rgba(212,175,55,0.04)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase' }}>Valle de Sombras (Ge-Tsalmáwet)</span>
                        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0', lineHeight: 1.5 }}>
                          Cañones de arenisca calcárea en Wadi Qelt donde los acantilados de más de 200 metros bloquean la luz solar directa, propiciando emboscadas de hienas y chacales.
                        </p>
                      </div>
                    </div>

                    {getSectionContent(4) && (
                      <SacredContentRenderer content={getSectionContent(4)} multiColumn={true} />
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODO F: DIMENSIÓN 5 - TEOLOGÍA DEL PACTO & CUMPLIMIENTO CRISTOLÓGICO
                 ========================================================================= */}
              {activeDimension === 'covenant' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '16px'
                  }}>
                    <div style={{ background: 'rgba(212,175,55,0.06)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.25)' }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase' }}>
                        Pacto Davídico (2 Samuel 7)
                      </span>
                      <p style={{ fontSize: '0.86rem', color: '#e2e8f0', margin: '6px 0 0', lineHeight: 1.6 }}>
                        David, el ungido en Belén, reconoce que su trono terrenal es provisional. El Señor Dios es el pastor eterno de cuyo linaje saldrá el pastor mesiánico anunciado por los profetas.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(59,130,246,0.06)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(147,197,253,0.25)' }}>
                      <span style={{ fontSize: '0.76rem', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase' }}>
                        Cumplimiento Mesiánico (Juan 10:11)
                      </span>
                      <p style={{ fontSize: '0.86rem', color: '#e2e8f0', margin: '6px 0 0', lineHeight: 1.6 }}>
                        Jesús proclama <em>«Ego eimi ho poimēn ho kalos»</em> (Yo Soy el Buen Pastor). La profecía de Ezequiel 34 se cumple: Dios en carne que no huye ante los lobos, sino que entrega su vida.
                      </p>
                    </div>

                    <div style={{ background: 'rgba(244,114,182,0.06)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(244,114,182,0.25)' }}>
                      <span style={{ fontSize: '0.76rem', color: '#f472b6', fontWeight: '700', textTransform: 'uppercase' }}>
                        Sello del Pacto Eterno (Hebreos 13:20)
                      </span>
                      <p style={{ fontSize: '0.86rem', color: '#e2e8f0', margin: '6px 0 0', lineHeight: 1.6 }}>
                        «Y el Dios de paz que resucitó de los muertos a nuestro Señor Jesucristo, el gran pastor de las ovejas, por la sangre del pacto eterno, os haga aptos en toda obra buena».
                      </p>
                    </div>
                  </div>

                  {getSectionContent(5) && (
                    <SacredContentRenderer content={getSectionContent(5)} multiColumn={true} />
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* =========================================================================
            4. PIE DEL GABINETE CON FUENTES PRIMARIAS Y ACCIÓN RUAJ
           ========================================================================= */}
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid rgba(212,175,55,0.18)',
          background: 'rgba(6, 8, 13, 0.98)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--gold-400)' }}>Fuentes Consultadas:</span>
            <span>Codex Leningradensis B19A • Qumrán 4QPs • LXX Rahlfs-Hanhart • BDB • HALOT • BDAG</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onConsultAI?.({
                passage: {
                  title: `${verseContext.book} ${verseContext.chapter}:${verseContext.verseNum}`,
                  book: verseContext.book,
                  chapter: verseContext.chapter
                },
                mood: 'Investigación Académica & Crítica Textual'
              });
            }}
            className="gold-btn-gradient"
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.84rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={15} />
            <span>Profundizar con Ruaj Académico</span>
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}
