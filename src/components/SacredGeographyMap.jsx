import React, { useState } from 'react';
import { Compass, MapPin, Mountain, Droplets, Globe, Layers, Navigation, Maximize2, Shield } from 'lucide-react';

/**
 * SacredGeographyMap.jsx
 * Cartografía histórica y arqueológica interactiva con proyección geográfica real y comparativa moderna.
 * Soporta dos variantes:
 * - 'compact': Usado en el Paso 4 del Compendio Panorámico 5D.
 * - 'expansive': Usado en la pestaña dedicada «4. Geografía & Clima» (Pantalla ancha, alta resolución y análisis de 3 columnas).
 */

// Hitos de Génesis y el Creciente Fértil
const GENESIS_SITES = [
  {
    id: 'eden_mesopotamia',
    name: 'Cuenca de los Cuatro Ríos (Tigris y Éufrates)',
    modernCountry: 'Irak (Centro y Sur)',
    modernCity: 'Región entre Bagdad y Basora (Chatt al-Arab)',
    historicalEra: 'Mesopotamia Antigua / Creciente Fértil',
    travelDistance: 'Cuna de la agricultura fluvial y de las primeras ciudades-estado',
    elevation: '+40 m (Llanura aluvial)',
    climate: 'Aluvial desértico, regado por las crecidas anuales de los dos ríos',
    secularNote: 'En esta llanura entre el Tigris y el Éufrates nació la agricultura y la escritura cuneiforme hace más de 5.000 años. Los primeros pobladores sumerios construyeron canales maestros para transformar el desierto en un vergel productivo.',
    biblicalRelation: 'Génesis sitúa el huerto del Edén en esta fértil cuenca fluvial para enseñar que la vida humana no comenzó en un desierto abstracto, sino en una tierra abundante y cultivable donde el ser humano debía cuidar de la creación.',
    archaeology: 'Estratos de Tell el-Obeid y Eridu (sur de Irak). Redes de irrigación sumerias y registros agrícolas en tablillas de arcilla milenarias.',
    coordsCompact: { x: 74, y: 46 },
    coordsExpansive: { x: 780, y: 310 }
  },
  {
    id: 'ur_caldeos',
    name: 'Ur de los Caldeos',
    modernCountry: 'Irak (Sur)',
    modernCity: 'Provincia de Di Qar, a 15 km de la moderna ciudad de Nasiriyah',
    historicalEra: 'Civilización Sumeria y Babilonia',
    travelDistance: 'Aprox. 950 km hasta Harán (mes y medio de marcha fluvial en caravana)',
    elevation: '+12 m (Cerca del Golfo Pérsico)',
    climate: 'Muy caluroso y seco en verano, con tierras fértiles cerca del río',
    secularNote: 'Era una de las metrópolis más avanzadas, comerciales y cosmopolitas del mundo antiguo, con un puerto fluvial activo y un gigantesco templo escalonado (el Zigurat de Ur) dedicado a la luna.',
    biblicalRelation: 'De aquí salió Abraham con su padre Taré. Dejó atrás la comodidad y los cultos de una gran ciudad cosmopolita para obedecer el llamado de buscar una tierra nueva viviendo en tiendas.',
    archaeology: 'Gran Zigurat de Ur excavado por Sir Leonard Woolley. Se descubrieron tumbas reales con joyas de oro, liras musicales y miles de contratos comerciales en arcilla.',
    coordsCompact: { x: 80, y: 70 },
    coordsExpansive: { x: 860, y: 395 }
  },
  {
    id: 'haran',
    name: 'Harán en Padán-Aram',
    modernCountry: 'Turquía (Frontera Sur)',
    modernCity: 'Distrito de Harran, provincia de Şanlıurfa (a 18 km de la frontera con Siria)',
    historicalEra: 'Reino de Mitani / Padán-Aram',
    travelDistance: 'Aprox. 600 km hacia el sur hasta entrar en Canaán (un mes de marcha a pie)',
    elevation: '+375 m sobre el nivel del mar',
    climate: 'Estepario continental con inviernos fríos y veranos templados',
    secularNote: 'Crucero neurálgico de las grandes rutas de comerciantes entre Mesopotamia, Anatolia y el Mediterráneo. Célebre en la historia por sus casas tradicionales con techos en forma de cono de barro.',
    biblicalRelation: 'Aquí vivió la familia de Abraham tras salir de Ur y aquí falleció su padre Taré. Años más tarde, el mayordomo de Abraham y su nieto Jacob volverían a esta misma región para buscar esposa.',
    archaeology: 'Mencionada en las tablillas cuneiformes de Ebla (Siria) y Mari del segundo milenio a.C. como próspera estación caravanera internacional.',
    coordsCompact: { x: 50, y: 22 },
    coordsExpansive: { x: 520, y: 155 }
  },
  {
    id: 'siquem',
    name: 'Siquem (Valle de Moreh)',
    modernCountry: 'Cisjordania / Palestina',
    modernCity: 'Ciudad actual de Nablus, entre los montes Ebal y Gerizim',
    historicalEra: 'Canaán Central (Edad del Bronce)',
    travelDistance: 'Aprox. 45 km al norte de Hebrón (dos días de caminata a pie por el lomo montañoso)',
    elevation: '+520 m en un paso estratégico de montaña',
    climate: 'Mediterráneo de montaña, fresco y con abundantes manantiales naturales',
    secularNote: 'Paso obligatorio para cualquier viajero que cruzara Canaán de norte a sur o que viajara del Mar Mediterráneo al Río Jordán.',
    biblicalRelation: 'Fue la primera parada de Abraham al llegar a la Tierra Prometida. Allí levantó su primer altar y escuchó la promesa de que esa tierra sería para su descendencia.',
    archaeology: 'Tel Balata: Murallas ciclópeas de piedra de la Edad del Bronce Medio (hacia 1900 a.C.) y puerta monumental de la ciudad, citada en los Textos de Execración egipcios.',
    coordsCompact: { x: 34, y: 48 },
    coordsExpansive: { x: 335, y: 315 }
  },
  {
    id: 'hebron_mamre',
    name: 'Hebrón y Encinar de Mamre',
    modernCountry: 'Cisjordania / Palestina',
    modernCity: 'Ciudad de Hebrón (Al-Khalil), a 30 km al sur de Jerusalén',
    historicalEra: 'Montañas de Judea (Canaán del Sur)',
    travelDistance: 'Campamento base principal de Abraham durante décadas',
    elevation: '+930 m sobre el nivel del mar (una de las ciudades más altas de la región)',
    climate: 'Clima de montaña con brisas frescas, noches despejadas y fértiles viñedos',
    secularNote: 'Una de las poblaciones continuamente habitadas más antiguas del planeta, famosa por sus olivares, viñas y la gran mezquita/iglesia sobre la Cueva de Macpela.',
    biblicalRelation: 'Escenario de Génesis 15: aquí acampaba Abraham cuando Dios lo invitó a salir de su tienda y mirar las estrellas. Más adelante, Abraham compró allí la Cueva de Macpela para enterrar a su esposa Sara.',
    archaeology: 'Tel Rumeida: Muralla defensiva de piedra de más de 3 metros de espesor construida hacia el 1900 a.C., probando que Hebrón ya existía como ciudad fortificada en tiempos de Abraham.',
    coordsCompact: { x: 33, y: 62 },
    coordsExpansive: { x: 325, y: 360 }
  }
];

