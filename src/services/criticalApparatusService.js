// ============================================================================
// SERVICIO DE APARATO CRÍTICO PENTADIMENSIONAL
// Exégesis, Contexto Histórico ANE, Crítica Textual, Geografía & Hermenéutica
// ============================================================================

import { askRuajAI } from './aiService';
import { generateScholarlyApparatus } from './scholarlyApparatusEngine';

export async function queryVerseApparatus({ book, chapter, verseNum, verseRange, text, version }) {
  const refString = verseRange ? `${book} ${chapter}:${verseRange}` : `${book} ${chapter}:${verseNum}`;
  
  // Base académica garantizada e infalible para el libro y pasaje específico
  const baseline = generateScholarlyApparatus({ book, chapter, verseNum, verseRange, text, version });

  const prompt = `Actúa como un profesor emérito de historia bíblica, arqueología y filología, caracterizado por su pedagogía diáfana y claridad absoluta.
Tu objetivo es explicar este pasaje bíblico a cualquier persona (de cualquier edad y formación) de manera inteligente, intuitiva, razonable y profundamente fundamentada en evidencia histórica y arqueológica.

Referencia: ${refString} (${version})
Texto bíblico: "${text}"

REGLAS DE PEDAGOGÍA Y COMUNICACIÓN OBLIGATORIAS:
- Cero jerga incomprensible: NO uses términos técnicos de seminario (como "merismo", "Qal", "jussivo", "aoristo", "Tetragrámaton", "BHS") sin explicar de inmediato su significado con ejemplos cotidianos de la vida real.
- Cero hebreo o griego huérfano: NUNCA coloques letras en hebreo o griego sin su traducción directa en español al lado y su explicación práctica. La traducción al español debe ser siempre la protagonista.
- Enfoque laico y riguroso: La crítica textual y el trasfondo histórico deben ser laicos, objetivos y basados en evidencia documental (manuscritos, fechas, descubrimientos arqueológicos), sin apologética dogmática ni sesgos ateos.
- Hilo conductor continuo: Cada sección debe conectarse lógicamente con la anterior, armando una sola historia coherente en lugar de fragmentos dispersos.
- Formato limpio: No uses asteriscos de markdown (* o **), numerales (#) ni códigos numéricos aislados. Usa títulos claros y párrafos fluidos y placenteros de leer.

Estructura obligatoria en 5 apartados conectados:

1. Exégesis y el Significado Original:
Explica con palabras sencillas qué decía la frase original en su idioma materno, qué matiz o riqueza tiene que la traducción tradicional en español a veces pierde, y por qué se usaron esas palabras concretas.

2. Contexto Histórico y Vida Cotidiana:
Explica en qué siglo ocurrió esto, quiénes vivían allí, qué leyes, costumbres o tratados de la época existían y qué problemas reales enfrentaba la gente común en ese momento.

3. Evidencia Documental y Manuscritos (Crítica Textual Laica):
Explica de forma histórica y científica qué manuscritos antiguos existen de este pasaje (como los Rollos del Mar Muerto, el Códice de Leningrado o la Septuaginta griega), en qué siglos se copiaron y si existen diferencias de palabras entre ellos, explicando con honestidad qué significan esas diferencias.

4. Geografía Física y Equivalencia con el Mapa Actual:
Describe el lugar físico de los hechos: el terreno, las rutas de viaje, el clima, y explica con total precisión en qué países modernos se encuentra hoy esa región (por ejemplo: Irak, Turquía, Siria, Israel, Cisjordania, Jordania, Egipto) y cuánta distancia implicaba recorrerla.

5. Conclusión y Sentido de Vida:
Sintetiza los 4 puntos anteriores en una sola idea clara: qué nos enseña todo este contexto histórico y literario para la vida y la reflexión ética del ser humano hoy.`;

  try {
    const aiResponse = await askRuajAI({ question: prompt, mood: 'Investigación Académica' });
    if (aiResponse && (aiResponse.includes('Exégesis') || aiResponse.includes('1.') || aiResponse.includes('Significado') || aiResponse.includes('Contexto'))) {
      return aiResponse;
    }
  } catch (e) {
    console.warn("Consulta IA remota para aparato crítico falló, usando motor pedagógico garantizado:", e);
  }

  return baseline;
}

