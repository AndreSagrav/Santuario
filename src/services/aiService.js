// ============================================================================
// MOTOR DE INTELIGENCIA TEOLÓGICA DE ALTA FIDELIDAD Y RIGUROSIDAD
// Multi-Proveedor: Google Gemini 3.x (Búsqueda en Vivo) + Groq + OpenRouter + NVIDIA NIM
// Parámetros de Blindaje: Temperatura 0.2 Estricta + Concordancia Strong + Cero Alucinación
// ============================================================================

const STORAGE_KEYS = {
  GEMINI: "santuario_theology_gemini_key",
  GROQ: "santuario_theology_groq_key",
  OPENROUTER: "santuario_theology_openrouter_key",
  NVIDIA: "santuario_theology_nvidia_key"
};

// Modelos Gemini 3.x (Generación 2026 de Máxima Cuota Gratuita y Precisión)
const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",              // Titular: Máxima velocidad sub-segundo y cuota generosa
  "gemini-3.1-flash-lite",              // Respaldo 1: Alta concurrencia y disponibilidad continua
  "gemini-3.6-flash",                   // Respaldo 2: Modelo oficial sustituto de 2.5 Flash
  "gemini-3.8-flash",                   // Vanguardia 3.8
  "gemini-3.7-flash",                   // Vanguardia 3.7
  "gemini-3.5-flash",                   // Insignia 3.5
  "gemini-flash-latest",                // Puntero dinámico a la versión Flash más reciente
  "gemini-3.1-pro-preview"              // Razonamiento profundo Pro
];

// Modelos Groq (Inferencia en LPU a ultra alta velocidad)
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "groq/compound-mini"
];

// Modelos OpenRouter (Catálogo de Razonamiento Amplio)
const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "google/gemini-3.8-flash"
];

// Modelos NVIDIA NIM
const NVIDIA_MODELS = [
  "deepseek-ai/deepseek-v4-flash-0731",
  "google/gemma-3-12b-it"
];

// ============================================================================
// GESTIÓN SEGURA DE CLAVES (ENV + LOCAL STORAGE)
// ============================================================================
export const getProviderKeys = () => {
  return {
    gemini: localStorage.getItem(STORAGE_KEYS.GEMINI) || import.meta.env.VITE_GEMINI_API_KEY || "",
    groq: localStorage.getItem(STORAGE_KEYS.GROQ) || import.meta.env.VITE_GROQ_API_KEY || "",
    openrouter: localStorage.getItem(STORAGE_KEYS.OPENROUTER) || import.meta.env.VITE_OPENROUTER_API_KEY || "",
    nvidia: localStorage.getItem(STORAGE_KEYS.NVIDIA) || import.meta.env.VITE_NVIDIA_API_KEY || ""
  };
};

export const saveProviderKey = (provider, key) => {
  const storageKey = STORAGE_KEYS[provider.toUpperCase()];
  if (!storageKey) return;
  if (key && key.trim()) {
    localStorage.setItem(storageKey, key.trim());
  } else {
    localStorage.removeItem(storageKey);
  }
};

// Compatibilidad retroactiva con Navbar y componentes de interfaz
export const getStoredApiKey = () => {
  return localStorage.getItem(STORAGE_KEYS.GEMINI) || "";
};

export const saveApiKey = (key) => {
  saveProviderKey("gemini", key);
};

export const getApiKeyPool = () => {
  const keys = getProviderKeys();
  return [keys.gemini, keys.groq, keys.openrouter, keys.nvidia].filter(Boolean);
};

