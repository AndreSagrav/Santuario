import React from 'react';
import { Flame, BookOpen, Sparkles, Music, HeartHandshake, Compass, BookMarked } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'devotional', label: 'Altar', icon: Flame },
    { id: 'bible', label: 'Palabra', icon: BookOpen },
    { id: 'dictionary', label: 'Dicc', icon: BookMarked },
    { id: 'atlas', label: 'Atlas', icon: Compass },
    { id: 'ruaj', label: 'Ruaj', icon: Sparkles },
    { id: 'music', label: 'Música', icon: Music },
    { id: 'prayers', label: 'Muro', icon: HeartHandshake }
  ];

  return (
    <nav 
      className="mobile-bottom-nav" 
      aria-label="Navegación móvil sagrada"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100%',
        height: '64px',
        zIndex: 999999,
        background: '#07080c',
        backgroundColor: 'rgba(7, 8, 12, 0.98)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1.5px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.95)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxSizing: 'border-box',
        margin: 0,
        touchAction: 'manipulation'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              flex: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              padding: '6px 2px',
              color: isActive ? 'var(--gold-300)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              position: 'relative'
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute',
                top: '0px',
                width: '32px',
                height: '3px',
                borderRadius: '9999px',
                background: 'var(--gold-400)',
                boxShadow: '0 0 10px var(--gold-400)'
              }} />
            )}
            <div style={{
              padding: '3px',
              borderRadius: '50%',
              background: isActive ? 'rgba(212,175,55,0.22)' : 'transparent',
              transition: 'background 0.2s'
            }}>
              <Icon size={19} color={isActive ? 'var(--gold-300)' : 'currentColor'} />
            </div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: isActive ? '800' : '500',
              letterSpacing: '0.02em',
              lineHeight: 1
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
