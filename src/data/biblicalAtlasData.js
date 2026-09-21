// ============================================================================
// DATOS DE CARTOGRAFÍA SAGRADA & CONCORDANCIA CONTEXTUAL
// Lugares Históricos, Coordenadas, Arqueología y Redes de Concordancia Teológica
// ============================================================================

export const BIBLICAL_PLACES = [
  {
    id: 'jerusalem',
    name: 'Jerusalén (Sión / Moriah)',
    hebrew: 'יְרוּשָׁלַיִם (Yerushalayim - H3389)',
    meaning: 'Fundación o Ciudad de Paz',
    coords: { lat: 31.778, lng: 35.235 },
    category: 'Judea / Centro',
    period: 'Patriarcas a la Era Apostólica',
    description: 'El epicentro espiritual y teológico de las Escrituras. Lugar del sacrificio de Isaac (Monte Moriah), capital del Reino Unido bajo David, sede del Templo de Salomón, escenario de la pasión, resurrección de Jesucristo y nacimiento de la Iglesia en Pentecostés.',
    archaeology: 'Ciudad de David, Estanque de Siloé, Muro de los Lamentos, Códice de Alepo, túnel de Ezequías.',
    passages: [
      { ref: 'Génesis 22:2', desc: 'Abraham en el monte Moriah' },
      { ref: '2 Samuel 5:7', desc: 'David conquista la fortaleza de Sión' },
      { ref: '1 Reyes 8:1', desc: 'Dedicación del Templo por Salomón' },
      { ref: 'Lucas 24:46-47', desc: 'Comisión de predicar el arrepentimiento desde Jerusalén' },
      { ref: 'Hechos 2:1-4', desc: 'Derramamiento del Espíritu Santo en Pentecostés' }
    ]
  },
  {
    id: 'bethlehem',
    name: 'Belén de Judá (Efrata)',
    hebrew: 'בֵּית לֶחֶם (Beit Lechem - H1035)',
    meaning: 'Casa de Pan',
    coords: { lat: 31.704, lng: 35.207 },
    category: 'Judea',
    period: 'Rut a los Evangelios',
    description: 'Escenario de la redención amorosa de Rut y Booz, lugar donde Samuel ungió al joven pastor David y sitio profetizado por Miqueas donde nacería el Pan de Vida encarnado.',
    archaeology: 'Campos de los pastores, Basílica de la Natividad, sellos reales de la época de Ezequías.',
    passages: [
      { ref: 'Rut 4:11', desc: 'Bendición de Booz y Rut en Belén' },
      { ref: '1 Samuel 16:1', desc: 'Samuel enviado a ungir al hijo de Isaí' },
      { ref: 'Miqueas 5:2', desc: 'Profecía del nacimiento del Gobernante eterno' },
      { ref: 'Mateo 2:1', desc: 'Nacimiento de Jesús en días del rey Herodes' }
    ]
  },
  {
    id: 'nazareth',
    name: 'Nazaret de Galilea',
    hebrew: 'נָצְרַת (Natzeret - G3478 / G3480)',
    meaning: 'Rama, Renuevo (Netzer - H5342)',
    coords: { lat: 32.701, lng: 35.303 },
    category: 'Galilea',
    period: 'Evangelios',
    description: 'Población serrana en la Baja Galilea donde Jesús pasó su infancia y juventud ("Nazareno" vinculado proféticamente al "Renuevo" de Isaías 11:1) y donde proclamó el cumplimiento de Isaías 61 en la sinagoga.',
    archaeology: 'Viviendas del siglo I excavadas en roca caliza, restos de terrazas agrícolas y prensas de oliva.',
    passages: [
      { ref: 'Isaías 11:1', desc: 'Saldrá una vara del tronco de Isaí y un vástago (Netzer)' },
      { ref: 'Lucas 1:26', desc: 'El ángel Gabriel enviado a Nazaret a María' },
      { ref: 'Lucas 4:16-21', desc: 'Lectura de Isaías 61 en la sinagoga de Nazaret' }
    ]
  },
  {
    id: 'capernaum',
    name: 'Capernaum (Kfar Najum)',
    hebrew: 'כְּפַר נַחוּם (Kfar Nachum - G2584)',
    meaning: 'Aldea del Consuelo',
    coords: { lat: 32.880, lng: 35.575 },
    category: 'Mar de Galilea',
    period: 'Evangelios',
    description: 'La "ciudad de Jesús" durante su ministerio galileo. Pueblo pesquero y aduanero donde llamó a Pedro, Andrés, Jacobo, Juan y Mateo; escenario de innumerables milagros de sanidad y del discurso del Pan de Vida.',
    archaeology: 'Sinagoga blanca del siglo IV sobre cimientos de basalto del siglo I, casa de Pedro con inscripciones cristianas primitivas.',
    passages: [
      { ref: 'Mateo 4:13', desc: 'Jesús deja Nazaret y habita en Capernaum' },
      { ref: 'Marcos 2:1-12', desc: 'Sanidad del paralítico bajado por el techo' },
      { ref: 'Juan 6:59', desc: 'Discurso sobre el Pan de Vida en la sinagoga' }
    ]
  },
  {
    id: 'sinai',
    name: 'Monte Sinaí / Horeb',
    hebrew: 'הַר סִינַי (Har Sinai - H5514)',
    meaning: 'Zarza o Zarzal (de Seneh - H5572)',
    coords: { lat: 28.539, lng: 33.975 },
    category: 'Península del Sinaí',
    period: 'Éxodo y Profetas',
    description: 'La Montaña Sagrada de Dios. Lugar de la revelación de la Zarza Ardiente (Éxodo 3), entrega del Decálogo y de las tablas de la Alianza con Israel, y refugio del profeta Elías donde Dios le habló en el silbo apacible y delicado.',
    archaeology: 'Inscripciones proto-sinaíticas, Monasterio de Santa Catalina, rutas caravaneras de cobre y turquesa.',
    passages: [
      { ref: 'Éxodo 3:1-6', desc: 'Llamamiento de Moisés en la zarza ardiente' },
      { ref: 'Éxodo 19:16-20', desc: 'Teofanía en el monte y entrega de la Ley' },
      { ref: '1 Reyes 19:8-12', desc: 'Elías escucha el silbo apacible en la cueva' }
    ]
  },
  {
    id: 'carmel',
    name: 'Monte Carmelo',
    hebrew: 'הַר הַכַּרְמֶל (Har HaKarmel - H3760)',
    meaning: 'Viñedo o Jardín de Dios',
    coords: { lat: 32.733, lng: 35.050 },
    category: 'Costa Norte',
    period: 'Reyes',
    description: 'Promontorio montañoso sobre el mar Mediterráneo célebre por su fertilidad y por el enfrentamiento decisivo entre el profeta Elías y los 450 profetas de Baal, donde cayó fuego de Jehová demostrando la soberanía del Dios vivo.',
    archaeology: 'Lugar de Muhraqa (el sacrificio), terrazas antiguas y cuevas ermitañas.',
    passages: [
      { ref: '1 Reyes 18:20-39', desc: 'El fuego del cielo desciende en el Carmelo' },
      { ref: 'Isaías 35:2', desc: 'La hermosura del Carmelo y de Sarón' }
    ]
  },
  {
    id: 'antioch',
    name: 'Antioquía de Siria',
    hebrew: 'Ἀντιόχεια (Antiocheia - G490)',
    meaning: 'Resistente / Conquistadora',
    coords: { lat: 36.202, lng: 36.160 },
    category: 'Siria / Misión',
    period: 'Era Apostólica',
    description: 'La tercera metrópoli del Imperio Romano y la cuna de las misiones gentiles. Primera comunidad donde creyentes judíos y gentiles adoraron juntos en igualdad y donde por primera vez se les llamó "Cristianos". Base misionera de Pablo y Bernabé.',
    archaeology: 'Gruta de San Pedro, mosaicos romanos del río Orontes, acueductos.',
    passages: [
      { ref: 'Hechos 11:19-26', desc: 'Los discípulos son llamados cristianos por primera vez' },
      { ref: 'Hechos 13:1-3', desc: 'El Espíritu Santo aparta a Bernabé y a Saulo para la misión' }
    ]
  },
  {
    id: 'athens',
    name: 'Atenas (El Areópago)',
    hebrew: 'Ἄρειος Πάγος (Areios Pagos - G697)',
    meaning: 'Colina de Ares (Marte)',
    coords: { lat: 37.971, lng: 23.725 },
    category: 'Grecia / Acaya',
    period: 'Viajes de Pablo',
    description: 'Corazón filosófico de la cultura helénica. Escenario del famoso discurso del apóstol Pablo ante los filósofos estoicos y epicúreos acerca del "Dios No Conocido", creador y sustentador de toda la humanidad.',
    archaeology: 'Acrópolis, Ágora ateniense, inscripción del altar al dios no conocido documentada por Pausanias.',
    passages: [
      { ref: 'Hechos 17:16-34', desc: 'Discurso de Pablo en el Areópago sobre el Dios Creador' }
    ]
  }
];

