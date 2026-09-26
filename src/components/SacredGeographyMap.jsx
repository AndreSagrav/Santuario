import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, MapPin, Mountain, Droplets, Globe, Layers, Navigation, Shield, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, X, Sparkles } from 'lucide-react';

/**
 * SacredGeographyMap.jsx
 * Mapa Cartográfico REAL del Mundo Bíblico y Países Actuales.
 * Construido sobre motor Leaflet con tiles satelitales y políticos reales:
 * - Capa 1: Mapa Político Actual (OpenStreetMap / CartoDB con fronteras, países coloreados y ciudades de hoy)
 * - Capa 2: Fotografía Satelital Real (Esri World Imagery con relieve real, desiertos y costas)
 * - Capa 3: Mapa Topográfico Físico (Esri World Topo con curvas de nivel y cordilleras)
 * - Trazado geodésico de la Ruta de Abraham con distancias en km.
 */

// Hitos de Génesis con coordenadas GPS exactas
const GENESIS_SITES = [
  {
    id: 'eden_mesopotamia',
    name: 'Cuenca de los Cuatro Ríos (Tigris y Éufrates)',
    modernCountry: 'Irak (Centro y Sur)',
    modernCity: 'Región entre Bagdad y Basora (Confluencia Chatt al-Arab)',
    historicalEra: 'Mesopotamia Antigua / Creciente Fértil',
    travelDistance: 'Cuna de la agricultura fluvial y de las primeras ciudades de la humanidad',
    elevation: '+40 m (Llanura aluvial)',
    climate: 'Aluvial desértico, regado por las crecidas históricas del Tigris y Éufrates',
    secularNote: 'En esta llanura entre el Tigris y el Éufrates nació la agricultura y la escritura cuneiforme hace más de 5.000 años. Los sumerios construyeron canales de riego para convertir las tierras áridas en el corazón agrícola del mundo antiguo.',
    biblicalRelation: 'Génesis sitúa el huerto del Edén en esta fértil cuenca fluvial para enseñar que la vida humana comenzó en una tierra viva, fecunda y provista de agua, donde el ser humano debía cuidar y labrar la creación.',
    archaeology: 'Estratos de Tell el-Obeid y Eridu (sur de Irak). Canales sumerios y registros agrícolas en tablillas de arcilla milenarias.',
    lat: 31.0050,
    lng: 47.4320,
    zoom: 8
  },
  {
    id: 'ur_caldeos',
    name: 'Ur de los Caldeos',
    modernCountry: 'Irak (Sur)',
    modernCity: 'Tell el-Mukayyar, provincia de Di Qar (a 15 km de Nasiriyah)',
    historicalEra: 'Civilización Sumeria y Babilonia',
    travelDistance: 'Aprox. 950 km hasta Harán (mes y medio de viaje en caravana junto al río)',
    elevation: '+12 m (Cerca de las marismas del Golfo Pérsico)',
    climate: 'Muy caluroso y seco en verano, con tierras aluviales junto al río',
    secularNote: 'Era una de las metrópolis más avanzadas, comerciales y cosmopolitas del mundo antiguo, con un activo puerto fluvial y el célebre Zigurat de Ur dedicado al culto de la luna.',
    biblicalRelation: 'De aquí salió Abraham con su padre Taré. Dejó atrás la comodidad y los cultos de una gran ciudad cosmopolita para obedecer el llamado de buscar una tierra nueva viviendo en tiendas.',
    archaeology: 'Gran Zigurat de Ur excavado por Sir Leonard Woolley. Se descubrieron tumbas reales con joyas de oro, liras musicales y miles de contratos comerciales en arcilla.',
    lat: 30.9628,
    lng: 46.1030,
    zoom: 10
  },
  {
    id: 'haran',
    name: 'Harán en Padán-Aram',
    modernCountry: 'Turquía (Frontera Sur con Siria)',
    modernCity: 'Distrito de Harran, provincia de Şanlıurfa (a 18 km de la frontera siria)',
    historicalEra: 'Reino de Mitani / Padán-Aram',
    travelDistance: 'Aprox. 600 km hacia el sur hasta entrar en Canaán (un mes de marcha a pie)',
    elevation: '+375 m sobre el nivel del mar',
    climate: 'Estepario continental con inviernos fríos y veranos templados',
    secularNote: 'Crucero neurálgico de las grandes rutas de comerciantes entre Mesopotamia, Anatolia y el Mediterráneo. Célebre por sus casas tradicionales con techos en forma de cono de barro.',
    biblicalRelation: 'Aquí vivió la familia de Abraham tras salir de Ur y aquí falleció su padre Taré. Años más tarde, el mayordomo de Abraham y su nieto Jacob volverían a esta misma región para buscar esposa.',
    archaeology: 'Mencionada en las tablillas cuneiformes de Ebla (Siria) y Mari del segundo milenio a.C. como próspera estación caravanera internacional.',
    lat: 36.8667,
    lng: 39.0333,
    zoom: 9
  },
  {
    id: 'siquem',
    name: 'Siquem (Valle de Moreh)',
    modernCountry: 'Cisjordania / Territorios Palestinos',
    modernCity: 'Ciudad de Nablus (Tel Balata), entre los montes Ebal y Gerizim',
    historicalEra: 'Canaán Central (Edad del Bronce)',
    travelDistance: 'Aprox. 45 km al norte de Hebrón (dos días de caminata a pie por el lomo montañoso)',
    elevation: '+520 m en un paso estratégico de montaña',
    climate: 'Mediterráneo de montaña, fresco y con abundantes manantiales naturales',
    secularNote: 'Paso obligatorio para cualquier viajero que cruzara Canaán de norte a sur o que viajara del Mar Mediterráneo al Río Jordán.',
    biblicalRelation: 'Fue la primera parada de Abraham al llegar a la Tierra Prometida. Allí levantó su primer altar y escuchó la promesa de que esa tierra sería para su descendencia.',
    archaeology: 'Tel Balata: Murallas ciclópeas de piedra de la Edad del Bronce Medio (hacia 1900 a.C.) y puerta monumental de la ciudad, citada en los Textos de Execración egipcios.',
    lat: 32.2144,
    lng: 35.2842,
    zoom: 11
  },
  {
    id: 'hebron_mamre',
    name: 'Hebrón y Encinar de Mamre',
    modernCountry: 'Cisjordania / Territorios Palestinos',
    modernCity: 'Ciudad de Hebrón (Al-Khalil / Tel Rumeida), a 30 km al sur de Jerusalén',
    historicalEra: 'Montañas de Judea (Canaán del Sur)',
    travelDistance: 'Campamento base principal de Abraham durante décadas',
    elevation: '+930 m sobre el nivel del mar (una de las ciudades más altas de la región)',
    climate: 'Clima de montaña con brisas frescas, noches despejadas y fértiles viñedos',
    secularNote: 'Una de las poblaciones continuamente habitadas más antiguas del planeta, famosa por sus olivares, viñas y el recinto monumental sobre la Cueva de Macpela.',
    biblicalRelation: 'Escenario de Génesis 15: aquí acampaba Abraham cuando Dios lo invitó a salir de su tienda y mirar las estrellas. Más adelante, Abraham compró allí la Cueva de Macpela para enterrar a su esposa Sara.',
    archaeology: 'Tel Rumeida: Muralla defensiva de piedra de más de 3 metros de espesor construida hacia el 1900 a.C., probando que Hebrón ya existía como ciudad fortificada en tiempos de Abraham.',
    lat: 31.5298,
    lng: 35.0938,
    zoom: 11
  }
];

