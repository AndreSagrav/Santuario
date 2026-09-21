import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DevotionalView from './components/DevotionalView';
import BibleReaderView from './components/BibleReaderView';
import RuajAiChat from './components/RuajAiChat';
import SoundscapePlayer from './components/SoundscapePlayer';
import PrayerWallView from './components/PrayerWallView';
import SanctuaryZenMode from './components/SanctuaryZenMode';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';
import BiblicalAtlasView from './components/BiblicalAtlasView';
import BiblicalDictionaryView from './components/BiblicalDictionaryView';
import { sacredAudio } from './services/sacredAudioEngine';
import { SOUNDSCAPES_DATA } from './data/soundscapesData';
import { supabase } from './services/supabaseClient';
import { loadKeysFromCloud } from './services/cloudKeysService';

export default function App() {
  const [activeTab, setActiveTab] = useState('devotional');
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Contexto para Ruaj
  const [aiContext, setAiContext] = useState({
    passage: null,
    mood: null
  });

  // Pasaje inicial para lector de biblia
  const [targetPassageId, setTargetPassageId] = useState(null);

  // Escuchar estado de autenticación en Supabase y sincronizar API keys
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user || null);
      if (user) loadKeysFromCloud(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) loadKeysFromCloud(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Toggle rápido de sonido ambiental sagrado
  const toggleSound = () => {
    if (isSoundPlaying) {
      sacredAudio.stopSacredTone();
      setIsSoundPlaying(false);
    } else {
      sacredAudio.playSacredTone(SOUNDSCAPES_DATA.nativeSacredTones[0]); // 432 Hz
      setIsSoundPlaying(true);
    }
  };

  const handleOpenBible = (passageId) => {
    setTargetPassageId(passageId);
    setActiveTab('bible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultAI = ({ passage, mood }) => {
    setAiContext({ passage, mood });
    setActiveTab('ruaj');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Partículas de Luz Celestial de Fondo */}
      <div className="celestial-particles-bg">
        <div className="particle" style={{ width: '4px', height: '4px', left: '15%', animationDuration: '22s', animationDelay: '0s' }} />
        <div className="particle" style={{ width: '6px', height: '6px', left: '35%', animationDuration: '28s', animationDelay: '3s' }} />
        <div className="particle" style={{ width: '3px', height: '3px', left: '60%', animationDuration: '25s', animationDelay: '5s' }} />
        <div className="particle" style={{ width: '5px', height: '5px', left: '80%', animationDuration: '20s', animationDelay: '1s' }} />
        <div className="particle" style={{ width: '4px', height: '4px', left: '92%', animationDuration: '30s', animationDelay: '7s' }} />
      </div>

      {/* Barra de Navegación Sagrada */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleZenMode={() => setIsZenMode(true)}
        isSoundPlaying={isSoundPlaying}
        toggleSound={toggleSound}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Contenido Dinámico de la Pestaña Activa */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {activeTab === 'devotional' && (
          <DevotionalView
            onOpenBible={handleOpenBible}
            onConsultAI={handleConsultAI}
          />
        )}

        {activeTab === 'bible' && (
          <BibleReaderView
            initialPassageId={targetPassageId}
            onConsultAI={handleConsultAI}
            onOpenDictionary={() => setActiveTab('dictionary')}
            onOpenAtlas={() => setActiveTab('atlas')}
          />
        )}

        {activeTab === 'dictionary' && (
          <BiblicalDictionaryView
            onOpenBible={handleOpenBible}
            onConsultAI={handleConsultAI}
          />
        )}

        {activeTab === 'atlas' && (
          <BiblicalAtlasView
            onConsultAI={handleConsultAI}
            onOpenBible={handleOpenBible}
          />
        )}

        {activeTab === 'ruaj' && (
          <RuajAiChat
            currentContext={aiContext}
          />
        )}

        {activeTab === 'music' && (
          <SoundscapePlayer
            isSoundPlaying={isSoundPlaying}
            setIsSoundPlaying={setIsSoundPlaying}
          />
        )}

        {activeTab === 'prayers' && (
          <PrayerWallView />
        )}
      </main>

      {/* Barra de Navegación Inferior Táctil (Móvil / Google Play Store) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Modal de Autenticación y Cuenta Segura */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={currentUser}
        onAuthChange={setCurrentUser}
      />

      {/* Modo Santuario Inmersivo (Zen) */}
      {isZenMode && (
        <SanctuaryZenMode
          onClose={() => setIsZenMode(false)}
          isSoundPlaying={isSoundPlaying}
          toggleSound={toggleSound}
        />
      )}

      {/* Pie de Página Sagrado */}
      <footer style={{ 
        position: 'relative', 
        zIndex: 1, 
        borderTop: '1px solid var(--border-gold-subtle)', 
        background: 'rgba(6,7,10,0.9)', 
        padding: '28px 16px', 
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div className="font-cinzel gold-text-gradient" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.08em' }}>
            SANTUARIO
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            "Cercano está Jehová a todos los que le invocan, a todos los que le invocan de veras." — Salmos 145:18
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Diseñado para transformar el tiempo devocional en una experiencia sagrada de clase mundial.
          </div>
        </div>
      </footer>

    </div>
  );
}
