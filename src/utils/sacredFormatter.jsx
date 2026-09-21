import React from 'react';

/**
 * sacredFormatter.jsx
 * Transforma texto teológico y bíblico eliminando al 100% símbolos markdown toscos
 * (####, **, *, _, `, ~, >) y resaltando los elementos de forma rica, aristocrática y elegante:
 * - Títulos en Cinzel con gema dorada ✦
 * - Términos clave en negrita oro noble
 * - Raíces hebreas y griegas en tipografía sagrada cálida
 * - Números Strong en insignias/micro-pills doradas
 * - Citas bíblicas en badges discretos zafiro-dorado
 * - Transliteraciones en itálica marfil
 * - Cero asteriscos, cero hashtags, cero viñetas toscas en pantalla
 */

// Limpieza total de caracteres de control markdown residuales
export function cleanRawSymbols(str) {
  if (!str) return '';
  return str.replace(/[*#`_~>]/g, '').trim();
}

/**
 * Tokeniza y formatea texto en línea con resaltados visuales exclusivos,
 * garantizando inmunidad absoluta contra asteriscos y hashtags sueltos.
 */
export function renderFormattedSpan(text, keyPrefix = '') {
  if (!text) return null;

  // Regex comprehensivo para capturar todas las entidades enriquecibles:
  // 1. Negrita **...**
  // 2. Cursiva *...*
  // 3. Códigos Strong (Hxxxx o Gxxxx)
  // 4. Caracteres hebreos con o sin niqud
  // 5. Caracteres griegos
  // 6. Citas y referencias bíblicas (ej. Salmos 23:1a, Éxod 3:14, Jn 3:16)
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|\b[HG]\d{3,5}\b|[\u0590-\u05FF\uFB1D-\uFB4F]+|[\u0370-\u03FF\u1F00-\u1FFF]+|\b(?:[1-3]\s+)?[A-ZÁÉÍÓÚ][a-záéíóú]+\s+\d+:\d+(?:[a-z]|-\d+)?\b)/g;

  const parts = [];
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    // 1. Texto plano previo al token encontrado
    if (match.index > lastIndex) {
      const rawPlain = text.substring(lastIndex, match.index);
      // Purgar incondicionalmente cualquier símbolo residual
      const sanitized = rawPlain.replace(/[*#`_~]/g, '');
      if (sanitized) {
        parts.push(
          <span key={`${keyPrefix}-txt-${partIndex++}`}>
            {sanitized}
          </span>
        );
      }
    }

    const rawToken = match[0];
    const cleanToken = rawToken.replace(/[*#`_~]/g, '').trim();

    // Caso A: Código de Concordancia Strong (ej. H3068, G1515)
    if (/^[HG]\d{3,5}$/.test(cleanToken)) {
      parts.push(
        <span
          key={`${keyPrefix}-strong-${partIndex++}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1px 7px',
            margin: '0 3px',
            borderRadius: '4px',
            background: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.32)',
            color: 'var(--gold-300)',
            fontSize: '0.82em',
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontWeight: '700',
            letterSpacing: '0.04em',
            verticalAlign: 'baseline'
          }}
          title={`Número Strong: ${cleanToken}`}
        >
          {cleanToken}
        </span>
      );
    }
    // Caso B: Texto Hebreo Original
    else if (/^[\u0590-\u05FF\uFB1D-\uFB4F]+$/.test(rawToken)) {
      parts.push(
        <span
          key={`${keyPrefix}-heb-${partIndex++}`}
          style={{
            fontFamily: "'SBL Hebrew', 'David', 'Times New Roman', serif",
            fontSize: '1.24em',
            color: '#fef08a',
            padding: '0 3px',
            direction: 'rtl',
            display: 'inline-block',
            fontWeight: '600'
          }}
        >
          {rawToken}
        </span>
      );
    }
    // Caso C: Texto Griego Original
    else if (/^[\u0370-\u03FF\u1F00-\u1FFF]+$/.test(rawToken)) {
      parts.push(
        <span
          key={`${keyPrefix}-grk-${partIndex++}`}
          style={{
            fontFamily: "'SBL Greek', 'Gentium Plus', 'Times New Roman', serif",
            fontSize: '1.16em',
            color: '#fef08a',
            padding: '0 3px',
            direction: 'ltr',
            display: 'inline-block',
            fontWeight: '600'
          }}
        >
          {rawToken}
        </span>
      );
    }
    // Caso D: Cita / Referencia Bíblica (ej. Salmos 23:1a, Éxod 3:14)
    else if (/^(?:[1-3]\s+)?[A-ZÁÉÍÓÚ][a-záéíóú]+\s+\d+:\d+(?:[a-z]|-\d+)?$/.test(cleanToken)) {
      parts.push(
        <span
          key={`${keyPrefix}-ref-${partIndex++}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1px 6px',
            margin: '0 2px',
            borderRadius: '4px',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(147, 197, 253, 0.28)',
            color: '#93c5fd',
            fontSize: '0.88em',
            fontWeight: '600'
          }}
        >
          {cleanToken}
        </span>
      );
    }
    // Caso E: Negrita Markdown (**texto**)
    else if (rawToken.startsWith('**') && rawToken.endsWith('**')) {
      if (cleanToken) {
        parts.push(
          <strong
            key={`${keyPrefix}-bold-${partIndex++}`}
            style={{
              fontWeight: '700',
              color: 'var(--gold-200)',
              letterSpacing: '0.01em'
            }}
          >
            {cleanToken}
          </strong>
        );
      }
    }
    // Caso F: Cursiva Markdown (*texto*)
    else if (rawToken.startsWith('*') && rawToken.endsWith('*')) {
      if (cleanToken) {
        parts.push(
          <em
            key={`${keyPrefix}-em-${partIndex++}`}
            style={{
              fontStyle: 'italic',
              color: '#fef3c7',
              opacity: 0.95
            }}
          >
            {cleanToken}
          </em>
        );
      }
    }
    // Caso G: Fallback seguro limpio
    else if (cleanToken) {
      parts.push(
        <span key={`${keyPrefix}-tok-${partIndex++}`}>
          {cleanToken}
        </span>
      );
    }

    lastIndex = match.index + rawToken.length;
  }

  // 2. Texto plano restante final
  if (lastIndex < text.length) {
    const rawPlain = text.substring(lastIndex);
    const sanitized = rawPlain.replace(/[*#`_~]/g, '');
    if (sanitized) {
      parts.push(
        <span key={`${keyPrefix}-end`}>
          {sanitized}
        </span>
      );
    }
  }

  return parts;
}

/**
/**
 * Componente principal: SacredContentRenderer
 * Toma el texto retornado por los modelos teológicos y lo renderiza
 * con un diseño sacro de alta cuna, sin un solo símbolo residual,
 * organizando el contenido en tarjetas editoriales distribuidas en una rejilla
 * multi-columna panorámica (cero apelotamiento en una sola columna).
 */
export default function SacredContentRenderer({ content, className = '', multiColumn = true }) {
  if (!content) return null;

  // Normalizar saltos de línea (Windows \r\n a \n)
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  // Agrupar el contenido en secciones lógicas basadas en encabezados
  const sections = [];
  let currentSection = {
    title: '',
    badge: '',
    items: []
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    // Detectar si es un encabezado principal
    const isHeader = /^#{1,6}\s+/.test(line) || /^(\d\.\s*[*_]*[A-ZÁÉÍÓÚ📖🏛️📜🗺️🕊️✨Scale])/.test(line);

    if (isHeader) {
      if (currentSection.title || currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      
      const cleanTitle = line
        .replace(/^#{1,6}\s+/, '')
        .replace(/^\d\.\s+/, '')
        .replace(/[*#`_~]/g, '')
        .trim();

      // Extraer badge numérico si existe (ej. "1.", "2.")
      const numMatch = line.match(/^(\d)\./);
      const badge = numMatch ? `Dimensión ${numMatch[1]}` : 'Análisis';

      currentSection = {
        title: cleanTitle,
        badge,
        items: []
      };
    } else {
      currentSection.items.push(line);
    }
  });

  if (currentSection.title || currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  // Función auxiliar para renderizar líneas individuales dentro de una tarjeta
  const renderItem = (line, idx) => {
    // 1. Líneas Divisoras
    if (/^[-*_]{3,}$/.test(line)) {
      return (
        <div 
          key={idx} 
          style={{ 
            height: '1px', 
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.35) 50%, transparent 100%)', 
            margin: '10px 0' 
          }} 
        />
      );
    }

    // 2. Citas Textuales (> ...)
    if (line.startsWith('>')) {
      const cleanQuote = line.replace(/^>\s*/, '').trim();
      return (
        <blockquote 
          key={idx}
          style={{
            margin: '6px 0',
            padding: '10px 14px',
            borderRadius: '6px',
            background: 'rgba(212,175,55,0.06)',
            borderLeft: '3px solid var(--gold-400)',
            color: 'var(--gold-100)',
            fontStyle: 'italic',
            fontSize: '0.92rem',
            lineHeight: 1.6
          }}
        >
          {renderFormattedSpan(cleanQuote, `quote-${idx}`)}
        </blockquote>
      );
    }

    // 3. Elementos de Lista / Viñetas (* ..., - ..., • ..., * **...**)
    const isListItem = /^[-*•]\s+/.test(line) || /^\*\s*\*\*/.test(line);
    let workingLine = isListItem ? line.replace(/^[-*•]\s+/, '').replace(/^\*\s*\*\*/, '**').trim() : line;

    let termHeader = null;
    let termBody = workingLine;

    const termMatch = workingLine.match(/^(\*{0,2}[^:\n]{2,75}?\*{0,2}):\*{0,2}\s+(.*)$/);
    if (termMatch && isListItem) {
      termHeader = termMatch[1];
      termBody = termMatch[2];
    }

    if (isListItem) {
      return (
        <div 
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(212,175,55,0.08)',
            lineHeight: 1.6,
            fontSize: '0.91rem',
            color: '#edf1f8',
            marginBottom: '4px'
          }}
        >
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--gold-400)',
            boxShadow: '0 0 6px var(--gold-400)',
            marginTop: '7px',
            flexShrink: 0
          }} />

          <div style={{ flex: 1 }}>
            {termHeader ? (
              <>
                <span style={{ fontWeight: '700', color: 'var(--gold-300)', marginRight: '6px' }}>
                  {renderFormattedSpan(termHeader, `th-${idx}`)}:
                </span>
                <span>{renderFormattedSpan(termBody, `tb-${idx}`)}</span>
              </>
            ) : (
              renderFormattedSpan(workingLine, `li-${idx}`)
            )}
          </div>
        </div>
      );
    }

    // 4. Párrafo Normal Limpio
    return (
      <p 
        key={idx}
        style={{
          margin: '3px 0',
          lineHeight: 1.65,
          fontSize: '0.92rem',
          color: '#edf1f8'
        }}
      >
        {renderFormattedSpan(line, `p-${idx}`)}
      </p>
    );
  };

  // Si hay más de una sección y multiColumn es true, desplegamos una Rejilla Multi-Columna Amplia
  if (multiColumn && sections.length > 1) {
    return (
      <div 
        className={`sacred-rendered-grid ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '20px',
          alignItems: 'stretch'
        }}
      >
        {sections.map((sec, sIdx) => (
          <div
            key={sIdx}
            style={{
              background: 'rgba(10, 13, 20, 0.85)',
              border: '1px solid rgba(212,175,55,0.22)',
              borderRadius: '12px',
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
          >
            {sec.title && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                borderBottom: '1px solid rgba(212,175,55,0.2)',
                paddingBottom: '10px',
                marginBottom: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    color: 'var(--gold-400)', 
                    fontSize: '0.9rem',
                    filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.6))'
                  }}>
                    ✦
                  </span>
                  <h4 
                    className="font-cinzel gold-text-gradient"
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: '800',
                      margin: 0,
                      letterSpacing: '0.03em'
                    }}
                  >
                    {sec.title}
                  </h4>
                </div>
                {sec.badge && (
                  <span style={{
                    fontSize: '0.68rem',
                    color: 'var(--gold-300)',
                    background: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: '700'
                  }}>
                    {sec.badge}
                  </span>
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {sec.items.map((line, lIdx) => renderItem(line, `${sIdx}-${lIdx}`))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback / Renderizado en una sola tarjeta amplia
  return (
    <div 
      className={`sacred-rendered-content ${className}`} 
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      {sections.map((sec, sIdx) => (
        <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sec.title && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              paddingBottom: '6px',
              borderBottom: '1px solid rgba(212,175,55,0.22)',
              width: '100%',
              marginTop: sIdx === 0 ? '0' : '14px'
            }}>
              <span style={{ color: 'var(--gold-400)', fontSize: '0.85rem' }}>✦</span>
              <h4 
                className="font-cinzel gold-text-gradient"
                style={{ fontSize: '1.12rem', fontWeight: '800', margin: 0 }}
              >
                {sec.title}
              </h4>
            </div>
          )}
          {sec.items.map((line, lIdx) => renderItem(line, `${sIdx}-${lIdx}`))}
        </div>
      ))}
    </div>
  );
}