// Hitos de Judea y Salmos con coordenadas GPS exactas
const JUDEA_SITES = [
  {
    id: 'jerusalem',
    name: 'Jerusalén (Monte Sion)',
    modernCountry: 'Israel / Cisjordania',
    modernCity: 'Jerusalén',
    historicalEra: 'Monarquía Unida y Reino de Judá',
    travelDistance: 'Núcleo central de Judea',
    elevation: '+754 m en la divisoria de aguas',
    climate: 'Mediterráneo montañoso, inviernos fríos y veranos secos',
    secularNote: 'Fortaleza natural protegida por valles profundos (Cedrón y Hinom) que David convirtió en capital por su posición neutral e inexpugnable.',
    biblicalRelation: 'Centro espiritual y político donde Salomón construyó el Templo y donde David compuso muchos de sus salmos litúrgicos.',
    archaeology: 'Manantial de Gihón, túnel excavado en la roca viva por el rey Ezequías (701 a.C.) y muros de la Ciudad de David.',
    lat: 31.7767,
    lng: 35.2345,
    zoom: 12
  },
  {
    id: 'bethlehem',
    name: 'Belén de Judá',
    modernCountry: 'Cisjordania / Territorios Palestinos',
    modernCity: 'Belén (Beit Lahm), a 10 km al sur de Jerusalén',
    historicalEra: 'Colinas de Judá',
    travelDistance: '2 horas a pie desde Jerusalén',
    elevation: '+775 m sobre el nivel del mar',
    climate: 'Mediterráneo fértil hacia el oeste, con caída hacia el desierto al este',
    secularNote: 'Pueblo de pastores y agricultores situado en terrazas de cultivo de cebada, trigo y olivos.',
    biblicalRelation: 'Cuna del rey David, donde cuidaba los rebaños de ovejas de su padre y aprendió a confiar en Dios frente al león y al oso.',
    archaeology: 'Sellos reales de barro con la inscripción «Belén» del siglo VIII a.C. y restos de terrazas agrícolas milenarias.',
    lat: 31.7054,
    lng: 35.2024,
    zoom: 12
  },
  {
    id: 'wadi_qelt',
    name: 'Wadi Qelt (Desfiladero del Desierto)',
    modernCountry: 'Cisjordania / Territorios Palestinos',
    modernCity: 'Desfiladero natural entre Jerusalén y la ciudad de Jericó',
    historicalEra: 'Desierto de Judea',
    travelDistance: 'Descenso abrupto de 1.000 metros de altura en solo 25 km',
    elevation: 'De +700 m a -250 m bajo el nivel del mar',
    climate: 'Desértico árido y sofocante, donde la luz solar penetra pocas horas al día',
    secularNote: 'Cañón estrecho y peligroso de paredes calizas verticales, famoso por haber sido históricamente guarida de asaltantes de caminos.',
    biblicalRelation: 'El paisaje que inspiró la frase del Salmo 23: «Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo».',
    archaeology: 'Canales de agua excavados en los riscos por los reyes asmoneos y el Monasterio de San Jorge encastrado en la roca.',
    lat: 31.8444,
    lng: 35.4167,
    zoom: 12
  },
  {
    id: 'engedi',
    name: 'Oasis de En-Gedi',
    modernCountry: 'Israel',
    modernCity: 'Costa occidental del Mar Muerto',
    historicalEra: 'Límite oriental del Desierto de Judea',
    travelDistance: 'Un día de marcha al este de Hebrón',
    elevation: '-200 m bajo el nivel del mar',
    climate: 'Calor tropical seco con manantiales perennes de agua dulce pura',
    secularNote: 'Un oasis verde con cascadas naturales y vegetación exuberante que brota milagrosamente en medio de la desolación de sal del Mar Muerto.',
    biblicalRelation: 'Lugar donde David y sus hombres se refugiaron en las cuevas mientras huían del rey Saúl, inspirando cantos de alivio y refugio seguro.',
    archaeology: 'Templo calcolítico, terrazas de bálsamo aromático y cuevas naturales habitadas desde hace 4.000 años.',
    lat: 31.4658,
    lng: 35.3900,
    zoom: 12
  }
];

