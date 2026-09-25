import React, { useState } from 'react';
import { Calendar, Compass, ScrollText, Landmark, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * HistoricalTimelineViewer.jsx
 * Línea de tiempo cronológica interactiva que contrasta la Cronología Bíblica
 * con la Cronología Histórico-Arqueológica Laica y del Antiguo Cercano Oriente (ANE),
 * adaptada dinámicamente según el libro consultado (Génesis, Salmos, NT).
 */

const GENESIS_TIMELINE_ERAS = [
  {
    id: 'creation_origins',
    name: 'Cosmogonía Primordial & Orígenes',
    period: 'Tiempo Primordial / Creatio Ex Nihilo',
    secularContext: 'Paralelos en cosmogonías del ANE (Enuma Elish babilónico, Teología Menfita egipcia). Frente a la violencia teogónica politeísta donde los dioses luchan entre sí, el texto bíblico presenta una ruptura epistemológica radical: un solo Dios trascendente que crea por su sola palabra soberana y pura voluntad.',
    biblicalContext: 'Génesis 1:1 - 2:4a. Creación ex nihilo del cosmos, separación de la luz y las tinieblas, ordenación de los cielos y la tierra, y consagración del ser humano como portador de la imagen de Dios (Imago Dei).',
    archaeology: 'Tablillas cosmogónicas de Eridu, Epopeya de la Creación (Nínive) y Prisma de Weld-Blundell (c. 1800 a.C.) con listas antediluvianas.',
    relevanceToPassage: 'Génesis 1 proclama la dignidad inalienable de la creación y desmitifica los cuerpos celestes (sol, luna y estrellas), tratándolos como meras lumbreras servidoras, no deidades.'
  },
  {
    id: 'flood_nations',
    name: 'Diluvio & Tabla de las Naciones',
    period: 'Tradición Antediluviana & Época Temprana',
    secularContext: 'Cuentos de inundaciones fluviales catastróficas en Mesopotamia meridional (Epopeya de Gilgamesh, Tablilla XI; Mito de Atrahasis). Sedimentos de limo documentados por Woolley en Ur y Kish.',
    biblicalContext: 'Génesis 6-11: El juicio de las aguas sobre la corrupción humana, preservación del arca de Noé, el pacto del arco iris y la dispersión lingüística en la Torre de Babel.',
    archaeology: 'Tablilla del Diluvio de Gilgamesh (Museo Británico, descubierta por George Smith en 1872) y las fundaciones de zigurats en Mesopotamia central (Babel / Borsippa).',
    relevanceToPassage: 'Muestra la gracia redentora preservadora de Dios frente a la decadencia moral, estableciendo el pacto noájico con toda la creación.'
  },
  {
    id: 'patriarchs_bronze_middle',
    name: 'Época Patriarcal (Bronce Medio)',
    period: 'c. 2000 – 1600 a.C.',
    secularContext: 'Movimientos nómadas amorreos a lo largo de la Media Luna Fértil. Códigos legales semíticos (Leyes de Eshnunna, Código de Hammurabi). Costumbres familiares idénticas a los contratos de Nuzi (adopción de siervos, compra de sepulcros).',
    biblicalContext: 'Génesis 12-50: El llamado de Abraham desde Ur a Canaán, los pactos con Isaac y Jacob, y el descenso de José a Egipto.',
    archaeology: 'Archivos cuneiformes de Mari (Siria, c. 1750 a.C.) registrando nombres idénticos a los patriarcas (Abam-rama, Ya\'qob-el) y tratados en Beerseba.',
    relevanceToPassage: 'El Dios creador cósmico de Génesis 1 se revela ahora como el Dios personal de la promesa: «En ti serán benditas todas las familias de la tierra».'
  },
  {
    id: 'sojourn_exodus',
    name: 'Estancia en Egipto & Redacción Mosaica',
    period: 'c. 1550 – 1250 a.C. (Imperio Nuevo Egipcio)',
    secularContext: 'Dinastías XVIII y XIX en Egipto. Construcción de Pi-Ramsés y presencia de poblaciones semíticas asiáticas en el delta del Nilo (Avaris / Tel el-Daba). Cartas de Amarna.',
    biblicalContext: 'Moisés recibe la revelación de la Ley en el monte Sinaí y entrega a Israel la Torá escrita para forjar una nación de sacerdotes monoteísta.',
    archaeology: 'Estela de Merneptah (c. 1208 a.C.): primera mención epigráfica extrabíblica de "Israel" como pueblo en Canaán.',
    relevanceToPassage: 'Génesis fue instruido a Israel a la salida de Egipto para purificar su mentalidad de los cultos idolátricos y recordar su origen en el Creador Supremo.'
  }
];

const GENERAL_TIMELINE_ERAS = [
  {
    id: 'bronze',
    name: 'Bronce Tardío & Orígenes Tribales',
    period: 'c. 1400 – 1200 a.C.',
    secularContext: 'Colapso de la Edad del Bronce en el Mediterráneo oriental. Invasión de los Pueblos del Mar. Cartas de Amarna (Egipto) describiendo disturbios provocados por los "Habiru" en Canaán.',
    biblicalContext: 'Peregrinación en el desierto del Sinaí y entrada en Canaán bajo el liderazgo de Josué y los primeros jueces.',
    archaeology: 'Estela de Merneptah (c. 1208 a.C.): Primera mención secular extrabíblica conocida del pueblo de "Israel" en Canaán.',
    relevanceToPassage: 'Surgen las leyes del santuario y la metáfora de Yahweh como pastor guiando al rebaño por el desierto (Salmo 77:20).'
  },
  {
    id: 'iron1',
    name: 'Hierro I: Época Tribal & Reino Temprano',
    period: 'c. 1200 – 1000 a.C.',
    secularContext: 'Fragmentación política de las tierras altas de Judea y Samaria. Comunidades aldeanas agropastoriles con ausencia de huesos de cerdo en los estratos arqueológicos.',
    biblicalContext: 'Período de los Jueces y Samuel. Juventud de David como pastor en las laderas áridas de Belén de Judá y su refugio en Siclag.',
    archaeology: 'Yacimientos de Khirbet Qeiyafa (ostracon con texto hebreo arcaico del siglo X a.C.) y Tel Beit Mirsim.',
    relevanceToPassage: 'La experiencia de campo cuidando rebaños ante fieras forja el imaginario pastoral y de confianza en el Eterno.'
  },
  {
    id: 'monarchy',
    name: 'Monarquía Unida & Dinastía Davídica',
    period: 'c. 1000 – 930 a.C.',
    secularContext: 'Consolidación de Jerusalén como capital monárquica del Levante. El rey asume en el Próximo Oriente el título de "pastor de pueblos" (acadio: rē\'û).',
    biblicalContext: 'Reinado de David y Salomón. David compone los Salmos litúrgicos de alabanza, pacto y adoración. Jerusalén establecida como centro del culto.',
    archaeology: 'Estela de Tel Dan (siglo IX a.C., arameo) con la inscripción histórica "Casa de David" (bytdwd). Estructura escalonada en la Ciudad de David.',
    relevanceToPassage: 'Subvierte la propaganda de los reyes paganos: el verdadero Pastor y Rey absoluto no es el gobernante terrenal, sino Yahweh.'
  },
  {
    id: 'divided_exile',
    name: 'Reinos Divididos & Cautiverio Babilónico',
    period: 'c. 930 – 539 a.C.',
    secularContext: 'Expansión asiria y babilónica. Nabucodonosor II destruye Jerusalén y el Templo en 586 a.C. Deportación de las élites a Babilonia.',
    biblicalContext: 'Los profetas exhortan al pueblo y denuncian la infidelidad, anticipando el Nuevo Pacto prometido por Dios.',
    archaeology: 'Crónicas Babilónicas, Tablillas de Raciones de Joaquín en Babilonia y Sellos reales LMLK de Judá.',
    relevanceToPassage: 'Durante el cautiverio, el texto sagrado preservó la identidad y esperanza de que Dios sigue presente aun sin templo físico.'
  },
  {
    id: 'persian_hellenistic',
    name: 'Período Persa & Helenístico (Fijación Canónica)',
    period: 'c. 539 – 63 a.C.',
    secularContext: 'Ciro el Grande decreta el retorno de los repatriados. Conquistas de Alejandro Magno. Traducción de la Septuaginta (LXX) en Alejandría.',
    biblicalContext: 'Reconstrucción del Segundo Templo con Esdras y Nehemías. Compilación litúrgica canónica final del texto bíblico.',
    archaeology: 'Cilindro de Ciro (539 a.C.), Rollos del Mar Muerto en Qumrán (siglos III a.C. - I d.C.) con los manuscritos hebreos más antiguos conocidos.',
    relevanceToPassage: 'Fijación rigurosa de los textos sagrados y difusión en las sinagogas de la Diáspora judía.'
  },
  {
    id: 'roman_second_temple',
    name: 'Período Romano & Segundo Templo Tardío',
    period: 'c. 63 a.C. – 70 d.C.',
    secularContext: 'Dominio de la República y el Imperio Romano en Judea. Gobierno de Herodes el Grande. Destrucción de Jerusalén y del Templo por Tito en el 70 d.C.',
    biblicalContext: 'Ministerio de Jesús de Nazaret, crucifixión, resurrección corporal y nacimiento de la Iglesia apostólica.',
    archaeology: 'Inscripción de Poncio Pilato en Cesarea Marítima, Osario de Caifás y Muralla del Monte del Templo.',
    relevanceToPassage: 'Cumplimiento pleno de las promesas del pacto en la persona y obra de Jesucristo.'
  }
];

export default function HistoricalTimelineViewer({ bookName = '', chapter = 1, verseRef = '' }) {
  const norm = (bookName || verseRef || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isGenesis = norm.includes('genesis') || norm.includes('exodo') || norm.includes('creacion');

  const eras = isGenesis ? GENESIS_TIMELINE_ERAS : GENERAL_TIMELINE_ERAS;

  const getInitialEra = () => {
    if (isGenesis) {
      const c = Number(chapter) || 1;
      if (c >= 12 && c <= 36) {
        return GENESIS_TIMELINE_ERAS.find(e => e.id === 'patriarchs_bronze_middle') || eras[0];
      }
      if (c >= 37 && c <= 50) {
        return GENESIS_TIMELINE_ERAS.find(e => e.id === 'sojourn_exodus') || eras[0];
      }
      if (c >= 6 && c <= 11) {
        return GENESIS_TIMELINE_ERAS.find(e => e.id === 'flood_nations') || eras[0];
      }
      return GENESIS_TIMELINE_ERAS[0];
    }
    return GENERAL_TIMELINE_ERAS[0];
  };

  const [selectedEra, setSelectedEra] = useState(getInitialEra());

  React.useEffect(() => {
    setSelectedEra(getInitialEra());
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
      {/* Título de la Línea de Tiempo */}
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
            <Calendar size={17} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
              Eje Cronológico Histórico & Arqueológico
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {isGenesis 
                ? 'Horizonte de los orígenes, cosmogonías del ANE y cronología patriarcal'
                : 'Contraste riguroso entre la historia del ANE, fuentes laicas y el texto bíblico'}
            </span>
          </div>
        </div>

        <span style={{
          fontSize: '0.74rem',
          color: 'var(--gold-300)',
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.3)',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontWeight: '600'
        }}>
          {eras.length} Horizontes Histórico-Críticos
        </span>
      </div>

      {/* Píldoras de Eras */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${isGenesis ? '200px' : '150px'}, 1fr))`,
        gap: '8px',
        padding: '6px',
        background: 'rgba(4, 5, 8, 0.85)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {eras.map((era) => {
          const isSelected = selectedEra.id === era.id;
          return (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era)}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                background: isSelected ? 'linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.1) 100%)' : 'transparent',
                border: isSelected ? '1px solid var(--gold-400)' : '1px solid transparent',
                color: isSelected ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.74rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <span style={{ fontWeight: isSelected ? '800' : '600', color: isSelected ? 'var(--gold-300)' : '#cbd5e1' }}>
                {era.name}
              </span>
              <span style={{ fontSize: '0.68rem', color: isSelected ? '#ffffff' : '#64748b' }}>
                {era.period}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detalle de la Era Seleccionada */}
      <div style={{
        background: 'rgba(11, 14, 22, 0.95)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: '10px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '10px' }}>
          <div>
            <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
              {selectedEra.name}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: '700' }}>
              Marco Cronológico: {selectedEra.period}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {/* Columna A: Contexto ANE & Laico */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.74rem', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Landmark size={13} />
              Contexto Histórico & Arqueológico Laico:
            </span>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
              {selectedEra.secularContext}
            </p>
          </div>

          {/* Columna B: Horizonte Bíblico */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ScrollText size={13} />
              Marco Bíblico & Teológico:
            </span>
            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
              {selectedEra.biblicalContext}
            </p>
          </div>
        </div>

        {/* Relevancia Directa para el Pasaje */}
        <div style={{
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '8px',
          padding: '12px 16px'
        }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
            Relevancia para la Comprensión del Pasaje:
          </span>
          <p style={{ fontSize: '0.86rem', color: '#ffffff', lineHeight: 1.55, margin: 0 }}>
            {selectedEra.relevanceToPassage}
          </p>
        </div>

        {/* Hallazgo Arqueológico Clave */}
        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <strong style={{ color: '#94a3b8' }}>Hallazgo Epigráfico / Arqueológico Clave:</strong> {selectedEra.archaeology}
        </div>
      </div>
    </div>
  );
}
