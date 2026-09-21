// Catálogo de música y soundscapes sagrados (Spotify, YouTube y Procedural WebAudio)
export const SOUNDSCAPES_DATA = {
  spotifyPlaylists: [
    {
      id: "sp-piano-sanctuary",
      title: "Piano de Adoración Íntima",
      description: "Melodías suaves para oración profunda y meditación de la Palabra",
      spotifyId: "37i9dQZF1DX4sWSpwq3LiO", // Spotify Peaceful Piano / Worship
      embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0",
      theme: "Intimidad & Oración"
    },
    {
      id: "sp-peaceful-worship",
      title: "Peaceful Christian & Worship",
      description: "Adoración acústica e instrumental suave sin distracciones vocales",
      spotifyId: "37i9dQZF1DX6tT9v2x4QJp",
      embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX6tT9v2x4QJp?utm_source=generator&theme=0",
      theme: "Sosiego & Paz"
    },
    {
      id: "sp-lofi-gospel",
      title: "Christian Lo-Fi Study & Devotion",
      description: "Beats relajantes con himnos clásicos para estudio bíblico",
      spotifyId: "37i9dQZF1DXcBWIGoYBM5M",
      embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0",
      theme: "Estudio & Enfoque"
    }
  ],
  youtubeStreams: [
    {
      id: "yt-harp-david",
      title: "Arpa Sagrada de David & Cuerdas de Paz",
      description: "Sonidos bíblicos de cuerdas para disipar la pesadez espiritual (1 Sam 16:23)",
      videoId: "1ZXjQx4wNhs", // Ambient worship harp
      embedUrl: "https://www.youtube-nocookie.com/embed/1ZXjQx4wNhs?autoplay=1&mute=0&controls=1&loop=1",
      tag: "Arpa Celestial"
    },
    {
      id: "yt-piano-soaking",
      title: "Piano de Santuario (Soaking Worship 24/7)",
      description: "Flujo instrumental continuo para momentos de clamor y quietud",
      videoId: "tf3_n9Z3vXw",
      embedUrl: "https://www.youtube-nocookie.com/embed/tf3_n9Z3vXw?autoplay=1&mute=0&controls=1&loop=1",
      tag: "Piano Sagrado"
    },
    {
      id: "yt-rain-peace",
      title: "Lluvia Suave en el Huerto de Getsemaní",
      description: "Lluvia tibia con cuerdas y ambient pad para descanso total",
      videoId: "mPZkdNFkNps",
      embedUrl: "https://www.youtube-nocookie.com/embed/mPZkdNFkNps?autoplay=1&mute=0&controls=1&loop=1",
      tag: "Naturaleza Sagrada"
    }
  ],
  nativeSacredTones: [
    {
      id: "freq-432",
      title: "432 Hz - Frecuencia de la Paz Profunda",
      subtitle: "Alineación natural que relaja el sistema nervioso y calma la mente",
      freq: 432,
      type: "sine",
      color: "from-amber-500/20 to-yellow-600/10",
      icon: "Shield"
    },
    {
      id: "freq-528",
      title: "528 Hz - Tono de Renovación y Gracia",
      subtitle: "Frecuencia tradicional de armonía interior y descanso emocional",
      freq: 528,
      type: "sine",
      color: "from-emerald-500/20 to-teal-600/10",
      icon: "Sparkles"
    },
    {
      id: "freq-harp-chords",
      title: "Arpegio Celestial (Arpa Generativa)",
      subtitle: "Acordes continuos en afinación sagrada generados en tiempo real",
      freq: 396,
      type: "harp-chord",
      color: "from-purple-500/20 to-indigo-600/10",
      icon: "Music"
    },
    {
      id: "freq-temple-drone",
      title: "Atmósfera del Tabernáculo",
      subtitle: "Almohadilla sonora sutil y cálida que llena el espacio de reverencia",
      freq: 216,
      type: "warm-pad",
      color: "from-rose-500/20 to-amber-600/10",
      icon: "Flame"
    }
  ]
};
