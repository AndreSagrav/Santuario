import React, { useState, useEffect } from 'react';
import { Minimize2, Volume2, VolumeX, Sparkles, Feather } from 'lucide-react';
import { DEVOTIONALS_DATA } from '../data/devotionalsData';
import logoImg from '../assets/santuario-logo.jpg';

export default function SanctuaryZenMode({ onClose, isSoundPlaying, toggleSound }) {
  const [breathPhase, setBreathPhase] = useState("Inhala Su Presencia...");
  const devo = DEVOTIONALS_DATA[0];

  useEffect(() => {
    const phases = [
      { text: "Inhala Su Paz...", duration: 4000 },
      { text: "Reposa en Su Presencia...", duration: 4000 },
      { text: "Exhala todo afán y temor...", duration: 4000 }
    ];

    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % phases.length;
      setBreathPhase(phases[current].text);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle at 50% 50%, #111422 0%, #050609 100%)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '40px 24px',
      overflow: 'hidden'
    }} className="animate-fade-in">
      
      {/* Botones Flotantes Superiores */}
      <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid var(--gold-400)',
            boxShadow: '0 0 16px rgba(212,175,55,0.4)'
          }}>
            <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div className="sacred-badge" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>SANTUARIO EN SILENCIO</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Momento a solas con Dios</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleSound}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-gold-subtle)',
              color: isSoundPlaying ? 'var(--gold-300)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {isSoundPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            <Minimize2 size={16} />
            <span>Volver a la App</span>
          </button>
        </div>
      </div>

      {/* Contenido Central Inmersivo */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: 'auto 0' }}>
        
        {/* Esfera Guiada de Respiración y Calma con Emblema Sagrado */}
        <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className="holy-glow-circle" 
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.03) 70%)',
              border: '1.5px solid rgba(212,175,55,0.4)',
              boxShadow: '0 0 55px rgba(212,175,55,0.35)'
            }} 
          />
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(212,175,55,0.85)',
            boxShadow: '0 0 25px rgba(212,175,55,0.5)',
            marginBottom: '10px'
          }}>
            <img src={logoImg} alt="Santuario Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'var(--gold-200)', fontSize: '0.86rem', fontWeight: '600', textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
            {breathPhase}
          </div>
        </div>

        {/* Versículo de Meditación Profunda */}
        <p className="font-scripture" style={{ fontSize: '2.4rem', lineHeight: '1.4', fontStyle: 'italic', color: '#fffef7', textShadow: '0 2px 20px rgba(0,0,0,0.8)', marginBottom: '16px' }}>
          "{devo.highlightVerse}"
        </p>

        <div className="font-cinzel" style={{ fontSize: '1.15rem', color: 'var(--gold-300)', fontWeight: '600', letterSpacing: '0.1em' }}>
          — {devo.highlightRef} —
        </div>

      </div>

      {/* Frase de reposo inferior */}
      <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>
        "Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones." (Salmos 46:10)
      </div>

    </div>
  );
}
