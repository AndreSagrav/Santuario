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
    <div className="mobile-bottom-nav" style={{
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      minHeight: 'calc(60px + env(safe-area-inset-bottom, 0px))'
    }}>
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
              padding: '8px 0',
              color: isActive ? 'var(--gold-300)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
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
              padding: '4px',
              borderRadius: '50%',
              background: isActive ? 'rgba(212,175,55,0.18)' : 'transparent',
              transition: 'background 0.2s'
            }}>
              <Icon size={20} color={isActive ? 'var(--gold-300)' : 'currentColor'} />
            </div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: isActive ? '700' : '500',
              letterSpacing: '0.02em'
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
