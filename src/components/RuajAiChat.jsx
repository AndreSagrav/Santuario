import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Flame, 
  BookOpen, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Lightbulb, 
  Heart,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { askRuajAI, transcribeAudio } from '../services/aiService';
import SacredContentRenderer from '../utils/sacredFormatter';
import logoImg from '../assets/santuario-logo.jpg';

const SUGGESTED_QUESTIONS = [
  "¿Cuál es el significado hebreo/griego original y contexto de este pasaje?",
  "Tengo ansiedad por el futuro, ¿cómo aplico esta promesa hoy?",
  "Genera una oración profunda y solemne basada en esta verdad",
  "¿Qué representa 'aderezar mesa en presencia de angustiadores'?"
];

export default function RuajAiChat({ currentContext }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `🕊️ **Bienvenido a este espacio.**
Soy **Ruaj**. Estoy aquí para acompañarte de persona a persona en tu camino de fe y estudio: desde la historia viva y los manuscritos antiguos de las Escrituras, hasta las dudas, batallas y decisiones que enfrentas en tu día a día.

${currentContext?.passage ? `*Hojeando las Escrituras en: **${currentContext.passage.title}** (${currentContext.passage.book} ${currentContext.passage.chapter})*` : ''}

Cuéntame con total libertad: ¿qué pasaje te gustaría explorar o qué inquietud tienes hoy en tu corazón?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [autoVoice, setAutoVoice] = useState(() => localStorage.getItem('santuario_ruaj_autovoice') !== 'false');

  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  // Detener audio y grabación al desmontar
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const toggleAutoVoice = () => {
    setAutoVoice(prev => {
      const next = !prev;
      localStorage.setItem('santuario_ruaj_autovoice', String(next));
      if (!next && window.speechSynthesis) window.speechSynthesis.cancel();
      return next;
    });
  };

  // Reproducción con voz humana natural (sin sonar robótico)
  const toggleSpeaking = (text, idx) => {
    if (!window.speechSynthesis) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Limpieza de símbolos técnicos y markdown para una lectura natural y fluida
    const cleanText = text
      .replace(/[*#_`>✦•]/g, ' ')
      .replace(/\(Strong\s+[HG]\d+\)/gi, '')
      .replace(/\[\d+\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();

    // Seleccionar voz neuronal o de alta calidad en español
    const bestVoice = voices.find(v => 
      v.lang.startsWith('es') && (
        v.name.includes('Natural') || 
        v.name.includes('Neural') || 
        v.name.includes('Google') || 
        v.name.includes('Alvaro') || 
        v.name.includes('Jorge') || 
        v.name.includes('Mónica')
      )
    ) || voices.find(v => v.lang.startsWith('es'));

    if (bestVoice) utterance.voice = bestVoice;
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 0.98;

    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  // Grabación directa con micrófono y transcripción rápida (Whisper v3 / Gemini)
  const toggleListening = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        if (audioBlob.size > 1000) {
          setIsTranscribing(true);
          try {
            const transcribed = await transcribeAudio(audioBlob);
            if (transcribed && transcribed.trim()) {
              setInputText('');
              handleSendMessage(transcribed.trim(), true);
            } else {
              // Fallback al dictado local
              fallbackNativeSpeech();
            }
          } catch (e) {
            console.error("Error transcribiendo audio:", e);
            fallbackNativeSpeech();
          } finally {
            setIsTranscribing(false);
          }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.warn("Acceso a micrófono estándar denegado o no disponible:", err);
      fallbackNativeSpeech();
    }
  };

  const fallbackNativeSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("No se pudo iniciar el dictado por voz. Verifica los permisos de micrófono.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const t = e.results[0][0].transcript;
      if (t) handleSendMessage(t, true);
    };
    recognition.start();
  };

  const handleSendMessage = async (textToSend, shouldSpeak = false) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg = { role: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askRuajAI({
        question: query,
        passage: currentContext?.passage,
        mood: currentContext?.mood,
        isChat: true
      });

      setMessages((prev) => {
        const nextIdx = prev.length;
        const updated = [...prev, { role: 'assistant', text: response }];
        // Si el usuario envió por voz o tiene auto-voz activo, Ruaj le responde hablando
        if ((autoVoice || shouldSpeak) && window.speechSynthesis) {
          setTimeout(() => toggleSpeaking(response, nextIdx), 250);
        }
        return updated;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Ocurrió una interrupción en la comunicación con Ruaj. Por favor intenta formular nuevamente tu pregunta.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '24px 24px 80px' }} className="animate-fade-in">
      
      {/* Encabezado del Asistente */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ 
          width: '84px', 
          height: '84px', 
          borderRadius: '50%', 
          overflow: 'hidden',
          border: '2.5px solid var(--gold-400)',
          boxShadow: '0 0 35px rgba(212,175,55,0.45)',
          margin: '0 auto 16px',
          background: '#07080c'
        }}>
          <img src={logoImg} alt="Ruaj Mentor Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h2 className="font-cinzel gold-text-gradient" style={{ fontSize: '2.2rem', fontWeight: '800' }}>
          RUAJ — Mentor Bíblico & Consejero Espiritual
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '600px', margin: '6px auto 0' }}>
          Exégesis bíblica rigurosa, raíces hebreas/griegas y dirección pastoral para el corazón.
        </p>
      </div>

      {/* Preguntas Sugeridas */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(212,175,55,0.18)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-400)';
              e.currentTarget.style.color = 'var(--gold-200)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <Lightbulb size={13} color="var(--gold-400)" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Ventana de Mensajes */}
      <div className="sacred-panel" style={{ padding: '24px', minHeight: '440px', maxHeight: '600px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                flexDirection: isUser ? 'row-reverse' : 'row'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(212,175,55,0.18)',
                border: isUser ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--gold-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isUser ? <User size={18} color="#fff" /> : <Flame size={18} color="var(--gold-400)" />}
              </div>

              <div style={{
                maxWidth: '82%',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: isUser ? 'rgba(212,175,55,0.15)' : 'rgba(11,13,20,0.85)',
                border: isUser ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--border-gold-subtle)',
                color: '#edf1f8',
                lineHeight: '1.7',
                fontSize: '0.96rem',
                position: 'relative'
              }}>
                {/* Renderizado sin símbolos para el asistente, texto plano para el usuario */}
                {isUser ? (
                  <p style={{ margin: 0 }}>{msg.text}</p>
                ) : (
                  <SacredContentRenderer content={msg.text} multiColumn={false} chatMode={true} />
                )}

                {!isUser && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <button
                      onClick={() => toggleSpeaking(msg.text, idx)}
                      style={{
                        background: speakingIdx === idx ? 'rgba(212,175,55,0.2)' : 'transparent',
                        border: 'none',
                        color: speakingIdx === idx ? 'var(--gold-300)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '5px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={speakingIdx === idx ? "Pausar lectura" : "Escuchar con voz solemne"}
                    >
                      {speakingIdx === idx ? <VolumeX size={15} color="var(--gold-400)" /> : <Volume2 size={15} />}
                    </button>

                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '5px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Copiar respuesta"
                    >
                      {copiedIdx === idx ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(212,175,55,0.18)',
              border: '1px solid var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={18} color="var(--gold-400)" className="animate-spin" />
            </div>
            <div style={{ fontStyle: 'italic', color: 'var(--gold-300)', fontSize: '0.9rem' }}>
              Escudriñando las Escrituras y buscando discernimiento pastoral...
            </div>
          </div>
        )}
      </div>

      {/* Input de Pregunta con Dictado por Voz y Grabación Fluida */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          className="sacred-input"
          placeholder={
            isRecording 
              ? "🔴 Grabando tu voz... (Toca el micrófono para enviar a Ruaj)" 
              : isTranscribing 
                ? "✨ Transcribiendo tu voz con Whisper v3..." 
                : "Escribe o háblale a Ruaj con tu voz..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading || isRecording || isTranscribing}
          style={{
            borderColor: isRecording ? '#ef4444' : isTranscribing ? 'var(--gold-400)' : undefined,
            boxShadow: isRecording ? '0 0 20px rgba(239,68,68,0.35)' : isTranscribing ? '0 0 15px rgba(212,175,55,0.3)' : undefined
          }}
        />

        {/* Interruptor de Respuesta por Voz Humana */}
        <button
          onClick={toggleAutoVoice}
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: autoVoice ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
            border: autoVoice ? '1px solid var(--gold-400)' : '1px solid var(--border-gold-subtle)',
            color: autoVoice ? 'var(--gold-300)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          title={autoVoice ? "Voz activa: Ruaj te responderá hablando de forma natural" : "Voz desactivada (solo texto)"}
        >
          {autoVoice ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Botón de Micrófono Dorado / Grabación */}
        <button
          onClick={toggleListening}
          disabled={isLoading || isTranscribing}
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: isRecording ? '#dc2626' : 'rgba(255,255,255,0.04)',
            border: isRecording ? 'none' : '1px solid var(--border-gold-subtle)',
            color: isRecording ? '#ffffff' : 'var(--gold-300)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0,
            boxShadow: isRecording ? '0 0 15px rgba(220,38,38,0.6)' : undefined
          }}
          title={isRecording ? "Detener y enviar audio a Ruaj" : "Hablar con voz fluida a Ruaj"}
        >
          {isRecording ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
        </button>

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || isRecording || isTranscribing || !inputText.trim()}
          className="btn-gold"
          style={{ padding: '12px 24px', flexShrink: 0 }}
        >
          <Send size={16} />
          <span>Preguntar</span>
        </button>
      </div>

    </div>
  );
}
