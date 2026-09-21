// ============================================================================
// SERVICIO DE CONCORDANCIA CONTEXTUAL Y GEOGRAFÍA TEOLÓGICA
// Multi-Proveedor (Gemini 3.x + Groq + OpenRouter) con Temperatura 0.2 Estricta
// ============================================================================

import { askRuajAI } from './aiService';

export async function queryContextualConcordance({ topic, textRef }) {
  const prompt = `Actúa como el decano de teología bíblica y hermenéutica del Santuario.

Realiza un estudio exhaustivo de CONCORDANCIA CONTEXTUAL Y TEOLÓGICA (no una simple lista de versículos con palabras repetidas, sino un análisis de la revelación progresiva, el pacto divino y el contexto histórico-cultural).

Tema o Pasaje a Analizar: "${topic}" ${textRef ? `(Pasaje base: ${textRef})` : ''}.

NORMAS ESTRICTAS DE RIGOR FACTUAL:
- Cita cada raíz en hebreo o griego con su número de concordancia Strong exacto (Hxxxx o Gxxxx).
- Conecta la trayectoria del tema en 4 etapas:
  1. Génesis y la Era Patriarcal / Antiguo Cercano Oriente.
  2. La Ley Mosaica y el Sistema Sacerdotal o Monarquía.
  3. Los Profetas y el cumplimiento cristológico en los Evangelios.
  4. La Teología Apostólica en las Epístolas y la consumación en Apocalipsis.
- Explica el trasfondo arqueológico, social o de pacto (ej. tratados de vasallaje, costumbres nupciales, geografía).
- Termina con una breve síntesis pastoral aplicable a la vida de oración del creyente hoy.

Presenta la respuesta estructurada en formato Markdown noble y solemne.`;

  return await askRuajAI({ question: prompt, mood: 'Estudio Profundo' });
}

export async function queryBiblicalGeography({ placeName }) {
  const prompt = `Actúa como un arqueólogo bíblico y geógrafo teológico de primer nivel.

Realiza una reconstrucción histórica, arqueológica y geográfica del siguiente lugar sagrado: "${placeName}".

NORMAS DE RIGOR:
1. Nombre original en hebreo/arameo o griego y su significado etimológico con Strong.
2. Ubicación geográfica y relieve en el mundo bíblico (región, rutas comerciales como Vía Maris o Camino del Rey).
3. Tres acontecimientos cruciales del pacto o del ministerio de Jesús/los apóstoles ocurridos allí, con cita de libro, capítulo y versículo exactos.
4. Hallazgos arqueológicos documentados (inscripciones, excavaciones, ciudades superpuestas).
5. Mensaje espiritual y lección para el altar del corazón hoy.

Presenta en Markdown estructurado y noble.`;

  return await askRuajAI({ question: prompt, mood: 'Exploración Histórica' });
}
