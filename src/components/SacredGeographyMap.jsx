import React, { useState } from 'react';
import { Compass, MapPin, Eye, Mountain, Droplets, Sun, Wind, ChevronRight } from 'lucide-react';

/**
 * SacredGeographyMap.jsx
 * Mapa topográfico y arqueológico interactivo de la cuenca de Judea y el Próximo Oriente.
 * Incluye elevaciones, wadis, precipitaciones, sitios arqueológicos y datos laicos.
 */

const SITES_DATA = [
  {
    id: 'wadi_qelt',
    name: 'Wadi Qelt (Valle de Sombra de Muerte)',
    hebrew: 'גֵּיא צַלְמָוֶת (Gey Tsalmaveth)',
    elevation: '-120 m a +250 m',
    climate: 'Desértico árido extremo, lluvia < 120 mm/año',
    archaeology: 'Profundo desfiladero calizo de 45 km entre Jerusalén y Jericó. Contiene cuevas de pastores, acueductos asmoneos y el monasterio bizantino de San Jorge.',
    secularNote: 'Los pastores nómadas debían descender con sus ovejas a través de estas gargantas estrechas donde la luz del sol solo penetra durante 1-2 horas al mediodía (sombra perpetua). Lugar propicio para emboscadas de salteadores y ataques de hienas/lobos.',
    exegeticalConnection: 'Ilumina literalmente «aunque ande en valle de sombra de muerte, no temeré mal alguno»: la vara y el cayado servían para ahuyentar depredadores y orientar a las ovejas entre los abismos de roca escarpada.',
    coords: { x: 58, y: 44 }
  },
  {
    id: 'bethlehem',
    name: 'Belén de Judá (Laderas del Efrata)',
    hebrew: 'בֵּית לֶחֶם (Bet Léjem)',
    elevation: '+775 m sobre el nivel del mar',
    climate: 'Mediterráneo montañoso, inviernos fríos con lluvias estacionales (c. 550 mm/año)',
    archaeology: 'Trazas de asentamientos del Bronce Tardío y Hierro I. Terrazas agrícolas escalonadas con olivos, cebada y corrales de ovejas en cuevas naturales de piedra caliza.',
    secularNote: 'Ubicada en la divisoria de aguas: hacia el oeste, colinas fértiles agrícolas; hacia el este, caída abrupta hacia el desierto árido de Judea.',
    exegeticalConnection: 'Lugar de crianza y pastoreo de David. Aquí aprendió la práctica de la trashumancia (mover el rebaño entre las laderas húmedas y los valles del desierto según la estación del año).',
    coords: { x: 42, y: 56 }
  },
  {
    id: 'engedi',
    name: 'Oasis de En-Gedi (Aguas de Reposo)',
    hebrew: 'עֵין גֶּדִי (Ein Guedi - Manantial del Cabrito)',
    elevation: '-200 m (junto a la depresión del Mar Muerto)',
    climate: 'Hiperárido, calor extremo (>40°C en verano), pero con manantiales dulces perennes',
    archaeology: 'Santuario calcolítico, terrazas de balsameras judías y cuevas de refugio davídico (1 Samuel 24). Presencia milenaria de íbices capra nubiana.',
    secularNote: 'El contraste visual y térmico entre el desierto calcinante y el agua dulce brotando entre cañas y palmeras es uno de los fenómenos geográficos más impactantes del Levante.',
    exegeticalConnection: 'Representa el arquetipo exacto de «junto a aguas de reposo (mey menujot) me pastoreará»: aguas tranquilas no estancadas donde los rebaños sedientos pueden beber sin ahogarse ni ser arrastrados por corrientes violentas.',
    coords: { x: 68, y: 72 }
  },
  {
    id: 'jerusalem',
    name: 'Jerusalén (Fortaleza de Sion)',
    hebrew: 'יְרוּשָׁלַיִם (Yerushalayim)',
    elevation: '+754 m',
    climate: 'Mediterráneo semiárido montañoso, vientos del oeste procedentes del Mediterráneo',
    archaeology: 'Manantial de Gihón, sistema de túneles cananeos del siglo XVIII a.C., Muro de Nehemías y Ciudad de David (Ophel).',
    secularNote: 'Eje estratégico entre las tribus del norte (Israel) y las tribus del sur (Judá). Conquistada por David a los jebuseos para establecer una capital neutral.',
    exegeticalConnection: 'Centro neurálgico del culto y de la casa de David: «en la casa de Jehová moraré por largos días». La geografía del monte Sion como cima cósmica de pacto, santuario y presencia divina perpetua.',
    coords: { x: 44, y: 42 }
  },
  {
    id: 'judean_wilderness',
    name: 'Desierto de Judá (Midbar Yehuda)',
    hebrew: 'מִדְבַּר יְהוּדָה (Midbar Yehuda)',
    elevation: 'De +1000 m (Hebrón) a -430 m (Mar Muerto)',
    climate: 'Sombra de lluvia orográfica causada por las montañas de Judea. Pluviosidad nula en verano.',
    archaeology: 'Red de cuevas habitadas desde el Epipaleolítico; yacimientos de Qumrán, Murabba\'at y Masada.',
    secularNote: 'Frontera natural de refugio para fugitivos políticos, ermitaños esenios y pastores seminómadas. Territorio de supervivencia biológica estricta.',
    exegeticalConnection: 'En este entorno donde la hierba se agota en pocas semanas, solo un pastor experimentado conoce los senderos seguros («me guiará por sendas de justicia por amor de su nombre») para evitar despeñaderos mortales.',
    coords: { x: 55, y: 62 }
  },
  {
    id: 'siclag',
    name: 'Siclag en el Néguev (Base Militar de David)',
    hebrew: 'צִקְלַג (Tsiqlag)',
    elevation: '+150 m sobre el nivel del mar',
    climate: 'Estepario semiárido del Néguev occidental, precipitaciones escasas (c. 200 mm/año)',
    archaeology: 'Identificada comúnmente con Khirbet el-Ra\'i o Tel Sera. Estratos con cerámica filistea bicroma y sellos reales del Hierro I.',
    secularNote: 'Ciudad fronteriza cedida a David por Aquis, rey filisteo de Gat (1 Sam 27:6). Punto de encuentro estratégico fuera del alcance de Saúl.',
    exegeticalConnection: 'Epicentro histórico de 1 Crónicas 12:1-22: aquí se congregaron los valientes arqueros y honderos ambidiestros de Benjamín y los caudillos de Gad para jurar lealtad a David.',
    coords: { x: 22, y: 76 }
  },
  {
    id: 'hebron',
    name: 'Hebrón (Ciudad de Pacto & Coronación)',
    hebrew: 'חֶבְרוֹן (Jevrón / Quiriat-arba)',
    elevation: '+927 m (Punto más alto de los montes de Judá)',
    climate: 'Mediterráneo de montaña templado, nieves ocasionales en invierno, terrazas con viñas y granados',
    archaeology: 'Tel Rumeida, murallas ciclópeas del Bronce Medio y la Cueva de Macpela (santuario herodiano monumental).',
    secularNote: 'Antigua capital sacerdotal de Judá durante los primeros 7 años del reinado davídico antes de la conquista de Jerusalén.',
    exegeticalConnection: 'Cumplimiento de 1 Crónicas 12:38: cientos de miles de guerreros acudieron a Hebrón con «un corazón perfecto para hacer rey a David», celebrando con banquetes sagrados.',
    coords: { x: 38, y: 64 }
  }
];

