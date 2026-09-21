import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Flame, 
  Music, 
  HeartHandshake, 
  Maximize2, 
  Key, 
  Volume2, 
  VolumeX,
  User,
  Compass,
  BookMarked
} from 'lucide-react';
import { getStoredApiKey, saveApiKey } from '../services/aiService';

export default function Navbar({ activeTab, setActiveTab, toggleZenMode, isSoundPlaying, toggleSound, currentUser, onOpenAuthModal }) {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKey = () => {
    saveApiKey(apiKeyInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowApiKeyModal(false);
    }, 1200);
  };

  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverItemId, setDragOverItemId] = useState(null);

  const DEFAULT_NAV_ITEMS = [
    { id: 'devotional', label: 'Devocional', fullLabel: 'Altar & Devocional', icon: Flame },
    { id: 'bible', label: 'Palabra & Versiones', fullLabel: 'Palabra & Versiones', icon: BookOpen },
    { id: 'dictionary', label: 'Diccionario', fullLabel: 'Diccionario Bíblico Académico', icon: BookMarked },
    { id: 'atlas', label: 'Atlas & Mapas', fullLabel: 'Atlas Bíblico & Concordancia', icon: Compass },
    { id: 'ruaj', label: 'Ruaj (Mentor)', fullLabel: 'Ruaj (Mentor Teológico AI)', icon: Sparkles },
    { id: 'music', label: 'Soundscape', fullLabel: 'Soundscape Sacro', icon: Music },
    { id: 'prayers', label: 'Muro de Oración', fullLabel: 'Muro de Oración & Comunión', icon: HeartHandshake }
  ];

  const [navItems, setNavItems] = useState(() => {
    try {
      const savedOrder = localStorage.getItem("santuario_navbar_tabs_order");
      if (savedOrder) {
        const orderIds = JSON.parse(savedOrder);
        const map = new Map(DEFAULT_NAV_ITEMS.map(item => [item.id, item]));
        const ordered = [];
        orderIds.forEach(id => {
          if (map.has(id)) {
            ordered.push(map.get(id));
            map.delete(id);
          }
        });
        map.forEach(item => ordered.push(item));
        return ordered;
      }
    } catch (e) {}
    return DEFAULT_NAV_ITEMS;
  });

  const handleDragStart = (e, id) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetId) {
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }

    setNavItems(prev => {
      const copy = [...prev];
      const fromIndex = copy.findIndex(item => item.id === draggedItemId);
      const toIndex = copy.findIndex(item => item.id === targetId);
      if (fromIndex >= 0 && toIndex >= 0) {
        const [moved] = copy.splice(fromIndex, 1);
        copy.splice(toIndex, 0, moved);
        localStorage.setItem("santuario_navbar_tabs_order", JSON.stringify(copy.map(x => x.id)));
      }
      return copy;
    });

    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  return (
    <header className="sticky top-0 z-50 px-4 py-2 border-b border-[rgba(212,175,55,0.18)] bg-[rgba(8,10,16,0.96)] backdrop-blur-xl">
      <div style={{ width: '100%', maxWidth: '1720px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        
        {/* Logo de Marca Sagrada */}
        <div 
          onClick={() => setActiveTab('devotional')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '50%', 
            overflow: 'hidden',
            border: '2px solid rgba(212, 175, 55, 0.9)', 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.45), inset 0 0 8px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#07080c',
            flexShrink: 0
          }}>
            <img 
              src="/santuario-logo.jpg" 
              alt="Santuario Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>
            <div className="font-cinzel gold-text-gradient" style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: 1.1, letterSpacing: '0.06em' }}>
              SANTUARIO
            </div>
            <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--gold-300)', textTransform: 'uppercase', fontWeight: '600' }}>
              Devocional & Comunión
            </div>
          </div>
        </div>

        {/* Pestañas Principales (Fluido, espacioso, 100% visible sin ningún corte ni scroll) */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '4px', 
          background: 'rgba(255,255,255,0.03)', 
          padding: '4px 6px', 
          borderRadius: '9999px', 
          border: '1px solid rgba(212,175,55,0.15)',
          overflow: 'visible',
          flex: '1 1 auto'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDragging = draggedItemId === item.id;
            const isOver = dragOverItemId === item.id;

            return (
              <button
                key={item.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={() => setDragOverItemId(null)}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                onClick={() => setActiveTab(item.id)}
                title={`${item.fullLabel} (Arrastra para reordenar)`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '9999px',
                  fontSize: '0.79rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#090a0f' : 'var(--text-muted)',
                  background: isActive ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'transparent',
                  border: isOver ? '1.5px dashed var(--gold-300)' : '1px solid transparent',
                  cursor: 'grab',
                  opacity: isDragging ? 0.45 : 1,
                  transform: isOver ? 'scale(1.05)' : 'none',
                  boxShadow: isActive ? '0 2px 14px rgba(212,175,55,0.35)' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                  userSelect: 'none'
                }}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Acciones Rápidas del Santuario (Fijas a la derecha) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Sonido rápido */}
          <button
            onClick={toggleSound}
            title={isSoundPlaying ? "Silenciar atmósfera" : "Activar atmósfera sacra de fondo"}
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isSoundPlaying ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (isSoundPlaying ? 'var(--gold-400)' : 'var(--border-gold-subtle)'),
              color: isSoundPlaying ? 'var(--gold-300)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            {isSoundPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Configurar Gemini API Key */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            title="Configuración de Servicios Teológicos (Opcional)"
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-gold-subtle)',
              color: apiKeyInput ? 'var(--gold-300)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <Key size={15} />
          </button>

          {/* Cuenta Segura en Supabase */}
          <button
            onClick={onOpenAuthModal}
            title={currentUser ? `Conectado como ${currentUser.email}` : "Iniciar Sesión o Crear Cuenta Segura"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: currentUser ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.06)',
              border: currentUser ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--border-gold-subtle)',
              color: currentUser ? '#4ade80' : 'var(--text-main)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <User size={14} />
            <span>{currentUser ? currentUser.email.split('@')[0] : "Acceder"}</span>
          </button>

          {/* Modo Santuario Inmersivo (Zen) */}
          <button
            onClick={toggleZenMode}
            className="btn-gold"
            style={{ padding: '8px 18px', fontSize: '0.84rem', whiteSpace: 'nowrap' }}
            title="Entrar en Modo Santuario Inmersivo a pantalla completa"
          >
            <Maximize2 size={15} />
            <span>Modo Inmersión</span>
          </button>
        </div>
      </div>

      {/* Modal de Configuración Teológica */}
      {showApiKeyModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="sacred-panel animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-400)' }}>
                <Key size={22} />
              </div>
              <div>
                <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                  Servidor Teológico
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Profundiza las consultas y la revelación del pasaje
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
              Santuario cuenta con un <strong>motor teológico local integrado</strong> que funciona inmediatamente sin costo. Si deseas conectar una clave de ampliación de consultas, puedes ingresarla a continuación:
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              className="sacred-input"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{ marginBottom: '18px' }}
            />

            {savedSuccess && (
              <div style={{ color: '#4ade80', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center' }}>
                ✓ Clave guardada con éxito en tu dispositivo.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setShowApiKeyModal(false)}
              >
                Cerrar
              </button>
              <button 
                className="btn-gold" 
                onClick={handleSaveKey}
              >
                Guardar Conexión
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