// Hitos de Éxodo y el Desierto del Sinaí
const EXODUS_SITES = [
  {
    id: 'ramesses',
    name: 'Ramesés / Avaris (Tierra de Gosén)',
    modernCountry: 'Egipto',
    modernCity: 'Qantir / Tell el-Dabaa (Delta Oriental del Nilo)',
    historicalEra: 'Imperio Nuevo Egipcio (Siglos XIII-XII a.C.)',
    travelDistance: 'Punto de partida de la marcha del Éxodo',
    elevation: '+10 m (Delta fértil del Nilo)',
    climate: 'Mediterráneo aluvial subtropical, canales de riego y cañaverales',
    secularNote: 'Capital dinástica de los faraones ramésidas construida con ladrillos de barro y paja por cuadrillas de trabajadores semíticos forzados.',
    biblicalRelation: 'Lugar donde los israelitas vivieron en servidumbre fabricando ladrillos hasta que Moisés los condujo en libertad tras la décima plaga.',
    archaeology: 'Palacio de Tell el-Dabaa con tumbas de estilo cananeo y almacenes reales del segundo milenio a.C.',
    lat: 30.7870,
    lng: 31.8310,
    zoom: 9
  },
  {
    id: 'red_sea',
    name: 'Mar Rojo / Pi-Hajirot',
    modernCountry: 'Egipto',
    modernCity: 'Norte del Golfo de Suez (cerca del actual Canal de Suez)',
    historicalEra: 'Frontera oriental fortificada de Egipto',
    travelDistance: 'Aprox. 80 km al este de Ramesés (3 jornadas a pie)',
    elevation: '0 m (Nivel del mar)',
    climate: 'Vientos secos del este, lagunas saladas y desierto costero',
    secularNote: 'Zona de marismas de cañas (Yam Suf) protegida por fortalezas defensivas de la frontera egipcia llamadas Shur.',
    biblicalRelation: 'Escenario donde las aguas se abrieron ante la vara de Moisés, permitiendo cruzar a pie en seco mientras los carros de guerra del Faraón quedaron atrapados.',
    archaeology: 'Fortalezas fronterizas de Tell el-Borg y el Muro del Soberano registradas en papiros egipcios.',
    lat: 29.9668,
    lng: 32.5498,
    zoom: 9
  },
  {
    id: 'sinai_horeb',
    name: 'Monte Sinaí / Horeb (Montaña de Dios)',
    modernCountry: 'Egipto (Península del Sinaí)',
    modernCity: 'Jabal Musa (Monte Moisés), a los pies del Monasterio de Santa Catalina',
    historicalEra: 'Edad del Bronce Tardío (siglo XIII a.C.)',
    travelDistance: 'Aprox. 250 km al sur por la costa del Golfo de Suez',
    elevation: '+2.285 m sobre el nivel del mar (picos de granito rojo)',
    climate: 'Desierto árido de montaña con noches heladas y vientos cortantes',
    secularNote: 'Macizo imponente de roca granítica en medio de un silencio desértico absoluto, ruta de minas de turquesa y cobre egipcias de Serabit el-Khadim.',
    biblicalRelation: 'Lugar de la zarza ardiente, la entrega de las tablas del Decálogo (Los Diez Mandamientos) y el pacto nacional que forjó a Israel como pueblo.',
    archaeology: 'Inscripciones proto-sinaíticas alfabéticas (las más antiguas de la historia humana) y Monasterio fundado en el siglo VI d.C.',
    lat: 28.5394,
    lng: 33.9753,
    zoom: 10
  },
  {
    id: 'kadesh_barnea',
    name: 'Cades-Barnea (Oasis de Meriba)',
    modernCountry: 'Egipto / Israel (Frontera Néguev-Sinaí)',
    modernCity: 'Ein el-Qudeirat / Ein Qadis',
    historicalEra: 'Campamento del Desierto (38 años)',
    travelDistance: 'A 11 jornadas de camino desde el monte Horeb',
    elevation: '+350 m sobre el nivel del mar',
    climate: 'Oasis fértil con manantial perenne rodeado de desierto absoluto',
    secularNote: 'El mayor manantial natural de agua dulce del norte del Sinaí, estación estratégica en la ruta hacia Canaán.',
    biblicalRelation: 'Base principal de los israelitas durante casi 40 años en el desierto; de aquí Moisés envió a los 12 espías a explorar la tierra prometida.',
    archaeology: 'Fortaleza israelita de la Edad del Hierro con muros de casamatas y cerámicas locales.',
    lat: 30.6500,
    lng: 34.4200,
    zoom: 10
  },
  {
    id: 'mount_nebo',
    name: 'Monte Nebo y Estepas de Moab',
    modernCountry: 'Jordania',
    modernCity: 'Gobernación de Madaba, frente a Jericó al otro lado del Río Jordán',
    historicalEra: 'Frontera de Canaán',
    travelDistance: 'A vista directa de Jericó y las montañas de Judea',
    elevation: '+817 m sobre el nivel del mar',
    climate: 'Meseta montañosa con brisas frescas y vista panorámica sobre el Valle del Jordán',
    secularNote: 'Mirador geográfico natural desde donde se domina con la vista el Mar Muerto, el oasis de Jericó y los montes de Jerusalén.',
    biblicalRelation: 'Cumbre donde Dios le mostró a Moisés toda la Tierra Prometida antes de fallecer, cediendo el liderazgo a Josué.',
    archaeology: 'Mosaicos bizantinos del siglo VI y santuario conmemorativo con vista a Tierra Santa.',
    lat: 31.7677,
    lng: 35.7258,
    zoom: 11
  }
];

// Hitos de los Evangelios y el Ministerio de Jesús
const GOSPEL_SITES = [
  {
    id: 'nazareth',
    name: 'Nazaret de Galilea',
    modernCountry: 'Israel',
    modernCity: 'Ciudad de Nazaret (Baja Galilea)',
    historicalEra: 'Época Romana y Herodiana (Siglo I d.C.)',
    travelDistance: 'A unos 30 km al oeste del Mar de Galilea',
    elevation: '+350 m en un anfiteatro natural de colinas',
    climate: 'Mediterráneo templado con abundantes olivares e higueras',
    secularNote: 'Aldea agrícola modesta habitada por familias campesinas y artesanos en piedra y madera (téktōn).',
    biblicalRelation: 'Población donde creció Jesús de Nazaret, donde trabajó como carpintero y proclamó en la sinagoga la buena nueva a los pobres.',
    archaeology: 'Viviendas del siglo I excavadas en roca caliza, aljibes de agua y prensas de aceite de oliva.',
    lat: 32.7019,
    lng: 35.3033,
    zoom: 11
  },
  {
    id: 'capernaum',
    name: 'Capernaum (Kfar Najum / Aldea del Consuelo)',
    modernCountry: 'Israel',
    modernCity: 'Costa noroeste del Mar de Galilea (Lago Kineret)',
    historicalEra: 'Centro del ministerio de Jesús en Galilea',
    travelDistance: 'A 2 horas de caminata desde Nazaret',
    elevation: '-210 m bajo el nivel del mar',
    climate: 'Subtropical cálido lacustre, brisas suaves y aguas ricas en peces',
    secularNote: 'Activo pueblo pesquero y aduanero fronterizo entre los territorios de Herodes Antipas y Filipo, en la ruta Vía Maris.',
    biblicalRelation: 'Lugar donde Jesús estableció su hogar, sanó al paralítico bajado por el tejado y llamó a sus primeros discípulos pescadores.',
    archaeology: 'Sinagoga blanca sobre cimientos de basalto negro del siglo I y restos de la casa octogonal atribuida a Simón Pedro.',
    lat: 32.8804,
    lng: 35.5750,
    zoom: 12
  },
  {
    id: 'sea_of_galilee',
    name: 'Mar de Galilea (Lago de Genesaret / Kineret)',
    modernCountry: 'Israel',
    modernCity: 'Lago de agua dulce entre Tiberíades y los Altos del Golán',
    historicalEra: 'Siglo I d.C.',
    travelDistance: '21 km de largo por 13 km de ancho',
    elevation: '-212 m bajo el nivel del mar',
    climate: 'Aguas calmas propensas a repentinas tormentas de viento que bajan de las colinas',
    secularNote: 'El lago de agua dulce más bajo del planeta, fuente vital de agua y pesca desde la prehistoria.',
    biblicalRelation: 'Escenario donde Jesús calmó la tempestad, caminó sobre las aguas y enseñó desde una barca a las multitudes en la orilla.',
    archaeology: 'La célebre «Barca de Jesús» del siglo I rescatada del lodo en 1986 durante una sequía.',
    lat: 32.8250,
    lng: 35.5850,
    zoom: 11
  },
  {
    id: 'jericho_gospels',
    name: 'Jericó y el Valle del Jordán',
    modernCountry: 'Cisjordania / Territorios Palestinos',
    modernCity: 'Jericó (Tell es-Sultan), a 10 km al norte del Mar Muerto',
    historicalEra: 'Palacios de invierno de Herodes el Grande',
    travelDistance: 'Parada obligada antes de subir los 1.000 m de cuesta hacia Jerusalén',
    elevation: '-258 m bajo el nivel del mar',
    climate: 'Oasis subtropical de palmeras datileras, plátanos y manantiales perennes',
    secularNote: 'La ciudad continuamente habitada más antigua del mundo y la más baja de la Tierra.',
    biblicalRelation: 'Lugar donde Jesús devolvió la vista al ciego Bartimeo y se hospedó en la casa del recaudador de impuestos Zaqueo.',
    archaeology: 'Tell es-Sultan (murallas neolíticas y de la Edad del Bronce) y suntuosos palacios de Herodes.',
    lat: 31.8667,
    lng: 35.4600,
    zoom: 12
  },
  {
    id: 'jerusalem_gospels',
    name: 'Jerusalén (Monte de los Olivos y Gólgota)',
    modernCountry: 'Israel / Cisjordania',
    modernCity: 'Jerusalén',
    historicalEra: 'Época del Segundo Templo (Poncio Pilato y Caifás)',
    travelDistance: 'Destino final del camino de la cruz',
    elevation: '+750 m sobre el nivel del mar',
    climate: 'Mediterráneo montañoso, noches frescas en primavera',
    secularNote: 'Metrópolis sagrada judía dominada por la monumental explanada del Templo herodiano y la Fortaleza Antonia romana.',
    biblicalRelation: 'Lugar de la última cena, la agonía en Getsemaní, la crucifixión en el Calvario y la resurrección al tercer día.',
    archaeology: 'Explanada del Templo, Estanque de Betesda, pavimento del Litóstrotos y sepulcros del siglo I.',
    lat: 31.7780,
    lng: 35.2354,
    zoom: 12
  }
];

