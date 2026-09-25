import React, { useState } from 'react';
import { Compass, MapPin, Mountain, Droplets, Globe, Layers, Navigation } from 'lucide-react';

/**
 * SacredGeographyMap.jsx
 * Mapa geográfico histórico con comparativa directa de países modernos:
 * - Visión del Mundo Bíblico vs. Países Actuales (Irak, Turquía, Siria, Israel, Cisjordania, Jordania, Egipto)
 * - Rutas reales de caravanas, distancias en jornadas de camino y arqueología accesible.
 */

// Hitos de Génesis y el Creciente Fértil
const GENESIS_SITES = [
  {
    id: 'eden_mesopotamia',
    name: 'Cuenca de los Cuatro Ríos (Tigris y Éufrates)',
    modernCountry: 'Irak (Centro y Sur)',
    modernCity: 'Región entre Bagdad y Basora (Chatt al-Arab)',
    historicalEra: 'Mesopotamia Antigua / Creciente Fértil',
    travelDistance: 'Punto de origen de la agricultura fluvial en la Media Luna Fértil',
    elevation: '+40 m (Llanura aluvial fértil)',
    climate: 'Aluvial desértico, regado por las crecidas anuales de los dos ríos',
    secularNote: 'En esta llanura entre el Tigris y el Éufrates nació la agricultura y la escritura cuneiforme hace más de 5.000 años. Los primeros pueblos construyeron diques y canales para convertir el desierto en un vergel productivo.',
    biblicalRelation: 'Génesis sitúa el huerto del Edén en esta fértil cuenca fluvial para enseñar que la vida humana no comenzó en un desierto abstracto, sino en una tierra abundante y cultivable donde el ser humano debía cuidar de la creación.',
    archaeology: 'Yacimientos de Tell el-Obeid y Eridu (sur de Irak). Canales sumerios y registros agrícolas milenarios.',
    coords: { x: 74, y: 46 }
  },
  {
    id: 'ur_caldeos',
    name: 'Ur de los Caldeos',
    modernCountry: 'Irak (Sur)',
    modernCity: 'Provincia de Di Qar, a 15 km de la moderna ciudad de Nasiriyah',
    historicalEra: 'Civilización Sumeria y Babilonia',
    travelDistance: 'Aprox. 950 km hasta Harán (mes y medio de viaje en caravana junto al río)',
    elevation: '+12 m (Cerca de las marismas del Golfo Pérsico)',
    climate: 'Muy caluroso y seco en verano, con tierras fértiles cerca del río',
    secularNote: 'Era una de las metrópolis más avanzadas, comerciales y cosmopolitas del mundo antiguo, con un puerto fluvial activo y un gigantesco templo escalonado (el Zigurat de Ur) dedicado a la luna.',
    biblicalRelation: 'De aquí salió Abraham con su padre Taré. Dejó atrás la comodidad y los cultos de una gran ciudad cosmopolita para obedecer el llamado de buscar una tierra nueva viviendo en tiendas.',
    archaeology: 'Gran Zigurat de Ur excavado por Sir Leonard Woolley. Se descubrieron tumbas reales con joyas de oro, liras musicales y miles de contratos en tablillas de arcilla.',
    coords: { x: 80, y: 70 }
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
    archaeology: 'Mencionada en las tablillas de Ebla (Siria) y Mari del segundo milenio a.C. como próspera estación caravanera.',
    coords: { x: 50, y: 22 }
  },
  {
    id: 'siquem',
    name: 'Siquem (Valle de Moreh)',
    modernCountry: 'Cisjordania / Palestina',
    modernCity: 'Ciudad actual de Nablus, entre los montes Ebal y Gerizim',
    historicalEra: 'Canaán Central (Edad del Bronce)',
    travelDistance: 'Aprox. 45 km al sur de Hebrón (dos días de caminata a pie por el lomo montañoso)',
    elevation: '+520 m en un paso estratégico de montaña',
    climate: 'Mediterráneo de montaña, fresco y con abundantes manantiales naturales',
    secularNote: 'Paso obligatorio para cualquier viajero que cruzara Canaán de norte a sur o que viajara del Mar Mediterráneo al Río Jordán.',
    biblicalRelation: 'Fue la primera parada de Abraham al llegar a la Tierra Prometida. Allí levantó su primer altar y escuchó la promesa de que esa tierra sería para su descendencia.',
    archaeology: 'Tel Balata: Murallas ciclópeas de piedra de la Edad del Bronce Medio (hacia 1900 a.C.) y puerta monumental de la ciudad, citada en los Textos de Execración egipcios.',
    coords: { x: 34, y: 48 }
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
    coords: { x: 33, y: 62 }
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
    coords: { x: 38, y: 42 }
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
    coords: { x: 37, y: 52 }
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
    coords: { x: 48, y: 44 }
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
    coords: { x: 54, y: 68 }
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
  const [mapLayer, setMapLayer] = useState('dual'); // 'dual' | 'ancient' | 'modern'

  React.useEffect(() => {
    setSelectedSite(getInitialSite());
  }, [isGenesis, chapter]);

  return (
    <div style={{
      background: 'rgba(9, 12, 19, 0.96)',
      border: '1px solid rgba(212,175,55,0.28)',
      borderRadius: '12px',
      padding: '22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)'
    }}>
      {/* 1. Encabezado Claro con Título y Modos de Vista */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.15)',
            border: '1.5px solid var(--gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Compass size={18} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
              {isGenesis 
                ? 'Geografía Real: Del Mundo Antiguo a los Países de Hoy' 
                : 'Mapa Topográfico de Judea y Países Modernos'}
            </h4>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Ubicación física en el terreno y equivalencia con las fronteras y naciones actuales
            </span>
          </div>
        </div>

        {/* Conmutador de Modos de Mapa: Bíblico vs Países Actuales vs Ambos */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.45)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid rgba(212,175,55,0.25)',
          gap: '4px'
        }}>
          <button
            onClick={() => setMapLayer('dual')}
            style={{
              padding: '5px 11px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: mapLayer === 'dual' ? '700' : '500',
              background: mapLayer === 'dual' ? 'rgba(212,175,55,0.22)' : 'transparent',
              border: `1px solid ${mapLayer === 'dual' ? 'var(--gold-400)' : 'transparent'}`,
              color: mapLayer === 'dual' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Layers size={13} color={mapLayer === 'dual' ? 'var(--gold-400)' : 'currentColor'} />
            <span>Comparativa Doble (Recomendada)</span>
          </button>

          <button
            onClick={() => setMapLayer('modern')}
            style={{
              padding: '5px 11px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: mapLayer === 'modern' ? '700' : '500',
              background: mapLayer === 'modern' ? 'rgba(59,130,246,0.25)' : 'transparent',
              border: `1px solid ${mapLayer === 'modern' ? '#60a5fa' : 'transparent'}`,
              color: mapLayer === 'modern' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Globe size={13} color={mapLayer === 'modern' ? '#60a5fa' : 'currentColor'} />
            <span>Solo Países de Hoy</span>
          </button>

          <button
            onClick={() => setMapLayer('ancient')}
            style={{
              padding: '5px 11px',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: mapLayer === 'ancient' ? '700' : '500',
              background: mapLayer === 'ancient' ? 'rgba(212,175,55,0.22)' : 'transparent',
              border: `1px solid ${mapLayer === 'ancient' ? 'var(--gold-400)' : 'transparent'}`,
              color: mapLayer === 'ancient' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <span>Solo Nombres Bíblicos</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Botones de Lugares (Clickeables, Claros, con Número y País de Hoy) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(212,175,55,0.18)'
      }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: '700', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={14} /> Lugares del Relato:
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
                padding: '6px 12px',
                borderRadius: '6px',
                background: isSelected
                  ? 'linear-gradient(135deg, var(--gold-400) 0%, #b8860b 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: isSelected ? '1.5px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                color: isSelected ? '#030508' : '#ffffff',
                fontWeight: isSelected ? '800' : '500',
                fontSize: '0.78rem',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 14px rgba(212,175,55,0.45)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ opacity: isSelected ? 1 : 0.6, fontWeight: '700' }}>{index + 1}.</span>
              <span>{site.name.split('(')[0].trim()}</span>
              <span style={{
                fontSize: '0.68rem',
                background: isSelected ? 'rgba(0,0,0,0.25)' : 'rgba(59,130,246,0.18)',
                color: isSelected ? '#000000' : '#93c5fd',
                padding: '2px 5px',
                borderRadius: '3px',
                fontWeight: '700'
              }}>
                {site.modernCountry.split('(')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Panel de Visualización Doble: Mapa Cartográfico Realista + Ficha Pedagógica */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {/* Mapa SVG Auténtico con Siluetas Geográficas y Fronteras Modernas */}
        <div style={{
          position: 'relative',
          minHeight: '380px',
          background: '#0a101d',
          borderRadius: '10px',
          border: '1.5px solid rgba(212,175,55,0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.85)'
        }}>
          <svg viewBox="0 0 500 340" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <defs>
              {/* Degradados de relieve y aguas */}
              <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#172033" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Masa Continental Base */}
            <rect width="500" height="340" fill="url(#landGradient)" />

            {/* MAR MEDITERRÁNEO (Silueta reconocible: Egipto, Costa Levantina, Chipre y Turquía) */}
            <path
              d="M 0 0 L 170 0 Q 150 40 130 75 Q 120 120 115 190 Q 110 250 85 270 Q 50 285 0 290 Z"
              fill="url(#seaGradient)"
              stroke="rgba(56,189,248,0.4)"
              strokeWidth="1.5"
            />
            {/* Isla de Chipre */}
            <path d="M 60 75 L 85 68 L 95 76 L 75 84 Z" fill="url(#seaGradient)" stroke="#38bdf8" strokeWidth="1" />
            <text x="68" y="78" fill="#7dd3fc" fontSize="7" fontWeight="600">Chipre</text>

            <text x="25" y="160" fill="#38bdf8" fontSize="10" fontWeight="700" opacity="0.85" transform="rotate(-90, 25, 160)">
              MAR MEDITERRÁNEO
            </text>

            {/* GOLFO PÉRSICO (Sur de Mesopotamia) */}
            <path
              d="M 400 240 Q 430 255 470 290 L 500 340 L 370 340 Q 380 290 400 240 Z"
              fill="url(#seaGradient)"
              stroke="rgba(56,189,248,0.4)"
              strokeWidth="1.5"
            />
            <text x="430" y="315" fill="#7dd3fc" fontSize="9" fontWeight="700">Golfo Pérsico</text>

            {/* MAR ROJO & GOLFO DE ÁQABA (Sur del Sinaí) */}
            <path
              d="M 20 340 L 70 310 Q 75 330 85 340 Z"
              fill="url(#seaGradient)"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <text x="35" y="335" fill="#7dd3fc" fontSize="8">Mar Rojo</text>

            {/* RÍOS TIGRIS Y ÉUFRATES CON SU TRAYECTO REAL */}
            {/* Río Éufrates (Perat) */}
            <path
              d="M 180 30 Q 220 70 260 115 T 320 185 T 385 245 T 415 270"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Río Tigris (Hiddekel) */}
            <path
              d="M 240 20 Q 280 60 320 110 T 360 175 T 405 240 T 415 270"
              fill="none"
              stroke="#0284c7"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Nombres de los Ríos */}
            <text x="215" y="85" fill="#bae6fd" fontSize="9" fontWeight="700">Río Éufrates</text>
            <text x="310" y="80" fill="#7dd3fc" fontSize="9" fontWeight="700">Río Tigris</text>

            {/* Cuenca Fluvial y Lago de Galilea / Río Jordán / Mar Muerto */}
            <path d="M 118 175 Q 120 185 119 198" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="118" cy="175" r="3" fill="#38bdf8" />
            <ellipse cx="119" cy="205" rx="3.5" ry="8" fill="#0284c7" />
            <text x="126" y="208" fill="#93c5fd" fontSize="7" fontWeight="700">Mar Muerto</text>

            {/* RUTA HISTÓRICA DE ABRAHAM (Línea Dorada Punteada) */}
            {isGenesis && (
              <>
                <path
                  d="M 400 240 Q 320 180 250 80 L 120 190 L 115 220"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  opacity="0.75"
                />
                <text x="200" y="165" fill="#fef08a" fontSize="8" fontWeight="600" opacity="0.8">
                  Ruta Caravanera de Abraham (Ur → Harán → Canaán)
                </text>
              </>
            )}

            {/* FRONTERAS Y NOMBRES DE PAÍSES ACTUALES (Capas Modernas) */}
            {(mapLayer === 'dual' || mapLayer === 'modern') && (
              <>
                {/* Límite Turquía / Siria / Irak */}
                <path d="M 140 50 L 300 55 L 450 110" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 220 55 L 210 130 L 290 190" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Rótulos de Países Actuales en Letras Grandes y Claras */}
                <rect x="235" y="15" width="65" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#60a5fa" strokeWidth="1" />
                <text x="242" y="28" fill="#93c5fd" fontSize="9" fontWeight="800">🇹🇷 TURQUÍA</text>

                <rect x="185" y="105" width="52" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#60a5fa" strokeWidth="1" />
                <text x="193" y="118" fill="#93c5fd" fontSize="9" fontWeight="800">🇸🇾 SIRIA</text>

                <rect x="330" y="145" width="50" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#60a5fa" strokeWidth="1" />
                <text x="340" y="158" fill="#93c5fd" fontSize="9" fontWeight="800">🇮🇶 IRAK</text>

                <rect x="75" y="225" width="70" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#4ade80" strokeWidth="1" />
                <text x="80" y="238" fill="#86efac" fontSize="8" fontWeight="800">CISJORDANIA</text>

                <rect x="135" y="250" width="65" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#60a5fa" strokeWidth="1" />
                <text x="142" y="263" fill="#93c5fd" fontSize="8" fontWeight="800">🇯🇴 JORDANIA</text>

                <rect x="15" y="295" width="55" height="18" rx="4" fill="rgba(15,23,42,0.85)" stroke="#60a5fa" strokeWidth="1" />
                <text x="22" y="308" fill="#93c5fd" fontSize="8" fontWeight="800">🇪🇬 EGIPTO</text>
              </>
            )}

            {/* Rótulos Antiguos Bíblicos (Cuando la capa lo permite) */}
            {(mapLayer === 'dual' || mapLayer === 'ancient') && (
              <>
                <text x="325" y="215" fill="#fef08a" fontSize="10" fontWeight="700" opacity="0.65">MESOPOTAMIA</text>
                <text x="110" y="145" fill="#fef08a" fontSize="9" fontWeight="700" opacity="0.65">CANAÁN</text>
              </>
            )}

            {/* Marcadores Interactivos de los Hitos */}
            {sitesList.map((site) => {
              const isSelected = selectedSite.id === site.id;
              // Ajustar coordenadas porcentuales al canvas 500x340
              const cx = (site.coords.x / 100) * 500;
              const cy = (site.coords.y / 100) * 340;

              return (
                <g key={site.id} onClick={() => setSelectedSite(site)} style={{ cursor: 'pointer' }}>
                  {isSelected && (
                    <circle cx={cx} cy={cy} r="18" fill="none" stroke="#ffd700" strokeWidth="2" opacity="0.8">
                      <animate attributeName="r" values="8;24;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? "9" : "6"}
                    fill={isSelected ? "#ffd700" : "#0284c7"}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                  />
                  <rect
                    x={cx + 10}
                    y={cy - 12}
                    width={site.name.split('(')[0].trim().length * 7 + 16}
                    height="20"
                    rx="4"
                    fill={isSelected ? "rgba(212,175,55,0.95)" : "rgba(10,15,26,0.85)"}
                    stroke={isSelected ? "#ffffff" : "rgba(212,175,55,0.4)"}
                    strokeWidth="1"
                  />
                  <text
                    x={cx + 16}
                    y={cy + 2}
                    fill={isSelected ? "#000000" : "#ffffff"}
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="sans-serif"
                  >
                    {site.name.split('(')[0].trim()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Leyenda Inferior del Mapa */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            right: '12px',
            background: 'rgba(5, 7, 12, 0.92)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '6px',
            padding: '7px 14px',
            fontSize: '0.74rem',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />
              <span>Punto dorado pulsante: <strong>{selectedSite.name.split('(')[0]}</strong></span>
            </div>
            <span style={{ color: 'var(--gold-300)' }}>
              Toque cualquier punto del mapa o botón para ver detalles
            </span>
          </div>
        </div>

        {/* Ficha Explicativa Clara y Concreta del Lugar Seleccionado */}
        <div style={{
          background: 'rgba(11, 15, 24, 0.95)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '10px',
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            {/* Banner de Equivalencia Actual Inmediata */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(37,99,235,0.08) 100%)',
              border: '1px solid rgba(147,197,253,0.35)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '14px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                📍 DÓNDE QUEDA EN EL MAPA DE HOY:
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
                {selectedSite.modernCountry} — {selectedSite.modernCity}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {selectedSite.historicalEra}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                {selectedSite.elevation}
              </span>
            </div>

            <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.35rem', fontWeight: '800', margin: '4px 0 10px' }}>
              {selectedSite.name}
            </h3>

            {/* Distancia y Viaje en la Antigüedad */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: 'var(--gold-300)',
              background: 'rgba(212,175,55,0.08)',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(212,175,55,0.2)',
              marginBottom: '14px'
            }}>
              <Navigation size={13} color="var(--gold-400)" />
              <span><strong>Distancia y Viaje:</strong> {selectedSite.travelDistance}</span>
            </div>

            {/* Explicación de la Vida e Historia en Lenguaje Común */}
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.74rem', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                ¿Cómo era este lugar y qué pasaba allí?
              </span>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                {selectedSite.secularNote}
              </p>
            </div>

            {/* Relación con el Pasaje Bíblico */}
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                ¿Por qué es importante para este versículo?
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--gold-100)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                {selectedSite.biblicalRelation}
              </p>
            </div>
          </div>

          {/* Respaldo Arqueológico en Español Simple */}
          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <strong style={{ color: '#cbd5e1' }}>🏛️ Descubrimientos Arqueológicos:</strong> {selectedSite.archaeology}
          </div>
        </div>
      </div>
    </div>
  );
}
