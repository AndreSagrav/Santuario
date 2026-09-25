import React, { useState } from 'react';
import { Compass, MapPin, Mountain, Droplets } from 'lucide-react';

/**
 * SacredGeographyMap.jsx
 * Mapa topográfico y arqueológico interactivo contextualizado por libro bíblico:
 * - Génesis & Pentateuco: Cuenca Mesopotámica, Tigris, Éufrates y Canaán Patriarcal
 * - Salmos & Libros Históricos: Topografía de Judea, Sion, Belén, Desierto y Oasis
 * - Evangelios & Hechos: Galilea, Valle del Jordán, Judea y Mundo Grecorromano
 */

// Sitios para Génesis y Pentateuco (Mesopotamia, Edén, Creciente Fértil)
const GENESIS_SITES = [
  {
    id: 'eden_mesopotamia',
    name: 'Cuenca de los Cuatro Ríos (Tigris y Éufrates)',
    hebrew: 'נְהַר פְּרָת וְחִדֶּקֶל (Perat w-Jiddeqel)',
    elevation: '+50 m (Llanura aluvial)',
    climate: 'Aluvial subtropical desértico, regado por crecidas fluviales históricas',
    archaeology: 'Estratos de Tell el-Obeid y Eridu (V-IV milenio a.C.). Complejo sistema de canales sumerios descritos en los textos cuneiformes más antiguos.',
    secularNote: 'El Génesis sitúa la morada primordial en la fértil cuenca del Creciente Fértil, entre el Hiddekel (Tigris) y el Perat (Éufrates), el corazón agrícola de la civilización.',
    exegeticalConnection: 'Enfatiza que la creación del ser humano no ocurrió en un vacío mítico abstracto, sino en un huerto real y deleitoso provisto de ríos abundantes para ser labrado y guardado.',
    coords: { x: 75, y: 35 }
  },
  {
    id: 'ur_caldeos',
    name: 'Ur de los Caldeos (Mesopotamia Meridional)',
    hebrew: 'אוּר כַּשְׂדִּים (Ur Kasdim)',
    elevation: '+10 m (Cerca del Golfo Pérsico)',
    climate: 'Árido extremoso con tierras pantanosas aluviales',
    archaeology: 'Gran Zigurat de Ur excavado por Sir Leonard Woolley. Archivos cuneiformes del III milenio a.C. dedicados al culto lunar del dios Nanna.',
    secularNote: 'Metrópolis comercial y cosmopolita sumeria de donde partió Taré y su hijo Abram hacia la tierra que Dios le mostraría.',
    exegeticalConnection: 'Punto de partida de la historia de la redención patriarcal: Abram fue llamado a renunciar al politeísmo urbano floreciente para caminar por fe.',
    coords: { x: 82, y: 72 }
  },
  {
    id: 'haran',
    name: 'Harán en Padán-Aram (Alta Mesopotamia)',
    hebrew: 'חָרָן (Jarán - «Encrucijada»)',
    elevation: '+375 m sobre el nivel del mar',
    climate: 'Estepario continental con llanuras cerealistas',
    archaeology: 'Mencionada en las tablillas de Ebla y Mari (siglo XVIII a.C.). Importante centro de rutas caravaneras entre Babilonia, Asiria y el Mediterráneo.',
    secularNote: 'Lugar donde habitó la familia de Abram tras salir de Ur y donde murió Taré (Génesis 11:31-32). Cuna familiar de Rebeca, Lea y Raquel.',
    exegeticalConnection: 'Escenario de la segunda confirmación del llamado divino: «Vete de tu tierra y de tu parentela... y haré de ti una nación grande».',
    coords: { x: 60, y: 20 }
  },
  {
    id: 'siquem',
    name: 'Siquem / Encinar de Moreh (Canaán Central)',
    hebrew: 'שְׁכֶם (Shejem / Encinar de Moreh)',
    elevation: '+520 m (Paso entre los montes Ebal y Gerizim)',
    climate: 'Mediterráneo montañoso fértil, rico en manantiales',
    archaeology: 'Tel Balata: Ciudad cananea fortificada con murallas ciclópeas del Bronce Medio (c. 1900-1750 a.C.), documentada en los Textos de Execración egipcios (siglo XIX a.C.) contemporáneos a la época patriarcal.',
    secularNote: 'Encrucijada geográfica obligada que conecta las rutas de la costa con el valle del Jordán y la cordillera central de Samaria.',
    exegeticalConnection: 'Lugar del primer altar de Abram en la Tierra Prometida (Génesis 12:6-7) donde Yahweh se le apareció y prometió: «A tu simiente daré esta tierra».',
    coords: { x: 45, y: 48 }
  },
  {
    id: 'hebron_mamre',
    name: 'Hebrón y Encinar de Mamre (Sepulcro Patriarcal)',
    hebrew: 'חֶבְרוֹן וְאֵלוֹנֵי מַמְרֵא (Jevrón u-Mamre)',
    elevation: '+930 m sobre el nivel del mar',
    climate: 'Templado de montaña con terrazas de viñas milenarias',
    archaeology: 'Tel Rumeida: Enorme muralla de piedra del Bronce Medio (c. 2000-1750 a.C.) que corrobora la existencia de Hebrón como ciudad fortificada en tiempos de Abraham. Recinto monumental de la Cueva de Macpela preservado.',
    secularNote: 'Única propiedad territorial que Abraham compró legalmente por plata a Efrón el hitita para sepulcro de Sara y los patriarcas.',
    exegeticalConnection: 'Epicentro del pacto de la circuncisión y la teofanía de los tres visitantes celestiales en las tiendas de Mamre (Génesis 18).',
    coords: { x: 42, y: 64 }
  }
];