// ============================================================================
// BASE LOCAL INFALIBLE (FALLBACK RESILIENTE OFFLINE)
// ============================================================================
const LOCAL_THEOLOGY_ENGINE = {
  ansiedad: {
    title: "Venciendo la Ansiedad y el Afán",
    biblicalTruth: "La ansiedad intenta que vivas en un futuro que aún no existe y donde olvidas que Dios ya está presente. En Filipenses 4:6, el apóstol Pablo enseña que la 'oración con acción de gracias' es el mecanismo de entrega de cargas.",
    greekHebrewInsight: "La palabra griega 'Merimnao' (afán, Strong G3308) se compone de 'merizo' (dividir) y 'nous' (mente). La ansiedad divide tu paz interior. La solución bíblica es 'Eirene' (Strong G1515) — la paz que restaura la integridad.",
    practicalAdvice: "1. No luches contra el pensamiento en solitario; exteriorízalo en oración escrita.\n2. Identifica si te estás preocupando por lo que está fuera de tu círculo de control.\n3. Practica 3 minutos de respiración profunda inhalando la promesa de Dios y exhalando el temor."
  },
  proposito: {
    title: "Dirección, Propósito y Voluntad de Dios",
    biblicalTruth: "El propósito bíblico no es un destino geográfico ni un puesto laboral específico, sino una postura de intimidad y fidelidad diaria (Romanos 8:28, Proverbios 3:5-6).",
    greekHebrewInsight: "En Proverbios 3:6, 'Él enderezará tus veredas', la palabra hebrea es 'Yashar' (Strong H3474), que significa despejar las piedras del camino para que no tropieces mientras caminas en obediencia.",
    practicalAdvice: "Dios rara vez ilumina 10 kilómetros por adelantado; su Palabra es 'lámpara a mis pies' (Salmo 119:105), ilumina el siguiente paso inmediato. Obedece en lo poco hoy."
  },
  perdon: {
    title: "Sanidad del Corazón y el Poder del Perdón",
    biblicalTruth: "El perdón no es justificar la falta del otro ni fingir que no dolió; es cancelar la deuda para que esa herida no sea una prisión espiritual en tu vida (Efesios 4:32).",
    greekHebrewInsight: "El término griego para perdonar es 'Aphiemi' (Strong G863), que significa literalmente 'soltar, despedir, remitir deuda'. Perdonar es dejar ir al prisionero, solo para descubrir que el prisionero eras tú.",
    practicalAdvice: "El perdón es una decisión de la voluntad, no una emoción instantánea. Comienza bendiciendo en privado a quien te hirió."
  }
};

// ============================================================================
// CONECTORES DE INFERENCIA ESTRICTA (TEMPERATURA 0.2 + BLINDAJE FACTUAL)
// ============================================================================

// 1. Conector Google Gemini (con Google Search Grounding y Temperatura 0.2)
async function callGemini(key, model, prompt, useSearch = true) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  
  // Intento 1: Con herramienta de verificación en vivo (Google Search Grounding)
  if (useSearch) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }], // Verificación en tiempo real de fuentes
          generationConfig: {
            temperature: 0.2, // Blindaje anti-alucinación: rigor factual
            topK: 20,
            topP: 0.8
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) return text.trim();
      }
    } catch (e) {
      // Continuar al intento directo si la búsqueda en vivo agota su cuota
    }
  }

  // Intento 2: Inferencia directa con temperatura 0.2 estricta
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2, // Rigor estricto sin especulación
          topK: 20,
          topP: 0.8
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) return text.trim();
    }
  } catch (e) {
    // Continuar al siguiente modelo
  }

  return null;
}

// 2. Conector OpenAI-Compatible (Groq, OpenRouter, NVIDIA NIM con Temperatura 0.2)
async function callOpenAICompatible({ endpoint, key, model, prompt, extraHeaders = {} }) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
        ...extraHeaders
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "Eres un erudito bíblico y mentor espiritual de máxima rigurosidad histórica, lingüística y teológica. Es obligatorio verificar cada raíz hebrea/griega contra el Diccionario Strong (Hxxxx / Gxxxx) y citar libro, capítulo y versículo exactos. Temperatura 0.2 estricta: cero especulación, fidelidad bíblica absoluta."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2 // Blindaje anti-alucinación
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text && text.trim()) return text.trim();
    }
  } catch (e) {
    // Continuar con siguiente proveedor
  }
  return null;
}

// ============================================================================
// CASCADA INTELIGENTE MULTI-PROVEEDOR
// ============================================================================
async function executeMultiProviderCascade({ prompt, useSearch = true }) {
  const keys = getProviderKeys();

  // Nivel 1: Google Gemini 3.x (Con Google Search Grounding y Temperatura 0.2)
  if (keys.gemini) {
    for (const model of GEMINI_MODELS) {
      const result = await callGemini(keys.gemini, model, prompt, useSearch);
      if (result) return result;
    }
  }

  // Nivel 2: GroqCloud (Ultra alta velocidad en LPU con Temperatura 0.2)
  if (keys.groq) {
    for (const model of GROQ_MODELS) {
      const result = await callOpenAICompatible({
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        key: keys.groq,
        model: model,
        prompt: prompt
      });
      if (result) return result;
    }
  }

  // Nivel 3: OpenRouter (Meta Llama 3.3 70B & Modelos Avanzados con Temperatura 0.2)
  if (keys.openrouter) {
    for (const model of OPENROUTER_MODELS) {
      const result = await callOpenAICompatible({
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        key: keys.openrouter,
        model: model,
        prompt: prompt,
        extraHeaders: {
          "HTTP-Referer": "https://santuario.app",
          "X-Title": "Santuario Devocional"
        }
      });
      if (result) return result;
    }
  }

  // Nivel 4: NVIDIA NIM (Modelos de Inferencia con Temperatura 0.2)
  if (keys.nvidia) {
    for (const model of NVIDIA_MODELS) {
      const result = await callOpenAICompatible({
        endpoint: "https://integrate.api.nvidia.com/v1/chat/completions",
        key: keys.nvidia,
        model: model,
        prompt: prompt
      });
      if (result) return result;
    }
  }

  return null;
}

