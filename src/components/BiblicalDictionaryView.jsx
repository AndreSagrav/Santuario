import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Sparkles, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  Landmark, 
  ArrowRight,
  Flame,
  Bookmark,
  Check,
  Scale
} from 'lucide-react';
import { BIBLICAL_DICTIONARY_ENTRIES } from '../data/biblicalDictionaryData';
import { askRuajAI } from '../services/aiService';
import SacredContentRenderer from '../utils/sacredFormatter';

export default function BiblicalDictionaryView({ onOpenBible, onConsultAI }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState(BIBLICAL_DICTIONARY_ENTRIES[0]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const [liveSearchResult, setLiveSearchResult] = useState(null);

  const categories = [
    { id: 'all', label: 'Todos los Términos' },
    { id: 'Nombres de Dios', label: 'Nombres de Dios' },
    { id: 'Atributos Divinos', label: 'Atributos Divinos' },
    { id: 'Metáforas del Pacto', label: 'Metáforas del Pacto' },
    { id: 'Vida en el Pacto', label: 'Vida en el Pacto' },
    { id: 'Teología Federal', label: 'Teología Federal' },
    { id: 'Cristología', label: 'Cristología' },
    { id: 'Soteriología', label: 'Soteriología' }
  ];

  // Filtrar entradas del diccionario estático
  const filteredEntries = BIBLICAL_DICTIONARY_ENTRIES.filter((entry) => {
    const matchesCat = selectedCategory === 'all' || entry.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesSearch = 
      entry.term.toLowerCase().includes(q) ||
      entry.original.includes(q) ||
      entry.strong.toLowerCase().includes(q) ||
      entry.transliteration.toLowerCase().includes(q) ||
      entry.meaning.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  // Búsqueda profunda en vivo con IA académica para términos que no estén en la base predefinida
  const handleLiveTheologicalSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim() || isLiveSearching) return;

    setIsLiveSearching(true);
    setLiveSearchResult(null);

    const prompt = `Actúa como lexicógrafo bíblico y teólogo del Instituto Bíblico del Santuario.
Genera la ENTRADA DE DICCIONARIO TEOLÓGICO Y EXEGÉTICO para el término bíblico o código Strong: "${searchQuery.trim()}".

REGLAS DE FORMATO:
- Cero símbolos crudos de markdown (nada de asteriscos, numerales #### ni guiones feos).
- Incluye:
1. Término y raíz original en hebreo o griego con vocalización y número Strong.
2. Significado léxico riguroso según BDB, HALOT o BDAG.
3. Paralelos o cognados en el Antiguo Cercano Oriente (acadio, ugarítico, arameo).
4. Evolución teológica: desde su primer uso en el Pentateuco o los Profetas hasta su cumplimiento en Jesucristo en el Nuevo Testamento.
5. Pasajes bíblicos clave.`;

    try {
      const res = await askRuajAI({ question: prompt, mood: 'Investigación Académica & Lexicografía' });
      setLiveSearchResult(res);
    } catch (err) {
      setLiveSearchResult('No fue posible consultar el léxico en este momento. Por favor reintente.');
    } finally {
      setIsLiveSearching(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 80px' }} className="animate-fade-in">
      
      {/* Encabezado del Diccionario */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '14px' }}>
          <BookMarked size={15} color="var(--gold-400)" />
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'var(--gold-300)', textTransform: 'uppercase', fontWeight: '700' }}>
            Léxico Hebreo, Griego & Teología Bíblica
          </span>
        </div>
        <h1 className="font-cinzel gold-text-gradient" style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '10px' }}>
          Diccionario Bíblico & Teológico del Santuario
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Coteje raíces etimológicas de los diccionarios Brown-Driver-Briggs (BDB), HALOT, BDAG y concordancias Strong con evolución teológica e historia del Próximo Oriente.
        </p>

        {/* Buscador de Términos / Códigos Strong */}
        <form 
          onSubmit={handleLiveTheologicalSearch}
          style={{ maxWidth: '720px', margin: '24px auto 0', display: 'flex', gap: '10px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--gold-400)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="sacred-input"
              placeholder="Buscar por término (ej. Hesed, Shalom, Pastor, YHWH, H3068, G26)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '48px', height: '48px', fontSize: '0.96rem' }}
            />
          </div>
          <button
            type="submit"
            disabled={isLiveSearching || !searchQuery.trim()}
            className="btn-gold"
            style={{ height: '48px', padding: '0 24px', flexShrink: 0 }}
          >
            {isLiveSearching ? <Flame size={16} className="animate-spin" /> : <Sparkles size={16} />}
            <span>Consultar Léxico</span>
          </button>
        </form>
      </div>

      {/* Selector de Categorías Teológicas */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px', justifyContent: 'center' }}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setLiveSearchResult(null);
              }}
              style={{
                flex: '0 0 auto',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: isSelected ? '700' : '500',
                background: isSelected ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'rgba(255,255,255,0.03)',
                color: isSelected ? '#07080c' : 'var(--text-muted)',
                border: isSelected ? 'none' : '1px solid rgba(212,175,55,0.18)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Si hay resultado de búsqueda profunda en vivo */}
      {liveSearchResult && (
        <div className="sacred-panel animate-fade-in" style={{ padding: '28px', marginBottom: '32px', border: '1px solid var(--gold-400)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--gold-400)" />
              <h3 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>
                Investigación Léxica de: «{searchQuery}»
              </h3>
            </div>
            <button
              onClick={() => setLiveSearchResult(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.82rem' }}
            >
              Cerrar resultado en vivo
            </button>
          </div>
          <SacredContentRenderer content={liveSearchResult} />
        </div>
      )}

      {/* Grid Principal del Diccionario: Lista de Términos a la Izquierda + Ficha Exhaustiva a la Derecha */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Columna Izquierda: Lista de Entradas Filtradas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Entradas Léxicas ({filteredEntries.length})
            </span>
          </div>

          {filteredEntries.map((entry) => {
            const isSelected = selectedEntry.id === entry.id;
            return (
              <div
                key={entry.id}
                onClick={() => {
                  setSelectedEntry(entry);
                  setLiveSearchResult(null);
                }}
                className="sacred-panel"
                style={{
                  padding: '16px 20px',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid var(--gold-400)' : '1px solid rgba(212,175,55,0.15)',
                  background: isSelected ? 'rgba(212,175,55,0.12)' : 'rgba(9, 12, 18, 0.75)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.94rem', fontWeight: '700', color: isSelected ? '#ffffff' : 'var(--gold-200)' }}>
                      {entry.term}
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      background: 'rgba(212,175,55,0.15)',
                      border: '1px solid rgba(212,175,55,0.3)',
                      color: 'var(--gold-300)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      {entry.strong}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {entry.meaning}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: entry.language === 'Hebreo' ? "'SBL Hebrew', serif" : "'SBL Greek', serif",
                    fontSize: '1.3rem',
                    color: '#fef08a',
                    direction: entry.language === 'Hebreo' ? 'rtl' : 'ltr'
                  }}>
                    {entry.original}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {entry.language}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Columna Derecha: Ficha Exhaustiva de la Palabra Seleccionada */}
        <div className="sacred-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '80px' }}>
          
          {/* Cabecera de la Ficha */}
          <div style={{ borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <span className="sacred-badge">
                {selectedEntry.category} • {selectedEntry.language}
              </span>
              <span style={{
                fontSize: '0.84rem',
                fontFamily: 'monospace',
                fontWeight: '700',
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid var(--gold-400)',
                color: 'var(--gold-300)',
                padding: '3px 10px',
                borderRadius: '6px'
              }}>
                Diccionario Strong: {selectedEntry.strong}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '12px' }}>
              <h2 className="font-cinzel gold-text-gradient" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>
                {selectedEntry.term}
              </h2>
              <div style={{
                fontFamily: selectedEntry.language === 'Hebreo' ? "'SBL Hebrew', serif" : "'SBL Greek', serif",
                fontSize: '2.1rem',
                color: '#fef08a',
                direction: selectedEntry.language === 'Hebreo' ? 'rtl' : 'ltr'
              }}>
                {selectedEntry.original}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', color: '#cbd5e1', marginTop: '6px' }}>
              <span><strong>Transliteración:</strong> {selectedEntry.transliteration}</span>
              <span>•</span>
              <span><strong>Pronunciación:</strong> <em>{selectedEntry.pronunciation}</em></span>
              <span>•</span>
              <span><strong>Morfología:</strong> {selectedEntry.partOfSpeech}</span>
            </div>
          </div>

          {/* Significado Principal & Raíz */}
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
              Definición Léxica & Etimología:
            </span>
            <p style={{ fontSize: '1.02rem', color: '#ffffff', fontWeight: '600', lineHeight: 1.5, margin: '0 0 6px' }}>
              {selectedEntry.meaning}
            </p>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: 0, fontStyle: 'italic' }}>
              {selectedEntry.root}
            </p>
          </div>

          {/* Paralelos del Antiguo Cercano Oriente (ANE) */}
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Landmark size={15} color="#93c5fd" />
              <span style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Epigrafía & Paralelos del Antiguo Cercano Oriente:
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
              {selectedEntry.aneCognate}
            </p>
          </div>

          {/* Evolución Teológica & Cumplimiento en Cristo */}
          <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '8px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Layers size={15} color="var(--gold-400)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--gold-300)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Trayectoria Teológica & Revelación Progresiva:
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.65, margin: 0 }}>
              {selectedEntry.theologicalEvolution}
            </p>
          </div>

          {/* Pasajes Bíblicos Clave */}
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
              Pasajes Bíblicos Fundamentales:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedEntry.keyVerses.map((verse, vIdx) => (
                <button
                  key={vIdx}
                  onClick={() => onOpenBible?.(verse.split(' ')[0].toLowerCase().includes('salmo') ? 'salmo23' : 'juan1')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    color: 'var(--gold-200)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={`Ver pasaje en el Lector Bíblico`}
                >
                  <BookOpen size={13} color="var(--gold-400)" />
                  <span>{verse}</span>
                  <ExternalLink size={11} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>

          {/* Botón de Profundización con Ruaj */}
          <button
            onClick={() => onConsultAI?.({
              passage: { title: `Término Léxico: ${selectedEntry.term} (${selectedEntry.strong})` },
              mood: 'Investigación Académica & Exégesis'
            })}
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: '0.92rem' }}
          >
            <Sparkles size={16} />
            <span>Consultar Exégesis Completa de «{selectedEntry.term}»</span>
          </button>

        </div>

      </div>

    </div>
  );
}