export const BIBLICAL_ROUTES = [
  {
    id: 'exodus',
    name: 'Ruta del Éxodo & Desierto de la Alianza',
    color: '#d4af37',
    description: 'Desde Ramesés en Egipto, cruzando el Mar Rojo, hacia el Monte Sinaí y las estepas de Moab frente a Jericó.',
    stops: ['Ramesés (Gosén)', 'Pi-Hajirot (Mar Rojo)', 'Mara & Elim', 'Monte Sinaí / Horeb', 'Cades-Barnea', 'Monte Nebo']
  },
  {
    id: 'paul_missionary',
    name: 'Viajes Misioneros del Apóstol Pablo',
    color: '#5bc0be',
    description: 'La expansión del Evangelio desde Antioquía de Siria por toda Asia Menor, Grecia y finalmente el corazón del Imperio en Roma.',
    stops: ['Antioquía de Siria', 'Tarso', 'Galacia (Derbe y Listra)', 'Éfeso', 'Filipos', 'Tesalónica', 'Atenas', 'Corinto', 'Roma']
  },
  {
    id: 'jesus_ministry',
    name: 'Ministerio de Jesús: De Galilea a Jerusalén',
    color: '#e0a96d',
    description: 'El camino del Maestro proclamando las buenas nuevas del Reino desde las orillas del Kineret hasta la colina del Gólgota.',
    stops: ['Nazaret', 'Caná de Galilea', 'Capernaum', 'Monte de las Bienaventuranzas', 'Cesarea de Filipo', 'Jericó', 'Betania', 'Jerusalén']
  }
];

