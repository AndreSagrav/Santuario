import React, { useState } from 'react';
import { 
  Music, 
  Play, 
  Square, 
  Volume2, 
  Sliders, 
  ExternalLink, 
  Video, 
  Radio, 
  Sparkles, 
  Link2, 
  Check 
} from 'lucide-react';
import { SOUNDSCAPES_DATA } from '../data/soundscapesData';
import { sacredAudio } from '../services/sacredAudioEngine';

export default function SoundscapePlayer({ isSoundPlaying, setIsSoundPlaying }) {
  const [activeTab, setActiveTab] = useState('native'); // 'native' | 'spotify' | 'youtube'
  const [activeNativeToneId, setActiveNativeToneId] = useState(null);
  const [volume, setVolume] = useState(0.6);

  // Spotify state
  const [selectedSpotify, setSelectedSpotify] = useState(SOUNDSCAPES_DATA.spotifyPlaylists[0]);
  const [customSpotifyUrl, setCustomSpotifyUrl] = useState('');
  const [activeSpotifyEmbed, setActiveSpotifyEmbed] = useState(SOUNDSCAPES_DATA.spotifyPlaylists[0].embedUrl);

  // YouTube state
  const [selectedYoutube, setSelectedYoutube] = useState(SOUNDSCAPES_DATA.youtubeStreams[0]);
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');
  const [activeYoutubeEmbed, setActiveYoutubeEmbed] = useState(SOUNDSCAPES_DATA.youtubeStreams[0].embedUrl);

  const handlePlayTone = (tone) => {
    if (activeNativeToneId === tone.id && isSoundPlaying) {
      sacredAudio.stopSacredTone();
      setIsSoundPlaying(false);
      setActiveNativeToneId(null);
    } else {
      sacredAudio.playSacredTone(tone);
      setIsSoundPlaying(true);
      setActiveNativeToneId(tone.id);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sacredAudio.setVolume(val);
  };

  const handleApplyCustomSpotify = () => {
    if (!customSpotifyUrl.trim()) return;
    // Extraer id o transformar URL
    let embed = customSpotifyUrl;
    if (customSpotifyUrl.includes('open.spotify.com')) {
      embed = customSpotifyUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    setActiveSpotifyEmbed(embed);
  };

  const handleApplyCustomYoutube = () => {
    if (!customYoutubeUrl.trim()) return;
    let videoId = customYoutubeUrl;
    if (customYoutubeUrl.includes('v=')) {
      videoId = customYoutubeUrl.split('v=')[1]?.split('&')[0];
    } else if (customYoutubeUrl.includes('youtu.be/')) {
      videoId = customYoutubeUrl.split('youtu.be/')[1]?.split('?')[0];
    }
    if (videoId) {
      setActiveYoutubeEmbed(`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1`);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 80px' }} className="animate-fade-in">
      
      {/* Título de Sección */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '54px', 
          height: '54px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.05) 100%)',
          border: '1px solid var(--gold-400)',
          boxShadow: '0 0 25px rgba(212,175,55,0.25)',
          marginBottom: '12px'
        }}>
          <Music size={26} color="var(--gold-300)" />
        </div>
        <h2 className="font-cinzel gold-text-gradient" style={{ fontSize: '2.2rem', fontWeight: '800' }}>
          SOUNDSCAPE & ADORACIÓN
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '650px', margin: '6px auto 0' }}>
          Acompaña tu tiempo de lectura y oración con atmósferas sacras nativas gratuitas, playlists de Spotify o transmisiones de YouTube sin anuncios molestos.
        </p>
      </div>

      {/* Selector de Fuente Musical */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
        <button
          onClick={() => setActiveTab('native')}
          className={activeTab === 'native' ? 'btn-gold' : 'btn-secondary'}
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          <Sparkles size={16} />
          <span>Frecuencias Nativas (Gratis)</span>
        </button>

        <button
          onClick={() => setActiveTab('spotify')}
          className={activeTab === 'spotify' ? 'btn-gold' : 'btn-secondary'}
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          <Radio size={16} />
          <span>Spotify Adoración</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={activeTab === 'youtube' ? 'btn-gold' : 'btn-secondary'}
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          <Video size={16} />
          <span>YouTube Live Ambient</span>
        </button>
      </div>

      {/* PESTAÑA 1: FRECUENCIAS SACRAS NATIVAS (Web Audio API) */}
      {activeTab === 'native' && (
        <div className="animate-fade-in">
          {/* Control de volumen maestro */}
          <div className="sacred-panel" style={{ padding: '18px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Volume2 size={20} color="var(--gold-400)" />
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Volumen de la Atmósfera Sagrada:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                style={{ flex: 1, accentColor: 'var(--gold-400)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--gold-200)', minWidth: '40px' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {SOUNDSCAPES_DATA.nativeSacredTones.map((tone) => {
              const isPlayingThis = isSoundPlaying && activeNativeToneId === tone.id;
              return (
                <div
                  key={tone.id}
                  className={isPlayingThis ? "sacred-panel-active" : "sacred-panel"}
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isPlayingThis && (
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)',
                      pointerEvents: 'none'
                    }} className="animate-sacred-breath" />
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="sacred-badge">{tone.freq ? `${tone.freq} Hz` : 'Acústico'}</span>
                      {isPlayingThis && (
                        <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: '600' }}>
                          ● EN VIVO
                        </span>
                      )}
                    </div>
                    <h3 className="font-cinzel" style={{ fontSize: '1.15rem', fontWeight: '700', color: isPlayingThis ? 'var(--gold-200)' : 'var(--text-main)', marginBottom: '8px' }}>
                      {tone.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                      {tone.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayTone(tone)}
                    className={isPlayingThis ? "btn-secondary active" : "btn-gold"}
                    style={{ width: '100%', padding: '10px 0', justifyContent: 'center' }}
                  >
                    {isPlayingThis ? <Square size={16} /> : <Play size={16} />}
                    <span>{isPlayingThis ? "Silenciar Frecuencia" : "Comenzar Sonido"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: SPOTIFY ADORACIÓN */}
      {activeTab === 'spotify' && (
        <div className="animate-fade-in">
          {/* Selector de Playlists preconfiguradas */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {SOUNDSCAPES_DATA.spotifyPlaylists.map((sp) => (
              <button
                key={sp.id}
                onClick={() => {
                  setSelectedSpotify(sp);
                  setActiveSpotifyEmbed(sp.embedUrl);
                }}
                className={selectedSpotify.id === sp.id ? "sacred-panel-active" : "sacred-panel"}
                style={{
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: selectedSpotify.id === sp.id ? '1px solid var(--gold-400)' : '1px solid var(--border-gold-subtle)',
                  background: selectedSpotify.id === sp.id ? 'rgba(212,175,55,0.15)' : 'var(--surface-glass)',
                  color: 'var(--text-main)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--gold-300)', fontWeight: '600' }}>{sp.theme}</div>
                <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>{sp.title}</div>
              </button>
            ))}
          </div>

          {/* Reproductor Embebido de Spotify */}
          <div className="sacred-panel" style={{ padding: '18px', marginBottom: '24px', borderRadius: '16px' }}>
            <iframe
              style={{ borderRadius: '12px' }}
              src={activeSpotifyEmbed}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Worship Sanctuary"
            />
          </div>

          {/* Pegar enlace personalizado de Spotify */}
          <div className="sacred-panel" style={{ padding: '20px 24px' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', color: '#cad2e5', marginBottom: '8px', fontWeight: '500' }}>
              ¿Tienes una playlist o álbum favorito en Spotify? Pega aquí el enlace para escucharlo:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="sacred-input"
                placeholder="https://open.spotify.com/playlist/..."
                value={customSpotifyUrl}
                onChange={(e) => setCustomSpotifyUrl(e.target.value)}
              />
              <button onClick={handleApplyCustomSpotify} className="btn-gold" style={{ flexShrink: 0 }}>
                <Link2 size={16} />
                <span>Cargar en Santuario</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: YOUTUBE LIVE AMBIENT */}
      {activeTab === 'youtube' && (
        <div className="animate-fade-in">
          {/* Streams Preconfigurados */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {SOUNDSCAPES_DATA.youtubeStreams.map((yt) => (
              <button
                key={yt.id}
                onClick={() => {
                  setSelectedYoutube(yt);
                  setActiveYoutubeEmbed(yt.embedUrl);
                }}
                className={selectedYoutube.id === yt.id ? "sacred-panel-active" : "sacred-panel"}
                style={{
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: selectedYoutube.id === yt.id ? '1px solid var(--gold-400)' : '1px solid var(--border-gold-subtle)',
                  background: selectedYoutube.id === yt.id ? 'rgba(212,175,55,0.15)' : 'var(--surface-glass)',
                  color: 'var(--text-main)',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--gold-300)', fontWeight: '600' }}>{yt.tag}</div>
                <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>{yt.title}</div>
              </button>
            ))}
          </div>

          {/* Reproductor Embebido de YouTube */}
          <div className="sacred-panel" style={{ padding: '16px', marginBottom: '24px', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src={activeYoutubeEmbed}
                title="YouTube Ambient Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Pegar enlace personalizado de YouTube */}
          <div className="sacred-panel" style={{ padding: '20px 24px' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', color: '#cad2e5', marginBottom: '8px', fontWeight: '500' }}>
              Pega cualquier transmisión o canción de adoración en YouTube:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="sacred-input"
                placeholder="https://www.youtube.com/watch?v=..."
                value={customYoutubeUrl}
                onChange={(e) => setCustomYoutubeUrl(e.target.value)}
              />
              <button onClick={handleApplyCustomYoutube} className="btn-gold" style={{ flexShrink: 0 }}>
                <Video size={16} />
                <span>Cargar Video</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
