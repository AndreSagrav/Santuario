import React, { useState } from 'react';
import { Landmark, Compass, ScrollText, Calendar, ShieldCheck, ArrowRight, Info } from 'lucide-react';

/**
 * HistoricalTimelineViewer.jsx
 * Línea de tiempo cronológica interactiva que contrasta la Cronología Bíblica
 * con la Cronología Histórico-Arqueológica Laica y del Antiguo Cercano Oriente (ANE).
 */

const TIMELINE_ERAS = [
  {
    id: 'bronze',
    name: 'Bronce Tardío & Orígenes',
    period: 'c. 1400 – 1200 a.C.',
    secularContext: 'Colapso de la Edad del Bronce en el Mediterráneo oriental. Invasión de los Pueblos del Mar. Cartas de Amarna (Egipto) describiendo disturbios provocados por los nómadas "Apiru/Habiru" en Canaán.',
    biblicalContext: 'Éxodo de Egipto, peregrinación en el desierto del Sinaí y entrada en Canaán bajo Josué.',
    archaeology: 'Estela de Merneptah (c. 1208 a.C.): Primera mención secular extrabíblica conocida del pueblo de "Israel" como entidad en Canaán.',
    relevanceToPassage: 'Surgen las leyes del desierto y la metáfora de Yahweh como pastor guiando al rebaño nómada por el desierto (Salmo 77:20, 78:52).'
  },
  {
    id: 'iron1',
    name: 'Hierro I: Época Tribal',
    period: 'c. 1200 – 1000 a.C.',
    secularContext: 'Fragmentación política de las tierras altas de Judea y Samaria. Comunidades aldeanas agropastoriles con cerámica de borde acanalado y ausencia de huesos de cerdo en los estratos arqueológicos.',
    biblicalContext: 'Período de los Jueces y liderazgo de Samuel. David se cría como pastor nómada en las laderas áridas de Belén de Judá.',
    archaeology: 'Yacimientos de Shiloh, Tel Beit Mirsim y Khirbet Qeiyafa. Asentamientos de pastores y agricultores en terrazas montañosas.',
    relevanceToPassage: 'La experiencia real de David cuidando rebaños ante depredadores (leones, osos) y buscando pastos en el desierto de Judá forja el imaginario del Salmo 23.'
  },
  {
    id: 'monarchy',
    name: 'Monarquía Unida & Dinastía Davídica',
    period: 'c. 1000 – 930 a.C.',
    secularContext: 'Consolidación del reino regional de Jerusalén. El rey asume en el Próximo Oriente el título de "pastor de pueblos" (acadio: rē\'û), semejante a Hammurabi o los reyes asirios.',
    biblicalContext: 'Reinado de David y Salomón. David compone Salmos litúrgicos de alabanza y confianza. Jerusalén establecida como capital del culto y del pacto.',
    archaeology: 'Estela de Tel Dan (siglo IX a.C., arameo) con la inscripción "Casa de David" (bytdwd). Estructura escalonada de piedra en la Ciudad de David.',
    relevanceToPassage: 'Salmo 23 subvierte la propaganda real del ANE: el verdadero Rey y Pastor no es el monarca humano, sino Yahweh, quien adereza mesa ante los enemigos.'
  },
  {
    id: 'divided_exile',
    name: 'Reinos Divididos & Cautiverio Babilónico',
    period: 'c. 930 – 539 a.C.',
    secularContext: 'Expansión del Imperio Neo-Asirio (caída de Samaria 722 a.C.) y del Imperio Neo-Babilónico. Nabucodonosor II destruye Jerusalén y el Templo en 586 a.C. Deportación de las élites a Babilonia.',
    biblicalContext: 'Profetas denuncian a los "malos pastores de Israel" que dispersaron el rebaño (Ezequiel 34, Jeremías 23). Promesa de que Dios mismo buscará a sus ovejas.',
    archaeology: 'Crónicas Babilónicas, Tablillas de Raciones de Joaquín en Babilonia, Sellos de LMLK en Judá y Cartas de Laquis.',
    relevanceToPassage: 'Durante el exilio, el Salmo 23 se convierte en himno de identidad: aun sin templo físico en ruinas, el Dios-pastor provee en tierra extranjera.'
  },
  {
    id: 'persian_hellenistic',
    name: 'Período Persa & Helenístico (Redacción Canónica)',
    period: 'c. 539 – 63 a.C.',
    secularContext: 'Ciro el Grande decreta el retorno de los deportados. Conquista de Alejandro Magno (332 a.C.) y difusión de la koiné griega. Traductores judíos en Alejandría vierten las Escrituras al griego (Septuaginta LXX).',
    biblicalContext: 'Reconstrucción del Segundo Templo (Esdras y Nehemías). Compilación y canonización litúrgica final de los 5 libros del Salterio (Tehilim).',
    archaeology: 'Cilindro de Ciro (539 a.C.), Rollos del Mar Muerto en Qumrán (siglos III a.C. – I d.C.) con los testimonios manuscritos de los Salmos más antiguos conocidos (4QPs).',
    relevanceToPassage: 'Fijación textual masorética y traducción en la LXX: «κύριος ποιμαίνει με καὶ οὐδέν με ὑστερήσει», consolidando el Salmo como lectura cúltica perpetua.'
  },
  {
    id: 'roman_second_temple',
    name: 'Período Romano & Segundo Templo Tardío',
    period: 'c. 63 a.C. – 70 d.C.',
    secularContext: 'Pompeyo somete Judea a la República Romana. Reinado clientelar de Herodes el Grande. Destrucción de Jerusalén y del Templo por Tito en el 70 d.C.',
    biblicalContext: 'Ministerio de Jesús de Nazaret, quien se proclama "El Buen Pastor" que da su vida por las ovejas (Juan 10:11) y la "Puerta del Redil", cumpliendo el Salmo 23 y Ezequiel 34.',
    archaeology: 'Inscripción de Poncio Pilato en Cesarea Marítima, Osario de Caifás, Manuscritos de Masada y Muralla Occidental del Monte del Templo.',
    relevanceToPassage: 'Apostolado cristiano primitivo cita a Jesús como el "Gran Pastor de las ovejas por la sangre del pacto eterno" (Hebreos 13:20).'
  }
];