// Hitos de Hechos de los Apóstoles y los Viajes Misioneros
const APOSTOLIC_SITES = [
  {
    id: 'antioch_syria',
    name: 'Antioquía de Siria (Cuna de las Misiones)',
    modernCountry: 'Turquía (Frontera Sur con Siria)',
    modernCity: 'Antakya (Provincia de Hatay)',
    historicalEra: 'Tercera urbe del Imperio Romano (después de Roma y Alejandría)',
    travelDistance: 'Base de operaciones de Pablo y Bernabé para cruzar el mar',
    elevation: '+67 m junto al río Orontes',
    climate: 'Mediterráneo cálido y fértil',
    secularNote: 'Metrópolis cosmopolita de más de 300.000 habitantes donde confluían griegos, romanos, judíos y sirios.',
    biblicalRelation: 'Primera congregación donde creyentes judíos y gentiles compartieron la mesa como iguales, y donde por primera vez se les llamó «cristianos».',
    archaeology: 'Gruta de San Pedro excavada en el monte Silpio y mosaicos romanos imperiales.',
    lat: 36.2021,
    lng: 36.1606,
    zoom: 10
  },
  {
    id: 'tarsus',
    name: 'Tarso de Cilicia',
    modernCountry: 'Turquía (Sur)',
    modernCity: 'Ciudad de Tarso (Provincia de Mersin)',
    historicalEra: 'Gran centro universitario y comercial del mundo romano',
    travelDistance: 'A 200 km al oeste de Antioquía',
    elevation: '+20 m en la fértil llanura de Cilicia',
    climate: 'Mediterráneo costero templado',
    secularNote: 'Famosa por sus escuelas de filosofía estoica y por la Puerta de Cleopatra en el río Cidno.',
    biblicalRelation: 'Ciudad natal del apóstol Pablo, donde adquirió su ciudadanía romana y su destreza en el pensamiento grecorromano.',
    archaeology: 'Calzada romana de basalto con columnas y el pozo tradicional de San Pablo.',
    lat: 36.9170,
    lng: 34.8950,
    zoom: 10
  },
  {
    id: 'ephesus',
    name: 'Éfeso (Capital de Asia Menor)',
    modernCountry: 'Turquía (Costa del Mar Egeo)',
    modernCity: 'Selçuk (Provincia de Esmirna / Izmir)',
    historicalEra: 'Metrópolis comercial y religiosa del Egeo',
    travelDistance: 'Pablo residió allí casi 3 años enseñando diariamente',
    elevation: '+15 m cerca de la desembocadura del río Caístro',
    climate: 'Mediterráneo marítimo brillante',
    secularNote: 'Hogar del Templo de Artemisa (una de las Siete Maravillas del Mundo Antiguo) y de un teatro para 25.000 espectadores.',
    biblicalRelation: 'Epicentro misionero donde el evangelio transformó la cultura, provocando la rebelión de los plateros de ídolos de plata.',
    archaeology: 'Biblioteca de Celso, gran teatro al aire libre, casas con mosaicos romanos y basílica de San Juan.',
    lat: 37.9400,
    lng: 27.3400,
    zoom: 11
  },
  {
    id: 'athens_areopagus',
    name: 'Atenas y la Colina del Areópago',
    modernCountry: 'Grecia',
    modernCity: 'Ciudad de Atenas (a los pies del Partenón)',
    historicalEra: 'Capital de la filosofía y el arte clásico',
    travelDistance: 'Cruzando el Mar Egeo desde Turquía',
    elevation: '+115 m sobre una colina de roca caliza',
    climate: 'Mediterráneo ático seco y soleado',
    secularNote: 'Sede del tribunal supremo ateniense y foro de debate de filósofos estoicos y epicúreos.',
    biblicalRelation: 'Lugar donde Pablo pronunció su discurso sobre el «Dios No Conocido», Creador y Padre de todas las naciones que no vive en templos hechos por manos humanas.',
    archaeology: 'Colina rocosa del Areópago con la placa grabada del discurso de Hechos 17 y la Acrópolis.',
    lat: 37.9719,
    lng: 23.7258,
    zoom: 12
  },
  {
    id: 'rome_apostolic',
    name: 'Roma (Corazón del Imperio)',
    modernCountry: 'Italia',
    modernCity: 'Roma (Foro Romano y Vía Apia)',
    historicalEra: 'Capital del Imperio Romano bajo Nerón',
    travelDistance: 'Culminación del largo viaje como prisionero por el Mediterráneo',
    elevation: '+30 m junto al río Tíber',
    climate: 'Mediterráneo templado de las siete colinas',
    secularNote: 'El centro del poder militar y político mundial del siglo I.',
    biblicalRelation: 'Punto culminante del libro de Hechos, donde Pablo predicó bajo custodia militar «abiertamente y sin impedimento» el reino de Dios.',
    archaeology: 'Vía Apia antigua, prisión Mamertina, Catacumbas romanas y Coliseo.',
    lat: 41.8902,
    lng: 12.4922,
    zoom: 11
  }
];

// Rutas geodésicas trazadas sobre el relieve real
const ABRAHAM_TRAIL = [
  [30.9628, 46.1030], // Ur (Irak)
  [32.0000, 45.0000], // Mesopotamia central
  [32.5363, 44.4208], // Babilonia
  [34.5492, 40.8931], // Mari (Éufrates Medio, frontera Siria-Irak)
  [35.9500, 39.0000], // Al-Raqqa
  [36.8667, 39.0333], // Harán (Sur de Turquía)
  [36.2000, 37.1500], // Alepo
  [34.7300, 36.7100], // Homs
  [33.5138, 36.2765], // Damasco (Siria)
  [32.9000, 35.8000], // Altos del Golán / Bashán
  [32.2144, 35.2842], // Siquem (Moreh, Cisjordania)
  [31.8500, 35.2000], // Betel / Hai
  [31.5298, 35.0938], // Hebrón / Mamre (Cisjordania)
  [31.2500, 34.8000], // Beerseba (Néguev)
  [30.8000, 33.5000], // Norte del Sinaí
  [30.0444, 31.2357]  // Delta del Nilo / Egipto
];

