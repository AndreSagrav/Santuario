// ============================================================================
// MOTOR TEOLÓGICO Y EXEGÉTICO OFFLINE DE ALTA FIDELIDAD
// Proporciona respuestas contextuales, bíblicas y exegéticas reales
// cuando el usuario no tiene configuradas claves de API remotas.
// ============================================================================

import { CANONICAL_BOOKS } from '../data/canonicalBooks.js';

/**
 * Textos bíblicos pre-cargados con alta fidelidad para pasajes clave
 */
const NOTABLE_PASSAGES = {
  "1 cronicas 12:35-40": {
    reference: "1 Crónicas 12:35-40 (NVI)",
    book: "1 Crónicas",
    chapter: 12,
    versesText: `v. 35: De la tribu de Dan, veintiocho mil seiscientos hombres listos para el combate.
v. 36: De la tribu de Aser, cuarenta mil soldados veteranos y diestros para entrar en batalla.
v. 37: Del lado oriental del Jordán, de las tribus de Rubén, Gad y la media tribu de Manasés, ciento veinte mil hombres con toda clase de armamento de guerra.
v. 38: Todos estos hombres de guerra, en perfecta formación de batalla, acudieron a Hebrón con corazón íntegro (לבב שלם - levav shalem) para proclamar a David como rey sobre todo Israel. Y también el resto de los israelitas compartía un mismo sentir y unánime corazón para coronar a David.
v. 39: Estuvieron allí tres días enteros comiendo y bebiendo junto a David, porque sus propios hermanos les habían preparado provisión abundante.
v. 40: Además, de las tribus vecinas y de lugares distantes como Isacar, Zabulón y Neftalí, la gente llegaba trayendo víveres a lomo de asnos, camellos, mulos y bueyes: alimentos de harina, tortas de higos, racimos de pasas, vino, aceite, y ganado vacuno y ovino en gran abundancia; porque un gozo inmenso (שמחה - simjá) llenaba a todo Israel.`,
    historicalSetting: `Nos encontramos en Hebrón, hacia el año 1010 a.C., en una encrucijada histórica decisiva. Tras la muerte trágica del rey Saúl en los montes de Guilboa y años desgastantes de guerra civil y división entre el norte y el sur, los líderes y valientes de todas las doce tribus decidieron dejar atrás viejas rencillas tribales. Reconocieron que la mano de Dios estaba sobre David y se reunieron en Hebrón no como rivales, sino como un solo pueblo bajo el pacto divino.`,
    hebrewRoots: [
      {
        word: "Levav Shalem (לֵבָב שָׁלֵם)",
        strong: "H3824 + H8003",
        meaning: "Corazón íntegro, entero, pacificado e indiviso. No había doblez de intención ni agenda oculta; se entregaron de lleno a la voluntad de Dios."
      },
      {
        word: "Simjá (שִׂמְחָה)",
        strong: "H8057",
        meaning: "Regocijo y alegría festiva desbordante. Describe el gozo visible y colectivo de una nación que experimenta la armonía y la provisión compartida."
      }
    ],
    reflectionPlural: `Queridos hermanos, qué cuadro tan inspirador y vivo nos regala este pasaje para nuestras realidades actuales. En un mundo y en una época donde tantas veces prima la fragmentación, el individualismo o la desconfianza mutua, los valientes de Israel nos enseñan tres principios que hoy necesitamos encarnar más que nunca:

1. La fuerza de un corazón indiviso: Aquellos soldados no fueron a Hebrón a negociar cargos o imponer condiciones personales; fueron con 'levav shalem', un corazón íntegro enfocado en el bien mayor de la comunidad de fe. Cuando nosotros dejamos a un lado las agendas particulares y nos unimos en torno a los propósitos eternos de Dios, las barreras caen.

2. Generosidad y sustento mutuo: El texto relata que las tribus más lejanas —como Isacar, Zabulón y Neftalí— cargaron provisiones en asnos, camellos y bueyes para alimentar durante tres días a cientos de miles de hermanos. Nadie pasó necesidad porque la generosidad fluyó de forma natural. En nuestras familias y comunidades actuales, la verdadera comunión se demuestra en la mesa compartida y en la solidaridad práctica con quien tiene menos.

3. El gozo que brota de la unidad: El versículo 40 concluye diciendo que 'había gran regocijo en Israel'. La tristeza y la incertidumbre de la época anterior quedaron sepultadas bajo una fiesta de esperanza. Cuando caminamos en unidad, la alegría de Dios se vuelve nuestra fortaleza.`,
    prayer: `Señor y Dios nuestro, Padre de bondad y fidelidad, te damos gracias por el testimonio vivo de tu Palabra. Te pedimos hoy que limpies nuestros corazones de todo doble ánimo, rencilla o desconfianza. Regálanos, como a aquellos hombres en Hebrón, un corazón íntegro para servirte y servir a nuestros semejantes. Enséñanos a ser generosos, a compartir con alegría lo que ponemos en nuestras manos y a construir puentes de unidad y paz en nuestros hogares, trabajos y congregaciones. Que tu gozo desbordante llene nuestras vidas hoy y siempre. En el nombre de Jesús, amén.`
  }
};