export default function HistoricalTimelineViewer() {
  const [selectedEra, setSelectedEra] = useState(TIMELINE_ERAS[2]); // Monarquía por defecto

  return (
    <div style={{
      background: 'rgba(7, 9, 14, 0.75)',
      border: '1px solid rgba(212,175,55,0.22)',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Título de la Línea de Tiempo */}
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
            <Calendar size={16} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.12rem', fontWeight: '800' }}>
              Eje Cronológico Histórico & Arqueológico
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Contraste entre la historia del ANE, evidencia epigráfica laica y la redacción del texto bíblico
            </span>
          </div>
        </div>

        <span style={{
          fontSize: '0.74rem',
          color: 'var(--gold-300)',
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.25)',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontWeight: '600'
        }}>
          6 Horizontes Histórico-Críticos
        </span>
      </div>

      {/* Barra de Navegación Horizontal de Eras (Sin cortes) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '8px',
        padding: '6px',
        background: 'rgba(4, 5, 8, 0.85)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {TIMELINE_ERAS.map((era) => {
          const isSelected = selectedEra.id === era.id;
          return (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: isSelected ? 'rgba(212,175,55,0.22)' : 'transparent',
                border: isSelected ? '1px solid var(--gold-400)' : '1px solid transparent',
                color: isSelected ? 'var(--gold-200)' : 'var(--text-muted)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--gold-400)' : '#71717a', fontWeight: '700' }}>
                {era.period}
              </span>
              <span style={{ fontSize: '0.84rem', fontWeight: isSelected ? '700' : '500', lineHeight: 1.3 }}>
                {era.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ficha Detallada de la Era Seleccionada con 4 Bloques Clave */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px',
        background: 'rgba(11, 14, 22, 0.9)',
        border: '1px solid rgba(212,175,55,0.18)',
        borderRadius: '10px',
        padding: '20px'
      }}>
        {/* Bloque 1: Contexto Histórico Laico / Secular del ANE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={15} color="#93c5fd" />
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Historia Secular & Contexto ANE
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
            {selectedEra.secularContext}
          </p>
        </div>

        {/* Bloque 2: Registro Arqueológico & Epigrafía */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={15} color="#4ade80" />
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Arqueología & Testigos Epigráficos
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
            {selectedEra.archaeology}
          </p>
        </div>

        {/* Bloque 3: Narrativa Bíblica & Culto Cúltico */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ScrollText size={15} color="var(--gold-400)" />
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--gold-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Horizonte Bíblico & Tradición Cúltica
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
            {selectedEra.biblicalContext}
          </p>
        </div>

        {/* Bloque 4: Conexión Exegética Directa con el Pasaje */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={15} color="#f472b6" />
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Iluminación Crítica del Pasaje
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#fce7f3', lineHeight: 1.6, margin: 0 }}>
            {selectedEra.relevanceToPassage}
          </p>
        </div>
      </div>
    </div>
  );
}
