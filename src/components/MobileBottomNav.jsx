import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Flame, BookOpen, Sparkles, Music, HeartHandshake, Compass, BookMarked } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'devotional', label: 'Altar', icon: Flame },
    { id: 'bible', label: 'Palabra', icon: BookOpen },
    { id: 'dictionary', label: 'Dicc', icon: BookMarked },
    { id: 'atlas', label: 'Atlas', icon: Compass },
    { id: 'ruaj', label: 'Ruaj', icon: Sparkles },
    { id: 'music', label: 'Música', icon: Music },
    { id: 'prayers', label: 'Muro', icon: HeartHandshake }
  ];

  const navContent = (
    <nav 
      className="mobile-bottom-nav" 
      aria-label="Navegación móvil sagrada"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100vw',
        zIndex: 99999,
        background: 'rgba(8, 10, 16, 0.98)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.28)',
        boxShadow: '0 -6px 35px rgba(0, 0, 0, 0.9)',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        minHeight: 'calc(62px + env(safe-area-inset-bottom, 0px))',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxSizing: 'border-box'
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              background: 'transparent',
              border: 'none',
              padding: '8px 2px',
              color: isActive ? 'var(--gold-300)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              position: 'relative',
              touchAction: 'manipulation'
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
              padding: '4px',
              borderRadius: '50%',
              background: isActive ? 'rgba(212,175,55,0.2)' : 'transparent',
              transition: 'background 0.2s'
            }}>
              <Icon size={20} color={isActive ? 'var(--gold-300)' : 'currentColor'} />
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

  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(navContent, document.body);
}