export const THEOLOGICAL_CONCORDANCE_TOPICS = [
  {
    id: 'the_covenant',
    title: 'El Pacto Divino (Berit) y la Sangre de la Alianza',
    strong: 'H1285 (Berit) / G1242 (Diatheke)',
    summary: 'La columna vertebral de toda la teología bíblica: Dios no se relaciona con el hombre mediante contratos comerciales, sino mediante pactos sagrados inmutables sellados con sangre y fidelidad incondicional.',
    trajectory: [
      { epoch: 'Pacto Edénico & Protoevangelio', ref: 'Génesis 3:15', note: 'La simiente de la mujer aplastará la cabeza de la serpiente.' },
      { epoch: 'Pacto Abrahámico', ref: 'Génesis 15:17-18', note: 'Dios pasa solo entre los animales divididos jurando fidelidad unilateral.' },
      { epoch: 'Pacto Sinaítico', ref: 'Éxodo 24:8', note: 'Moisés rocía la sangre de la alianza sobre el pueblo.' },
      { epoch: 'Pacto Davídico', ref: '2 Samuel 7:12-16', note: 'Promesa de un linaje real eterno que culmina en Cristo.' },
      { epoch: 'Nuevo Pacto', ref: 'Jeremías 31:31 / Lucas 22:20', note: 'La ley escrita en el corazón y la copa de la nueva alianza en su sangre.' }
    ]
  },
  {
    id: 'the_dwelling_temple',
    title: 'La Morada de Dios: Del Tabernáculo a la Iglesia',
    strong: 'H4908 (Mishkán) / H7931 (Shakán) / G4637 (Skenóo)',
    summary: 'El anhelo eterno de Dios: no habitar en templos lejanos hechos por manos humanas, sino morar (*Shekinah*) en medio y dentro de su pueblo redimido.',
    trajectory: [
      { epoch: 'El Huerto del Edén', ref: 'Génesis 3:8', note: 'Comunión íntima de Dios paseando en el aire del día.' },
      { epoch: 'El Tabernáculo del Desierto', ref: 'Éxodo 25:8', note: '«Y harán un santuario para mí, y habitaré en medio de ellos».' },
      { epoch: 'El Templo de Salomón', ref: '1 Reyes 8:10-11', note: 'La nube de gloria llena el lugar santísimo.' },
      { epoch: 'La Encarnación', ref: 'Juan 1:14', note: 'El Verbo se hizo carne y tabernaculizó (*eskenosen*) entre nosotros.' },
      { epoch: 'La Iglesia y el Creyente', ref: '1 Corintios 6:19', note: '«¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo?»' },
      { epoch: 'La Nueva Jerusalén', ref: 'Apocalipsis 21:3', note: '«He aquí el tabernáculo de Dios con los hombres».' }
    ]
  },
  {
    id: 'shalom_peace',
    title: 'Shalom & Eirene: La Paz Integral del Reino',
    strong: 'H7965 (Shalom - Shalam) / G1515 (Eirene - Eiro)',
    summary: 'La paz bíblica no es mera tregua o ausencia de guerra psicológica; es plenitud, restauración de lo que estaba fracturado, justicia y reconciliación total.',
    trajectory: [
      { epoch: 'Bendición Sacerdotal Aarónica', ref: 'Números 6:24-26', note: '«Jehová alce sobre ti su rostro, y ponga en ti paz (Shalom)».' },
      { epoch: 'Profecía Mesiánica', ref: 'Isaías 9:6', note: 'Anuncio del Príncipe de Paz (Sar Shalom).' },
      { epoch: 'El Castigo por Nuestra Paz', ref: 'Isaías 53:5', note: 'El castigo de nuestra paz fue sobre Él para sanarnos.' },
      { epoch: 'La Paz Legada por Cristo', ref: 'Juan 14:27', note: '«La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da».' },
      { epoch: 'Paz con Dios por la Justificación', ref: 'Romanos 5:1', note: 'Justificados por la fe, tenemos paz para con Dios.' }
    ]
  },
  {
    id: 'substitutionary_lamb',
    title: 'El Cordero y el Sustituto: De Isaac al Calvario',
    strong: 'H7716 (Seh) / G721 (Arnion) / G286 (Amnos)',
    summary: 'La tipología del rescate provisto por Dios: donde el ser humano culpable o condenado es exonerado porque Dios mismo provee el sacrificio perfecto.',
    trajectory: [
      { epoch: 'Moriah y el Carnero en el Zarzal', ref: 'Génesis 22:8-13', note: '«Dios se proveerá de cordero para el holocausto, hijo mío».' },
      { epoch: 'El Cordero de la Pascua en Egipto', ref: 'Éxodo 12:5-7', note: 'Sangre en los dinteles para librar de la muerte.' },
      { epoch: 'El Siervo Sufriente Llevado al Matadero', ref: 'Isaías 53:7', note: 'Como cordero fue llevado al matadero sin abrir su boca.' },
      { epoch: 'Identificación de Juan el Bautista', ref: 'Juan 1:29', note: '«He aquí el Cordero de Dios, que quita el pecado del mundo».' },
      { epoch: 'El Cordero en el Trono', ref: 'Apocalipsis 5:6-12', note: '«El Cordero que fue inmolado es digno de tomar el poder».' }
    ]
  }
];
