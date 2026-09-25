import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, MapPin, Mountain, Droplets, Globe, Layers, Navigation, Shield, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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

// Ruta geodésica de la migración de Abraham: Ur -> Harán -> Canaán -> Egipto
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

// Países modernos de la región para marcadores de referencia política
const MODERN_COUNTRIES = [
  { name: 'TURQUÍA', flag: '🇹🇷', lat: 38.5, lng: 35.0, note: 'Anatolia y Padán-Aram' },
  { name: 'SIRIA', flag: '🇸🇾', lat: 35.2, lng: 38.5, note: 'Aram y Éufrates Medio' },
  { name: 'IRAK', flag: '🇮🇶', lat: 33.2, lng: 43.8, note: 'Antigua Mesopotamia y Babilonia' },
  { name: 'CISJORDANIA', flag: '🇵🇸', lat: 31.95, lng: 35.25, note: 'Hebrón, Siquem, Jericó' },
  { name: 'ISRAEL', flag: '🇮🇱', lat: 31.3, lng: 34.8, note: 'Costa de Canaán y Néguev' },
  { name: 'JORDANIA', flag: '🇯🇴', lat: 31.2, lng: 36.8, note: 'Al este del Río Jordán' },
  { name: 'EGIPTO', flag: '🇪🇬', lat: 29.8, lng: 31.3, note: 'Delta del Nilo y Sinaí' },
  { name: 'ARABIA SAUDITA', flag: '🇸🇦', lat: 28.5, lng: 40.5, note: 'Península Arábiga' }
];

export default function SacredGeographyMap({ bookName = '', chapter = 1, verseRef = '', variant = 'compact' }) {
  const norm = (bookName || verseRef || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isGenesis = norm.includes('genesis') || norm.includes('exodo') || norm.includes('levitico') || norm.includes('numeros') || norm.includes('deuteronomio');
  
  const sitesList = isGenesis ? GENESIS_SITES : JUDEA_SITES;

  const getInitialSite = () => {
    if (isGenesis) {
      const c = Number(chapter) || 1;
      if (c >= 13 && c <= 25) {
        return GENESIS_SITES.find(s => s.id === 'hebron_mamre') || GENESIS_SITES[0];
      }
      if (c === 12) {
        return GENESIS_SITES.find(s => s.id === 'siquem') || GENESIS_SITES[0];
      }
      if (c === 11) {
        return GENESIS_SITES.find(s => s.id === 'ur_caldeos') || GENESIS_SITES[0];
      }
      return GENESIS_SITES[0];
    }
    return JUDEA_SITES[0];
  };

  const [selectedSite, setSelectedSite] = useState(getInitialSite());
  const [tileLayerType, setTileLayerType] = useState('osm'); // 'osm' | 'satellite' | 'topo'

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersGroupRef = useRef(null);
  const countriesGroupRef = useRef(null);
  const polylineRef = useRef(null);

  const isExpansive = variant === 'expansive';

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

    // Centro inicial: Medio Oriente y Creciente Fértil
    const initialCenter = isGenesis ? [33.5, 41.5] : [31.7, 35.3];
    const initialZoom = isGenesis ? (isExpansive ? 5 : 5) : 8;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
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
  }, [isGenesis, isExpansive]);

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

    // 1. Trazar la Ruta de Abraham sobre los países
    if (isGenesis) {
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
      }
      polylineRef.current = L.polyline(ABRAHAM_TRAIL, {
        color: '#dc2626',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
    }

    // 2. Rótulos de Naciones Vecinas (Turquía, Siria, Irak, Jordania, etc.)
    if (isGenesis) {
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
    }

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

  }, [selectedSite, sitesList, isGenesis, isExpansive]);

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
      const initialCenter = isGenesis ? [33.8, 41.5] : [31.7, 35.3];
      const initialZoom = isGenesis ? (isExpansive ? 5 : 5) : 9;
      mapInstanceRef.current.flyTo(initialCenter, initialZoom, { duration: 1 });
    }
  };

  return (
    <div style={{
      background: 'rgba(9, 12, 19, 0.98)',
      border: '1.5px solid rgba(212,175,55,0.35)',
      borderRadius: '14px',
      padding: isExpansive ? '26px' : '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      boxShadow: '0 6px 36px rgba(0,0,0,0.8)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* 1. Barra Superior con Título y Conmutador de Capas Reales */}
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
              {isGenesis 
                ? 'Mapa Cartográfico Real: Del Mundo Bíblico a los Países de Hoy' 
                : 'Cartografía Física y Satelital de Judea'}
            </h4>
            <span style={{ fontSize: isExpansive ? '0.86rem' : '0.8rem', color: 'var(--text-muted)' }}>
              Mapa cartográfico auténtico interactivo con fotografía satelital real y división política contemporánea
            </span>
          </div>
        </div>

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
      </div>

      {/* 2. Barra de Países Vecinos Actuales para Ubicación Instantánea */}
      {isGenesis && (
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
      )}

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

      {/* 3. CONTENEDOR DEL MAPA REAL LEAFLET (ALTA DEFINICIÓN & INTERACTIVO) */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: isExpansive ? '540px' : '380px',
        height: isExpansive ? '560px' : '380px',
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

        {/* Botones de Control de Zoom / Recentrado Flotantes */}
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
            {isGenesis && (
              <span style={{ color: '#ffd700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-block', width: '18px', height: '3px', background: '#ffd700', borderRadius: '2px' }}></span>
                Ruta de Abraham (~2.000 km)
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
