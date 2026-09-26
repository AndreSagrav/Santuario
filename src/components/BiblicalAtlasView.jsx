import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  BookMarked, 
  Search, 
  Layers, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Navigation,
  Globe,
  Landmark,
  ScrollText,
  Flame,
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react';
import { THEOLOGICAL_CONCORDANCE_TOPICS } from '../data/biblicalAtlasData';
import { queryContextualConcordance, queryBiblicalGeography } from '../services/concordanceService';
import SacredContentRenderer from '../utils/sacredFormatter';
import HistoricalTimelineViewer from './HistoricalTimelineViewer';
import SacredGeographyMap from './SacredGeographyMap';

export default function BiblicalAtlasView({ onConsultAI, onOpenBible }) {
  const [activeSubTab, setActiveSubTab] = useState('maps'); // 'maps' | 'concordance'
  
  // Estado Cartográfico y Búsqueda
  const [customPlaceQuery, setCustomPlaceQuery] = useState('');
  const [isSearchingPlace, setIsSearchingPlace] = useState(false);
  const [customPlaceResult, setCustomPlaceResult] = useState(null);

  // Estado de Concordancia
  const [selectedTopic, setSelectedTopic] = useState(THEOLOGICAL_CONCORDANCE_TOPICS[0]);
  const [customConcordanceQuery, setCustomConcordanceQuery] = useState('');
  const [isAnalyzingConcordance, setIsAnalyzingConcordance] = useState(false);
  const [concordanceResult, setConcordanceResult] = useState(null);

  // Ejecutar búsqueda cartográfica personalizada
  const handleSearchCustomPlace = async (e) => {
    e?.preventDefault();
    if (!customPlaceQuery.trim() || isSearchingPlace) return;

    setIsSearchingPlace(true);
    setCustomPlaceResult(null);
    try {
      const result = await queryBiblicalGeography({ placeName: customPlaceQuery.trim() });
      setCustomPlaceResult(result);
    } catch (err) {
      setCustomPlaceResult("No fue posible reconstruir la geografía en este momento. Por favor reintenta.");
    } finally {
      setIsSearchingPlace(false);
    }
  };

  // Ejecutar búsqueda de concordancia de contexto
  const handleSearchCustomConcordance = async (e) => {
    e?.preventDefault();
    if (!customConcordanceQuery.trim() || isAnalyzingConcordance) return;

    setIsAnalyzingConcordance(true);
    setConcordanceResult(null);
    try {
      const result = await queryContextualConcordance({ topic: customConcordanceQuery.trim() });
      setConcordanceResult(result);
    } catch (err) {
      setConcordanceResult("Ocurrió una interrupción al analizar la concordancia contextual. Por favor reintenta.");
    } finally {
      setIsAnalyzingConcordance(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 80px' }} className="animate-fade-in">
      
      {/* Encabezado Principal */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '14px' }}>
          <Compass size={15} color="var(--gold-400)" />
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--gold-300)', textTransform: 'uppercase', fontWeight: '700' }}>
            Geografía Sagrada & Hermenéutica del Pacto
          </span>
        </div>
        <h1 className="font-cinzel gold-text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '10px' }}>
          Atlas Bíblico & Concordancia de Contexto
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore los mapas del mundo bíblico con coordenadas históricas comprobadas y profundice en las concordancias teológicas del pacto divino más allá de simples palabras repetidas.
        </p>

        {/* Selector de Modo */}
        <div style={{ display: 'inline-flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '9999px', border: '1px solid var(--border-gold-subtle)', marginTop: '24px' }}>
          <button
            onClick={() => setActiveSubTab('maps')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: activeSubTab === 'maps' ? 'var(--gold-gradient)' : 'transparent',
              color: activeSubTab === 'maps' ? '#07080c' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'maps' ? '800' : '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
          >
            <Globe size={17} />
            <span>Mapas Bíblicos & Rutas</span>
          </button>
          <button
            onClick={() => setActiveSubTab('concordance')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: activeSubTab === 'concordance' ? 'var(--gold-gradient)' : 'transparent',
              color: activeSubTab === 'concordance' ? '#07080c' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'concordance' ? '800' : '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
          >
            <BookMarked size={17} />
            <span>Concordancia de Contexto</span>
          </button>
          <button
            onClick={() => setActiveSubTab('timeline')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: activeSubTab === 'timeline' ? 'var(--gold-gradient)' : 'transparent',
              color: activeSubTab === 'timeline' ? '#07080c' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'timeline' ? '800' : '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.25s'
            }}
          >
            <Calendar size={17} />
            <span>Eje Cronológico & Línea de Tiempo</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECCIÓN 1: MAPAS BÍBLICOS & RUTAS SAGRADAS */}
      {/* ==================================================================== */}
      {activeSubTab === 'maps' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Cartografía Real Georreferenciada Multiepocal con Satélite NASA, OpenStreetMap y Países de Hoy */}
          <SacredGeographyMap 
            variant="expansive" 
            onConsultAI={onConsultAI} 
          />

          {/* Buscador Geográfico Personalizado en Tiempo Real */}
          <div className="sacred-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Landmark size={18} color="var(--gold-400)" />
              <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                Explorar Cualquier Coordenada o Lugar Bíblico en Tiempo Real
              </h3>
            </div>
            <form onSubmit={handleSearchCustomPlace} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={customPlaceQuery}
                onChange={(e) => setCustomPlaceQuery(e.target.value)}
                placeholder="Ejemplo: 'Valle de Ela', 'Caserío de Emaús', 'Arroyo de Querit', 'Hebrón'..."
                style={{
                  flex: 1,
                  minWidth: '280px',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-gold-subtle)',
                  color: 'white',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isSearchingPlace || !customPlaceQuery.trim()}
                className="gold-btn-gradient"
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  opacity: isSearchingPlace ? 0.7 : 1
                }}
              >
                <Search size={16} />
                <span>{isSearchingPlace ? 'Reconstruyendo Geografía...' : 'Investigar Lugar'}</span>
              </button>
            </form>

            {/* Resultado de Geografía Personalizada */}
            {customPlaceResult && (
              <div style={{ 
                marginTop: '20px', 
                padding: '24px', 
                borderRadius: '10px', 
                background: 'rgba(212,175,55,0.04)', 
                border: '1px solid rgba(212,175,55,0.2)'
              }}>
                <SacredContentRenderer content={customPlaceResult} />
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SECCIÓN 2: CONCORDANCIA DE CONTEXTO (HERMENÉUTICA DEL PACTO) */}
      {/* ==================================================================== */}
      {activeSubTab === 'concordance' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Banner Didáctico: ¿Qué es una Concordancia de Contexto? */}
          <div className="sacred-panel" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(6,8,13,0.95) 100%)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-400)', flexShrink: 0 }}>
              <ScrollText size={22} color="var(--gold-400)" />
            </div>
            <div>
              <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '6px' }}>
                Concordancia Hermenéutica & Teología del Pacto
              </h3>
              <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Una concordancia clásica se limita a listar palabras idénticas sin considerar el significado. La <strong>Concordancia de Contexto</strong> rastrea la <em>revelación progresiva</em>: cómo un concepto nace en el Antiguo Cercano Oriente, se reglamenta en la Ley Mosaica, es profetizado en las Escrituras hebreas y se consuma cristológicamente en el Nuevo Pacto.
              </p>
            </div>
          </div>

          {/* Temas del Pacto Pre-Cargados */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.8fr)', gap: '24px' }}>
            
            {/* Lista de Temas Fundamentales */}
            <div className="sacred-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Hilos Conductores del Pacto
              </div>
              {THEOLOGICAL_CONCORDANCE_TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'var(--gold-400)' : 'rgba(255,255,255,0.06)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: isSelected ? '800' : '600', color: isSelected ? 'var(--gold-200)' : 'var(--text-main)' }}>
                        {topic.title}
                      </span>
                      <ChevronRight size={15} color={isSelected ? 'var(--gold-400)' : 'var(--text-muted)'} />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontStyle: 'italic' }}>
                      Strong: {topic.strong}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Detalle de la Trayectoria Contextual del Tema */}
            <div className="sacred-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                  Concordancia Temática del Pacto
                </div>
                <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '4px 0 4px' }}>
                  {selectedTopic.title}
                </h3>
                <div style={{ fontSize: '0.86rem', color: 'var(--gold-300)', fontStyle: 'italic' }}>
                  Raíces Bíblicas: {selectedTopic.strong}
                </div>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-main)', lineHeight: 1.6, marginTop: '8px' }}>
                  {selectedTopic.summary}
                </p>
              </div>

              {/* Cadena Histórica Progresiva */}
              <div>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-300)', marginBottom: '12px', fontWeight: '700' }}>
                  Cadena de Revelación Progresiva
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedTopic.trajectory.map((step, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(212,175,55,0.12)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase' }}>
                          {idx + 1}. {step.epoch}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold-200)', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                          {step.ref}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        {step.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón para abrir consulta profunda en Ruaj */}
              <button
                onClick={() => onConsultAI?.({
                  passage: { title: selectedTopic.title, book: selectedTopic.strong, chapter: 'Concordancia de Contexto' },
                  mood: 'Estudio Profundo'
                })}
                className="gold-btn-gradient"
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  marginTop: 'auto',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={16} />
                <span>Profundizar con Ruaj sobre este Hilo del Pacto</span>
              </button>

            </div>

          </div>

          {/* Buscador de Concordancia Contextual Personalizada */}
          <div className="sacred-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Search size={18} color="var(--gold-400)" />
              <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                Investigar Cualquier Concordancia de Contexto en Tiempo Real
              </h3>
            </div>
            <form onSubmit={handleSearchCustomConcordance} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={customConcordanceQuery}
                onChange={(e) => setCustomConcordanceQuery(e.target.value)}
                placeholder="Ejemplo: 'La mesa en presencia de angustiadores', 'Melquisedec y el sacerdocio', 'La higuera estéril'..."
                style={{
                  flex: 1,
                  minWidth: '280px',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-gold-subtle)',
                  color: 'white',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={isAnalyzingConcordance || !customConcordanceQuery.trim()}
                className="gold-btn-gradient"
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  opacity: isAnalyzingConcordance ? 0.7 : 1
                }}
              >
                <Sparkles size={16} />
                <span>{isAnalyzingConcordance ? 'Analizando Contexto...' : 'Analizar Concordancia'}</span>
              </button>
            </form>

            {/* Resultado de Concordancia Personalizada */}
            {concordanceResult && (
              <div style={{ 
                marginTop: '20px', 
                padding: '24px', 
                borderRadius: '10px', 
                background: 'rgba(212,175,55,0.04)', 
                border: '1px solid rgba(212,175,55,0.2)'
              }}>
                <SacredContentRenderer content={concordanceResult} />
              </div>
            )}
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SECCIÓN 3: EJE CRONOLÓGICO & LÍNEA DE TIEMPO HISTÓRICO-ARQUEOLÓGICA */}
      {/* ==================================================================== */}
      {activeSubTab === 'timeline' && (
        <div className="animate-fade-in">
          <HistoricalTimelineViewer />
        </div>
      )}

    </div>
  );
}