// Sitios para Salmos, Monarquía e Históricos (Judea y Desierto)
const JUDEA_SITES = [
  {
    id: 'jerusalem',
    name: 'Jerusalén (Monte Sion & Morada Divina)',
    hebrew: 'יְרוּשָׁלַיִם (Yerushalayim)',
    elevation: '+754 m',
    climate: 'Mediterráneo semiárido montañoso, vientos del oeste',
    archaeology: 'Manantial de Gihón, sistema de túneles cananeos del siglo XVIII a.C., Muro de Nehemías y Ciudad de David (Ophel).',
    secularNote: 'Eje estratégico conquistado por David a los jebuseos para fundar la capital neutral unificada de las doce tribus de Israel.',
    exegeticalConnection: 'Cima cósmica del culto y de la morada eterna del Eterno: «en la casa de Jehová moraré por largos días».',
    coords: { x: 44, y: 42 }
  },
  {
    id: 'wadi_qelt',
    name: 'Wadi Qelt (Valle de Sombra de Muerte)',
    hebrew: 'גֵּיא צַלְמָוֶת (Gey Tsalmaveth)',
    elevation: '-120 m a +250 m',
    climate: 'Desértico árido extremo, lluvia < 120 mm/año',
    archaeology: 'Profundo desfiladero calizo de 45 km entre Jerusalén y Jericó con cuevas de pastores y acueductos asmoneos.',
    secularNote: 'Garganta angosta donde la luz del sol apenas penetra 1 hora al día; paso peligroso por emboscadas y depredadores.',
    exegeticalConnection: 'Arquetipo geográfico de «aunque ande en valle de sombra de muerte, no temeré mal alguno: tu vara y tu cayado me infunden aliento».',
    coords: { x: 58, y: 44 }
  },
  {
    id: 'bethlehem',
    name: 'Belén de Judá (Laderas del Efrata)',
    hebrew: 'בֵּית לֶחֶם (Bet Léjem)',
    elevation: '+775 m sobre el nivel del mar',
    climate: 'Mediterráneo montañoso, inviernos fríos y lluvias estacionales',
    archaeology: 'Trazas de asentamientos del Bronce Tardío y Hierro I con terrazas agrícolas escalonadas y corrales de piedra caliza.',
    secularNote: 'Situada en la divisoria de aguas: colinas fértiles hacia el oeste y caída abrupta hacia el desierto desolado hacia el este.',
    exegeticalConnection: 'Cuna del pastoreo de David donde experimentó la defensa de sus rebaños frente a leones y osos, forjando su fe inquebrantable.',
    coords: { x: 42, y: 56 }
  },
  {
    id: 'engedi',
    name: 'Oasis de En-Gedi (Aguas de Reposo)',
    hebrew: 'עֵין גֶּדִי (Ein Guedi - Manantial del Cabrito)',
    elevation: '-200 m (Junto al Mar Muerto)',
    climate: 'Hiperárido con manantiales de agua dulce perennes y cascadas',
    archaeology: 'Santuario calcolítico, terrazas de bálsamo y cuevas de refugio davídico frente a Saúl (1 Samuel 24).',
    secularNote: 'Oasis exuberante en medio de la desolación salina del Mar Muerto, donde la fauna del desierto encuentra sustento vital.',
    exegeticalConnection: 'Ilustra con exactitud «junto a aguas de reposo me pastoreará»: corrientes mansas y puras donde el rebaño puede beber sin peligro.',
    coords: { x: 68, y: 72 }
  },
  {
    id: 'judean_wilderness',
    name: 'Desierto de Judá (Midbar Yehuda)',
    hebrew: 'מִדְבַּר יְהוּדָה (Midbar Yehuda)',
    elevation: 'De +1000 m a -430 m',
    climate: 'Sombra de lluvia orográfica, pluviosidad nula en verano',
    archaeology: 'Cuevas de habitación de pastores trashumantes, manuscritos de Qumrán y fortalezas asmonéas.',
    secularNote: 'Territorio inhóspito de supervivencia donde los senderos mal calculados conducen a precipicios mortales.',
    exegeticalConnection: 'Marco de «me guiará por sendas de justicia»: caminos firmes y seguros trazados por el pastor experimentado para preservar la vida.',
    coords: { x: 55, y: 62 }
  }
];

