// Motor de sonido sagrado nativo (Web Audio API) y síntesis de voz oratoria (SpeechSynthesis API)
class SacredAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.currentOscillators = [];
    this.isPlaying = false;
    this.activeToneId = null;
    this.timerId = null;
    this.isSpeaking = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setVolume(vol) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped * 0.25, this.ctx.currentTime, 0.1);
    }
  }

  playSacredTone(tone) {
    this.initContext();
    this.stopSacredTone();

    this.activeToneId = tone.id;
    this.isPlaying = true;

    if (tone.type === "sine") {
      this.playHarmonicSine(tone.freq);
    } else if (tone.type === "warm-pad") {
      this.playWarmPad(tone.freq);
    } else if (tone.type === "harp-chord") {
      this.playGenerativeHarp();
    }
  }

  playHarmonicSine(baseFreq) {
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2];
    const gains = [0.12, 0.04, 0.02];

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gains[idx], this.ctx.currentTime + 3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.currentOscillators.push({ osc, gain });
    });
  }

  playWarmPad(baseFreq) {
    const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.currentOscillators.push({ osc, gain });
    });
  }

  playGenerativeHarp() {
    const pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    let noteIdx = 0;

    const playPluck = () => {
      if (!this.isPlaying || this.activeToneId !== "freq-harp-chords") return;
      const freq = pentatonicNotes[noteIdx % pentatonicNotes.length];
      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % pentatonicNotes.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 4);

      const nextDelay = 1200 + Math.random() * 1400;
      this.timerId = setTimeout(playPluck, nextDelay);
    };

    playPluck();
  }

  stopSacredTone() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.currentOscillators.length > 0 && this.ctx) {
      const now = this.ctx.currentTime;
      this.currentOscillators.forEach(({ osc, gain }) => {
        try {
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
          setTimeout(() => {
            try { osc.stop(); osc.disconnect(); } catch (e) {}
          }, 1300);
        } catch (e) {}
      });
      this.currentOscillators = [];
    }
    this.isPlaying = false;
    this.activeToneId = null;
  }

  // Audiobiblia: Síntesis de voz solemne con Web Speech API
  speakScripture(versesArray, onVerseStart, onComplete) {
    if (!('speechSynthesis' in window)) {
      alert("Tu navegador no soporta síntesis de voz web.");
      return;
    }
    this.stopSpeaking();
    this.isSpeaking = true;

    let index = 0;
    const playNext = () => {
      if (!this.isSpeaking || index >= versesArray.length) {
        this.isSpeaking = false;
        if (onComplete) onComplete();
        return;
      }

      const verse = versesArray[index];
      if (onVerseStart) onVerseStart(verse.num);

      const textToSpeak = `Versículo ${verse.num}. ${verse.text}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      utterance.lang = "es-ES";
      utterance.rate = 0.88; // Tono sosegado y reflexivo
      utterance.pitch = 0.95;

      utterance.onend = () => {
        index++;
        setTimeout(playNext, 600); // Pausa reverente entre versículos
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();
  }

  stopSpeaking() {
    this.isSpeaking = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sacredAudio = new SacredAudioEngine();
