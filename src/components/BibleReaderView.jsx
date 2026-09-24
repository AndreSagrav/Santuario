import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Columns, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Layers, 
  Info, 
  Check, 
  Play, 
  Square,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Search,
  BookMarked,
  Sliders,
  Maximize2,
  Minimize2,
  X,
  Compass,
  CheckSquare,
  Square as EmptySquare,
  Filter,
  ListFilter,
  Copy
} from 'lucide-react';
import { BIBLES_DATA, BIBLE_VERSIONS } from '../data/biblesData';
import { CANONICAL_BOOKS } from '../data/canonicalBooks';
import { getPassageData } from '../services/bibleFetchService';
import { sacredAudio } from '../services/sacredAudioEngine';
import { getChapterVerseCount } from '../data/bibleVerseCounts';
import TheologicalApparatusDrawer from './TheologicalApparatusDrawer';

export default function BibleReaderView({ initialPassageId, onConsultAI, onOpenDictionary, onOpenAtlas }) {
  const [selectedPassageId, setSelectedPassageId] = useState(initialPassageId || BIBLES_DATA[0].id);
  const [currentPassage, setCurrentPassage] = useState(
    BIBLES_DATA.find(p => p.id === selectedPassageId) || BIBLES_DATA[0]
  );
  const [primaryVersion, setPrimaryVersion] = useState("RVR1960");
  const [secondaryVersion, setSecondaryVersion] = useState("NTV");
  const [isParallelMode, setIsParallelMode] = useState(false);
  const [layoutMode, setLayoutMode] = useState('two_columns'); // 'two_columns' | 'wide'
  const [activeSpeakingVerse, setActiveSpeakingVerse] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedWordDetail, setSelectedWordDetail] = useState(null);
  
  // Selección Múltiple y Rango de Versículos
  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState([1]); // Por defecto versículo 1
  const [lastClickedVerse, setLastClickedVerse] = useState(1);
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(3);
  const [isApparatusOpen, setIsApparatusOpen] = useState(false);
  const [apparatusContext, setApparatusContext] = useState(null);
  const [copiedSelection, setCopiedSelection] = useState(false);

  // Rango de capítulos en estudio en el lector
  const [studyChapterRange, setStudyChapterRange] = useState({
    book: currentPassage.book,
    start: Number(currentPassage.chapter) || 23,
    end: Number(currentPassage.chapter) || 23
  });

  // Estado del Modal Selector de Libros y Capítulos
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
  const [pickerStep, setPickerStep] = useState('book'); // 'book' | 'chapter' | 'verse'
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [selectedTestament, setSelectedTestament] = useState('all'); // 'all' | 'AT' | 'NT'
  const [selectedBookObj, setSelectedBookObj] = useState(CANONICAL_BOOKS[0]); // Génesis por defecto
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);
  const [modalChapterStart, setModalChapterStart] = useState(1);
  const [modalChapterEnd, setModalChapterEnd] = useState(1);
  const [modalVerseMode, setModalVerseMode] = useState('all'); // 'all' | 'range'
  const [modalVerseStart, setModalVerseStart] = useState(1);
  const [modalVerseEnd, setModalVerseEnd] = useState(31);

  const versesList = currentPassage.versions[primaryVersion] || currentPassage.versions["RVR1960"] || [];
  const secondaryVersesList = currentPassage.versions[secondaryVersion] || currentPassage.versions["NTV"] || [];
  const totalVerses = versesList.length;

  // Texto combinado de los versículos seleccionados
  const selectedVersesData = useMemo(() => {
    return versesList.filter(v => selectedVerseNumbers.includes(v.num));
  }, [versesList, selectedVerseNumbers]);

  const combinedSelectedText = useMemo(() => {
    return selectedVersesData.map(v => `${v.num}. ${v.text}`).join(' ');
  }, [selectedVersesData]);

  const verseRangeDisplay = useMemo(() => {
    if (selectedVerseNumbers.length === 0) return '1';
    if (selectedVerseNumbers.length === 1) return `${selectedVerseNumbers[0]}`;
    const sorted = [...selectedVerseNumbers].sort((a, b) => a - b);
    const isConsecutive = sorted.every((val, idx) => idx === 0 || val === sorted[idx - 1] + 1);
    if (isConsecutive) {
      return `${sorted[0]}-${sorted[sorted.length - 1]}`;
    }
    return sorted.join(', ');
  }, [selectedVerseNumbers]);

  // Manejador Inteligente con soporte para Clic Normal, Ctrl/Cmd + Clic (Toggle) y Shift + Clic (Rango Continuo)
  const handleVerseClick = (num, e = null) => {
    if (e && e.shiftKey && lastClickedVerse !== null) {
      const start = Math.min(lastClickedVerse, num);
      const end = Math.max(lastClickedVerse, num);
      const range = [];
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      setSelectedVerseNumbers(prev => {
        return Array.from(new Set([...prev, ...range])).sort((a, b) => a - b);
      });
    } else if (e && (e.ctrlKey || e.metaKey)) {
      // Toggle individual si mantiene presionado Ctrl/Cmd
      setSelectedVerseNumbers(prev => {
        if (prev.includes(num)) {
          const next = prev.filter(n => n !== num);
          return next.length === 0 ? [num] : next;
        } else {
          return [...prev, num].sort((a, b) => a - b);
        }
      });
    } else {
      // Clic normal: selecciona DIRECTAMENTE el versículo clickeado (sin arrastrar el anterior)
      setSelectedVerseNumbers([num]);
    }
    setLastClickedVerse(num);
  };

  const toggleVerseSelection = (num) => {
    handleVerseClick(num);
  };

  const handleApplyRange = () => {
    const start = Math.min(rangeStart, rangeEnd);
    const end = Math.max(rangeStart, rangeEnd);
    const rangeArr = [];
    for (let i = start; i <= end; i++) {
      if (i <= totalVerses) rangeArr.push(i);
    }
    if (rangeArr.length > 0) {
      setSelectedVerseNumbers(rangeArr);
    }
  };

  const handleSelectQuickRange = (start, end) => {
    const arr = [];
    for (let i = start; i <= end && i <= totalVerses; i++) {
      arr.push(i);
    }
    if (arr.length > 0) {
      setSelectedVerseNumbers(arr);
    }
  };

  const handleSelectAll = () => {
    const allNums = versesList.map(v => v.num);
    setSelectedVerseNumbers(allNums);
  };

  const handleClearSelection = () => {
    setSelectedVerseNumbers([1]);
  };

  const handleCopySelectedVerses = () => {
    const textToCopy = `${currentPassage.book} ${currentPassage.chapter}:${verseRangeDisplay} (${primaryVersion})\n${combinedSelectedText}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSelection(true);
    setTimeout(() => setCopiedSelection(false), 2000);
  };

  // Abrir Aparato Crítico 5D para los versículos seleccionados
  const handleOpen5DForSelection = (singleVerse = null) => {
    if (singleVerse) {
      setApparatusContext({
        book: currentPassage.book,
        chapter: currentPassage.chapter,
        verseNum: singleVerse.num,
        verseRange: `${singleVerse.num}`,
        text: `${singleVerse.num}. ${singleVerse.text}`,
        version: primaryVersion,
        verses: [singleVerse]
      });
    } else {
      setApparatusContext({
        book: currentPassage.book,
        chapter: currentPassage.chapter,
        verseNum: selectedVerseNumbers[0] || 1,
        verseRange: verseRangeDisplay,
        text: combinedSelectedText,
        version: primaryVersion,
        verses: selectedVersesData
      });
    }
    setIsApparatusOpen(true);
  };

  // Audiobiblia Narrada
  const handleStartAudiobible = (onlySelected = false) => {
    if (isAudioPlaying) {
      sacredAudio.stopSpeaking();
      setIsAudioPlaying(false);
      setActiveSpeakingVerse(null);
      return;
    }

    const targetVerses = onlySelected && selectedVersesData.length > 0 ? selectedVersesData : versesList;
    setIsAudioPlaying(true);

    sacredAudio.speakScripture(
      targetVerses,
      (verseNum) => {
        setActiveSpeakingVerse(verseNum);
      },
      () => {
        setIsAudioPlaying(false);
        setActiveSpeakingVerse(null);
      }
    );
  };

  // Cargar pasaje dinámicamente con soporte de versículos y rangos
  const handleSelectPassage = async (bookName, chapterNum, verseConfig = null) => {
    setIsLoadingPassage(true);
    sacredAudio.stopSpeaking();
    setIsAudioPlaying(false);
    setActiveSpeakingVerse(null);

    try {
      const data = await getPassageData({ book: bookName, chapter: chapterNum, preferredVersion: primaryVersion });
      setCurrentPassage(data);
      setSelectedPassageId(data.id);
      
      const vList = data.versions?.[primaryVersion] || data.versions?.["RVR1960"] || [];
      const totalV = vList.length;

      if (verseConfig) {
        if (verseConfig.verseMode === 'all') {
          setSelectedVerseNumbers(vList.map(v => v.num));
          setRangeStart(1);
          setRangeEnd(totalV || 1);
        } else {
          const vStart = Math.max(1, Math.min(Number(verseConfig.verseStart) || 1, totalV));
          const vEnd = Math.max(vStart, Math.min(Number(verseConfig.verseEnd) || totalV, totalV));
          const nums = [];
          for (let i = vStart; i <= vEnd; i++) nums.push(i);
          setSelectedVerseNumbers(nums.length > 0 ? nums : [1]);
          setRangeStart(vStart);
          setRangeEnd(vEnd);
        }
      } else {
        // Por defecto todos los versículos del capítulo están activos y seleccionados
        setSelectedVerseNumbers(vList.map(v => v.num));
        setRangeStart(1);
        setRangeEnd(totalV || 1);
      }
    } catch (e) {
      console.error("Error al cargar pasaje bíblico:", e);
    } finally {
      setIsLoadingPassage(false);
    }
  };

  // Navegación de capítulos anterior / siguiente respetando el rango en estudio
  const handleNavigateChapter = (direction) => {
    const currentChap = Number(currentPassage.chapter) || 1;
    let minChap = 1;
    let maxChap = selectedBookObj?.chapters || 150;
    
    if (studyChapterRange.book === currentPassage.book) {
      minChap = Math.min(studyChapterRange.start, studyChapterRange.end);
      maxChap = Math.max(studyChapterRange.start, studyChapterRange.end);
    }
    
    let newChap = currentChap;
    if (direction === 'next') {
      newChap = currentChap < maxChap ? currentChap + 1 : minChap;
    } else {
      newChap = currentChap > minChap ? currentChap - 1 : maxChap;
    }
    handleSelectPassage(currentPassage.book, newChap);
  };

  // Abrir Modal Selector sincronizado con el libro y rango actual
  const handleOpenBookPicker = () => {
    const matchedBook = CANONICAL_BOOKS.find(b => b.name.toLowerCase() === currentPassage.book.toLowerCase()) || CANONICAL_BOOKS[0];
    setSelectedBookObj(matchedBook);
    const currChap = Number(currentPassage.chapter) || 1;
    const isMatchingBook = studyChapterRange.book === matchedBook.name;
    const targetChap = isMatchingBook ? studyChapterRange.start : currChap;
    setModalChapterStart(targetChap);
    setModalChapterEnd(isMatchingBook ? studyChapterRange.end : currChap);
    
    const vCount = getChapterVerseCount(matchedBook.name, targetChap);
    setModalVerseMode('all');
    setModalVerseStart(1);
    setModalVerseEnd(vCount);
    setPickerStep('book');
    setIsBookPickerOpen(true);
  };

  // Seleccionar un libro en el modal y avanzar limpiamente al Paso 2 (Capítulos)
  const handleSelectBookInModal = (b) => {
    setSelectedBookObj(b);
    setModalChapterStart(1);
    setModalChapterEnd(1);
    const vCount = getChapterVerseCount(b.name, 1);
    setModalVerseMode('all');
    setModalVerseStart(1);
    setModalVerseEnd(vCount);
    setPickerStep('chapter');
  };

  // Interacción en cuadrícula de capítulos: fija con precisión el capítulo elegido y recalcula versículos
  const handleModalChapterClick = (chap) => {
    setModalChapterStart(chap);
    setModalChapterEnd(chap);
    const vCount = getChapterVerseCount(selectedBookObj.name, chap);
    setModalVerseMode('all');
    setModalVerseStart(1);
    setModalVerseEnd(vCount);
  };

  // Confirmar selección del modal con el botón "Aceptar y Cargar Selección"
  const handleConfirmModalSelection = async (overrideStart = null, overrideEnd = null, overrideVStart = null, overrideVEnd = null) => {
    setIsBookPickerOpen(false);
    const startChap = typeof overrideStart === 'number' ? overrideStart : Math.min(Number(modalChapterStart) || 1, Number(modalChapterEnd) || 1);
    const endChap = typeof overrideEnd === 'number' ? overrideEnd : Math.max(Number(modalChapterStart) || 1, Number(modalChapterEnd) || 1);

    const chapVerses = getChapterVerseCount(selectedBookObj.name, startChap);
    const vStart = typeof overrideVStart === 'number' ? overrideVStart : modalVerseStart;
    const vEnd = typeof overrideVEnd === 'number' ? overrideVEnd : (modalVerseMode === 'all' ? chapVerses : modalVerseEnd);
    const vMode = typeof overrideVStart === 'number' ? 'range' : modalVerseMode;

    setStudyChapterRange({
      book: selectedBookObj.name,
      start: startChap,
      end: endChap
    });

    await handleSelectPassage(selectedBookObj.name, startChap, {
      verseMode: vMode,
      verseStart: Math.min(vStart, vEnd),
      verseEnd: Math.max(vStart, vEnd)
    });
  };

  // Dividir versículos para modo 2 columnas equilibrado
  const halfCount = Math.ceil(versesList.length / 2);
  const leftColumnVerses = versesList.slice(0, halfCount);
  const rightColumnVerses = versesList.slice(halfCount);

  // Filtrar libros en el modal
  const filteredBooks = CANONICAL_BOOKS.filter(b => {
    const matchesTestament = selectedTestament === 'all' || b.testament === selectedTestament;
    const matchesSearch = b.name.toLowerCase().includes(bookSearchQuery.toLowerCase().trim());
    return matchesTestament && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '20px 20px 110px' }} className="animate-fade-in">
      
      {/* 1. BARRA SUPERIOR SOBRIA: NAVEGACIÓN + VERSIÓN + AUDIO */}
      <div className="sacred-panel" style={{
        padding: '12px 18px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Selector de Libro y Capítulo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => handleNavigateChapter('prev')}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.2)',
              color: 'var(--gold-300)',
              padding: '7px 9px',
              borderRadius: '7px',
              cursor: 'pointer'
            }}
            title="Capítulo Anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleOpenBookPicker}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: '7px',
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid var(--gold-400)',
              color: '#ffffff',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Cambiar libro o capítulo"
          >
            <BookOpen size={16} color="var(--gold-400)" />
            <span style={{ fontSize: '1.02rem' }}>{currentPassage.book} {currentPassage.chapter}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--gold-300)' }}>▾</span>
          </button>

          <button
            onClick={() => handleNavigateChapter('next')}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(212,175,55,0.2)',
              color: 'var(--gold-300)',
              padding: '7px 9px',
              borderRadius: '7px',
              cursor: 'pointer'
            }}
            title="Capítulo Siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Versión + Audio + Comparar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Píldoras de Versión */}
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(255,255,255,0.03)', padding: '3px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {BIBLE_VERSIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => setPrimaryVersion(v.id)}
                style={{
                  padding: '4px 9px',
                  borderRadius: '5px',
                  fontSize: '0.75rem',
                  fontWeight: primaryVersion === v.id ? '700' : '500',
                  background: primaryVersion === v.id ? 'var(--gold-gradient)' : 'transparent',
                  color: primaryVersion === v.id ? '#07080c' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {v.id}
              </button>
            ))}
          </div>

          {/* Audio del Capítulo */}
          <button
            onClick={() => handleStartAudiobible(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 13px',
              borderRadius: '7px',
              background: isAudioPlaying ? 'rgba(239,68,68,0.2)' : 'rgba(212,175,55,0.1)',
              border: isAudioPlaying ? '1px solid #ef4444' : '1px solid rgba(212,175,55,0.3)',
              color: isAudioPlaying ? '#ef4444' : 'var(--gold-300)',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isAudioPlaying ? <Square size={13} /> : <Volume2 size={14} />}
            <span>{isAudioPlaying ? "Detener" : "Escuchar"}</span>
          </button>

          {/* Modo Paralelo */}
          <button
            onClick={() => setIsParallelMode(!isParallelMode)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '7px',
              background: isParallelMode ? 'rgba(212,175,55,0.2)' : 'transparent',
              border: `1px solid ${isParallelMode ? 'var(--gold-400)' : 'rgba(255,255,255,0.1)'}`,
              color: isParallelMode ? 'var(--gold-200)' : 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
            title="Comparar dos versiones"
          >
            <Columns size={13} />
            <span>{isParallelMode ? "Paralelo" : "Comparar"}</span>
          </button>

          {/* Botón Acceso Rápido Estudio 5D */}
          <button
            onClick={() => handleOpen5DForSelection()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.1) 100%)',
              border: '1.5px solid var(--gold-400)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(212,175,55,0.2)'
            }}
            title="Abrir Biblia de Estudio 5D, comentarios y notas exegéticas"
          >
            <ScrollText size={14} color="var(--gold-400)" />
            <span>Estudio 5D</span>
          </button>
        </div>
      </div>

      {/* 2. ENCABEZADO SERENO DEL PASAJE */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 className="font-cinzel gold-text-gradient" style={{ fontSize: '2.3rem', fontWeight: '800', margin: '0 0 6px' }}>
          {currentPassage.book} {currentPassage.chapter}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
          {currentPassage.title ? `${currentPassage.title} • ` : ''}{primaryVersion}
        </p>
      </div>

      {/* 3. LECTURA BÍBLICA LIMPIA E INMERSIVA */}
      {isParallelMode ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
          {/* Columna Versión 1 */}
          <div className="sacred-panel" style={{ padding: '28px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--gold-300)', marginBottom: '18px', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '8px' }}>
              {primaryVersion}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {versesList.map((verse) => {
                const isSelected = selectedVerseNumbers.includes(verse.num);
                const isSpeaking = activeSpeakingVerse === verse.num;
                return (
                  <div
                    key={verse.num}
                    onClick={(e) => handleVerseClick(verse.num, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '12px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isSpeaking ? 'rgba(212,175,55,0.22)' : isSelected ? 'rgba(212,175,55,0.12)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--gold-400)' : '3px solid transparent'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: isSelected ? 'var(--gold-300)' : 'var(--gold-500)', minWidth: '20px', userSelect: 'none' }}>
                      {verse.num}
                    </span>
                    <p className="font-scripture" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#f1f5f9', margin: 0, flex: 1 }}>
                      {verse.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Versión 2 */}
          <div className="sacred-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--gold-300)' }}>{secondaryVersion}</span>
              <select
                value={secondaryVersion}
                onChange={(e) => setSecondaryVersion(e.target.value)}
                style={{ background: '#0e121a', color: 'var(--gold-200)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.74rem' }}
              >
                {BIBLE_VERSIONS.filter(v => v.id !== primaryVersion).map(v => (
                  <option key={v.id} value={v.id}>{v.id}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {secondaryVersesList.map((verse) => (
                <div key={verse.num} style={{ display: 'flex', gap: '12px', padding: '8px 12px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--gold-500)', minWidth: '20px' }}>
                    {verse.num}
                  </span>
                  <p className="font-scripture" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#f1f5f9', margin: 0 }}>
                    {verse.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LECTURA A UNA SOLA COLUMNA NOBLE Y DESPEJADA */
        <div className="sacred-panel" style={{ padding: '36px 42px', maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {versesList.map((verse) => {
              const isSelected = selectedVerseNumbers.includes(verse.num);
              const isSpeaking = activeSpeakingVerse === verse.num;
              return (
                <div
                  key={verse.num}
                  onClick={(e) => handleVerseClick(verse.num, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '14px',
                    padding: '8px 14px',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    background: isSpeaking ? 'rgba(212,175,55,0.22)' : isSelected ? 'rgba(212,175,55,0.1)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--gold-400)' : '3px solid transparent',
                    transition: 'background 0.15s, border-left 0.15s'
                  }}
                >
                  <span style={{
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    color: isSelected ? 'var(--gold-300)' : 'var(--gold-500)',
                    minWidth: '22px',
                    userSelect: 'none'
                  }}>
                    {verse.num}
                  </span>
                  <p className="font-scripture" style={{
                    fontSize: '1.38rem',
                    lineHeight: '1.85',
                    color: isSelected ? '#ffffff' : '#f1f5f9',
                    margin: 0,
                    flex: 1
                  }}>
                    {verse.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. BARRA FLOTANTE BAJO DEMANDA (ACCESO INMEDIATO SIN SCROLL) */}
      {selectedVerseNumbers.length > 0 && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: '76px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(9, 12, 18, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--gold-400)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.9), 0 0 25px rgba(212,175,55,0.35)',
          borderRadius: '9999px',
          padding: '8px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '94vw'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ffd700', paddingRight: '10px', borderRight: '1px solid rgba(212,175,55,0.3)', whiteSpace: 'nowrap' }}>
            v. {verseRangeDisplay}
          </span>

          <button
            onClick={() => handleStartAudiobible(true)}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.76rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Volume2 size={13} color="var(--gold-400)" />
            <span>Escuchar</span>
          </button>

          <button
            onClick={handleCopySelectedVerses}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.76rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            {copiedSelection ? <Check size={13} color="#4ade80" /> : <Copy size={13} color="var(--gold-400)" />}
            <span>{copiedSelection ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={() => onConsultAI?.({
              passage: {
                title: `${currentPassage.book} ${currentPassage.chapter}:${verseRangeDisplay}`,
                book: currentPassage.book,
                chapter: currentPassage.chapter,
                verse: verseRangeDisplay
              },
              mood: 'Exégesis & Consejería'
            })}
            style={{ background: 'transparent', border: 'none', color: '#e2e8f0', fontSize: '0.76rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Sparkles size={13} color="var(--gold-400)" />
            <span>Ruaj</span>
          </button>

          <button
            onClick={() => handleOpen5DForSelection()}
            style={{
              background: 'rgba(212,175,55,0.2)',
              border: '1px solid var(--gold-400)',
              borderRadius: '9999px',
              color: 'var(--gold-200)',
              fontSize: '0.76rem',
              fontWeight: '700',
              padding: '4px 11px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ScrollText size={13} />
            <span>Estudio 5D</span>
          </button>

          <button
            onClick={() => setSelectedVerseNumbers([])}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
            title="Deseleccionar"
          >
            <X size={14} />
          </button>
        </div>
      )}


      {/* =========================================================================
          5. MODAL SELECTOR DE LIBROS Y CAPÍTULOS DE TODA LA BIBLIA
         ========================================================================= */}
      {isBookPickerOpen && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          background: 'rgba(3, 4, 7, 0.88)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '860px',
            maxHeight: '90vh',
            background: 'linear-gradient(180deg, #0e121b 0%, #07090e 100%)',
            border: '1.5px solid rgba(212,175,55,0.3)',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.95), 0 0 35px rgba(212,175,55,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Cabecera del Selector con Pasos */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(212,175,55,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={20} color="var(--gold-400)" />
                  <span className="font-cinzel gold-text-gradient" style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                    Explorador Bíblico Canónico
                  </span>
                </div>

                {/* Tabs de Pasos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setPickerStep('book')}
                    style={{
                      background: pickerStep === 'book' ? 'rgba(212,175,55,0.2)' : 'transparent',
                      border: pickerStep === 'book' ? '1px solid var(--gold-400)' : '1px solid transparent',
                      color: pickerStep === 'book' ? '#ffd700' : 'var(--text-muted)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    1. Libro: {selectedBookObj.name}
                  </button>

                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>›</span>

                  <button
                    onClick={() => setPickerStep('chapter')}
                    style={{
                      background: pickerStep === 'chapter' ? 'rgba(212,175,55,0.2)' : 'transparent',
                      border: pickerStep === 'chapter' ? '1px solid var(--gold-400)' : '1px solid transparent',
                      color: pickerStep === 'chapter' ? '#ffd700' : 'var(--text-muted)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    2. Cap: {modalChapterStart}
                  </button>

                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>›</span>

                  <button
                    onClick={() => setPickerStep('verse')}
                    style={{
                      background: pickerStep === 'verse' ? 'rgba(212,175,55,0.2)' : 'transparent',
                      border: pickerStep === 'verse' ? '1px solid var(--gold-400)' : '1px solid transparent',
                      color: pickerStep === 'verse' ? '#ffd700' : 'var(--text-muted)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    3. Versículos {modalVerseMode === 'range' ? '(' + modalVerseStart + '-' + modalVerseEnd + ')' : '(Todos)'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsBookPickerOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* CUERPO DEL SELECTOR SEGÚN PASO */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* PASO 1: SELECCIONAR LIBRO */}
              {pickerStep === 'book' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Barra de Filtros y Búsqueda */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-400)' }} />
                      <input
                        type="text"
                        placeholder="Buscar libro (ej. Génesis, Mateo, Salmos)..."
                        value={bookSearchQuery}
                        onChange={(e) => setBookSearchQuery(e.target.value)}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '10px 14px 10px 38px',
                          background: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                      {bookSearchQuery && (
                        <button
                          onClick={() => setBookSearchQuery('')}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Filtros AT / NT */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { id: 'all', label: 'Todos (66)' },
                        { id: 'AT', label: 'Antiguo T. (39)' },
                        { id: 'NT', label: 'Nuevo T. (27)' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTestament(t.id)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: selectedTestament === t.id ? 'var(--gold-400)' : 'rgba(255,255,255,0.04)',
                            color: selectedTestament === t.id ? '#05070a' : 'var(--text-muted)',
                            border: selectedTestament === t.id ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.08)',
                            fontWeight: selectedTestament === t.id ? '800' : '500',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cuadrícula limpia de Libros */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '10px',
                    maxHeight: '52vh',
                    overflowY: 'auto',
                    paddingRight: '6px'
                  }}>
                    {filteredBooks.map((b) => {
                      const isSelected = selectedBookObj.name === b.name;
                      return (
                        <button
                          key={b.name}
                          onClick={() => handleSelectBookInModal(b)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            background: isSelected
                              ? 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.08) 100%)'
                              : 'rgba(255,255,255,0.03)',
                            border: isSelected
                              ? '1.5px solid var(--gold-400)'
                              : '1px solid rgba(255,255,255,0.06)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{
                              fontWeight: isSelected ? '800' : '600',
                              color: isSelected ? '#ffd700' : '#ffffff',
                              fontSize: '0.92rem'
                            }}>
                              {b.name}
                            </span>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: b.testament === 'AT' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                              color: b.testament === 'AT' ? '#7dd3fc' : '#d8b4fe',
                              fontWeight: '700'
                            }}>
                              {b.testament}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {b.chapters} {b.chapters === 1 ? 'capítulo' : 'capítulos'} • {b.category || 'Canónico'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 2: SELECCIONAR CAPÍTULO */}
              {pickerStep === 'chapter' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Subcabecera informativa del libro seleccionado */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.25)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffd700' }}>
                          {selectedBookObj.name}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ({selectedBookObj.chapters} capítulos disponibles)
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Seleccione un número para fijar el capítulo. Doble clic para abrir al instante.
                      </span>
                    </div>

                    <button
                      onClick={() => setPickerStep('book')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      ← Cambiar Libro
                    </button>
                  </div>

                  {/* Cuadrícula de Números de Capítulos */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
                    gap: '10px',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    padding: '6px 4px'
                  }}>
                    {Array.from({ length: selectedBookObj.chapters }, (_, i) => i + 1).map((chap) => {
                      const isSelected = modalChapterStart === chap;
                      return (
                        <button
                          key={chap}
                          onClick={() => handleModalChapterClick(chap)}
                          onDoubleClick={() => handleConfirmModalSelection(chap, chap)}
                          style={{
                            height: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            background: isSelected
                              ? 'linear-gradient(135deg, var(--gold-400) 0%, #b8860b 100%)'
                              : 'rgba(255,255,255,0.04)',
                            border: isSelected
                              ? '1.5px solid #ffd700'
                              : '1px solid rgba(255,255,255,0.08)',
                            color: isSelected ? '#05070a' : '#ffffff',
                            fontWeight: isSelected ? '900' : '600',
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            boxShadow: isSelected ? '0 0 16px rgba(212,175,55,0.4)' : 'none',
                            transition: 'all 0.12s ease'
                          }}
                          title={'Capítulo ' + chap + ' (Doble clic para cargar inmediatamente)'}
                        >
                          {chap}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 3: SELECCIONAR VERSÍCULOS (OPCIONAL) */}
              {pickerStep === 'verse' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    background: 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.25)'
                  }}>
                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffd700' }}>
                        {selectedBookObj.name} {modalChapterStart}
                      </span>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Este capítulo cuenta con {getChapterVerseCount(selectedBookObj.name, modalChapterStart)} versículos
                      </p>
                    </div>

                    <button
                      onClick={() => setPickerStep('chapter')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      ← Volver a Capítulos
                    </button>
                  </div>

                  {/* Opciones de Versículos */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button
                      onClick={() => {
                        setModalVerseMode('all');
                        setModalVerseStart(1);
                        setModalVerseEnd(getChapterVerseCount(selectedBookObj.name, modalChapterStart));
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: modalVerseMode === 'all' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)',
                        border: modalVerseMode === 'all' ? '1.5px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.08)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: modalVerseMode === 'all' ? '#ffd700' : '#fff', marginBottom: '6px', fontSize: '0.95rem' }}>
                        ✓ Todo el Capítulo
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Leer desde el versículo 1 hasta el {getChapterVerseCount(selectedBookObj.name, modalChapterStart)}
                      </div>
                    </button>

                    <button
                      onClick={() => setModalVerseMode('range')}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        background: modalVerseMode === 'range' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)',
                        border: modalVerseMode === 'range' ? '1.5px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.08)',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '800', color: modalVerseMode === 'range' ? '#ffd700' : '#fff', marginBottom: '6px', fontSize: '0.95rem' }}>
                        Seleccionar Rango Específico
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Definir versículo inicial y versículo final
                      </div>
                    </button>
                  </div>

                  {modalVerseMode === 'range' && (
                    <div style={{
                      padding: '16px 20px',
                      borderRadius: '10px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px'
                    }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Desde el versículo:</label>
                        <input
                          type="number"
                          min="1"
                          max={getChapterVerseCount(selectedBookObj.name, modalChapterStart)}
                          value={modalVerseStart}
                          onChange={(e) => setModalVerseStart(Math.max(1, Math.min(Number(e.target.value) || 1, getChapterVerseCount(selectedBookObj.name, modalChapterStart))))}
                          style={{
                            padding: '8px 12px',
                            background: '#0d1117',
                            border: '1px solid rgba(212,175,55,0.3)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hasta el versículo:</label>
                        <input
                          type="number"
                          min="1"
                          max={getChapterVerseCount(selectedBookObj.name, modalChapterStart)}
                          value={modalVerseEnd}
                          onChange={(e) => setModalVerseEnd(Math.max(1, Math.min(Number(e.target.value) || 1, getChapterVerseCount(selectedBookObj.name, modalChapterStart))))}
                          style={{
                            padding: '8px 12px',
                            background: '#0d1117',
                            border: '1px solid rgba(212,175,55,0.3)',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Pie de Página del Modal */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid rgba(212,175,55,0.2)',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selección activa:</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#ffd700' }}>
                  {selectedBookObj.name} {modalChapterStart}
                  {modalVerseMode === 'range' ? ':' + modalVerseStart + '-' + modalVerseEnd : ''}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setIsBookPickerOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--text-muted)',
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>

                {pickerStep === 'book' ? (
                  <button
                    onClick={() => setPickerStep('chapter')}
                    className="btn-gold font-cinzel"
                    style={{
                      padding: '8px 20px',
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>Elegir Capítulos de {selectedBookObj.name} →</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleConfirmModalSelection()}
                    className="btn-gold font-cinzel"
                    style={{
                      padding: '8px 22px',
                      fontSize: '0.92rem',
                      fontWeight: '800',
                      borderRadius: '8px',
                      boxShadow: '0 0 20px rgba(212,175,55,0.3)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Check size={18} />
                    <span>Cargar {selectedBookObj.name} {modalChapterStart}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Drawer del Aparato Crítico Pentadimensional */}
      {isApparatusOpen && apparatusContext && (
        <TheologicalApparatusDrawer
          isOpen={isApparatusOpen}
          onClose={() => setIsApparatusOpen(false)}
          verseContext={apparatusContext}
          onConsultAI={onConsultAI}
        />
      )}

    </div>
  );
}