export default function SacredGeographyMap({ bookName = '', verseRef = '' }) {
  const isChronicles = (bookName && bookName.toLowerCase().includes('crónica')) || (verseRef && verseRef.toLowerCase().includes('crónica'));
  const initialSite = isChronicles 
    ? (SITES_DATA.find(s => s.id === 'siclag') || SITES_DATA[0])
    : SITES_DATA[0];

  const [selectedSite, setSelectedSite] = useState(initialSite);

  return (
    <div style={{
      background: 'rgba(7, 9, 14, 0.8)',
      border: '1px solid rgba(212,175,55,0.22)',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Encabezado del Mapa */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.15)',
            border: '1px solid var(--gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={16} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.12rem', fontWeight: '800' }}>
              Cartografía Topográfica & Arqueológica de Judea
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Orografía física, desfiladeros, precipitaciones e hitos históricos del entorno del versículo
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.74rem', color: '#93c5fd', background: 'rgba(59,130,246,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(147,197,253,0.3)' }}>
            Elevaciones: +1000m a -430m
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.08)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.3)' }}>
            5 Yacimientos Clave
          </span>
        </div>
      </div>

      {/* Grid: Canvas Topográfico a la Izquierda + Ficha Arqueológica a la Derecha */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {/* Panel del Mapa Topográfico SVG Ilustrado */}
        <div style={{
          position: 'relative',
          height: '380px',
          background: 'radial-gradient(ellipse at 40% 40%, #151a26 0%, #080a10 100%)',
          borderRadius: '10px',
          border: '1px solid rgba(212,175,55,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Gráfico Topográfico SVG con Curvas de Nivel y Relieve */}
          <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a2216" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0c111c" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="deadSeaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0d2038" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Curvas de nivel topográficas estilizadas */}
            <path d="M 20 80 Q 90 120 180 90 T 340 110" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 10 160 Q 110 200 210 150 T 380 180" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
            <path d="M 30 240 Q 140 280 230 220 T 390 260" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth="1" strokeDasharray="6 3" />
            <path d="M 20 320 Q 120 350 250 310 T 380 340" fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="1" />

            {/* Representación del Mar Muerto (Depresión Oriental) */}
            <path d="M 280 100 Q 320 200 300 320 Q 285 360 270 380 L 380 380 L 380 100 Z" fill="url(#deadSeaGrad)" opacity="0.75" />
            <text x="310" y="240" fill="#60a5fa" fontSize="11" opacity="0.6" transform="rotate(75, 310, 240)" fontFamily="sans-serif">
              MAR MUERTO (-430m)
            </text>

            {/* Ruta del Cañón Wadi Qelt */}
            <path d="M 180 160 Q 210 180 240 170 T 290 190" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.8" />
            <text x="210" y="160" fill="#fcd34d" fontSize="10" opacity="0.85" fontFamily="sans-serif">
              Wadi Qelt
            </text>

            {/* Cordillera de las Montañas de Judea (Divisoria) */}
            <path d="M 150 40 L 170 380" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="20" strokeLinecap="round" opacity="0.3" />
            <text x="140" y="60" fill="#9ca3af" fontSize="10" opacity="0.7" fontFamily="sans-serif">
              Cordillera de Judea (+800m)
            </text>
          </svg>

          {/* Marcadores de Sitios en el Mapa */}
          {SITES_DATA.map((site) => {
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
                  background: isSelected ? 'var(--gold-400)' : 'rgba(10, 13, 20, 0.9)',
                  color: isSelected ? '#040508' : 'var(--gold-300)',
                  border: isSelected ? '2px solid #ffffff' : '1px solid rgba(212,175,55,0.4)',
                  boxShadow: isSelected ? '0 0 16px var(--gold-400)' : '0 2px 6px rgba(0,0,0,0.6)',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 2,
                  transition: 'all 0.2s'
                }}
              >
                <MapPin size={11} color={isSelected ? '#040508' : 'var(--gold-400)'} />
                <span>{site.name.split(' ')[0]}</span>
              </button>
            );
          })}

          {/* Leyenda en la esquina del Mapa */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            background: 'rgba(5, 7, 12, 0.85)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            zIndex: 5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold-400)' }} />
              <span>Hito seleccionado (clic para examinar)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '2px', background: '#f59e0b' }} />
              <span>Garganta Wadi Qelt (Barranco de sombra)</span>
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
                fontSize: '1.1rem',
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
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '3px 8px',
                borderRadius: '4px',
                color: '#cbd5e1'
              }}>
                <Mountain size={12} color="#94a3b8" />
                <span>Elevación: {selectedSite.elevation}</span>
              </span>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                background: 'rgba(212,175,55,0.06)',
                border: '1px solid rgba(212,175,55,0.2)',
                padding: '3px 8px',
                borderRadius: '4px',
                color: 'var(--gold-300)'
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

            {/* Relevancia Exegética */}
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '3px' }}>
                Conexión con el Salmo y la Metáfora del Pastor:
              </span>
              <p style={{ fontSize: '0.86rem', color: 'var(--gold-100)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                {selectedSite.exegeticalConnection}
              </p>
            </div>
          </div>

          <div style={{
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.76rem',
            color: 'var(--text-muted)'
          }}>
            {selectedSite.archaeology}
          </div>
        </div>
      </div>
    </div>
  );
}