// Hitos de Judea y Salmos
const JUDEA_SITES = [
  {
    id: 'jerusalem',
    name: 'Jerusalén (Monte Sion)',
    modernCountry: 'Israel / Cisjordania',
    modernCity: 'Jerusalén',
    historicalEra: 'Monarquía Unida y Reino de Judá',
    travelDistance: 'Núcleo central de Judea',
    elevation: '+754 m en la divisoria de aguas',
    climate: 'Mediterráneo montañoso, inviernos fríos y veranos secos',
    secularNote: 'Fortaleza jebusea natural protegida por valles profundos (Cedrón y Hinom) que David convirtió en capital por su posición neutral e inexpugnable.',
    biblicalRelation: 'Centro espiritual y político donde Salomón construyó el Templo y donde David compuso muchos de sus salmos litúrgicos.',
    archaeology: 'Manantial de Gihón, túnel excavado en la roca viva por el rey Ezequías (701 a.C.) y muros de la Ciudad de David.',
    coordsCompact: { x: 38, y: 42 },
    coordsExpansive: { x: 330, y: 340 }
  },
  {
    id: 'bethlehem',
    name: 'Belén de Judá',
    modernCountry: 'Cisjordania / Palestina',
    modernCity: 'Belén (Beit Lahm), a 10 km al sur de Jerusalén',
    historicalEra: 'Colinas de Judá',
    travelDistance: '2 horas a pie desde Jerusalén',
    elevation: '+775 m sobre el nivel del mar',
    climate: 'Mediterráneo fértil hacia el oeste, con caída hacia el desierto al este',
    secularNote: 'Pueblo de pastores y agricultores situado en terrazas de cultivo de cebada, trigo y olivos.',
    biblicalRelation: 'Cuna del rey David, donde cuidaba los rebaños de ovejas de su padre y aprendió a confiar en Dios frente al león y al oso.',
    archaeology: 'Sellos reales de barro con la inscripción «Belén» del siglo VIII a.C. y restos de terrazas agrícolas milenarias.',
    coordsCompact: { x: 37, y: 52 },
    coordsExpansive: { x: 328, y: 350 }
  },
  {
    id: 'wadi_qelt',
    name: 'Wadi Qelt (Desfiladero del Desierto)',
    modernCountry: 'Cisjordania / Palestina',
    modernCity: 'Desfiladero natural entre Jerusalén y la ciudad de Jericó',
    historicalEra: 'Desierto de Judea',
    travelDistance: 'Descenso abrupto de 1.000 metros de altura en solo 25 km',
    elevation: 'De +700 m a -250 m bajo el nivel del mar',
    climate: 'Desértico árido y sofocante, donde la luz solar penetra pocas horas al día',
    secularNote: 'Cañón estrecho y peligroso de paredes calizas verticales, famoso por haber sido históricamente guarida de asaltantes de caminos.',
    biblicalRelation: 'El paisaje que inspiró la frase del Salmo 23: «Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo».',
    archaeology: 'Canales de agua excavados en los riscos por los reyes asmoneos y el Monasterio de San Jorge encastrado en la roca.',
    coordsCompact: { x: 48, y: 44 },
    coordsExpansive: { x: 360, y: 335 }
  },
  {
    id: 'engedi',
    name: 'Oasis de En-Gedi',
    modernCountry: 'Israel',
    modernCity: 'Costa occidental del Mar Muerto',
    historicalEra: 'Límite oriental del Desierto de Judea',
    travelDistance: 'Un día de marcha al este de Hebrón',
    elevation: '-200 m bajo el nivel del mar',
    climate: 'Calor tropical seco con manantiales perennes de agua dulce pura',
    secularNote: 'Un oasis verde con cascadas naturales y vegetación exuberante que brota milagrosamente en medio de la desolación de sal del Mar Muerto.',
    biblicalRelation: 'Lugar donde David y sus hombres se refugiaron en las cuevas mientras huían del rey Saúl, inspirando cantos de alivio y refugio seguro.',
    archaeology: 'Templo calcolítico, terrazas de bálsamo aromático y cuevas naturales habitadas desde hace 4.000 años.',
    coordsCompact: { x: 54, y: 68 },
    coordsExpansive: { x: 380, y: 380 }
  }
];