export default function SacredGeographyMap({ bookName = '', chapter = 1, verseRef = '' }) {
  const norm = (bookName || verseRef || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isGenesis = norm.includes('genesis') || norm.includes('exodo') || norm.includes('levitico') || norm.includes('numeros') || norm.includes('deuteronomio');
  
  const sitesList = isGenesis ? GENESIS_SITES : JUDEA_SITES;

  const getInitialSite = () => {
    if (isGenesis) {
      const c = Number(chapter) || 1;
      if (c >= 13 && c <= 25) {
        return GENESIS_SITES.find(s => s.id === 'hebron_mamre') || GENESIS_SITES[0];
      }
      if (c === 12) {
        return GENESIS_SITES.find(s => s.id === 'siquem') || GENESIS_SITES[0];
      }
      if (c === 11) {
        return GENESIS_SITES.find(s => s.id === 'ur_caldeos') || GENESIS_SITES[0];
      }
      return GENESIS_SITES[0];
    }
    return JUDEA_SITES[0];
  };

  const [selectedSite, setSelectedSite] = useState(getInitialSite());

  // Si cambia el libro o el capítulo, sincronizar el sitio más relevante
  React.useEffect(() => {
    setSelectedSite(getInitialSite());
  }, [isGenesis, chapter]);

  return (
    <div style={{
      background: 'rgba(10, 13, 20, 0.95)',
      border: '1px solid rgba(212,175,55,0.25)',
      borderRadius: '12px',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      {/* Encabezado del Mapa */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.15)',
            border: '1px solid var(--gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Compass size={17} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
              {isGenesis 
                ? 'Geografía Histórica de los Orígenes & Creciente Fértil' 
                : 'Cartografía Topográfica & Arqueológica de Judea'}
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {isGenesis 
                ? 'Mesopotamia, cuenca fluvial del Edén y rutas migratorias patriarcales'
                : 'Orografía física, desfiladeros, precipitaciones y yacimientos del entorno bíblico'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.74rem', color: '#93c5fd', background: 'rgba(59,130,246,0.12)', padding: '3px 9px', borderRadius: '4px', border: '1px solid rgba(147,197,253,0.3)', fontWeight: '600' }}>
            {isGenesis ? 'Región: Tigris, Éufrates & Canaán' : 'Elevaciones: +1000m a -430m'}
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.08)', padding: '3px 9px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.3)', fontWeight: '600' }}>
            {sitesList.length} Hitos Cartográficos
          </span>
        </div>
      </div>

      {/* Selector de Hitos Geográficos en Botones Claros y Accesibles */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '8px',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginRight: '6px' }}>
          <MapPin size={13} color="var(--gold-400)" />
          <strong style={{ color: 'var(--gold-300)' }}>Hitos ({sitesList.length}):</strong>
        </span>
        {sitesList.map((site, index) => {
          const isSelected = selectedSite.id === site.id;
          return (
            <button
              key={site.id}
              onClick={() => setSelectedSite(site)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                background: isSelected
                  ? 'linear-gradient(135deg, var(--gold-400) 0%, #b8860b 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: isSelected
                  ? '1.5px solid #ffd700'
                  : '1px solid rgba(255,255,255,0.1)',
                color: isSelected ? '#05070a' : '#ffffff',
                fontWeight: isSelected ? '800' : '500',
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 12px rgba(212,175,55,0.4)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title={`Examinar hito: ${site.name}`}
            >
              <span style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6 }}>{index + 1}.</span>
              <span>{site.name.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Grid: Canvas Topográfico Iluminado a la Izquierda + Ficha Arqueológica a la Derecha */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '18px',
        alignItems: 'stretch'
      }}>
        {/* Panel del Mapa Topográfico SVG de Alta Visibilidad */}
        <div style={{
          position: 'relative',
          minHeight: '340px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #090d16 100%)',
          borderRadius: '10px',
          border: '1.5px solid rgba(212,175,55,0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.7)'
        }}>
          {/* Gráfico Topográfico SVG Claro y Contrastado */}
          <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="reliefGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#d4af37" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {isGenesis ? (
              /* Mapa Fluvial de Mesopotamia y Creciente Fértil */
              <>
                {/* Cuenca Fluvial Éufrates */}
                <path d="M 40 180 Q 55 120 70 80 T 85 40" fill="none" stroke="url(#riverGrad)" strokeWidth="4" />
                <text x="56" y="90" fill="#7dd3fc" fontSize="11" fontWeight="700" fontFamily="sans-serif">Éufrates (Perat)</text>

                {/* Cuenca Fluvial Tigris */}
                <path d="M 65 240 Q 75 160 85 100 T 95 30" fill="none" stroke="url(#riverGrad)" strokeWidth="3" />
                <text x="76" y="150" fill="#38bdf8" fontSize="11" fontWeight="700" fontFamily="sans-serif">Tigris (Hiddekel)</text>

                {/* Arco del Creciente Fértil */}
                <path d="M 30 260 Q 50 140 75 90 T 90 280" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="18" opacity="0.35" />
                
                {/* Costa Mediterránea */}
                <path d="M 32 60 Q 36 180 34 320" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="5 3" />
                <text x="15" y="200" fill="#38bdf8" fontSize="10" transform="rotate(-90, 15, 200)" fontFamily="sans-serif">GRAN MAR (Mediterráneo)</text>
              </>
            ) : (
              /* Mapa de Judea y Desierto */
              <>
                {/* Depresión del Mar Muerto */}
                <path d="M 270 90 Q 310 190 290 310 Q 275 350 260 370 L 370 370 L 370 90 Z" fill="#0284c7" opacity="0.35" />
                <text x="290" y="230" fill="#38bdf8" fontSize="11" fontWeight="700" transform="rotate(75, 290, 230)" fontFamily="sans-serif">MAR MUERTO (-430m)</text>

                {/* Ruta del Cañón Wadi Qelt */}
                <path d="M 170 150 Q 200 170 230 160 T 280 180" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="4 3" />
                <text x="195" y="148" fill="#fef08a" fontSize="11" fontWeight="700" fontFamily="sans-serif">Wadi Qelt</text>

                {/* Cordillera de las Montañas de Judea */}
                <path d="M 140 30 L 160 370" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="22" strokeLinecap="round" opacity="0.4" />
                <text x="130" y="55" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="sans-serif">Cordillera de Judea (+850m)</text>
              </>
            )}
          </svg>

          {/* Marcadores Luminosos de Sitios */}
          {sitesList.map((site) => {
            const isSelected = selectedSite.id === site.id;
            return (
              <button
                key={site.id}
                onClick={() => setSelectedSite(site)}
                style={{
                  position: 'absolute',
                  top: `${site.coords.y}%`,
                  left: `${site.coords.x}%`,
                  transform: 'translate(-50%, -50%)',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #ffd700 0%, #d4af37 100%)' 
                    : 'rgba(10, 15, 26, 0.92)',
                  color: isSelected ? '#040508' : '#fef08a',
                  border: isSelected ? '2px solid #ffffff' : '1px solid rgba(212,175,55,0.5)',
                  boxShadow: isSelected 
                    ? '0 0 20px rgba(255,215,0,0.8), 0 0 8px #ffffff' 
                    : '0 2px 8px rgba(0,0,0,0.8)',
                  borderRadius: '9999px',
                  padding: '5px 11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 2,
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <MapPin size={12} color={isSelected ? '#040508' : 'var(--gold-400)'} />
                <span>{site.name.split(' ')[0]}</span>
              </button>
            );
          })}

          {/* Leyenda en la esquina del Mapa */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            background: 'rgba(5, 7, 12, 0.92)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.72rem',
            color: '#e2e8f0',
            zIndex: 5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 6px #ffd700' }} />
              <span>Clic en cualquier punto para examinar arqueología y orografía</span>
            </div>
          </div>
        </div>

        {/* Ficha Arqueológica y Topográfica del Sitio Seleccionado */}
        <div style={{
          background: 'rgba(11, 14, 22, 0.95)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Hito Geográfico Seleccionado
              </span>
              <span style={{
                fontFamily: "'SBL Hebrew', serif",
                fontSize: '1.15rem',
                color: '#fef08a',
                direction: 'rtl'
              }}>
                {selectedSite.hebrew}
              </span>
            </div>

            <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '800', margin: '2px 0 10px' }}>
              {selectedSite.name}
            </h3>

            {/* Badges de Elevación y Clima */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '3px 9px',
                borderRadius: '4px',
                color: '#cbd5e1',
                fontWeight: '600'
              }}>
                <Mountain size={12} color="#94a3b8" />
                <span>Elevación: {selectedSite.elevation}</span>
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
                padding: '3px 9px',
                borderRadius: '4px',
                color: 'var(--gold-300)',
                fontWeight: '600'
              }}>
                <Droplets size={12} color="var(--gold-400)" />
                <span>{selectedSite.climate}</span>
              </span>
            </div>

            {/* Texto Arqueológico Laico */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '0.76rem', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                Arqueología & Geografía Física Laica:
              </span>
              <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                {selectedSite.secularNote}
              </p>
            </div>

            {/* Conexión Exegética Rigurosa */}
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                Conexión Exegética & Significado Bíblico:
              </span>
              <p style={{ fontSize: '0.86rem', color: 'var(--gold-100)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                {selectedSite.exegeticalConnection}
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            <strong style={{ color: '#94a3b8' }}>Evidencia Arqueológica:</strong> {selectedSite.archaeology}
          </div>
        </div>
      </div>
    </div>
  );
}