const EXODUS_TRAIL = [
  [30.7870, 31.8310], // Ramesés (Egipto)
  [30.3000, 32.1000], // Sucot
  [29.9668, 32.5498], // Pi-Hajirot (Paso del Mar Rojo)
  [29.5000, 32.8000], // Mara
  [29.0500, 33.1500], // Elim
  [28.5394, 33.9753], // Monte Sinaí / Horeb
  [29.5000, 34.8000], // Desierto de Parán
  [30.6500, 34.4200], // Cades-Barnea
  [31.1000, 35.6000], // Borde de Edom y Moab
  [31.7677, 35.7258]  // Monte Nebo (Jordania)
];

const GOSPEL_TRAIL = [
  [32.7019, 35.3033], // Nazaret
  [32.7470, 35.3380], // Caná
  [32.8804, 35.5750], // Capernaum
  [32.8250, 35.5850], // Mar de Galilea
  [32.3000, 35.4000], // Samaria (Sicar)
  [31.8667, 35.4600], // Jericó
  [31.7700, 35.2600], // Betania
  [31.7780, 35.2354]  // Jerusalén (Gólgota)
];

const PAUL_MISSION_TRAIL = [
  [31.7780, 35.2354], // Jerusalén
  [36.2021, 36.1606], // Antioquía de Siria (Turquía)
  [36.9170, 34.8950], // Tarso (Turquía)
  [37.9400, 27.3400], // Éfeso (Turquía)
  [40.6400, 22.9400], // Tesalónica (Grecia)
  [41.0130, 24.2860], // Filipos (Grecia)
  [37.9719, 23.7258], // Atenas (Grecia)
  [37.9050, 22.8800], // Corinto (Grecia)
  [41.8902, 12.4922]  // Roma (Italia)
];

// Países modernos de la región para marcadores de referencia política
const MODERN_COUNTRIES = [
  { name: 'TURQUÍA', flag: '🇹🇷', lat: 38.8, lng: 35.2, note: 'Anatolia, Harán, Éfeso y Tarso' },
  { name: 'SIRIA', flag: '🇸🇾', lat: 35.0, lng: 38.0, note: 'Aram, Damasco y Éufrates Medio' },
  { name: 'IRAK', flag: '🇮🇶', lat: 33.2, lng: 43.8, note: 'Antigua Mesopotamia, Ur y Babilonia' },
  { name: 'CISJORDANIA', flag: '🇵🇸', lat: 31.95, lng: 35.25, note: 'Hebrón, Siquem, Belén, Jericó' },
  { name: 'ISRAEL', flag: '🇮🇱', lat: 31.5, lng: 34.8, note: 'Jerusalén, Nazaret, Galilea y Carmelo' },
  { name: 'JORDANIA', flag: '🇯🇴', lat: 31.2, lng: 36.8, note: 'Monte Nebo, Galaad y Moab' },
  { name: 'EGIPTO', flag: '🇪🇬', lat: 29.5, lng: 31.5, note: 'Delta del Nilo, Gosén y Sinaí' },
  { name: 'GRECIA', flag: '🇬🇷', lat: 38.8, lng: 22.8, note: 'Atenas, Corinto, Filipos y Macedonia' },
  { name: 'ITALIA', flag: '🇮🇹', lat: 41.9, lng: 12.5, note: 'Roma imperial' },
  { name: 'LÍBANO', flag: '🇱🇧', lat: 33.9, lng: 35.8, note: 'Tiro, Sidón y montes del Líbano' },
  { name: 'ARABIA SAUDITA', flag: '🇸🇦', lat: 27.5, lng: 40.5, note: 'Península Arábiga' }
];

