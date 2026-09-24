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
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [selectedTestament, setSelectedTestament] = useState('all'); // 'all' | 'AT' | 'NT'
  const [selectedBookObj, setSelectedBookObj] = useState(CANONICAL_BOOKS[18]); // Salmos por defecto
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);
  const [modalChapterStart, setModalChapterStart] = useState(23);
  const [modalChapterEnd, setModalChapterEnd] = useState(23);
  const [modalVerseMode, setModalVerseMode] = useState('all'); // 'all' | 'range'
  const [modalVerseStart, setModalVerseStart] = useState(1);
  const [modalVerseEnd, setModalVerseEnd] = useState(6);

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
    const matchedBook = CANONICAL_BOOKS.find(b => b.name.toLowerCase() === currentPassage.book.toLowerCase()) || CANONICAL_BOOKS[18];
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
    setIsBookPickerOpen(true);
  };

  // Seleccionar un libro en el modal
  const handleSelectBookInModal = (b) => {
    setSelectedBookObj(b);
    setModalChapterStart(1);
    setModalChapterEnd(1);
    const vCount = getChapterVerseCount(b.name, 1);
    setModalVerseMode('all');
    setModalVerseStart(1);
    setModalVerseEnd(vCount);
  };

  // Interacción en cuadrícula de capítulos del modal: Clic normal selecciona el capítulo exacto; Shift+Clic expande rango
  const handleModalChapterClick = (chap, isShift = false) => {
    if (isShift) {
      const start = Math.min(modalChapterStart, chap);
      const end = Math.max(modalChapterStart, chap);
      setModalChapterStart(start);
      setModalChapterEnd(end);
    } else {
      // Clic normal: fija con precisión el capítulo elegido y recalcula versículos
      setModalChapterStart(chap);
      setModalChapterEnd(chap);
      const vCount = getChapterVerseCount(selectedBookObj.name, chap);
      setModalVerseMode('all');
      setModalVerseStart(1);
      setModalVerseEnd(vCount);
    }
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
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 28px 90px' }} className="animate-fade-in">
      
      {/* =========================================================================
          1. BARRA SUPERIOR: SELECTOR CANÓNICO + VERSIONES + AUDIO
         ========================================================================= */}
      <div className="sacred-panel" style={{ padding: '16px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Selector de Cita Bíblica (Botón principal interactivo) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => handleNavigateChapter('prev')}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: 'var(--gold-300)',
                padding: '8px 10px',
                borderRadius: '8px',
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
                gap: '10px',
                padding: '8px 20px',
                borderRadius: '8px',
                background: 'rgba(212,175,55,0.18)',
                border: '1.5px solid var(--gold-400)',
                color: '#ffffff',
                fontSize: '1.1rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 0 18px rgba(212,175,55,0.25)',
                transition: 'all 0.2s'
              }}
              title="Cambiar libro, capítulo o rango de versículos"
            >
              <BookOpen size={17} color="var(--gold-400)" />
              <span>
                {currentPassage.book} {currentPassage.chapter}
                {studyChapterRange.book === currentPassage.book && studyChapterRange.start !== studyChapterRange.end && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold-300)', marginLeft: '6px' }}>
                    (Rango {studyChapterRange.start}-{studyChapterRange.end})
                  </span>
                )}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.3)' }}>
                Cambiar Cita ▾
              </span>
            </button>

            <button
              onClick={() => handleNavigateChapter('next')}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: 'var(--gold-300)',
                padding: '8px 10px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              title="Capítulo Siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Accesos Rápidos a Capítulos Emblemáticos */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {BIBLES_DATA.map((p) => {
              const isSelected = p.id === currentPassage.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentPassage(p);
                    setSelectedPassageId(p.id);
                    setSelectedVerseNumbers([1]);
                  }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? '700' : '500',
                    background: isSelected ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.03)',
                    color: isSelected ? '#07080c' : 'var(--text-muted)',
                    border: isSelected ? 'none' : '1px solid rgba(212,175,55,0.18)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {p.book} {p.chapter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Herramientas de Estudio: Versiones + Modos + Audio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Selector de Versión Primaria */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {BIBLE_VERSIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => setPrimaryVersion(v.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: primaryVersion === v.id ? '700' : '500',
                  border: primaryVersion === v.id ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.08)',
                  background: primaryVersion === v.id ? 'rgba(212,175,55,0.22)' : 'transparent',
                  color: primaryVersion === v.id ? 'var(--gold-200)' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {v.id}
              </button>
            ))}
          </div>

          {/* Toggle Modo Paralelo */}
          <button
            onClick={() => setIsParallelMode(!isParallelMode)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: isParallelMode ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isParallelMode ? 'var(--gold-400)' : 'rgba(255,255,255,0.1)'}`,
              color: isParallelMode ? 'var(--gold-200)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <Columns size={14} />
            <span>{isParallelMode ? "2 Versiones Activas" : "Comparar Versiones"}</span>
          </button>

          {/* Selector de Layout */}
          {!isParallelMode && (
            <button
              onClick={() => setLayoutMode(layoutMode === 'two_columns' ? 'wide' : 'two_columns')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Sliders size={14} />
              <span>{layoutMode === 'two_columns' ? "2 Columnas" : "Lectura Amplia"}</span>
            </button>
          )}

          {/* Audiobiblia Narrada */}
          <button
            onClick={() => handleStartAudiobible(false)}
            className="btn-gold"
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {isAudioPlaying ? <Square size={14} /> : <Play size={14} />}
            <span>{isAudioPlaying ? "Detener" : "Audiobiblia"}</span>
          </button>

          {/* Gabinete 5D (Restaurado en la barra superior junto a Audiobiblia) */}
          <button
            onClick={() => handleOpen5DForSelection()}
            className="gold-btn-gradient"
            style={{ 
              fontSize: '0.82rem', 
              padding: '6px 16px',
              borderRadius: '8px',
              fontWeight: '800',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
            title={`Abrir Gabinete 5D para ${currentPassage.book} ${currentPassage.chapter}:${verseRangeDisplay}`}
          >
            <ScrollText size={15} />
            <span>Gabinete 5D ({currentPassage.book} {currentPassage.chapter}:{verseRangeDisplay})</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          1.1 BARRA DE NAVEGACIÓN DE RANGO DE CAPÍTULOS (SI HAY RANGO ACTIVO)
         ========================================================================= */}
      {studyChapterRange.book === currentPassage.book && studyChapterRange.start !== studyChapterRange.end && (
        <div style={{
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.25)',
          borderRadius: '12px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📖 Rango en Estudio:
            </span>
            <span className="font-cinzel" style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: '700' }}>
              {studyChapterRange.book} {Math.min(studyChapterRange.start, studyChapterRange.end)} al {Math.max(studyChapterRange.start, studyChapterRange.end)}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(212,175,55,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
              {Math.abs(studyChapterRange.end - studyChapterRange.start) + 1} capítulos
            </span>
          </div>

          {/* Píldoras de Capítulos para saltar instantáneamente */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
            {Array.from(
              { length: Math.abs(studyChapterRange.end - studyChapterRange.start) + 1 },
              (_, i) => Math.min(studyChapterRange.start, studyChapterRange.end) + i
            ).map(chap => {
              const isActive = Number(currentPassage.chapter) === chap;
              return (
                <button
                  key={chap}
                  onClick={() => handleSelectPassage(studyChapterRange.book, chap)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? '800' : '600',
                    background: isActive ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#07080c' : 'var(--gold-200)',
                    border: isActive ? '1px solid #ffd700' : '1px solid rgba(212,175,55,0.2)',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 0 12px rgba(212,175,55,0.5)' : 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  }}
                >
                  Cap. {chap}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Indicador de Carga Sagrada */}
      {isLoadingPassage && (
        <div style={{
          padding: '14px 20px',
          marginBottom: '20px',
          borderRadius: '10px',
          background: 'rgba(212,175,55,0.12)',
          border: '1px solid var(--gold-400)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--gold-200)'
        }}>
          <Sparkles className="animate-spin" size={18} color="var(--gold-400)" />
          <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>
            Cargando texto bíblico canónico de las Sagradas Escrituras...
          </span>
        </div>
      )}

      {/* =========================================================================
          2. ENCABEZADO CANÓNICO, ESTADO DE ESTUDIO Y TÉRMINOS ORIGINALES
         ========================================================================= */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="sacred-badge">{currentPassage.book} {currentPassage.chapter}:{currentPassage.versesRange}</span>
            <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>Tema: {currentPassage.theme}</span>
          </div>

          {/* Indicador de Rango de Estudio Activo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.78rem',
              color: 'var(--gold-200)',
              background: 'rgba(212,175,55,0.1)',
              border: '1px solid rgba(212,175,55,0.25)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontWeight: '700'
            }}>
              ✦ Versículo(s) en estudio: v. {verseRangeDisplay} ({selectedVerseNumbers.length} de {totalVerses})
            </span>
            <button
              onClick={handleSelectAll}
              style={{
                padding: '3px 9px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
              title="Seleccionar todos los versículos del capítulo"
            >
              Todo el capítulo
            </button>
            <button
              onClick={handleClearSelection}
              style={{
                padding: '3px 9px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                fontSize: '0.74rem',
                cursor: 'pointer'
              }}
              title="Restablecer selección a solo el primer versículo"
            >
              Solo v.1
            </button>
            <button
              onClick={handleCopySelectedVerses}
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: copiedSelection ? '#4ade80' : 'var(--gold-300)',
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Copiar texto de los versículos seleccionados"
            >
              {copiedSelection ? <Check size={12} /> : <Copy size={12} />}
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
                mood: 'Investigación Académica & Crítica Textual'
              })}
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: 'var(--gold-200)',
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Consultar con Ruaj IA sobre este versículo o rango"
            >
              <Sparkles size={12} />
              <span>Consultar Ruaj</span>
            </button>
          </div>
        </div>

        <h2 className="font-cinzel gold-text-gradient" style={{ fontSize: '2.4rem', fontWeight: '800', margin: '4px 0' }}>
          {currentPassage.title}
        </h2>
        <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '1050px', lineHeight: 1.6 }}>
          <strong>Contexto Histórico:</strong> {currentPassage.background}
        </p>
      </div>

      {/* Términos Originales & Enlace al Léxico */}
      {currentPassage.originalWords && currentPassage.originalWords.length > 0 && (
        <div className="sacred-panel" style={{ padding: '16px 20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gold-400)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Términos Clave en Hebreo/Griego (Diccionario Strong):
            </span>
            <button
              onClick={() => onOpenDictionary?.()}
              style={{ background: 'transparent', border: 'none', color: 'var(--gold-300)', fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <BookMarked size={13} />
              <span>Abrir Diccionario Bíblico Completo ↗</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {currentPassage.originalWords.map((wordObj, wIdx) => (
              <button
                key={wIdx}
                onClick={() => setSelectedWordDetail(selectedWordDetail?.word === wordObj.word ? null : wordObj)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  border: selectedWordDetail?.word === wordObj.word ? '1px solid var(--gold-400)' : '1px solid rgba(212,175,55,0.22)',
                  background: selectedWordDetail?.word === wordObj.word ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.02)',
                  color: 'var(--gold-200)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontWeight: '700' }}>{wordObj.word}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>({wordObj.language} • {wordObj.strong})</span>
              </button>
            ))}
          </div>

          {selectedWordDetail && (
            <div className="animate-fade-in" style={{ marginTop: '14px', padding: '16px', borderRadius: '8px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div style={{ fontWeight: '700', color: 'var(--gold-200)', fontSize: '0.96rem', marginBottom: '4px' }}>
                {selectedWordDetail.word} ({selectedWordDetail.strong}) — {selectedWordDetail.meaning}
              </div>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                {selectedWordDetail.note}
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          4. VISUALIZACIÓN ESPACIOSA DEL TEXTO BÍBLICO (CON CASILLAS DE SELECCIÓN)
         ========================================================================= */}
      
      {/* CASO A: MODO PARALELO (2 VERSIONES CARA A CARA) */}
      {isParallelMode ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '28px' }}>
          
          {/* Columna Versión 1 */}
          <div className="sacred-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-gold-subtle)', paddingBottom: '12px' }}>
              <span className="font-cinzel" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--gold-200)' }}>
                {primaryVersion}
              </span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Versión Primaria</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {versesList.map((verse) => {
                const isSelected = selectedVerseNumbers.includes(verse.num);
                const isSpeakingThis = activeSpeakingVerse === verse.num;
                return (
                  <div
                    key={verse.num}
                    onClick={(e) => handleVerseClick(verse.num, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSpeakingThis ? 'rgba(212,175,55,0.24)' : isSelected ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.015)',
                      borderLeft: isSelected ? '4px solid var(--gold-400)' : '4px solid transparent',
                      border: isSelected ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: isSelected ? '0 0 14px rgba(212,175,55,0.15)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ color: isSelected ? 'var(--gold-400)' : '#64748b', display: 'flex', alignItems: 'center', paddingTop: '3px' }}>
                      {isSelected ? <CheckSquare size={16} /> : <EmptySquare size={16} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--gold-400)', minWidth: '22px' }}>
                        {verse.num}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.64rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', padding: '1px 5px', borderRadius: '3px', fontWeight: '700' }}>
                          ✓ Sel
                        </span>
                      )}
                    </div>
                    <p className="font-scripture" style={{ fontSize: '1.35rem', lineHeight: '1.8', color: '#f0f3fa', margin: 0, flex: 1 }}>
                      {verse.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Versión 2 */}
          <div className="sacred-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-gold-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-cinzel" style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--gold-200)' }}>
                  {secondaryVersion}
                </span>
                <select
                  value={secondaryVersion}
                  onChange={(e) => setSecondaryVersion(e.target.value)}
                  style={{ background: '#0e121a', color: 'var(--gold-200)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.78rem' }}
                >
                  {BIBLE_VERSIONS.filter(v => v.id !== primaryVersion).map(v => (
                    <option key={v.id} value={v.id}>{v.id}</option>
                  ))}
                </select>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Versión Comparativa</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {secondaryVersesList.map((verse) => (
                <div key={verse.num} style={{ display: 'flex', gap: '14px', padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--gold-500)', minWidth: '24px', paddingTop: '3px' }}>
                    {verse.num}
                  </span>
                  <p className="font-scripture" style={{ fontSize: '1.35rem', lineHeight: '1.8', color: '#f0f3fa', margin: 0 }}>
                    {verse.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : layoutMode === 'two_columns' ? (
        
        /* CASO B: MODO ATRIL DE DOS COLUMNAS EQUILIBRADAS (AMPLIO, ESPACIOSO) */
        <div className="sacred-panel" style={{ padding: '36px 44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid var(--border-gold-subtle)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <span className="font-cinzel" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--gold-200)' }}>
              {currentPassage.book} {currentPassage.chapter} — {primaryVersion} ({BIBLE_VERSIONS.find(v => v.id === primaryVersion)?.name})
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)', background: 'rgba(212,175,55,0.08)', padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.22)' }}>
              Lectura Imperial en Dos Columnas (Haz clic para seleccionar; Shift+Clic para rango)
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Columna Izquierda */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {leftColumnVerses.map((verse) => {
                const isSelected = selectedVerseNumbers.includes(verse.num);
                const isSpeakingThis = activeSpeakingVerse === verse.num;
                return (
                  <div
                    key={verse.num}
                    onClick={(e) => handleVerseClick(verse.num, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '14px',
                      padding: '12px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSpeakingThis ? 'rgba(212,175,55,0.24)' : isSelected ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.015)',
                      borderLeft: isSelected ? '4px solid var(--gold-400)' : '4px solid transparent',
                      border: isSelected ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: isSelected ? '0 0 14px rgba(212,175,55,0.15)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ color: isSelected ? 'var(--gold-400)' : '#64748b', display: 'flex', alignItems: 'center', paddingTop: '3px' }}>
                      {isSelected ? <CheckSquare size={16} /> : <EmptySquare size={16} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--gold-400)', minWidth: '24px' }}>
                        {verse.num}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.64rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.3)', padding: '1px 5px', borderRadius: '3px', fontWeight: '700' }}>
                          ✓ Sel
                        </span>
                      )}
                    </div>
                    <p className="font-scripture" style={{ fontSize: '1.4rem', lineHeight: '1.85', color: '#f8fafc', margin: 0, flex: 1 }}>
                      {verse.text}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen5DForSelection(verse);
                      }}
                      style={{
                        background: 'rgba(212,175,55,0.08)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        color: 'var(--gold-300)',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                      title={`Abrir 5D solo para el versículo ${verse.num}`}
                    >
                      5D v.{verse.num}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Columna Derecha */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {rightColumnVerses.map((verse) => {
                const isSelected = selectedVerseNumbers.includes(verse.num);
                const isSpeakingThis = activeSpeakingVerse === verse.num;
                return (
                  <div
                    key={verse.num}
                    onClick={(e) => handleVerseClick(verse.num, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '14px',
                      padding: '12px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSpeakingThis ? 'rgba(212,175,55,0.24)' : isSelected ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.015)',
                      borderLeft: isSelected ? '4px solid var(--gold-400)' : '4px solid transparent',
                      border: isSelected ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: isSelected ? '0 0 14px rgba(212,175,55,0.15)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ color: isSelected ? 'var(--gold-400)' : '#64748b', display: 'flex', alignItems: 'center', paddingTop: '3px' }}>
                      {isSelected ? <CheckSquare size={16} /> : <EmptySquare size={16} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: '800', color: 'var(--gold-400)', minWidth: '24px' }}>
                        {verse.num}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.64rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.3)', padding: '1px 5px', borderRadius: '3px', fontWeight: '700' }}>
                          ✓ Sel
                        </span>
                      )}
                    </div>
                    <p className="font-scripture" style={{ fontSize: '1.4rem', lineHeight: '1.85', color: '#f8fafc', margin: 0, flex: 1 }}>
                      {verse.text}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen5DForSelection(verse);
                      }}
                      style={{
                        background: 'rgba(212,175,55,0.08)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        color: 'var(--gold-300)',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                      title={`Abrir 5D solo para el versículo ${verse.num}`}
                    >
                      5D v.{verse.num}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        
        /* CASO C: MODO COLUMNA AMPLIA UNIFICADA CON MÁRGENES GENEROSOS */
        <div className="sacred-panel" style={{ padding: '40px 60px', maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {versesList.map((verse) => {
              const isSelected = selectedVerseNumbers.includes(verse.num);
              const isSpeakingThis = activeSpeakingVerse === verse.num;
              return (
                <div
                  key={verse.num}
                  onClick={(e) => handleVerseClick(verse.num, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '18px',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSpeakingThis ? 'rgba(212,175,55,0.24)' : isSelected ? 'rgba(212,175,55,0.14)' : 'rgba(255,255,255,0.015)',
                    borderLeft: isSelected ? '4px solid var(--gold-400)' : '3px solid transparent',
                    border: isSelected ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.03)',
                    boxShadow: isSelected ? '0 0 14px rgba(212,175,55,0.15)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ color: isSelected ? 'var(--gold-400)' : '#64748b', display: 'flex', alignItems: 'center', paddingTop: '3px' }}>
                    {isSelected ? <CheckSquare size={18} /> : <EmptySquare size={18} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--gold-400)', minWidth: '28px' }}>
                      {verse.num}
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: '0.64rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.3)', padding: '1px 6px', borderRadius: '3px', fontWeight: '700' }}>
                        ✓ Seleccionado
                      </span>
                    )}
                  </div>
                  <p className="font-scripture" style={{ fontSize: '1.45rem', lineHeight: '1.9', color: '#f8fafc', margin: 0, flex: 1 }}>
                    {verse.text}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen5DForSelection(verse);
                    }}
                    style={{
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      color: 'var(--gold-300)',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    title={`Abrir 5D solo para el versículo ${verse.num}`}
                  >
                    5D v.{verse.num}
                  </button>
                </div>
              );
            })}
          </div>
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
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '24px 20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '920px',
            maxHeight: 'calc(100vh - 48px)',
            background: 'linear-gradient(180deg, #0a0d14 0%, #06070a 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '16px',
            boxShadow: '0 0 50px rgba(0,0,0,0.9), 0 0 30px rgba(212,175,55,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Cabecera del Selector */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={18} color="var(--gold-400)" />
                <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>
                  Selector Canónico de Libros & Capítulos
                </h3>
              </div>
              <button
                onClick={() => setIsBookPickerOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Buscador de Libro + Filtros de Testamento */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 280px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Escribe el nombre de un libro (ej. Génesis, Salmos, Mateo)..."
                  value={bookSearchQuery}
                  onChange={(e) => setBookSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setSelectedTestament('all')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    background: selectedTestament === 'all' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.03)',
                    color: selectedTestament === 'all' ? '#07080c' : 'var(--text-muted)',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  66 Libros
                </button>
                <button
                  onClick={() => setSelectedTestament('AT')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    background: selectedTestament === 'AT' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.03)',
                    color: selectedTestament === 'AT' ? '#07080c' : 'var(--text-muted)',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Antiguo Testamento (39)
                </button>
                <button
                  onClick={() => setSelectedTestament('NT')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    background: selectedTestament === 'NT' ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.03)',
                    color: selectedTestament === 'NT' ? '#07080c' : 'var(--text-muted)',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Nuevo Testamento (27)
                </button>
              </div>
            </div>

            {/* Contenido en 2 Paneles: Libros a la Izquierda + Capítulos y Versículos a la Derecha */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', flex: 1, overflow: 'hidden' }}>
              
              {/* Lista de Libros */}
              <div style={{ padding: '16px', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px', alignContent: 'start' }}>
                {filteredBooks.map((b) => {
                  const isSelected = selectedBookObj.name === b.name;
                  return (
                    <button
                      key={b.name}
                      onClick={() => handleSelectBookInModal(b)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        textAlign: 'left',
                        background: isSelected ? 'rgba(212,175,55,0.22)' : 'rgba(255,255,255,0.02)',
                        border: isSelected ? '1px solid var(--gold-400)' : '1px solid transparent',
                        color: isSelected ? 'var(--gold-200)' : 'var(--text-muted)',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? '700' : '400',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{b.name}</span>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{b.chapters}c</span>
                    </button>
                  );
                })}
              </div>

              {/* Selector de Capítulos & Versículos para el Libro Seleccionado */}
              <div style={{ padding: '18px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Cabecera del Panel de Capítulos */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--gold-400)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>
                      Selección Canónica de Capítulos:
                    </span>
                    <h4 className="font-cinzel" style={{ fontSize: '1.25rem', color: '#ffffff', margin: '2px 0 0' }}>
                      {selectedBookObj.name} ({selectedBookObj.chapters} capítulos)
                    </h4>
                  </div>

                  {/* Resumen del Rango de Capítulos */}
                  <div style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    padding: '4px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--gold-200)',
                    fontWeight: '700'
                  }}>
                    {modalChapterStart === modalChapterEnd
                      ? `Capítulo ${modalChapterStart}`
                      : `Capítulos ${Math.min(modalChapterStart, modalChapterEnd)} al ${Math.max(modalChapterStart, modalChapterEnd)} (${Math.abs(modalChapterEnd - modalChapterStart) + 1} caps)`}
                  </div>
                </div>

                {/* Atajos Rápidos de Rango */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Atajos:</span>
                  <button
                    onClick={() => { setModalChapterStart(1); setModalChapterEnd(1); }}
                    style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                  >
                    Solo Cap. 1
                  </button>
                  {selectedBookObj.chapters >= 5 && (
                    <button
                      onClick={() => { setModalChapterStart(1); setModalChapterEnd(5); }}
                      style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                    >
                      Cap. 1-5
                    </button>
                  )}
                  {selectedBookObj.chapters >= 10 && (
                    <button
                      onClick={() => { setModalChapterStart(1); setModalChapterEnd(10); }}
                      style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                    >
                      Cap. 1-10
                    </button>
                  )}
                  {selectedBookObj.chapters >= 23 && (
                    <button
                      onClick={() => { setModalChapterStart(1); setModalChapterEnd(23); }}
                      style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(212,175,55,0.18)', border: '1px solid var(--gold-400)', color: '#ffd700', fontWeight: '800', cursor: 'pointer' }}
                    >
                      Cap. 1-23 ★
                    </button>
                  )}
                  <button
                    onClick={() => { setModalChapterStart(1); setModalChapterEnd(selectedBookObj.chapters); }}
                    style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                  >
                    Todo el libro ({selectedBookObj.chapters}c)
                  </button>
                </div>

                {/* Selectores de Rango Numéricos Manuales */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Desde Cap:</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedBookObj.chapters}
                      value={modalChapterStart}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(parseInt(e.target.value, 10) || 1, selectedBookObj.chapters));
                        setModalChapterStart(val);
                      }}
                      style={{
                        width: '56px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--gold-400)',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.84rem',
                        textAlign: 'center'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hasta Cap:</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedBookObj.chapters}
                      value={modalChapterEnd}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(parseInt(e.target.value, 10) || 1, selectedBookObj.chapters));
                        setModalChapterEnd(val);
                      }}
                      style={{
                        width: '56px',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid var(--gold-400)',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.84rem',
                        textAlign: 'center'
                      }}
                    />
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontStyle: 'italic' }}>
                    💡 Haz clic en 2 capítulos o usa Shift+Clic para marcar un rango
                  </span>
                </div>

                {/* Cuadrícula Interactiva de Capítulos */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                  {Array.from({ length: selectedBookObj.chapters }, (_, i) => i + 1).map((chap) => {
                    const minSelected = Math.min(modalChapterStart, modalChapterEnd);
                    const maxSelected = Math.max(modalChapterStart, modalChapterEnd);
                    const isEndpoint = chap === minSelected || chap === maxSelected;
                    const isInRange = chap >= minSelected && chap <= maxSelected;

                    return (
                      <button
                        key={chap}
                        onClick={(e) => handleModalChapterClick(chap, e.shiftKey)}
                        onDoubleClick={() => handleConfirmModalSelection(chap, chap)}
                        style={{
                          height: '38px',
                          borderRadius: '6px',
                          background: isEndpoint
                            ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)'
                            : isInRange
                              ? 'rgba(212,175,55,0.24)'
                              : 'rgba(255,255,255,0.04)',
                          border: isEndpoint
                            ? '1.5px solid #ffd700'
                            : isInRange
                              ? '1px solid rgba(212,175,55,0.55)'
                              : '1px solid rgba(212,175,55,0.16)',
                          color: isEndpoint
                            ? '#07080c'
                            : isInRange
                              ? 'var(--gold-200)'
                              : 'var(--text-muted)',
                          fontSize: '0.86rem',
                          fontWeight: isEndpoint ? '900' : isInRange ? '700' : '500',
                          boxShadow: isEndpoint ? '0 0 16px rgba(212,175,55,0.7)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        title={`Capítulo ${chap}. Clic para seleccionar, Shift+Clic para rango, doble clic para abrir de inmediato.`}
                      >
                        {chap}
                      </button>
                    );
                  })}
                </div>

                {/* =========================================================================
                    NUEVA SECCIÓN: SELECTOR DE VERSÍCULOS DINÁMICO DE ALTA FIDELIDAD
                   ========================================================================= */}
                {(() => {
                  const currentChapVersesTotal = getChapterVerseCount(selectedBookObj.name, modalChapterStart);

                  return (
                    <div style={{
                      marginTop: '6px',
                      borderTop: '1px solid rgba(212,175,55,0.22)',
                      paddingTop: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {/* Cabecera de Versículos */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ScrollText size={17} color="var(--gold-400)" />
                          <span className="font-cinzel" style={{ fontSize: '0.98rem', fontWeight: '800', color: '#ffffff' }}>
                            Versículos de {selectedBookObj.name} {modalChapterStart}
                            <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)', marginLeft: '8px', fontWeight: '600' }}>
                              ({currentChapVersesTotal} versículos)
                            </span>
                          </span>
                        </div>

                        {/* Atajos Rápidos de Versículos */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button
                            onClick={() => {
                              setModalVerseMode('all');
                              setModalVerseStart(1);
                              setModalVerseEnd(currentChapVersesTotal);
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                              background: modalVerseMode === 'all'
                                ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)'
                                : 'rgba(255,255,255,0.05)',
                              color: modalVerseMode === 'all' ? '#07080c' : 'var(--gold-200)',
                              fontWeight: modalVerseMode === 'all' ? '800' : '600',
                              border: modalVerseMode === 'all' ? '1px solid #ffd700' : '1px solid rgba(212,175,55,0.25)',
                              cursor: 'pointer'
                            }}
                          >
                            Todo el capítulo ({currentChapVersesTotal}v) ★
                          </button>
                          {currentChapVersesTotal >= 5 && (
                            <button
                              onClick={() => {
                                setModalVerseMode('range');
                                setModalVerseStart(1);
                                setModalVerseEnd(5);
                              }}
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                            >
                              v. 1-5
                            </button>
                          )}
                          {currentChapVersesTotal >= 10 && (
                            <button
                              onClick={() => {
                                setModalVerseMode('range');
                                setModalVerseStart(1);
                                setModalVerseEnd(10);
                              }}
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                            >
                              v. 1-10
                            </button>
                          )}
                          {currentChapVersesTotal >= 20 && (
                            <button
                              onClick={() => {
                                setModalVerseMode('range');
                                setModalVerseStart(1);
                                setModalVerseEnd(20);
                              }}
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                            >
                              v. 1-20
                            </button>
                          )}
                          {currentChapVersesTotal > 20 && (
                            <button
                              onClick={() => {
                                setModalVerseMode('range');
                                setModalVerseStart(21);
                                setModalVerseEnd(currentChapVersesTotal);
                              }}
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.74rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', color: 'var(--gold-200)', cursor: 'pointer' }}
                            >
                              v. 21-{currentChapVersesTotal}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Selectores Numéricos Manuales de Versículo */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Desde v:</label>
                          <input
                            type="number"
                            min="1"
                            max={currentChapVersesTotal}
                            value={modalVerseStart}
                            onChange={(e) => {
                              const val = Math.max(1, Math.min(parseInt(e.target.value, 10) || 1, currentChapVersesTotal));
                              setModalVerseStart(val);
                              setModalVerseMode('range');
                            }}
                            style={{
                              width: '54px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'rgba(0,0,0,0.5)',
                              border: '1px solid var(--gold-400)',
                              color: '#ffffff',
                              fontWeight: '700',
                              fontSize: '0.84rem',
                              textAlign: 'center'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hasta v:</label>
                          <input
                            type="number"
                            min="1"
                            max={currentChapVersesTotal}
                            value={modalVerseEnd}
                            onChange={(e) => {
                              const val = Math.max(1, Math.min(parseInt(e.target.value, 10) || 1, currentChapVersesTotal));
                              setModalVerseEnd(val);
                              setModalVerseMode('range');
                            }}
                            style={{
                              width: '54px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'rgba(0,0,0,0.5)',
                              border: '1px solid var(--gold-400)',
                              color: '#ffffff',
                              fontWeight: '700',
                              fontSize: '0.84rem',
                              textAlign: 'center'
                            }}
                          />
                        </div>

                        <span style={{ fontSize: '0.74rem', color: 'var(--gold-400)', fontStyle: 'italic' }}>
                          💡 Haz clic en un versículo para seleccionarlo, o Shift+Clic para marcar un rango
                        </span>
                      </div>

                      {/* Cuadrícula Interactiva de Versículos */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
                        gap: '6px',
                        maxHeight: '180px',
                        overflowY: 'auto',
                        paddingRight: '4px'
                      }}>
                        {Array.from({ length: currentChapVersesTotal }, (_, i) => i + 1).map((vNum) => {
                          const isAll = modalVerseMode === 'all';
                          const vMin = Math.min(modalVerseStart, modalVerseEnd);
                          const vMax = Math.max(modalVerseStart, modalVerseEnd);
                          const isEndpoint = !isAll && (vNum === vMin || vNum === vMax);
                          const isInRange = isAll || (vNum >= vMin && vNum <= vMax);

                          return (
                            <button
                              key={vNum}
                              onClick={(e) => {
                                if (e.shiftKey) {
                                  const newStart = Math.min(modalVerseStart, vNum);
                                  const newEnd = Math.max(modalVerseStart, vNum);
                                  setModalVerseStart(newStart);
                                  setModalVerseEnd(newEnd);
                                  setModalVerseMode('range');
                                } else {
                                  setModalVerseStart(vNum);
                                  setModalVerseEnd(vNum);
                                  setModalVerseMode('range');
                                }
                              }}
                              onDoubleClick={() => {
                                setModalVerseStart(vNum);
                                setModalVerseEnd(vNum);
                                setModalVerseMode('range');
                                handleConfirmModalSelection(modalChapterStart, modalChapterStart, vNum, vNum);
                              }}
                              style={{
                                height: '38px',
                                borderRadius: '6px',
                                background: isEndpoint
                                  ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)'
                                  : isInRange
                                    ? 'rgba(212,175,55,0.22)'
                                    : 'rgba(255,255,255,0.04)',
                                border: isEndpoint
                                  ? '1.5px solid #ffd700'
                                  : isInRange
                                    ? '1px solid rgba(212,175,55,0.5)'
                                    : '1px solid rgba(212,175,55,0.14)',
                                color: isEndpoint
                                  ? '#07080c'
                                  : isInRange
                                    ? 'var(--gold-200)'
                                    : 'var(--text-muted)',
                                fontSize: '0.84rem',
                                fontWeight: isEndpoint ? '900' : isInRange ? '700' : '500',
                                boxShadow: isEndpoint ? '0 0 14px rgba(212,175,55,0.6)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}
                              title={`Versículo ${vNum}. Clic para seleccionar, Shift+Clic para rango, doble clic para abrir de inmediato.`}
                            >
                              {vNum}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })()}

              </div>

            </div>

            {/* Barra Inferior Fija del Modal con Resumen y Botón Aceptar */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid rgba(212,175,55,0.25)',
              background: 'rgba(10,13,20,0.98)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} color="var(--gold-400)" />
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Selección a Cargar:
                  </span>
                  <div style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: '800' }}>
                    {selectedBookObj.name}{' '}
                    <span style={{ color: 'var(--gold-300)' }}>
                      {modalChapterStart === modalChapterEnd
                        ? `Capítulo ${modalChapterStart}`
                        : `Capítulos ${Math.min(modalChapterStart, modalChapterEnd)} al ${Math.max(modalChapterStart, modalChapterEnd)}`}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                      • {modalVerseMode === 'all' 
                          ? `Todos los versículos (1-${getChapterVerseCount(selectedBookObj.name, modalChapterStart)})` 
                          : `v. ${Math.min(modalVerseStart, modalVerseEnd)}-${Math.max(modalVerseStart, modalVerseEnd)}`}
                    </span>
                  </div>
                </div>
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
                <button
                  onClick={() => handleConfirmModalSelection()}
                  className="btn-gold font-cinzel"
                  style={{
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(212,175,55,0.4)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Check size={18} />
                  <span>
                    Aceptar y Cargar {selectedBookObj.name}{' '}
                    {modalChapterStart === modalChapterEnd
                      ? `${modalChapterStart}:${modalVerseMode === 'all' ? `1-${getChapterVerseCount(selectedBookObj.name, modalChapterStart)}` : `${Math.min(modalVerseStart, modalVerseEnd)}-${Math.max(modalVerseStart, modalVerseEnd)}`}`
                      : `Caps. ${Math.min(modalChapterStart, modalChapterEnd)}-${Math.max(modalChapterStart, modalChapterEnd)}`}
                  </span>
                </button>
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
