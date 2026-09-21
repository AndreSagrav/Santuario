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
import { BIBLICAL_PLACES, BIBLICAL_ROUTES, THEOLOGICAL_CONCORDANCE_TOPICS } from '../data/biblicalAtlasData';
import { queryContextualConcordance, queryBiblicalGeography } from '../services/concordanceService';
import SacredContentRenderer from '../utils/sacredFormatter';
import HistoricalTimelineViewer from './HistoricalTimelineViewer';

export default function BiblicalAtlasView({ onConsultAI, onOpenBible }) {
  const [activeSubTab, setActiveSubTab] = useState('maps'); // 'maps' | 'concordance'
  
  // Estado Cartográfico
  const [selectedPlace, setSelectedPlace] = useState(BIBLICAL_PLACES[0]);
  const [selectedRoute, setSelectedRoute] = useState(BIBLICAL_ROUTES[0]);
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
          
          {/* Selector de Rutas Bíblicas */}
          <div className="sacred-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Navigation size={18} color="var(--gold-400)" />
              <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--gold-200)' }}>
                Rutas Históricas del Pacto:
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {BIBLICAL_ROUTES.map((route) => {
                const isSelected = selectedRoute.id === route.id;
                return (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: isSelected ? '700' : '500',
                      background: isSelected ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? 'var(--gold-400)' : 'rgba(255,255,255,0.08)'}`,
                      color: isSelected ? 'var(--gold-300)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {route.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Mapa Interactivo y Detalle Arqueológico */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '24px' }}>
            
            {/* Lienzo Cartográfico Sacro */}
            <div className="sacred-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', zIndex: 2 }}>
                <div>
                  <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                    Cartografía de Tierra Santa & el Cercano Oriente
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {selectedRoute.description}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.08)', padding: '4px 10px', borderRadius: '9999px', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <ShieldCheck size={13} />
                  <span>Georreferenciado</span>
                </div>
              </div>

              {/* Render del Mapa Sagrado Vectorial */}
              <div style={{ 
                flex: 1, 
                position: 'relative', 
                background: 'radial-gradient(circle at 60% 40%, #0d121c 0%, #06080d 100%)', 
                borderRadius: '12px', 
                border: '1px solid rgba(212,175,55,0.15)',
                minHeight: '400px',
                overflow: 'hidden'
              }}>
                
                {/* Cuadrícula Geográfica Cartográfica Antigua */}
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.12, pointerEvents: 'none' }}>
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4af37" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Rosa de los Vientos */}
                  <g transform="translate(60, 60) scale(0.6)">
                    <circle cx="0" cy="0" r="30" stroke="#d4af37" strokeWidth="1" fill="none" />
                    <line x1="0" y1="-35" x2="0" y2="35" stroke="#d4af37" strokeWidth="1.5" />
                    <line x1="-35" y1="0" x2="35" y2="0" stroke="#d4af37" strokeWidth="1.5" />
                    <text x="-4" y="-40" fill="#d4af37" fontSize="12" fontWeight="bold">N</text>
                  </g>
                </svg>

                {/* Formas Geográficas Estilizadas (Mediterráneo, Jordán, Mar Muerto, Galilea) */}
                <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: 0, left: 0 }}>
                  
                  {/* Mar Mediterráneo (Costas) */}
                  <path 
                    d="M 0,0 L 260,0 C 270,120 280,240 250,340 C 230,400 180,450 0,480 Z" 
                    fill="rgba(24, 45, 68, 0.45)" 
                    stroke="rgba(91, 192, 190, 0.35)" 
                    strokeWidth="1.5" 
                  />
                  <text x="70" y="200" fill="rgba(91, 192, 190, 0.4)" fontSize="14" fontStyle="italic" letterSpacing="4">MAR MEDITERRÁNEO</text>

                  {/* Mar de Galilea (Kineret) */}
                  <ellipse cx="490" cy="120" rx="22" ry="32" fill="rgba(91, 192, 190, 0.35)" stroke="rgba(91, 192, 190, 0.7)" strokeWidth="1.5" />
                  <text x="518" y="125" fill="rgba(212,175,55,0.7)" fontSize="11">Mar de Galilea</text>

                  {/* Río Jordán */}
                  <path 
                    d="M 490,152 C 485,190 495,240 488,290" 
                    fill="none" 
                    stroke="rgba(91, 192, 190, 0.55)" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 2" 
                  />
                  <text x="502" y="220" fill="rgba(91, 192, 190, 0.5)" fontSize="10" transform="rotate(75, 502, 220)">Río Jordán</text>

                  {/* Mar Muerto (Mar Salado) */}
                  <path 
                    d="M 488,290 C 475,340 480,410 492,450 C 498,420 500,340 494,290 Z" 
                    fill="rgba(40, 75, 99, 0.55)" 
                    stroke="rgba(91, 192, 190, 0.6)" 
                    strokeWidth="1.5" 
                  />
                  <text x="508" y="370" fill="rgba(212,175,55,0.7)" fontSize="11">Mar Muerto</text>

                  {/* Línea de Ruta Activa */}
                  {selectedRoute.id === 'exodus' && (
                    <path 
                      d="M 140,460 C 230,470 320,440 370,470 C 410,490 460,450 485,300" 
                      fill="none" 
                      stroke="#d4af37" 
                      strokeWidth="2" 
                      strokeDasharray="6 4" 
                    />
                  )}
                  {selectedRoute.id === 'jesus_ministry' && (
                    <path 
                      d="M 430,130 C 490,120 480,180 470,280 C 460,310 440,320 442,326" 
                      fill="none" 
                      stroke="#e0a96d" 
                      strokeWidth="2" 
                      strokeDasharray="6 4" 
                    />
                  )}
                  {selectedRoute.id === 'paul_missionary' && (
                    <path 
                      d="M 680,60 C 580,70 450,50 320,80 C 220,90 120,60 80,40" 
                      fill="none" 
                      stroke="#5bc0be" 
                      strokeWidth="2" 
                      strokeDasharray="6 4" 
                    />
                  )}
                </svg>

                {/* Marcadores Interactivos (Pins) de Lugares Sagrados */}
                {BIBLICAL_PLACES.map((place) => {
                  const isSelected = selectedPlace.id === place.id;
                  
                  // Mapeo estilizado de coordenadas lat/lng al lienzo
                  let leftPercent = '50%';
                  let topPercent = '50%';

                  if (place.id === 'jerusalem') { leftPercent = '55%'; topPercent = '65%'; }
                  else if (place.id === 'bethlehem') { leftPercent = '54%'; topPercent = '71%'; }
                  else if (place.id === 'nazareth') { leftPercent = '53%'; topPercent = '27%'; }
                  else if (place.id === 'capernaum') { leftPercent = '61%'; topPercent = '24%'; }
                  else if (place.id === 'sinai') { leftPercent = '42%'; topPercent = '92%'; }
                  else if (place.id === 'carmel') { leftPercent = '47%'; topPercent = '26%'; }
                  else if (place.id === 'antioch') { leftPercent = '82%'; topPercent = '14%'; }
                  else if (place.id === 'athens') { leftPercent = '20%'; topPercent = '18%'; }

                  return (
                    <div
                      key={place.id}
                      onClick={() => setSelectedPlace(place)}
                      style={{
                        position: 'absolute',
                        left: leftPercent,
                        top: topPercent,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: isSelected ? 10 : 5,
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        <div style={{
                          width: isSelected ? '26px' : '18px',
                          height: isSelected ? '26px' : '18px',
                          borderRadius: '50%',
                          background: isSelected ? 'var(--gold-400)' : 'rgba(212,175,55,0.4)',
                          border: '2px solid #07080c',
                          boxShadow: isSelected ? '0 0 20px #d4af37' : '0 0 8px rgba(0,0,0,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}>
                          <MapPin size={isSelected ? 14 : 10} color="#07080c" />
                        </div>
                        <span style={{
                          fontSize: isSelected ? '0.78rem' : '0.68rem',
                          fontWeight: isSelected ? '800' : '600',
                          color: isSelected ? 'var(--gold-300)' : 'rgba(255,255,255,0.7)',
                          background: 'rgba(6,8,13,0.85)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${isSelected ? 'var(--gold-400)' : 'rgba(255,255,255,0.1)'}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {place.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Paradas de la Ruta Seleccionada */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(7,9,14,0.92)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflowX: 'auto'
                }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    Itinerario:
                  </span>
                  {selectedRoute.stops.map((stop, idx) => (
                    <React.Fragment key={idx}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {stop}
                      </span>
                      {idx < selectedRoute.stops.length - 1 && (
                        <ArrowRight size={11} color="var(--gold-500)" style={{ flexShrink: 0 }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

              </div>
            </div>

            {/* Ficha Exegética y Arqueológica del Lugar Seleccionado */}
            <div className="sacred-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ borderBottom: '1px solid var(--border-gold-subtle)', paddingBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
                  {selectedPlace.category} • {selectedPlace.period}
                </div>
                <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '4px 0 2px' }}>
                  {selectedPlace.name}
                </h3>
                <div style={{ fontSize: '0.88rem', color: 'var(--gold-200)', fontStyle: 'italic' }}>
                  {selectedPlace.hebrew} — «{selectedPlace.meaning}»
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Coordenadas históricas: Lat {selectedPlace.coords.lat}° N, Lng {selectedPlace.coords.lng}° E
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-300)', marginBottom: '6px', fontWeight: '700' }}>
                  Significado Teológico & Bíblico
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {selectedPlace.description}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-300)', marginBottom: '6px', fontWeight: '700' }}>
                  🏛️ Evidencia Arqueológica Comprobada
                </h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {selectedPlace.archaeology}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-300)', marginBottom: '8px', fontWeight: '700' }}>
                  📖 Pasajes Sagrados Clave
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedPlace.passages.map((p, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'baseline', 
                        justifyContent: 'space-between',
                        padding: '6px 10px', 
                        borderRadius: '6px', 
                        background: 'rgba(212,175,55,0.04)',
                        border: '1px solid rgba(212,175,55,0.1)'
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--gold-200)' }}>
                        {p.ref}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        {p.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón para Consultar a Ruaj */}
              <button
                onClick={() => onConsultAI?.({
                  passage: { title: selectedPlace.name, book: selectedPlace.category, chapter: 'Geografía Sagrada' },
                  mood: 'Exploración Histórica'
                })}
                className="gold-btn-gradient"
                style={{
                  width: '100%',
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
                <span>Profundizar en Ruaj sobre {selectedPlace.name.split(' ')[0]}</span>
              </button>

            </div>
          </div>

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
