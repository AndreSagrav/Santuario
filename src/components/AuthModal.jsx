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
        
        if (data?.session && data?.user) {
          setSuccessMessage('¡Cuenta creada y sesión iniciada con éxito!');
          onAuthChange(data.user);
          setTimeout(onClose, 1200);
        } else {
          // Supabase requiere confirmación de correo
          setSuccessMessage('¡Cuenta registrada! Si tu panel de Supabase tiene "Confirm email" activado, desactívalo en Auth > Providers > Email para entrar sin esperar confirmación.');
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
      let msg = err.message || 'Error de autenticación. Intenta nuevamente.';
      if (msg.includes('Email not confirmed')) {
        msg = 'Tu cuenta existe, pero Supabase tiene "Confirm email" activado. Desactiva la casilla "Confirm email" en tu panel de Supabase (Authentication > Providers > Email) para entrar al instante.';
      } else if (msg.includes('Invalid login credentials')) {
        msg = 'Correo o contraseña incorrectos. Si aún no te has registrado, pulsa en la pestaña "Crear Cuenta" arriba.';
      } else if (msg.includes('User already registered')) {
        msg = 'Este correo ya está registrado. Pulsa en la pestaña "Iniciar Sesión" arriba.';
      } else if (msg.includes('Password should be at least')) {
        msg = 'La contraseña debe tener al menos 6 caracteres.';
      }
      setErrorMessage(msg);
    } finally {
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
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '58px',
                height: '58px',
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
                  ? 'Crea tu cuenta para sincronizar con tu tablet, celular y PC' 
                  : 'Ingresa para acceder a tus oraciones y notas en cualquier dispositivo'}
              </p>
            </div>

            {/* Pestañas Selectoras: Iniciar Sesión / Crear Cuenta */}
            <div style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.05)',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              marginBottom: '18px',
              border: '1px solid rgba(212,175,55,0.15)'
            }}>
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 'var(--radius-full)',
                  background: !isSignUp ? 'var(--gold-500)' : 'transparent',
                  color: !isSignUp ? '#090a0f' : 'var(--text-muted)',
                  fontWeight: !isSignUp ? '800' : '600',
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 'var(--radius-full)',
                  background: isSignUp ? 'var(--gold-500)' : 'transparent',
                  color: isSignUp ? '#090a0f' : 'var(--text-muted)',
                  fontWeight: isSignUp ? '800' : '600',
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Crear Cuenta
              </button>
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
