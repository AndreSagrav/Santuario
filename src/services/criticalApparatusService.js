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

  const prompt = `Actúa como el decano del Instituto de Investigaciones Teológicas del Santuario.

Genera el APARATO CRÍTICO PENTADIMENSIONAL riguroso y exhaustivo para el siguiente pasaje bíblico:
Referencia: ${refString} (${version})
Texto: "${text}"

REGLAS DE FORMATO ESTRICTAS:
- NO utilices símbolos crudos de markdown: PROHIBIDO usar asteriscos (* o **), numerales (### o ####), o guiones de viñeta con asterisco (* ).
- Escribe títulos claros y limpios.
- Al definir palabras, escribe el término, el vocablo hebreo/griego y el número Strong en texto continuo (ejemplo: Jehová (יהוה - H3068): El Tetragrámaton, el nombre propio del Dios del pacto...).
- El motor visual de la interfaz se encarga de aplicar los colores dorados, insignias y tipografía noble.

Estructura tu respuesta exactamente en estas 5 secciones numeradas del 1 al 5:

1. Exégesis Lingüística & Morfología Original:
- Texto original en hebreo/arameo o griego koiné con vocalización.
- Análisis morfosintáctico de los términos clave: lema, tiempo verbal (ej. Qal/Piel, Aoristo/Perfecto), aspecto, voz y número de concordancia Strong exacto (Hxxxx o Gxxxx).

2. Contexto Histórico & Sociocultural:
- Trasfondo del Antiguo Cercano Oriente (ANE) o del mundo grecorromano del siglo I para ${book}.
- Costumbres, tratados de pacto/vasallaje, dinámicas de honor/vergüenza, leyes de pureza ritual o economía de la época que iluminan el pasaje.

3. Crítica Textual & Manuscritos:
- Testigos textuales primarios para ${book}: Cotejo entre el Texto Masorético (Códices de Leningrado/Alepo), Septuaginta (LXX), Manuscritos del Mar Muerto (Qumrán) o Códices del Nuevo Testamento (Sinaiticus, Vaticanus, Alexandrinus, Textus Receptus).
- Señala si existen variantes textuales significativas y su impacto teológico.

4. Geografía Teológica & Topografía:
- Relieve, orografía, clima, rutas comerciales o ecosistema del lugar donde se ubica o redactó el pasaje de ${book}, y por qué la geografía física es intencional para el mensaje espiritual.

5. Hermenéutica del Pacto & Cumplimiento Cristológico:
- Género literario y propósito del autor sagrado hacia su audiencia original.
- Cómo este pasaje de ${book} se inserta en el hilo redentor de la historia de la salvación y apunta a Cristo.

NORMAS FACTUALES:
- Temperatura 0.2: Exactitud factual rigurosa, cero especulación.
- Cita léxicos acreditados (BDB, HALOT, BDAG, Thayer).`;

  try {
    const aiResponse = await askRuajAI({ question: prompt, mood: 'Investigación Académica' });
    if (aiResponse && (aiResponse.includes('Exégesis') || aiResponse.includes('1.') || aiResponse.includes('Contexto'))) {
      return aiResponse;
    }
  } catch (e) {
    console.warn("Consulta IA remota para aparato crítico falló, usando motor exegético garantizado:", e);
  }

  return baseline;
}