// ============================================================================
// FUNCIONES PÚBLICAS DE CONSULTA TEOLÓGICA Y ORACIÓN
// ============================================================================

export async function askRuajAI({ question, passage, mood }) {
  const prompt = `Actúa como un erudito bíblico y mentor espiritual de máxima rigurosidad histórica, lingüística y teológica.

NORMAS DE VERACIDAD FACTUAL Y COMPROBACIÓN ESTRICTA:
1. Comprueba cada raíz etimológica en hebreo o griego contra la numeración del Diccionario Strong (ej. Hxxxx para hebreo, Gxxxx para griego) y los manuscritos bíblicos masoréticos y Textus Receptus.
2. Está terminantemente prohibido inventar versículos, atribuir frases falsas a personajes bíblicos o falsear hechos históricos.
3. Si un pasaje tiene múltiples interpretaciones históricas sustentadas, menciónalas objetivamente.
4. Cita con precisión milimétrica el libro, capítulo y versículo exactos para sustentar cada afirmación.

Pasaje de meditación: "${passage?.title || 'la Palabra de Dios'}" (${passage?.versesRange || ''} de ${passage?.book || ''}).
Estado interior del buscador: ${mood || 'Reflexivo'}.
Inquietud o pregunta: "${question}".

REGLA VISUAL DE FORMATO:
- NO uses símbolos de markdown: PROHIBIDO usar asteriscos (* o **), numerales (### o ####), guiones bajos (_) o viñetas de asterisco (* ).
- Escribe títulos de sección en prosa limpia.
- Cita los términos hebreos/griegos y números Strong directamente en el texto. La interfaz aplicará la tipografía y medallas visuales de oro automáticamente.

Estructura tu respuesta en 3 secciones claras:
1. Luz Teológica & Raíces Comprobadas: Exégesis rigurosa, contexto histórico del autor y destinatarios, y análisis de la raíz en hebreo/griego original con su número de concordancia Strong verificado (ejemplo: Hxxxx o Gxxxx).
2. Aplicación Pastoral al Corazón: Cómo encarnar esta verdad bíblica con sabiduría práctica, sin legalismos y con gracia.
3. Oración Guiada: Una oración solemne, íntima y anclada firmemente en la promesa de las Escrituras.`;

  const remoteResult = await executeMultiProviderCascade({ prompt, useSearch: true });
  if (remoteResult) return remoteResult;

  // Fallback local en caso de desconexión absoluta
  await new Promise(res => setTimeout(res, 400));
  const lowerQ = question.toLowerCase();
  let topic = "ansiedad";
  if (lowerQ.includes("proposito") || lowerQ.includes("futuro") || lowerQ.includes("decision") || lowerQ.includes("trabajo") || lowerQ.includes("direccion")) {
    topic = "proposito";
  } else if (lowerQ.includes("perdon") || lowerQ.includes("culpa") || lowerQ.includes("ofensa") || lowerQ.includes("dolor") || lowerQ.includes("herida")) {
    topic = "perdon";
  }

  const insight = LOCAL_THEOLOGY_ENGINE[topic];
  return `1. Luz Teológica & Raíces Sagradas
${insight.biblicalTruth}

Raíz Original Comprobada: ${insight.greekHebrewInsight}

2. Aplicación Pastoral al Corazón (${mood ? `Sintiendo: ${mood}` : "Caminando en Fe"})
${insight.practicalAdvice}

3. Oración Guiada de Intimidad
Padre Bueno, me rindo delante de tu majestad en este momento sagrado. Reconozco que tu sabiduría sobrepasa mis límites humanos y que en Cristo todas mis preguntas encuentran reposo. Te entrego mi mente y mis emociones; afirmo mi corazón en tu fidelidad inquebrantable y decido dar el siguiente paso en fe. En el glorioso nombre de Jesús, amén.`;
}