export default function SacredGeographyMap({ bookName = '', chapter = 1, verseRef = '', variant = 'compact', initialEra = null, onConsultAI = null }) {
  const norm = (bookName || verseRef || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  const getDetectedEra = () => {
    if (initialEra) return initialEra;
    if (norm.includes('genesis')) return 'genesis';
    if (norm.includes('exodo') || norm.includes('levitico') || norm.includes('numero') || norm.includes('deuteronomio') || norm.includes('josue')) return 'exodus';
    if (norm.includes('mateo') || norm.includes('marcos') || norm.includes('lucas') || (norm.includes('juan') && !norm.includes('1 juan') && !norm.includes('2 juan') && !norm.includes('3 juan'))) return 'gospels';
    if (norm.includes('hecho') || norm.includes('romano') || norm.includes('corintio') || norm.includes('galatas') || norm.includes('efesios') || norm.includes('filipenses') || norm.includes('colosenses') || norm.includes('tesalonicenses') || norm.includes('timoteo') || norm.includes('tito') || norm.includes('hebreos') || norm.includes('apocalipsis')) return 'apostolic';
    if (norm.includes('salmo') || norm.includes('samuel') || norm.includes('reyes') || norm.includes('cronica')) return 'judea';
    return 'genesis';
  };

  const [activeEra, setActiveEra] = useState(getDetectedEra);

  useEffect(() => {
    if (initialEra) {
      setActiveEra(initialEra);
    } else if (bookName || verseRef) {
      setActiveEra(getDetectedEra());
    }
  }, [bookName, verseRef, initialEra]);

  // Selección de lista de sitios y ruta según la época activa
  let sitesList = GENESIS_SITES;
  let activeTrail = ABRAHAM_TRAIL;
  let trailName = 'Ruta de Abraham (~2.000 km: Ur → Harán → Canaán → Egipto)';
  let defaultCenter = [33.5, 41.5];
  let defaultZoom = 5;

  if (activeEra === 'exodus') {
    sitesList = EXODUS_SITES;
    activeTrail = EXODUS_TRAIL;
    trailName = 'Ruta del Éxodo (Ramesés → Sinaí → Cades → Monte Nebo)';
    defaultCenter = [29.8, 33.8];
    defaultZoom = 7;
  } else if (activeEra === 'gospels') {
    sitesList = GOSPEL_SITES;
    activeTrail = GOSPEL_TRAIL;
    trailName = 'Ministerio de Jesús (Nazaret → Galilea → Jericó → Jerusalén)';
    defaultCenter = [32.3, 35.3];
    defaultZoom = 8;
  } else if (activeEra === 'apostolic') {
    sitesList = APOSTOLIC_SITES;
    activeTrail = PAUL_MISSION_TRAIL;
    trailName = 'Viajes Misioneros y Expansión (Jerusalén → Turquía → Grecia → Roma)';
    defaultCenter = [38.0, 26.0];
    defaultZoom = 5;
  } else if (activeEra === 'judea') {
    sitesList = JUDEA_SITES;
    activeTrail = null;
    trailName = 'Hitos Bíblicos de Judea y Jerusalén (Monarquía & Salmos)';
    defaultCenter = [31.7, 35.3];
    defaultZoom = 9;
  }

  const getInitialSite = () => {
    if (activeEra === 'genesis') {
      const c = Number(chapter) || 1;
      if (c >= 13 && c <= 25) return GENESIS_SITES.find(s => s.id === 'hebron_mamre') || GENESIS_SITES[0];
      if (c === 12) return GENESIS_SITES.find(s => s.id === 'siquem') || GENESIS_SITES[0];
      if (c === 11) return GENESIS_SITES.find(s => s.id === 'ur_caldeos') || GENESIS_SITES[0];
      return GENESIS_SITES[0];
    }
    return sitesList[0] || GENESIS_SITES[0];
  };

  const [selectedSite, setSelectedSite] = useState(getInitialSite());
  const [tileLayerType, setTileLayerType] = useState('osm'); // 'osm' | 'satellite' | 'topo'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const countriesGroupRef = useRef(null);
  const polylineRef = useRef(null);

  const isExpansive = variant === 'expansive';

  // Salir de pantalla completa con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Recalcular tamaño de Leaflet al alternar pantalla completa
  useEffect(() => {
    if (mapInstanceRef.current) {
      const t1 = setTimeout(() => mapInstanceRef.current.invalidateSize(), 80);
      const t2 = setTimeout(() => mapInstanceRef.current.invalidateSize(), 300);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isFullscreen]);

  // Configuración de capas de mapa real y vibrante
  const TILE_SERVERS = {
    // OpenStreetMap Estándar: Mapa mundial vibrante, colores claros (mar azul brillante, países, carreteras y fronteras)
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    },
    // Fotografía Satelital Real (Esri NASA): La Tierra real con desiertos, ríos y vegetación
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; NASA, USGS'
    },
    // Físico Topográfico: Relieve montañoso y curvas de nivel
    topo: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Topo Relief'
    }
  };

  // Inicializar mapa Leaflet con ciclo de vida robusto y tamaño garantizado
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Si ya existe instancia anterior en este contenedor, desmontarla limpiamente
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    // Centro inicial adaptado al corpus bíblico actual
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      minZoom: 3,
      maxZoom: 16,
      scrollWheelZoom: true,
      zoomControl: false
    });

    // Capa base inicial
    tileLayerRef.current = L.tileLayer(TILE_SERVERS[tileLayerType].url, {
      attribution: TILE_SERVERS[tileLayerType].attribution,
      maxZoom: 18
    }).addTo(map);

    countriesGroupRef.current = L.featureGroup().addTo(map);
    markersGroupRef.current = L.featureGroup().addTo(map);

    mapInstanceRef.current = map;

    // InvalidateSize retardado para resolver cualquier render diferido en tabs/drawers
    const t1 = setTimeout(() => { map.invalidateSize(); }, 120);
    const t2 = setTimeout(() => { map.invalidateSize(); }, 400);

    // ResizeObserver para mantener las dimensiones sincronizadas
    let resizeObserver = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (resizeObserver) resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [bookName, chapter, isExpansive]);

  // Cambiar capa de tiles dinámicamente
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = L.tileLayer(TILE_SERVERS[tileLayerType].url, {
      attribution: TILE_SERVERS[tileLayerType].attribution,
      maxZoom: 18
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current.bringToBack();
  }, [tileLayerType]);

  // Actualizar marcadores e itinerario bíblico sobre el mapa
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersGroupRef.current || !countriesGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    countriesGroupRef.current.clearLayers();

    // 1. Trazar la Ruta Histórica sobre los países
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
    if (activeTrail && activeTrail.length > 0) {
      polylineRef.current = L.polyline(activeTrail, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    }

    // 2. Rótulos de Naciones Vecinas Actuales (Turquía, Siria, Irak, Jordania, Egipto, etc.)
    MODERN_COUNTRIES.forEach((c) => {
      const countryIcon = L.divIcon({
        className: 'country-label-icon',
        html: `<div style="
          background: rgba(15, 23, 42, 0.92);
          border: 1.5px solid #38bdf8;
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          padding: 3px 9px;
          border-radius: 6px;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(0,0,0,0.7);
          letter-spacing: 0.5px;
          pointer-events: auto;
          cursor: pointer;
        ">${c.flag} ${c.name}</div>`,
        iconSize: [100, 24],
        iconAnchor: [50, 12]
      });
      L.marker([c.lat, c.lng], { icon: countryIcon })
        .addTo(countriesGroupRef.current)
        .on('click', () => {
          map.flyTo([c.lat, c.lng], 6, { duration: 1.2 });
        });
    });

    // 3. Marcadores de Hitos Bíblicos
    sitesList.forEach((site, index) => {
      const isSelected = selectedSite.id === site.id;
      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        ">
          ${isSelected ? `
            <div style="
              position: absolute;
              width: 38px;
              height: 38px;
              top: -9px;
              left: -9px;
              border-radius: 50%;
              background: rgba(255, 215, 0, 0.35);
              border: 2px solid #ffd700;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
          <div style="
            width: ${isSelected ? '24px' : '18px'};
            height: ${isSelected ? '24px' : '18px'};
            border-radius: 50%;
            background: ${isSelected ? 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)' : '#0284c7'};
            border: 2.5px solid #ffffff;
            box-shadow: 0 0 12px ${isSelected ? 'rgba(255,215,0,0.9)' : 'rgba(0,0,0,0.6)'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isSelected ? '11px' : '9px'};
            font-weight: 900;
            color: ${isSelected ? '#000000' : '#ffffff'};
            flex-shrink: 0;
            z-index: ${isSelected ? 100 : 10};
          ">
            ${index + 1}
          </div>
          <div style="
            background: ${isSelected ? 'rgba(212, 175, 55, 0.95)' : 'rgba(10, 15, 26, 0.88)'};
            color: ${isSelected ? '#000000' : '#ffffff'};
            border: 1px solid ${isSelected ? '#ffffff' : 'rgba(212,175,55,0.4)'};
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.7);
            z-index: ${isSelected ? 100 : 10};
          ">
            ${site.name.split('(')[0].trim()}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'biblical-site-marker',
        html: markerHtml,
        iconSize: [160, 30],
        iconAnchor: [10, 15]
      });

      const marker = L.marker([site.lat, site.lng], { icon: customIcon })
        .addTo(markersGroupRef.current)
        .on('click', () => {
          setSelectedSite(site);
        });

      if (isSelected) {
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #b8860b; font-size: 13px;">${site.name}</strong><br/>
            <span style="font-size: 11px; color: #333;">📍 <strong>Hoy:</strong> ${site.modernCountry}</span><br/>
            <span style="font-size: 11px; color: #555;">${site.modernCity}</span>
          </div>
        `);
      }
    });

  }, [selectedSite, sitesList, activeTrail, activeEra, isExpansive]);

  // Cambiar época histórica y recentrar el mapa
  const handleSwitchEra = (eraId) => {
    setActiveEra(eraId);
    let targetSites = GENESIS_SITES;
    let center = [33.5, 41.5];
    let zoom = 5;

    if (eraId === 'exodus') {
      targetSites = EXODUS_SITES;
      center = [29.8, 33.8];
      zoom = 7;
    } else if (eraId === 'gospels') {
      targetSites = GOSPEL_SITES;
      center = [32.3, 35.3];
      zoom = 8;
    } else if (eraId === 'apostolic') {
      targetSites = APOSTOLIC_SITES;
      center = [38.0, 26.0];
      zoom = 5;
    } else if (eraId === 'judea') {
      targetSites = JUDEA_SITES;
      center = [31.7, 35.3];
      zoom = 9;
    }

    setSelectedSite(targetSites[0]);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1.2 });
    }
  };

  // Centrar y volar suavemente hacia el sitio seleccionado
  const handleSelectSite = (site) => {
    setSelectedSite(site);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([site.lat, site.lng], site.zoom || 10, {
        duration: 1.4,
        easeLinearity: 0.25
      });
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
    }
  };

  return (
    <div style={{
      ...(isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: '#070a13',
        borderRadius: 0,
        border: 'none',
        padding: '16px 22px',
        overflowY: 'auto'
      } : {
        background: 'rgba(9, 12, 19, 0.98)',
        border: '1.5px solid rgba(212,175,55,0.35)',
        borderRadius: '14px',
        padding: isExpansive ? '26px' : '20px',
        boxShadow: '0 6px 36px rgba(0,0,0,0.8)',
        width: '100%'
      }),
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      {/* 1. Barra Superior con Título, Conmutador de Capas y Pantalla Completa */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: isExpansive ? '44px' : '38px',
            height: isExpansive ? '44px' : '38px',
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.18)',
            border: '1.5px solid var(--gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 16px rgba(212,175,55,0.3)'
          }}>
            <Globe size={isExpansive ? 22 : 18} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: isExpansive ? '1.45rem' : '1.2rem', fontWeight: '800' }}>
              {trailName}
            </h4>
            <span style={{ fontSize: isExpansive ? '0.86rem' : '0.8rem', color: 'var(--text-muted)' }}>
              Cartografía interactiva real con OpenStreetMap y satélite de la NASA conectada a {bookName || verseRef || 'la Biblia'}
            </span>
          </div>
        </div>

        {/* Acciones de la barra superior: Selector de Capas y Botón de Pantalla Completa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Selector de Tipo de Mapa Real (Color OpenStreetMap vs Satélite NASA vs Topo) */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.6)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid rgba(212,175,55,0.25)',
            gap: '6px'
          }}>
            <button
              onClick={() => setTileLayerType('osm')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: tileLayerType === 'osm' ? '800' : '500',
                background: tileLayerType === 'osm' ? 'rgba(59,130,246,0.3)' : 'transparent',
                border: `1px solid ${tileLayerType === 'osm' ? '#60a5fa' : 'transparent'}`,
                color: tileLayerType === 'osm' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Globe size={14} color={tileLayerType === 'osm' ? '#60a5fa' : 'currentColor'} />
              <span>🗺️ Mapa a Color & Países (OpenStreetMap)</span>
            </button>

            <button
              onClick={() => setTileLayerType('satellite')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: tileLayerType === 'satellite' ? '800' : '500',
                background: tileLayerType === 'satellite' ? 'rgba(212,175,55,0.3)' : 'transparent',
                border: `1px solid ${tileLayerType === 'satellite' ? 'var(--gold-400)' : 'transparent'}`,
                color: tileLayerType === 'satellite' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Layers size={14} color={tileLayerType === 'satellite' ? 'var(--gold-400)' : 'currentColor'} />
              <span>🛰️ Satélite Real de la Tierra (NASA/Esri)</span>
            </button>

            <button
              onClick={() => setTileLayerType('topo')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: tileLayerType === 'topo' ? '800' : '500',
                background: tileLayerType === 'topo' ? 'rgba(74,222,128,0.25)' : 'transparent',
                border: `1px solid ${tileLayerType === 'topo' ? '#4ade80' : 'transparent'}`,
                color: tileLayerType === 'topo' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Mountain size={14} color={tileLayerType === 'topo' ? '#4ade80' : 'currentColor'} />
              <span>⛰️ Físico Topográfico</span>
            </button>
          </div>

          {/* Botón de Pantalla Completa */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: '800',
              background: isFullscreen ? 'rgba(239, 68, 68, 0.25)' : 'rgba(212,175,55,0.22)',
              border: `1.5px solid ${isFullscreen ? '#f87171' : 'var(--gold-400)'}`,
              color: isFullscreen ? '#fca5a5' : 'var(--gold-200)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              transition: 'all 0.15s ease'
            }}
            title={isFullscreen ? "Presione Escape o haga clic para salir" : "Maximizar mapa a pantalla completa"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}</span>
          </button>
        </div>
      </div>

      {/* 2. Selector de Rutas y Grandes Épocas Bíblicas */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '10px 14px',
        background: 'rgba(212,175,55,0.06)',
        borderRadius: '10px',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
          <Compass size={16} color="var(--gold-400)" />
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--gold-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Rutas y Épocas:
          </span>
        </div>
        {[
          { id: 'genesis', label: 'Patriarcas (Abraham)', icon: '🐪', desc: 'Ruta de Abraham: Ur → Harán → Canaán → Egipto' },
          { id: 'exodus', label: 'Éxodo & Sinaí', icon: '⛰️', desc: 'Ruta del Éxodo: Ramesés → Sinaí → Cades → Nebo' },
          { id: 'judea', label: 'David & Salmos', icon: '👑', desc: 'Monarquía de Judá: Jerusalén, Belén, Wadi Qelt, En-Gedi' },
          { id: 'gospels', label: 'Jesús & Galilea', icon: '🐟', desc: 'Ministerio de Jesús: Nazaret, Galilea, Jericó, Jerusalén' },
          { id: 'apostolic', label: 'Pablo & Misiones', icon: '⛵', desc: 'Viajes Misioneros: Antioquía, Éfeso, Atenas, Corinto, Roma' },
        ].map((era) => {
          const isSelected = activeEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => handleSwitchEra(era.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: isSelected ? '800' : '600',
                background: isSelected ? 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.1) 100%)' : 'rgba(255,255,255,0.03)',
                border: isSelected ? '1.5px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.1)',
                color: isSelected ? 'var(--gold-200)' : 'var(--text-muted)',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 14px rgba(212,175,55,0.25)' : 'none',
                transition: 'all 0.2s'
              }}
              title={era.desc}
            >
              <span>{era.icon}</span>
              <span>{era.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Barra de Países Vecinos Actuales para Ubicación Instantánea */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
        padding: '8px 14px',
        background: 'rgba(15, 23, 42, 0.75)',
        borderRadius: '8px',
        border: '1px solid rgba(56, 189, 248, 0.35)'
      }}>
        <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '800', marginRight: '4px' }}>
          🌍 Países Vecinos de Hoy:
        </span>
        <button
          onClick={() => handleResetView()}
          style={{
            padding: '4px 10px',
            borderRadius: '5px',
            fontSize: '0.75rem',
            fontWeight: '700',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          🌐 Toda la Región
        </button>
        {MODERN_COUNTRIES.map((c) => (
          <button
            key={c.name}
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([c.lat, c.lng], 6, { duration: 1.2 });
              }
            }}
            style={{
              padding: '4px 9px',
              borderRadius: '5px',
              fontSize: '0.75rem',
              fontWeight: '700',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#e0f2fe',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={`Ver ${c.name} en el mapa`}
          >
            <span>{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* 3. Botonera Táctil de Hitos Geográficos del Relato */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '10px 16px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)', fontWeight: '700', marginRight: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={15} /> Lugares del Relato ({sitesList.length}):
        </span>
        {sitesList.map((site, index) => {
          const isSelected = selectedSite.id === site.id;
          return (
            <button
              key={site.id}
              onClick={() => handleSelectSite(site)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: isExpansive ? '8px 14px' : '6px 12px',
                borderRadius: '6px',
                background: isSelected
                  ? 'linear-gradient(135deg, var(--gold-400) 0%, #b8860b 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: isSelected ? '1.5px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                color: isSelected ? '#030508' : '#ffffff',
                fontWeight: isSelected ? '800' : '500',
                fontSize: isExpansive ? '0.82rem' : '0.78rem',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 0 16px rgba(212,175,55,0.5)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ opacity: isSelected ? 1 : 0.6, fontWeight: '700' }}>{index + 1}.</span>
              <span>{site.name.split('(')[0].trim()}</span>
              <span style={{
                fontSize: '0.7rem',
                background: isSelected ? 'rgba(0,0,0,0.25)' : 'rgba(59,130,246,0.2)',
                color: isSelected ? '#000000' : '#93c5fd',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '700'
              }}>
                {site.modernCountry.split('(')[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. CONTENEDOR DEL MAPA REAL LEAFLET (ALTA DEFINICIÓN & INTERACTIVO) */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: isFullscreen ? 'calc(100vh - 210px)' : (isExpansive ? '540px' : '380px'),
        height: isFullscreen ? 'calc(100vh - 210px)' : (isExpansive ? '560px' : '380px'),
        borderRadius: '12px',
        border: '1.5px solid rgba(212,175,55,0.4)',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.8)'
      }}>
        {/* Contenedor del DOM para Leaflet */}
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', zIndex: 1 }}
        />

        {/* Botones de Control de Zoom / Recentrado / Fullscreen Flotantes */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          background: 'rgba(10, 14, 24, 0.92)',
          border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            title="Acercar mapa"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gold-300)',
              padding: '6px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            title="Alejar mapa"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gold-300)',
              padding: '6px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetView}
            title="Vista panorámica completa"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gold-300)',
              padding: '6px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            style={{
              background: isFullscreen ? 'rgba(212,175,55,0.3)' : 'transparent',
              border: 'none',
              color: isFullscreen ? '#ffd700' : 'var(--gold-300)',
              padding: '6px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Leyenda Inferior Flotante */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '16px',
          right: '16px',
          zIndex: 1000,
          background: 'rgba(6, 9, 15, 0.94)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '0.8rem',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 10px #ffd700' }} />
            <span>Lugar enfocado: <strong>{selectedSite.name}</strong></span>
            <span style={{ color: '#93c5fd', fontWeight: '700' }}>📍 {selectedSite.modernCountry}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.76rem' }}>
            {activeTrail && (
              <span style={{ color: '#ffd700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-block', width: '18px', height: '3px', background: '#dc2626', borderRadius: '2px' }}></span>
                {trailName.split('(')[0].trim()}
              </span>
            )}
            <span style={{ color: '#94a3b8' }}>
              Arrastre y use la rueda para hacer zoom en cualquier país
            </span>
          </div>
        </div>
      </div>

      {/* 4. PANEL DE PROFUNDIZACIÓN GEOGRÁFICA (3 COLUMNAS EXPANSIVAS O COMPACTO) */}
      {isExpansive ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {/* Columna 1: Ubicación en el Mapa Actual */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, rgba(10,14,24,0.95) 100%)',
            border: '1.5px solid rgba(147,197,253,0.35)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="#60a5fa" />
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. Dónde Queda en el Mapa de Hoy
              </h5>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
              {selectedSite.modernCountry}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.55 }}>
              <strong>Ciudad y Entorno Hoy:</strong> {selectedSite.modernCity}
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.84rem',
              color: '#93c5fd'
            }}>
              <strong>Jornadas y Distancia en la Época:</strong><br />
              {selectedSite.travelDistance}
            </div>
          </div>

          {/* Columna 2: Arqueología y Excavaciones */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(212,175,55,0.12) 0%, rgba(10,14,24,0.95) 100%)',
            border: '1.5px solid rgba(212,175,55,0.35)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--gold-400)" />
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. Historia y Excavaciones Reales
              </h5>
            </div>
            <div style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6 }}>
              {selectedSite.secularNote}
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(212,175,55,0.2)',
              fontSize: '0.84rem',
              color: '#cbd5e1'
            }}>
              <strong style={{ color: 'var(--gold-300)' }}>🏛️ Evidencia Documentada:</strong><br />
              {selectedSite.archaeology}
            </div>
          </div>

          {/* Columna 3: Orografía, Clima y Significado Bíblico */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(74,222,128,0.1) 0%, rgba(10,14,24,0.95) 100%)',
            border: '1.5px solid rgba(74,222,128,0.35)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mountain size={18} color="#4ade80" />
              <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                3. Terreno, Clima y Sentido Bíblico
              </h5>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '4px', color: '#ffffff', fontWeight: '700' }}>
                Elevación: {selectedSite.elevation}
              </span>
              <span style={{ fontSize: '0.8rem', background: 'rgba(74,222,128,0.12)', padding: '4px 10px', borderRadius: '4px', color: '#86efac', fontWeight: '700' }}>
                Clima: {selectedSite.climate}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#fef08a', lineHeight: 1.6, fontStyle: 'italic' }}>
              {selectedSite.biblicalRelation}
            </div>
          </div>

          {/* Botón de Profundización con Ruaj si está disponible */}
          {onConsultAI && (
            <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
              <button
                onClick={() => onConsultAI({
                  passage: { title: selectedSite.name, book: selectedSite.modernCountry, chapter: 'Geografía Sagrada' },
                  mood: 'Exploración Histórica'
                })}
                className="gold-btn-gradient"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={16} />
                <span>Profundizar con Ruaj sobre {selectedSite.name.split('(')[0].trim()}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Variante Compacta (Para Paso 4 del Compendio) */
        <div style={{
          background: 'rgba(11, 15, 24, 0.95)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: '800', textTransform: 'uppercase' }}>
              📍 DÓNDE QUEDA HOY:
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
              {selectedSite.modernCountry} — {selectedSite.modernCity}
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, margin: '6px 0 0' }}>
              {selectedSite.secularNote}
            </p>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: '800', textTransform: 'uppercase' }}>
              📖 RELEVANCIA EN ESTE PASAJE:
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--gold-100)', lineHeight: 1.5, margin: '4px 0 0', fontStyle: 'italic' }}>
              {selectedSite.biblicalRelation}
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <strong>Arqueología:</strong> {selectedSite.archaeology}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