/**
 * Intenta extraer una cita bíblica de la pregunta
 */
function extractPassageReference(text = '') {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  if (norm.includes('1 cronicas') && (norm.includes('12') || norm.includes('35') || norm.includes('hebron'))) {
    return '1 cronicas 12:35-40';
  }
  if (norm.includes('salmo') && norm.includes('23')) {
    return 'salmos 23';
  }
  if (norm.includes('salmo') && norm.includes('91')) {
    return 'salmos 91';
  }
  if (norm.includes('filipenses') && norm.includes('4')) {
    return 'filipenses 4:6';
  }
  if (norm.includes('romanos') && norm.includes('8')) {
    return 'romanos 8';
  }
  if (norm.includes('juan') && norm.includes('3')) {
    return 'juan 3:16';
  }
  
  return null;
}

/**
 * Genera una respuesta teológica y pastoral exhaustiva y bien fundada
 * en ausencia de claves de inteligencia artificial remotas.
 */
export function generateOfflineTheologicalResponse({ question = '', passage = null, mood = '', isChat = true }) {
  const refKey = extractPassageReference(question) || (passage ? extractPassageReference(`${passage.book} ${passage.chapter}`) : null);

  // Caso 1: Pasaje notable específico (ej. 1 Crónicas 12:35-40)
  if (refKey && NOTABLE_PASSAGES[refKey]) {
    const data = NOTABLE_PASSAGES[refKey];
    
    return `✦ ${data.reference}

${data.versesText}

✦ Contexto Histórico y Escenario Real
${data.historicalSetting}

✦ Raíces Lingüísticas en Hebreo Original
${data.hebrewRoots.map(r => `• ${r.word} (Concordancia Strong ${r.strong}): ${r.meaning}`).join('\n')}

✦ Reflexión para Nuestro Tiempo y Vida Cotidiana
${data.reflectionPlural}

✦ Oración en Comunidad
${data.prayer}

> 💡 Nota pastoral: Esta exégesis y reflexión fue preparada con el motor canónico interno de Santuario para ${data.reference}. Para activar respuestas libres, dinámicas e ilimitadas con modelos de IA en tiempo real (Google Gemini, Groq, OpenRouter o NVIDIA), puedes ingresar tu clave gratuita en el botón de Configuración ⚙️ de la barra superior.`;
  }

  // Caso 2: Consulta sobre pasajes de los libros canónicos generales
  const normQ = question.toLowerCase();
  const matchedBook = CANONICAL_BOOKS.find(b => 
    normQ.includes(b.name.toLowerCase()) || 
    normQ.includes(b.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
  );

  if (matchedBook) {
    const isOT = matchedBook.testament === 'AT';
    return `✦ Estudio Bíblico de ${matchedBook.name}

Hemos analizado tu consulta sobre el libro de ${matchedBook.name} (${matchedBook.chapters} capítulos, ${matchedBook.group}, ${isOT ? 'Antiguo Testamento' : 'Nuevo Testamento'}).

✦ Marco Histórico y Teológico
El libro de ${matchedBook.name} ocupa un lugar fundamental en la revelación bíblica dentro del grupo de los libros ${matchedBook.group.toLowerCase()}. Su propósito central nos revela el carácter inmutable de Dios, Su fidelidad de pacto y Su gobierno providencial sobre la historia humana.

✦ Raíces Sagradas
${isOT 
  ? `En el texto hebreo masorético, este libro resalta conceptos clave como 'Jesed' (חֶסֶד, Strong H2617 - amor leal e inquebrantable de pacto) y 'Tsedek' (צֶדֶק, Strong H6664 - justicia y rectitud moral).`
  : `En el texto griego neotestamentario, se enfatiza la 'Charis' (χάρις, Strong G5485 - gracia redentora inmerecida) y la 'Pistis' (πίστις, Strong G4102 - fe viva y perseverante).`}

✦ Aplicación para Nuestras Vidas Hoy
Al meditar juntos en esta porción de las Escrituras, recordamos que la Palabra de Dios no es una reliquia estática del pasado, sino voz viva que ilumina nuestras decisiones, alinea nuestras prioridades y nos llama a vivir con integridad en nuestro tiempo.

✦ Oración de Fe
Padre celestial, te damos gracias por el testimonio del libro de ${matchedBook.name}. Ilumina nuestro entendimiento para atesorar tus verdades en el corazón y reflejarlas en cada acto cotidiano. En el nombre de Jesús, amén.

> 💡 Consejo: Para dialogar en profundidad sobre cualquier versículo específico de ${matchedBook.name} y hacer preguntas en vivo con IA conversacional, añade tu API Key gratuita de Gemini o Groq en el menú de Configuración ⚙️.`;
  }

  // Caso 3: Temas pastorales y emocionales cotidianos
  if (normQ.includes('ansiedad') || normQ.includes('afan') || normQ.includes('preocupacion') || normQ.includes('temor') || normQ.includes('miedo')) {
    return `✦ Paz Interior y Descanso en la Promesa de Dios

La ansiedad intenta que vivamos en un futuro imaginario que aún no existe, haciéndonos olvidar que la presencia de Dios ya está aquí y ahora.

✦ Luz Bíblica y Raíz Original
En Filipenses 4:6-7, las Escrituras nos instruyen a presentar toda petición con acción de gracias. La palabra griega para afán o ansiedad es 'Merimnao' (μέριμνα, Strong G3308), formada por 'merizo' (dividir) y 'nous' (mente). La ansiedad fragmenta la mente; en contraste, Dios nos ofrece 'Shalom' (שָׁלוֹם, Strong H7965) y 'Eirene' (εἰρήνη, Strong G1515), la paz integral que restablece la unidad y el reposo del alma.

✦ Pasos Prácticos para Hoy
1. No cargues tus pensamientos en silencio: vacíalos en oración específica.
2. Distingue lo que puedes accionar hoy de aquello que solo Dios puede resolver.
3. Respira conscientemente en la certeza de que Dios cuida de ti en cada instante.

✦ Oración
Señor de paz, deposito en tus manos soberanas cada inquietud y temor. Guarda mi mente y mis emociones en Cristo Jesús. Amén.

> 💡 Nota: Puedes habilitar respuestas conversacionales libres en tiempo real ingresando tu API Key gratuita en Configuración ⚙️.`;
  }

  if (normQ.includes('perdon') || normQ.includes('culpa') || normQ.includes('ofensa') || normQ.includes('herida') || normQ.includes('rencor')) {
    return `✦ Sanidad del Corazón y Gracia para Perdonar

El perdón bíblico no consiste en minimizar el dolor ni en fingir que no fuimos agraviados; es el acto de cancelar la deuda espiritual para que la herida no se convierta en una prisión en nuestra propia alma (Efesios 4:32).

✦ Raíz Lingüística
En el Nuevo Testamento, el término para perdonar es 'Aphiemi' (ἀφίημι, Strong G863), que significa literalmente 'soltar, desatar o dejar ir a un prisionero'. Quien perdona descubre que el prisionero liberado era uno mismo. En el Antiguo Testamento, 'Salach' (סָלַח, Strong H5545) refleja el perdón divino que limpia y restaura la comunión.

✦ Oración
Padre de amor, reconozco que me has perdonado una deuda impagable. Dame la valentía y la gracia para soltar toda ofensa y bendecir incluso a quien me hirió. En el nombre de Jesús, amén.`;
  }

  // Caso 4: Respuesta reflexiva general con guía clara
  return `✦ Diálogo y Reflexión Bíblica en Santuario

Hemos recibido tu consulta: "${question}".

La sabiduría de las Escrituras nos enseña que Dios se acerca con gracia al buscador sincero (Jeremías 29:13, Proverbios 2:3-6). Toda verdad bíblica tiene como propósito transformar nuestro corazón, guiar nuestras relaciones y arraigarnos en la esperanza eterna.

✦ Para activar el poder conversacional completo de Ruaj con Inteligencia Artificial:
Actualmente Santuario está funcionando en modo local porque no se ha ingresado una clave de API. Para que Ruaj pueda analizar libremente cualquier pasaje, responder con traducciones instantáneas, exégesis en vivo y redactar exactamente en el estilo que pidas:

1. Haz clic en el botón de Configuración (⚙️ en la esquina superior derecha).
2. Ingresa tu API Key gratuita de **Google Gemini** (desde Google AI Studio) o de **Groq Cloud**.
3. Guarda los cambios. A partir de ese momento, Ruaj responderá con fluidez en tiempo real a cada pregunta que le hagas.

Que la paz del Señor acompañe tu meditación hoy.`;
}
