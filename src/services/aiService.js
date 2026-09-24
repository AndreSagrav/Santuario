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

import { generateOfflineTheologicalResponse } from './offlineTheologyEngine.js';

// Modelos Gemini Oficiales y Activos en Google AI Studio
const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-3.1-pro-preview",
  "gemini-pro-latest"
];

let cachedGeminiModels = null;
async function getLiveGeminiModels(key) {
  if (cachedGeminiModels && cachedGeminiModels.length > 0) {
    return cachedGeminiModels;
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    if (res.ok) {
      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        const available = data.models
          .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
          .map(m => m.name.replace(/^models\//, ''))
          .sort((a, b) => {
            const aFlash = a.includes('flash');
            const bFlash = b.includes('flash');
            if (aFlash && !bFlash) return -1;
            if (!aFlash && bFlash) return 1;
            return 0;
          });
        if (available.length > 0) {
          cachedGeminiModels = available;
          return available;
        }
      }
    }
  } catch (e) {
    // Continuar con fallback estático
  }
  return GEMINI_MODELS;
}

// Modelos Groq Oficiales de Alta Capacidad y Razonamiento LPU
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "deepseek-r1-distill-llama-70b",
  "qwen-2.5-32b",
  "llama-3.1-8b-instant"
];

let cachedGroqModels = null;
async function getLiveGroqModels(key) {
  if (cachedGroqModels && cachedGroqModels.length > 0) {
    return cachedGroqModels;
  }
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { "Authorization": `Bearer ${key}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        const models = data.data
          .map(m => m.id)
          .filter(id => id && !id.includes("whisper") && !id.includes("guard"))
          .sort((a, b) => (b.includes("70b") || b.includes("versatile") ? 1 : -1));
        if (models.length > 0) {
          cachedGroqModels = models;
          return models;
        }
      }
    }
  } catch (e) {
    // Continuar con fallback
  }
  return GROQ_MODELS;
}

// Modelos OpenRouter Oficiales de Frontera Analítica
const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct",
  "deepseek/deepseek-chat",
  "qwen/qwen-2.5-72b-instruct",
  "mistralai/mistral-large-2411"
];

// Modelos NVIDIA NIM Oficiales de Inferencia de Máxima Precisión
const NVIDIA_MODELS = [
  "meta/llama-3.3-70b-instruct",
  "mistralai/mistral-large-2-instruct",
  "meta/llama-3.1-70b-instruct"
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
// CONECTORES DE INFERENCIA ESTRICTA (TEMPERATURA 0.2 + BLINDAJE FACTUAL)
// ============================================================================

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
            content: "Eres Ruaj: un mentor bíblico, compañero de estudio y consejero espiritual que integra en perfecto balance la ciencia bíblica pura (crítica textual rigurosa de manuscritos masoréticos, Qumrán, Septuaginta y variantes) con la historia real, la arqueología, las raíces hebreas/griegas (Strong Hxxxx/Gxxxx) y la aplicación devocional profunda al corazón. Tienes total libertad de análisis, reflexión y pensamiento crítico para dialogar de forma inteligente, natural, cercana y conversacional, sin encajonarte en fórmulas rígidas ni dogmas artificiales."
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

  // Nivel 1: Google Gemini (Modelo seleccionado por el usuario o detección dinámica en vivo)
  if (keys.gemini) {
    const userModel = localStorage.getItem("santuario_theology_gemini_model")?.trim();
    if (userModel) {
      const res = await callGemini(keys.gemini, userModel, prompt, useSearch);
      if (res) return res;
    }
    const activeModels = await getLiveGeminiModels(keys.gemini);
    for (const model of activeModels) {
      if (model === userModel) continue;
      const result = await callGemini(keys.gemini, model, prompt, useSearch);
      if (result) return result;
    }
  }

  // Nivel 2: GroqCloud (Detección dinámica en vivo de modelos en LPU)
  if (keys.groq) {
    const activeModels = await getLiveGroqModels(keys.groq);
    for (const model of activeModels) {
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

export async function askRuajAI({ question, passage, mood, isChat = false }) {
  const prompt = isChat
    ? `Eres Ruaj, un mentor bíblico, compañero de estudio y consejero espiritual. Dialogas de forma viva, cercana, empática e inteligente con el creyente, manteniendo plena libertad analítica y de razonamiento.

MARCO INTEGRAL DE CIENCIA BÍBLICA Y REFLEXIÓN (EQUILIBRIO COMPLETO):
1. Ciencia Bíblica y Crítica Textual: Cuando el pasaje lo amerite, fundamenta tus análisis en la evidencia de los manuscritos antiguos reales (Texto Masorético, Qumrán, Septuaginta LXX, Códices) señalando variantes textuales o matices que las traducciones al español a menudo ocultan.
2. Historia y Arqueología Comprobadas: Contextualiza el cuándo y el dónde real (reyes, batallas, geografía del Néguev, Hebrón, Galilea, costumbres sociopolíticas) sin ficción ni adornos ficticios.
3. Raíces Lingüísticas Originales: Cita con precisión las raíces en hebreo, arameo o griego con su numeración Strong oficial (Hxxxx o Gxxxx), explicando el significado profundo del término original.
4. Concordancias de Contexto: Conecta el pasaje armónicamente con el resto del canon bíblico (la Escritura iluminando a la Escritura).
5. Aplicación Viva al Corazón: Extrae enseñanzas prácticas, emotivas y aplicables para los desafíos reales del creyente de hoy.

El usuario te escribe la siguiente consulta en el chat:
"${question}"

${passage ? `Contexto del pasaje activo en el lector: ${passage.book} ${passage.chapter || ''} ${passage.title ? `("${passage.title}")` : ''}` : ''}
${mood ? `Estado de ánimo / enfoque: ${mood}` : ''}

DIRECTRICES CLAVE DE CONVERSACIÓN:
- Conversa con naturalidad, como un sabio compañero en el estudio y la fe. No te encajones en plantillas de formulario ni en cajas burocráticas.
- Respeta con total rigor cualquier indicación específica que el usuario te haya pedido en su mensaje (por ejemplo: versión bíblica solicitada como NVI dividida en versos numerados, perspectiva en primera persona plural "nosotros", lenguaje amigable, sencillo y emotivo sin términos sintéticos).
- Cero alucinaciones: Rigor y veracidad milimétrica en citas y hechos.`
    : `Actúa como Ruaj: mentor bíblico y erudito exegético que integra la ciencia bíblica pura (crítica textual de manuscritos, historia y arqueología) con la exégesis de raíces lingüísticas (Strong Hxxxx / Gxxxx) y la aplicación devocional sabia.

Pasaje de meditación: "${passage?.title || 'la Palabra de Dios'}" (${passage?.versesRange || ''} de ${passage?.book || ''}).
Estado interior del buscador: ${mood || 'Reflexivo'}.
Inquietud o pregunta: "${question}".

REGLAS DE FORMATO:
- NO uses símbolos de markdown toscos como asteriscos (* o **), numerales (###) o guiones bajos (_).
- Escribe títulos de sección en prosa limpia.
- Cita los términos hebreos/griegos y números Strong directamente en el texto.

Estructura tu respuesta en 3 secciones claras:
1. Ciencia Bíblica, Manuscritos & Raíces Originales: Crítica textual, contexto histórico y etimología con número Strong.
2. Aplicación Pastoral al Corazón: Sabiduría práctica y enriquecedora para la vida diaria.
3. Oración Guiada: Una oración íntima y anclada en la promesa bíblica.`;

  const remoteResult = await executeMultiProviderCascade({ prompt, useSearch: true });
  if (remoteResult) return remoteResult;

  // Fallback teológico contextual de alta fidelidad cuando no hay claves remotas
  await new Promise(res => setTimeout(res, 300));
  return generateOfflineTheologicalResponse({ question, passage, mood, isChat });
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