export default function SacredGeographyMap({ bookName = '', chapter = 1, verseRef = '', variant = 'compact' }) {
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
  const [mapLayer, setMapLayer] = useState('dual'); // 'dual' | 'ancient' | 'modern'

  React.useEffect(() => {
    setSelectedSite(getInitialSite());
  }, [isGenesis, chapter]);

  const isExpansive = variant === 'expansive';

  return (
    <div style={{
      background: 'rgba(9, 12, 19, 0.96)',
      border: '1.5px solid rgba(212,175,55,0.32)',
      borderRadius: '14px',
      padding: isExpansive ? '28px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: isExpansive ? '22px' : '16px',
      boxShadow: '0 6px 30px rgba(0,0,0,0.7)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* 1. Encabezado de la Estación Cartográfica */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: isExpansive ? '44px' : '36px',
            height: isExpansive ? '44px' : '36px',
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.18)',
            border: '1.5px solid var(--gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 15px rgba(212,175,55,0.25)'
          }}>
            <Compass size={isExpansive ? 22 : 18} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: isExpansive ? '1.45rem' : '1.2rem', fontWeight: '800' }}>
              {isGenesis 
                ? 'Estación Cartográfica de Oriente Medio: Del Mundo Bíblico a los Países de Hoy' 
                : 'Cartografía Topográfica y Física de Judea'}
            </h4>
            <span style={{ fontSize: isExpansive ? '0.88rem' : '0.82rem', color: 'var(--text-muted)' }}>
              Proyección geográfica real, orografía, cursos fluviales y equivalencia directa con las naciones actuales
            </span>
          </div>
        </div>

        {/* Selector de Capas */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.55)',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid rgba(212,175,55,0.25)',
          gap: '5px'
        }}>
          <button
            onClick={() => setMapLayer('dual')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: mapLayer === 'dual' ? '700' : '500',
              background: mapLayer === 'dual' ? 'rgba(212,175,55,0.25)' : 'transparent',
              border: `1px solid ${mapLayer === 'dual' ? 'var(--gold-400)' : 'transparent'}`,
              color: mapLayer === 'dual' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={14} color={mapLayer === 'dual' ? 'var(--gold-400)' : 'currentColor'} />
            <span>Comparativa Doble Capa</span>
          </button>

          <button
            onClick={() => setMapLayer('modern')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: mapLayer === 'modern' ? '700' : '500',
              background: mapLayer === 'modern' ? 'rgba(59,130,246,0.25)' : 'transparent',
              border: `1px solid ${mapLayer === 'modern' ? '#60a5fa' : 'transparent'}`,
              color: mapLayer === 'modern' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Globe size={14} color={mapLayer === 'modern' ? '#60a5fa' : 'currentColor'} />
            <span>Países Modernos (Hoy)</span>
          </button>

          <button
            onClick={() => setMapLayer('ancient')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: mapLayer === 'ancient' ? '700' : '500',
              background: mapLayer === 'ancient' ? 'rgba(212,175,55,0.22)' : 'transparent',
              border: `1px solid ${mapLayer === 'ancient' ? 'var(--gold-400)' : 'transparent'}`,
              color: mapLayer === 'ancient' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <span>Nombres Bíblicos Antiguos</span>
          </button>
        </div>
      </div>

      {/* 2. Botonera Táctil de Hitos Geográficos */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '10px 16px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: '700', marginRight: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={15} /> Hitos del Pasaje ({sitesList.length}):
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
                gap: '8px',
                padding: isExpansive ? '7px 14px' : '5px 12px',
                borderRadius: '6px',
                background: isSelected
                  ? 'linear-gradient(135deg, var(--gold-400) 0%, #b8860b 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: isSelected ? '1.5px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                color: isSelected ? '#030508' : '#ffffff',
                fontWeight: isSelected ? '800' : '500',
                fontSize: isExpansive ? '0.82rem' : '0.78rem',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 16px rgba(212,175,55,0.45)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ opacity: isSelected ? 1 : 0.6, fontWeight: '700' }}>{index + 1}.</span>
              <span>{site.name.split('(')[0].trim()}</span>
              <span style={{
                fontSize: '0.7rem',
                background: isSelected ? 'rgba(0,0,0,0.25)' : 'rgba(59,130,246,0.18)',
                color: isSelected ? '#000000' : '#93c5fd',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                {site.modernCountry.split('(')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. CANVAS CARTOGRÁFICO PANORÁMICO DE GRAN ESCALA (IMAX) */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: isExpansive ? '520px' : '360px',
        height: isExpansive ? '540px' : '360px',
        background: '#090e1a',
        borderRadius: '12px',
        border: '1.5px solid rgba(212,175,55,0.38)',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.9)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <svg
          viewBox={isExpansive ? "0 0 1000 520" : "0 0 500 340"}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="expSeaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082f49" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="expLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="40%" stopColor="#172235" />
              <stop offset="80%" stopColor="#131b2c" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <pattern id="mountainPattern" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 20 L 20 5 L 40 20 Z" fill="none" stroke="rgba(212,175,55,0.06)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Continente Base */}
          <rect width="100%" height="100%" fill="url(#expLandGrad)" />
          <rect width="100%" height="100%" fill="url(#mountainPattern)" opacity="0.7" />

          {isExpansive ? (
            /* =========================================================================
               VISTA PANORÁMICA EXPANSIVA (VIEWBOX 1000x520)
               ========================================================================= */
            <>
              {/* MAR MEDITERRÁNEO COMPLETO */}
              <path
                d="M 0 0 L 320 0 Q 300 70 270 120 Q 250 180 240 280 Q 230 380 180 420 Q 110 440 0 450 Z"
                fill="url(#expSeaGrad)"
                stroke="rgba(56,189,248,0.5)"
                strokeWidth="2"
              />
              {/* Isla de Chipre */}
              <path d="M 120 120 L 175 105 L 190 125 L 150 140 Z" fill="url(#expSeaGrad)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="140" y="126" fill="#7dd3fc" fontSize="11" fontWeight="700">Chipre</text>

              <text x="60" y="260" fill="#38bdf8" fontSize="16" fontWeight="800" opacity="0.85" transform="rotate(-90, 60, 260)" letterSpacing="0.2em">
                MAR MEDITERRÁNEO
              </text>

              {/* GOLFO PÉRSICO (Sur de Mesopotamia) */}
              <path
                d="M 800 370 Q 860 395 940 450 L 1000 520 L 750 520 Q 770 440 800 370 Z"
                fill="url(#expSeaGrad)"
                stroke="rgba(56,189,248,0.5)"
                strokeWidth="2"
              />
              <text x="860" y="480" fill="#7dd3fc" fontSize="14" fontWeight="800" letterSpacing="0.1em">GOLFO PÉRSICO</text>

              {/* MAR ROJO (Sinaí y Golfo de Áqaba) */}
              <path
                d="M 40 520 L 140 470 Q 150 500 170 520 Z"
                fill="url(#expSeaGrad)"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text x="70" y="510" fill="#7dd3fc" fontSize="12" fontWeight="700">Mar Rojo</text>

              {/* RÍO ÉUFRATES (Perat) */}
              <path
                d="M 370 50 Q 450 110 530 180 T 650 290 T 780 380 T 840 420"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <text x="440" y="130" fill="#bae6fd" fontSize="13" fontWeight="800">Río Éufrates (Perat)</text>

              {/* RÍO TIGRIS (Hiddekel) */}
              <path
                d="M 490 30 Q 570 90 650 170 T 730 270 T 820 370 T 840 420"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <text x="630" y="125" fill="#7dd3fc" fontSize="13" fontWeight="800">Río Tigris (Hiddekel)</text>

              {/* RÍO JORDÁN, LAGO DE GALILEA & MAR MUERTO */}
              <ellipse cx="245" cy="275" rx="5" ry="4" fill="#38bdf8" />
              <text x="255" y="278" fill="#93c5fd" fontSize="9" fontWeight="700">Mar de Galilea</text>
              <path d="M 245 280 L 246 320" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <ellipse cx="246" cy="335" rx="6" ry="14" fill="#0284c7" />
              <text x="258" y="340" fill="#93c5fd" fontSize="10" fontWeight="800">Mar Muerto (-430m)</text>

              {/* RUTA DE ABRAHAM (Caravana dorada con flechas) */}
              <path
                d="M 850 395 Q 680 290 520 155 L 340 310 L 325 360"
                fill="none"
                stroke="#ffd700"
                strokeWidth="3.5"
                strokeDasharray="8 6"
              />
              <text x="480" y="260" fill="#fef08a" fontSize="12" fontWeight="700" opacity="0.9">
                Ruta Migratoria de Abraham: Ur (Irak) ➔ Harán (Turquía) ➔ Siquem ➔ Hebrón (Cisjordania)
              </text>

              {/* CAPAS DE PAÍSES MODERNOS CON BANDERAS Y LÍMITES */}
              {(mapLayer === 'dual' || mapLayer === 'modern') && (
                <>
                  {/* Límites internacionales modernos punteados */}
                  <path d="M 290 85 L 610 90 L 900 180" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5 5" />
                  <path d="M 450 90 L 430 210 L 590 310" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="5 5" />

                  {/* Badges de Países Modernos */}
                  <g transform="translate(480, 25)">
                    <rect width="135" height="26" rx="6" fill="rgba(15,23,42,0.92)" stroke="#60a5fa" strokeWidth="1.5" />
                    <text x="10" y="18" fill="#93c5fd" fontSize="12" fontWeight="800">🇹🇷 TURQUÍA</text>
                  </g>

                  <g transform="translate(370, 170)">
                    <rect width="105" height="26" rx="6" fill="rgba(15,23,42,0.92)" stroke="#60a5fa" strokeWidth="1.5" />
                    <text x="10" y="18" fill="#93c5fd" fontSize="12" fontWeight="800">🇸🇾 SIRIA</text>
                  </g>

                  <g transform="translate(680, 230)">
                    <rect width="105" height="26" rx="6" fill="rgba(15,23,42,0.92)" stroke="#60a5fa" strokeWidth="1.5" />
                    <text x="10" y="18" fill="#93c5fd" fontSize="12" fontWeight="800">🇮🇶 IRAK</text>
                  </g>

                  <g transform="translate(160, 360)">
                    <rect width="155" height="26" rx="6" fill="rgba(15,23,42,0.92)" stroke="#4ade80" strokeWidth="1.5" />
                    <text x="10" y="18" fill="#86efac" fontSize="11" fontWeight="800">🇵🇸 CISJORDANIA</text>
                  </g>

                  <g transform="translate(265, 410)">
                    <rect width="125" height="26" rx="6" fill="rgba(15,23,42,0.92)" stroke="#60a5fa" strokeWidth="1.5" />
                    <text x="10" y="18" fill="#93c5fd" fontSize="11" fontWeight="800">🇯🇴 JORDANIA</text>
                  </g>

                  <g transform="translate(30, 460)">
                    <rect width="110" height="26" rx="6" fill="rgba(15,23,42,0.92)" stroke="#60a5fa" strokeWidth="1.5" />
                    <text x="10" y="18" fill="#93c5fd" fontSize="12" fontWeight="800">🇪🇬 EGIPTO</text>
                  </g>
                </>
              )}

              {/* Rótulos del Mundo Antiguo */}
              {(mapLayer === 'dual' || mapLayer === 'ancient') && (
                <>
                  <text x="660" y="340" fill="#fef08a" fontSize="15" fontWeight="800" opacity="0.7" letterSpacing="0.15em">MESOPOTAMIA</text>
                  <text x="215" y="240" fill="#fef08a" fontSize="14" fontWeight="800" opacity="0.7" letterSpacing="0.15em">CANAÁN</text>
                  <text x="470" y="110" fill="#fef08a" fontSize="13" fontWeight="700" opacity="0.6">PADÁN-ARAM</text>
                </>
              )}

              {/* Puntos de los Hitos Cartográficos */}
              {sitesList.map((site) => {
                const isSelected = selectedSite.id === site.id;
                const pos = site.coordsExpansive;
                return (
                  <g key={site.id} onClick={() => setSelectedSite(site)} style={{ cursor: 'pointer' }}>
                    {isSelected && (
                      <circle cx={pos.x} cy={pos.y} r="26" fill="none" stroke="#ffd700" strokeWidth="2.5" opacity="0.9">
                        <animate attributeName="r" values="10;32;10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? "11" : "7"}
                      fill={isSelected ? "#ffd700" : "#0284c7"}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "3" : "2"}
                    />
                    <rect
                      x={pos.x + 12}
                      y={pos.y - 14}
                      width={site.name.split('(')[0].trim().length * 8.5 + 24}
                      height="26"
                      rx="6"
                      fill={isSelected ? "rgba(212,175,55,0.98)" : "rgba(10,15,26,0.9)"}
                      stroke={isSelected ? "#ffffff" : "rgba(212,175,55,0.5)"}
                      strokeWidth="1.5"
                    />
                    <text
                      x={pos.x + 20}
                      y={pos.y + 4}
                      fill={isSelected ? "#000000" : "#ffffff"}
                      fontSize="12"
                      fontWeight="800"
                      fontFamily="sans-serif"
                    >
                      {site.name.split('(')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </>
          ) : (
            /* =========================================================================
               VISTA COMPACTA PARA EL COMPENDIO 5D (VIEWBOX 500x340)
               ========================================================================= */
            <>
              {/* Mar Mediterráneo */}
              <path
                d="M 0 0 L 170 0 Q 150 40 130 75 Q 120 120 115 190 Q 110 250 85 270 Q 50 285 0 290 Z"
                fill="url(#expSeaGrad)"
                stroke="rgba(56,189,248,0.4)"
                strokeWidth="1.5"
              />
              <text x="25" y="160" fill="#38bdf8" fontSize="10" fontWeight="700" opacity="0.85" transform="rotate(-90, 25, 160)">
                MAR MEDITERRÁNEO
              </text>

              {/* Golfo Pérsico */}
              <path d="M 400 240 Q 430 255 470 290 L 500 340 L 370 340 Q 380 290 400 240 Z" fill="url(#expSeaGrad)" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="430" y="315" fill="#7dd3fc" fontSize="9" fontWeight="700">Golfo Pérsico</text>

              {/* Ríos Éufrates y Tigris */}
              <path d="M 180 30 Q 220 70 260 115 T 320 185 T 385 245 T 415 270" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <path d="M 240 20 Q 280 60 320 110 T 360 175 T 405 240 T 415 270" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <text x="215" y="85" fill="#bae6fd" fontSize="9" fontWeight="700">Éufrates</text>
              <text x="310" y="80" fill="#7dd3fc" fontSize="9" fontWeight="700">Tigris</text>

              {/* Ruta Abraham */}
              <path d="M 400 240 Q 320 180 250 80 L 120 190 L 115 220" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 4" />

              {/* Capas Modernas */}
              {(mapLayer === 'dual' || mapLayer === 'modern') && (
                <>
                  <rect x="235" y="15" width="65" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#60a5fa" strokeWidth="1" />
                  <text x="242" y="28" fill="#93c5fd" fontSize="9" fontWeight="800">TURQUÍA</text>
                  <rect x="330" y="145" width="50" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#60a5fa" strokeWidth="1" />
                  <text x="340" y="158" fill="#93c5fd" fontSize="9" fontWeight="800">IRAK</text>
                  <rect x="75" y="225" width="70" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#4ade80" strokeWidth="1" />
                  <text x="80" y="238" fill="#86efac" fontSize="8" fontWeight="800">CISJORDANIA</text>
                </>
              )}

              {/* Hitos */}
              {sitesList.map((site) => {
                const isSelected = selectedSite.id === site.id;
                const cx = (site.coordsCompact.x / 100) * 500;
                const cy = (site.coordsCompact.y / 100) * 340;
                return (
                  <g key={site.id} onClick={() => setSelectedSite(site)} style={{ cursor: 'pointer' }}>
                    <circle cx={cx} cy={cy} r={isSelected ? "8" : "5"} fill={isSelected ? "#ffd700" : "#0284c7"} stroke="#ffffff" strokeWidth="1.5" />
                    <text x={cx + 9} y={cy + 3} fill={isSelected ? "#ffd700" : "#ffffff"} fontSize="9" fontWeight="800">
                      {site.name.split('(')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>

        {/* Leyenda Inferior del Mapa */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          background: 'rgba(5, 7, 12, 0.94)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '0.78rem',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 10px #ffd700' }} />
            <span>Hito seleccionado: <strong>{selectedSite.name}</strong></span>
            <span style={{ color: '#93c5fd', marginLeft: '6px' }}>📍 {selectedSite.modernCountry}</span>
          </div>
          <span style={{ color: 'var(--gold-300)' }}>
            Haga clic en cualquier punto del mapa o botón superior para examinar
          </span>
        </div>
      </div>

      {/* 4. PANEL DE PROFUNDIZACIÓN GEOGRÁFICA (EXPANSIVO EN 3 COLUMNAS O COMPACTO) */}
      {isExpansive ? (
        /* Estructura Panorámica en 3 Columnas Ricas */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '18px'
        }}>
          {/* Columna 1: Ubicación Política Actual */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, rgba(10,14,24,0.95) 100%)',
            border: '1.5px solid rgba(147,197,253,0.35)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="#60a5fa" />
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Ubicación en el Mapa Actual
              </h5>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>
              {selectedSite.modernCountry}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong>Ciudad y Entorno Hoy:</strong> {selectedSite.modernCity}
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.82rem',
              color: '#93c5fd'
            }}>
              <strong>Jornadas y Distancia:</strong> {selectedSite.travelDistance}
            </div>
          </div>

          {/* Columna 2: Evidencia Arqueológica Laica */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(212,175,55,0.12) 0%, rgba(10,14,24,0.95) 100%)',
            border: '1.5px solid rgba(212,175,55,0.35)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--gold-400)" />
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Arqueología y Excavaciones
              </h5>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6 }}>
              {selectedSite.secularNote}
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(212,175,55,0.2)',
              fontSize: '0.82rem',
              color: '#cbd5e1'
            }}>
              <strong style={{ color: 'var(--gold-300)' }}>Hallazgos:</strong> {selectedSite.archaeology}
            </div>
          </div>

          {/* Columna 3: Orografía, Clima y Significado Bíblico */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(74,222,128,0.1) 0%, rgba(10,14,24,0.95) 100%)',
            border: '1.5px solid rgba(74,222,128,0.35)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mountain size={18} color="#4ade80" />
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. Terreno, Clima y Sentido Bíblico
              </h5>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', color: '#ffffff', fontWeight: '700' }}>
                Elevación: {selectedSite.elevation}
              </span>
              <span style={{ fontSize: '0.78rem', background: 'rgba(74,222,128,0.1)', padding: '3px 8px', borderRadius: '4px', color: '#86efac', fontWeight: '700' }}>
                Clima: {selectedSite.climate}
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#fef08a', lineHeight: 1.6, fontStyle: 'italic' }}>
              {selectedSite.biblicalRelation}
            </div>
          </div>
        </div>
      ) : (
        /* Variante Compacta (Para Paso 4 del Compendio) */
        <div style={{
          background: 'rgba(11, 15, 24, 0.95)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase' }}>
              📍 DÓNDE QUEDA HOY:
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
              {selectedSite.modernCountry} — {selectedSite.modernCity}
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: '6px 0 0' }}>
              {selectedSite.secularNote}
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: '800', textTransform: 'uppercase' }}>
              📖 RELEVANCIA EN ESTE PASAJE:
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--gold-100)', lineHeight: 1.5, margin: '4px 0 0', fontStyle: 'italic' }}>
              {selectedSite.biblicalRelation}
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <strong>Arqueología:</strong> {selectedSite.archaeology}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
