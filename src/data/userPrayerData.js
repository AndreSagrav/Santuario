/**
 * userPrayerData.js
 * Datos exactos del Muro de Oración del Usuario según sus documentos originales.
 * 4 Categorías canónicas exclusivas:
 * 1. Arrepentimiento
 * 2. Agradecimiento
 * 3. Peticiones
 * 4. Peticiones Especiales
 */

export const PRAYER_CATEGORIES = [
  { id: "arrepentimiento", name: "1. Arrepentimiento", motto: "PERDONA MIS OFENSAS ASÍ COMO YO PERDONO A LOS QUE ME OFENDEN • DESEO DESPOJARME DE TODOS MIS ÍDOLOS" },
  { id: "agradecimiento", name: "2. Agradecimiento", motto: "DAD GRACIAS EN TODO, PORQUE ESTA ES LA VOLUNTAD DE DIOS" },
  { id: "peticiones", name: "3. Peticiones", motto: "PEDID, Y SE OS DARÁ; BUSCAD, Y HALLARÉIS; LLAMAD, Y SE OS ABRIRÁ" },
  { id: "peticiones_especiales", name: "4. Peticiones Especiales", motto: "ORANDO EN TODO TIEMPO POR LAS PERSONAS Y SUS NECESIDADES" }
];

// 1. ARREPENTIMIENTO (Exacto del documento del usuario, sin añadiduras)
export const INITIAL_REPENTANCE = [
  "Iras Contiendas por Paciencia",
  "Desidia por Diligencia y disciplina",
  "Negligencia Pereza por Fervor Esforzado",
  "Mentiras Engaños por Honestidad",
  "Gula por Moderación",
  "Envidias Codicia por Generosidad",
  "Fornicación Adulterio por Pureza",
  "Malos pensamientos por Pureza de pensamiento",
  "Inmoralidad Sexual - Lujuria por Pureza",
  "Orgullo - Soberbia por Humildad",
  "Avaricia Egoísmo por Compasión",
  "Incredulidad por Fe",
  "Desobediencia por Obediencia",
  "Hurtos por Honestidad y justicia",
  "Amargura por Gozo",
  "Obesidad por Bienestar y salud",
  "Baja estima por Alta estima, confianza y seguridad",
  "Miseria por Prosperidad",
  "Malas palabras por Pureza de labios",
  "Pensamientos negativos",
  "Temor por Valentía"
].map((text, idx) => ({
  id: `rep-${idx + 1}`,
  text: text,
  category: "Arrepentimiento",
  status: "active"
}));

// 2. AGRADECIMIENTO (Exacto del documento del usuario)
export const INITIAL_GRATITUDE = [
  "Sacrificio y Perdón",
  "Vida",
  "Adopción",
  "Salud",
  "Misericordia",
  "Auxilio y refugio",
  "Propósito y obra en mi vida",
  "Fidelidad",
  "Esperanza",
  "Sustento / Provisión",
  "Por mi familia / Amigos",
  "Casa",
  "Lugar de reposo",
  "Alimento",
  "Vestido",
  "Trabajo",
  "Transporte",
  "Esposa",
  "Hijos",
  "Prosperidad",
  "Por poner en mí el querer como el hacer",
  "Sabiduría",
  "Inteligencia"
].map((text, idx) => ({
  id: `gra-${idx + 1}`,
  text: text,
  category: "Agradecimiento",
  status: "active"
}));

// 3. PETICIONES (Exacto del documento del usuario)
export const INITIAL_PETITIONS = [
  "Establece tu Reino / Sana las naciones",
  "Hágase tu voluntad / Enséñame a descubrirla",
  "Danos hoy nuestro pan de cada día",
  "No me permitas ceder ante la tentación",
  "Líbrame de todo Mal",
  "Deseo serte fiel mientras viva",
  "Ayúdame a purificar cada área de mi vida",
  "Lléname de tu gracia",
  "Enséñame a discernir tu voz",
  "Cobertura / Autoridad",
  "Espíritu de Sabiduría / revelación",
  "Abre mi mente y entendimiento",
  "Quiero ser un hombre de oración",
  "Pon en mí el querer como el hacer",
  "Dominio propio",
  "Vida",
  "Salud",
  "Trabajo",
  "Presidente / gobernantes, Sana mi país",
  "Por la paz en Israel"
].map((text, idx) => ({
  id: `pet-${idx + 1}`,
  text: text,
  category: "Peticiones",
  status: "active"
}));

// 4. PETICIONES ESPECIALES (Personas específicas, familia, amigos y peticiones compartidas)
export const INITIAL_SPECIAL_PETITIONS = [
  {
    id: "esp-1",
    person: "Esposa",
    text: "Química, Temor de Dios / íntegra / Amor, Sabia, Inteligente, Honrar, Edificar",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-2",
    person: "Hijos",
    text: "Conformes al corazón de Dios, Libres, Sanos, Inteligentes",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-3",
    person: "Familia",
    text: "Protección, bendición y unidad familiar",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-4",
    person: "Amigos & Liderazgo",
    text: "Grupo de estudio bíblico, Grupo de producción, Pastores y liderazgo",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-5",
    person: "Maureen Cristina Coronado Monge",
    text: "Crecimiento espiritual, oportunidad laboral",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-6",
    person: "Ana Lineth Salazar Álvarez",
    text: "Por conversión de mis 3 hijos",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-7",
    person: "Lincy Vanessa Zúñiga García",
    text: "Crecimiento espiritual y por un mejor trabajo que me permita involucrarme más en las cosas del reino de Dios",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-8",
    person: "Edwin Andrés Sancho Quirós",
    text: "Orar por mi situación familiar y por un mejor trabajo que me permita involucrarme más en las cosas del reino de Dios",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-9",
    person: "Sugeily Jiménez Esquivel",
    text: "Por trabajo y para que Dios nos repare una casita",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-10",
    person: "Gabriela Vega",
    text: "Que el Señor nos guíe en este Programa de Discipulado, con el fin de aprender y refrescar los conocimientos adquiridos a través de los años, así como ser Su instrumento para dar a conocer a otras personas Su palabra.",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-11",
    person: "Federico Paredes",
    text: "Que el Señor nos unja fuertemente por medio de este curso y podamos servirle de acuerdo con Su voluntad.",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-12",
    person: "Ricardo Adolfo Torres Espinoza",
    text: "Por cada miembro de mi familia, más entendimiento y comprensión",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-13",
    person: "Liseth Angulo Ríos",
    text: "Por mi matrimonio / mi esposo / mis hijos para que se vuelvan a Dios / por liberación de vicios de mis hijos / por mi vida por fortaleza que Dios me dé un corazón limpio y avive mi fe.",
    category: "Peticiones Especiales",
    status: "active"
  },
  {
    id: "esp-14",
    person: "Eidy Angulo Ríos",
    text: "Oro por la salud de mi esposo que tiene cáncer en el colon, por sanidad y mucha paz que nunca se aparte de Dios. Por mis hijos que son nacidos de nuevo, para que se congreguen y se entreguen a Dios. Por el esposo de mis hijos, que Dios les muestre quién es y los junte. Por mi familia, hermanos... Por los pastores y por las iglesias que Dios cuide a su pueblo.",
    category: "Peticiones Especiales",
    status: "active"
  }
];
