import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Mail, Lock, LogIn, LogOut, CheckCircle, X, Shield, Sparkles } from 'lucide-react';
import logoImg from '../assets/santuario-logo.jpg';

export default function AuthModal({ isOpen, onClose, user, onAuthChange }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password
        });
        if (error) throw error;
        setSuccessMessage('¡Cuenta creada con éxito! Revisa tu correo o inicia sesión.');
        if (data?.user) {
          onAuthChange(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });
        if (error) throw error;
        setSuccessMessage('¡Bienvenido de vuelta a tu Santuario!');
        if (data?.user) {
          onAuthChange(data.user);
          setTimeout(onClose, 1000);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error de autenticación. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      setErrorMessage(err.message || 'Error con Google OAuth.');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      onAuthChange(null);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }} className="animate-fade-in">
      
      <div className="sacred-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 32px',
        position: 'relative'
      }}>
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Si el usuario ya está autenticado */}
        {user ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 25px rgba(212,175,55,0.4)'
            }}>
              <User size={32} color="#090a0f" />
            </div>

            <div className="sacred-badge" style={{ marginBottom: '8px' }}>
              ✦ SESIÓN ACTIVA EN LA NUBE ✦
            </div>

            <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>
              Tu Perfil Sagrado
            </h3>
            <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '4px', fontWeight: '600' }}>
              {user.email}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '24px' }}>
              Tus devocionales, notas y oraciones se sincronizan en Supabase Cloud.
            </p>

            <button
              onClick={handleSignOut}
              disabled={loading}
              className="btn-secondary"
              style={{ width: '100%', padding: '12px 0', justifyContent: 'center' }}
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          /* Formulario de Inicio de Sesión o Registro */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--gold-400)',
                margin: '0 auto 12px',
                boxShadow: '0 0 22px rgba(212,175,55,0.45)'
              }}>
                <img src={logoImg} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.45rem', fontWeight: '800' }}>
                {isSignUp ? 'Crear Cuenta en Santuario' : 'Bienvenido a tu Santuario'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '4px' }}>
                {isSignUp 
                  ? 'Guarda tus notas y oraciones de por vida en la nube' 
                  : 'Ingresa para sincronizar tu progreso espiritual'}
              </p>
            </div>

            {/* Botón de Google OAuth */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                marginBottom: '18px',
                transition: 'background 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>O CON CORREO</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            </div>

            <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e8', marginBottom: '6px' }}>
                  Correo Electrónico:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="sacred-input"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e8', marginBottom: '6px' }}>
                  Contraseña:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="sacred-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                </div>
              </div>

              {errorMessage && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', textAlign: 'center' }}>
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div style={{ color: '#4ade80', fontSize: '0.8rem', textAlign: 'center' }}>
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{ width: '100%', padding: '12px 0', marginTop: '6px', fontSize: '0.92rem' }}
              >
                <LogIn size={16} />
                <span>{loading ? 'Procesando...' : (isSignUp ? 'Crear mi Cuenta' : 'Iniciar Sesión')}</span>
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gold-300)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isSignUp ? '¿Ya tienes una cuenta? Inicia sesión aquí' : '¿Aún no tienes cuenta? Regístrate gratis'}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
