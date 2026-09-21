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
import { askRuajAI } from '../services/aiService';
import SacredContentRenderer from '../utils/sacredFormatter';

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
      text: `### 🕊️ Paz a tu espíritu.
Soy **Ruaj**, tu compañero de estudio bíblico y exégesis en este Santuario.

Puedo ayudarte a desentrañar el contexto histórico, las raíces en hebreo y griego de las Escrituras, encontrar sabiduría práctica para tus decisiones cotidianas o redactar oraciones de fe para tu altar personal.

${currentContext?.passage ? `*Actualmente meditando en: **${currentContext.passage.title}** (${currentContext.passage.book} ${currentContext.passage.chapter})*` : ''}

¿Qué carga o pregunta trae hoy tu corazón ante la presencia de Dios?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  // Detener audio al desmontar
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Dictado por voz (Micrófono)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tu navegador no soporta entrada de voz directa. Puedes escribir tu consulta en el campo.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Lectura oral de la respuesta
  const toggleSpeaking = (text, idx) => {
    if (!window.speechSynthesis) return;

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`>]/g, '').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);

    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend) => {
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
        mood: currentContext?.mood
      });

      setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Ocurrió una interrupción en la comunión digital. Por favor intenta formular nuevamente tu pregunta.'
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
          <img src="/santuario-logo.jpg" alt="Ruaj Mentor Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  <SacredContentRenderer content={msg.text} />
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

      {/* Input de Pregunta con Dictado por Voz */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          className="sacred-input"
          placeholder={isListening ? "Escuchando tu voz sagrada... (Habla ahora)" : "Escribe tu inquietud o pregunta bíblica aquí..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
          style={{
            borderColor: isListening ? 'var(--gold-400)' : undefined,
            boxShadow: isListening ? '0 0 15px rgba(212,175,55,0.3)' : undefined
          }}
        />

        {/* Botón de Micrófono Dorado (Sin Saturación Visual) */}
        <button
          onClick={toggleListening}
          disabled={isLoading}
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            background: isListening ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.04)',
            border: isListening ? 'none' : '1px solid var(--border-gold-subtle)',
            color: isListening ? '#07080c' : 'var(--gold-300)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          title={isListening ? "Detener dictado" : "Hablar con voz a Ruaj"}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
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