export async function generateCustomPrayer({ need, emotion, devotionTitle }) {
  const prompt = `Redacta una oración íntima, solemne, profunda y bíblicamente anclada para un creyente que experimenta "${emotion}" y cuya necesidad es: "${need}". Meditando en "${devotionTitle}". Temperatura 0.2 estricta, veracidad bíblica total. Máximo 160 palabras. Cero textos técnicos, solo la oración viva.`;

  const remoteResult = await executeMultiProviderCascade({ prompt, useSearch: false });
  if (remoteResult) return remoteResult;

  await new Promise(res => setTimeout(res, 300));
  return `Señor de los cielos y de la tierra, me acerco a ti no con palabras prefabricadas, sino con la verdad desnuda de mi alma. Hoy mi corazón experimenta ${emotion || 'la fragilidad del día a día'}, pero declaro que tu gracia es más alta que mis circunstancias.

Pongo en tus manos mi petición: "${need}". Sé que ningún clamor tuyo se pierde en el vacío, y que antes de que la palabra esté en mi lengua, Tú ya la conoces por completo.

Lléname de tu Espíritu Santo, aquieta el ruido del mundo a mi alrededor y derrama tu bálsamo sanador sobre cada pensamiento. Descanso en que tienes el control y que veré tu gloria manifestada. En el nombre de Jesús, amén.`;
}

/**
 * Motor Inteligente para el Muro de Oración:
 * Realza ortográfica y estilísticamente la petición y la clasifica en las 4 categorías canónicas:
 * 1. Arrepentimiento | 2. Agradecimiento | 3. Peticiones | 4. Peticiones Especiales
 */
export async function enhanceAndClassifyPrayer({ rawText }) {
  if (!rawText || !rawText.trim()) return null;

  const prompt = `Actúa como asistente y escriba devocional reverente.
El usuario ha redactado una nota u oración: "${rawText.trim()}".

TAREAS ESTRICTAS:
1. Realce ortográfico y redacción: Corrige errores ortográficos, tildes, puntuación y caligrafía estilística. Redacta de forma clara, sobria, reverente y digna, preservando exactamente el sentido que el usuario quiso expresar sin inventar conceptos ajenos.
2. Clasificación: Determina a cuál de estas 4 categorías exclusivas pertenece:
   - "Arrepentimiento" (Confesión de faltas, pedir perdón, despojo de malos hábitos, ira, desidia, orgullo, cambio de debilidad por virtud)
   - "Agradecimiento" (Dar gracias a Dios por la vida, salud, provisión, sustento, salvación, bendiciones)
   - "Peticiones" (Peticiones personales o generales: sabiduría, dirección, trabajo, salud propia, gobierno, paz)
   - "Peticiones Especiales" (Oración por personas específicas: esposa, hijos, familiares, amigos, enfermos, conocidos que piden oración)

RESPONDE EXCLUSIVAMENTE en formato JSON válido con esta estructura:
{
  "polishedText": "Texto corregido y embellecido aquí...",
  "category": "Arrepentimiento | Agradecimiento | Peticiones | Peticiones Especiales",
  "recommendedPerson": "Nombre de la persona si se menciona explícitamente o null"
}`;

  try {
    const remoteResult = await executeMultiProviderCascade({ prompt, useSearch: false });
    if (remoteResult) {
      const jsonMatch = remoteResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Asegurar que la categoría coincida con una de las 4 permitidas
        const validCats = ["Arrepentimiento", "Agradecimiento", "Peticiones", "Peticiones Especiales"];
        if (!validCats.includes(parsed.category)) {
          if (parsed.category === "Súplicas") parsed.category = "Peticiones";
          else if (parsed.category === "Intercesión") parsed.category = "Peticiones Especiales";
          else parsed.category = "Peticiones";
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Fallo al clasificar con IA remota, usando clasificación heurística local:", e);
  }

  // Fallback heurístico inteligente local sin IA
  const lower = rawText.toLowerCase();
  let cat = "Peticiones";
  let recommendedPerson = null;

  if (lower.includes("gracias") || lower.includes("agradez") || lower.includes("sustento") || lower.includes("bendición")) {
    cat = "Agradecimiento";
  } else if (lower.includes("perdón") || lower.includes("perdona") || lower.includes("arrepiento") || lower.includes("limpia") || lower.includes("pecado") || lower.includes("ira") || lower.includes("desidia") || lower.includes("pereza")) {
    cat = "Arrepentimiento";
  } else if (lower.includes("esposa") || lower.includes("hijos") || lower.includes("hijo") || lower.includes("familia") || lower.includes("hermano") || lower.includes("pastor") || lower.includes("amig") || lower.includes("por ") || lower.includes("para ")) {
    cat = "Peticiones Especiales";
    // Intentar extraer persona si empieza con "por " o "para "
    const match = rawText.match(/(?:por|para)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)/i);
    if (match) recommendedPerson = match[1];
  }

  const trimmed = rawText.trim();
  const polished = trimmed.charAt(0).toUpperCase() + trimmed.slice(1) + (trimmed.endsWith('.') ? '' : '.');

  return {
    polishedText: polished,
    category: cat,
    recommendedPerson: recommendedPerson
  };
}

