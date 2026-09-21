import React, { useState } from 'react';
import { 
  ScrollText, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Scale,
  GitBranch,
  Puzzle,
  Bookmark
} from 'lucide-react';

/**
 * TextualCriticismWorkbench.jsx
 * Estación de Crítica Textual Rigurosa:
 * 1. Cotejo de testigos primarios (𝔐 Masorético, 𝔔 Qumrán, 𝔊 LXX, 𝔖 Peshitta, 𝔙 Vulgata).
 * 2. Aparato de variantes críticas formales.
 * 3. Contraste histórico-crítico secular (Sitz im Leben, Formgeschichte).
 * 4. Estratificación Literaria & Fuentes Documentales (Compendio y Fracciones J, E, P, D y Toledot).
 */

export default function TextualCriticismWorkbench({ verseRef = 'Génesis 1:1' }) {
  const isGenesis = verseRef.toLowerCase().includes('génesis') || verseRef.toLowerCase().includes('genesis');
  const [selectedWitnessSiglum, setSelectedWitnessSiglum] = useState('𝔐');
  const [viewTab, setViewTab] = useState(isGenesis ? 'literary_sources' : 'witnesses'); // 'literary_sources' | 'witnesses' | 'variants' | 'secular_critical'

  // Testigos primarios adaptados según el pasaje
  const witnesses = isGenesis ? [
    {
      siglum: '𝔐',
      name: 'Texto Masorético (Codex Leningradensis B19A)',
      date: '1008 d.C. (Copia fiel del texto tiberiense de Ben Asher)',
      language: 'Hebreo Bíblico consonántico con niqud y cantilación',
      transcription: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
      translation: '«En el principio creó Dios los cielos y la tierra»',
      notes: 'Lectura base canónica de la Biblia Hebraica Stuttgartensia (BHS). Preserva la vocalización masorética tradicional con Bet prepuesta (בְּ) sin artículo definido determinado.'
    },
    {
      siglum: '𝔔',
      name: 'Rollos del Mar Muerto (Qumrán 4QGen^b / 4QGen^d)',
      date: 'c. 100 – 50 a.C. (Cueva 4 de Qumrán)',
      language: 'Hebreo paleo-consonántico cuadrangular',
      transcription: 'בראשית ברא אלהים את השמים ואת הארץ',
      translation: '«Bereshit bara Elohim \'et hashamayim w\'et ha\'aretz»',
      notes: 'Texto pre-masorético consonántico puro. Testifica la preservación idéntica del versículo mil años antes de los códices medievales de Leningrado y Alepo.'
    },
    {
      siglum: '𝔊 (LXX)',
      name: 'Septuaginta Griega (Codex Vaticanus B / Alexandrinus A)',
      date: 'c. 280 – 250 a.C. (Traducción alejandrina de la Torá)',
      language: 'Griego Koiné alejandrino',
      transcription: 'Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν',
      translation: '«En el principio hizo Dios el cielo y la tierra»',
      notes: 'Traduce בָּרָא (bara) con ἐποίησεν (verbo común de "hacer" en aoristo indicativo activo). La LXX sirvió de texto bíblico primario para los escritores del Nuevo Testamento.'
    },
    {
      siglum: '𝔖',
      name: 'Peshitta Siríaca (Manuscrito Ambrosiano B.21)',
      date: 'siglo II – IV d.C.',
      language: 'Siríaco clásico (dialecto arameo cristiano)',
      transcription: 'ܒܪܫܝܬ ܒܪܐ ܐܠܗܐ ܝܬ ܫܡܝܐ ܘܝܬ ܐܪܥܐ',
      translation: '«Breshith bra Alaha yath shmaya w\'yath ar\'a»',
      notes: 'Traducción directa de manuscritos hebreos proto-masoréticos, mostrando una afinidad léxica muy estrecha con el arameo de los Targumes judíos (Onquelos).'
    },
    {
      siglum: '𝔙',
      name: 'Vulgata Latina (San Jerónimo)',
      date: 'c. 390 – 405 d.C. (Traducido en Belén iuxta Hebraeos)',
      language: 'Latín bíblico clásico tardío',
      transcription: 'In principio creavit Deus caelum et terram',
      translation: '«En el principio creó Dios el cielo y la tierra»',
      notes: 'Jerónimo empleó conscientemente "creavit" (crear ex nihilo) en vez de "fecit" (hacer), preservando la singularidad teológica del verbo hebreo bara.'
    }
  ] : [
    {
      siglum: '𝔐',
      name: 'Texto Masorético (Codex Leningradensis B19A)',
      date: '1008 d.C. (Colofón de Samuel ben Jacob)',
      language: 'Hebreo Bíblico con niqud y te\'amim tiberienses',
      transcription: 'יְהוָה רֹעִי לֹא אֶחְסָר',
      translation: '«Jehová es mi pastor; nada me faltará»',
      notes: 'Texto base oficial de la Biblia Hebraica Stuttgartensia (BHS). Conserva la vocalización masorética de la escuela de Ben Asher.'
    },
    {
      siglum: '𝔔',
      name: 'Rollos del Mar Muerto (Qumrán 4QPs^a / 4Q83)',
      date: 'c. 150 – 50 a.C.',
      language: 'Hebreo paleo-consonántico cuadrangular',
      transcription: 'יהוה רעי לא אחסר',
      translation: '«YHVH r\'y l\' \'hsr»',
      notes: 'Pre-masorético. Ausencia de puntos vocálicos. Confirma la estabilidad consonántica milenaria.'
    },
    {
      siglum: '𝔊 (LXX)',
      name: 'Septuaginta Griega (Codex Vaticanus B, gr. 1209)',
      date: 'c. 325 – 350 d.C.',
      language: 'Griego Koiné alejandrino',
      transcription: 'κύριος ποιμαίνει με καὶ οὐδέν με ὑστερήσει',
      translation: '«El Señor me pastorea y nada me hará falta»',
      notes: 'Traduce el Tetragrámaton como κύριος. Verbo en presente activo durativo ("me pastorea continuamente").'
    },
    {
      siglum: '𝔖',
      name: 'Peshitta Siríaca (Manuscrito Ambrosiano 7a1)',
      date: 'siglo VI – VII d.C.',
      language: 'Siríaco clásico',
      transcription: 'ܡܪܝܐ ܢܪܥܝܢܝ ܘܡܕܡ ܠܐ ܢܚܣܪ ܠܝ',
      translation: '«Māryā ner‘ēnī wemeddem lā neḥsar lī»',
      notes: 'Usa "Māryā" para YHWH con afinidad semítica targúmica.'
    },
    {
      siglum: '𝔙',
      name: 'Vulgata Latina (Psalterium Gallicanum / Iuxta Hebr.)',
      date: 'c. 392 d.C. (San Jerónimo)',
      language: 'Latín bíblico',
      transcription: 'Dominus regit me, et nihil mihi deerit / Dominus pascit me',
      translation: '«El Señor me gobierna/apacienta y nada me faltará»',
      notes: 'El Gallicanum emplea "regit" ("gobierna"), y la versión Iuxta Hebraeos corrigió a "pascit" ("apacienta").'
    }
  ];

  const selectedWitness = witnesses.find(w => w.siglum === selectedWitnessSiglum) || witnesses[0];

  // Variantes textuales
  const variants = isGenesis ? [
    {
      locus: 'Génesis 1:1 - Vocalización de בְּרֵאשִׁית (Bereshit)',
      masoretic: 'בְּרֵאשִׁית (Estado constructo morfológico sin artículo determinativo)',
      witnesses: '𝔐 vs Comentaristas Medievales (Rashi, Ibn Ezra) & Bereshit Rabba',
      analysis: 'Debate sintáctico fundamental: Si Bereshit está en estado absoluto significa «En el principio creó Dios...» (creación absoluta del cosmos ex nihilo). Si se vocaliza en estado constructo significa «En el comienzo del crear de Dios los cielos y la tierra, cuando la tierra era tohu va-bohu... dijo Dios: Sea la luz». La LXX (Ἐν ἀρχῇ) y la Vulgata apoyan unívocamente la lectura absoluta clásica.'
    },
    {
      locus: 'Génesis 1:2 - Significado de ר֣וּחַ אֱלֹהִ֔ים (Ruaj Elohim)',
      masoretic: 'וְר֣וּחַ אֱלֹהִ֔ים מְרַחֶ֖פֶת עַל־פְּנֵ֥י הַמָּֽיִם',
      witnesses: '𝔐: "El Espíritu de Dios" | Crítica Filológica Comparada (Ugarítico / Acadio)',
      analysis: 'En la erudición laica e histórico-crítica, la frase puede traducirse como «un viento impetuoso/tormentoso de Dios» (usando Elohim como superlativo semítico de poder colosal, como en "montañas de Dios"). No obstante, el participio מְרַחֶפֶת (merajéfet: empollar, sobrevolar con ternura protectora, cf. Dt 32:11) respalda la acción vivificadora del Espíritu Santo en la tradición canónica judeocristiana.'
    },
    {
      locus: 'Génesis 1:26 - Plural «Hagamos al ser humano» (נַֽעֲשֶׂ֥ה אָדָ֛ם)',
      masoretic: 'נַֽעֲשֶׂ֥ה אָדָ֛ם בְּצַלְמֵ֖נוּ כִּדְמוּתֵ֑נוּ (Na\'asé \'Adam betzalmenu)',
      witnesses: '𝔐, 𝔔, 𝔊, 𝔙 (Plural unánime en todos los códices)',
      analysis: 'Ningún manuscrito tiene variante en singular. La crítica laica postula que Dios se dirige a su "Corte Celestial" o consejo divino de ángeles/hijos de Dios (bene ha-elohim, cf. Job 38:7, 1 Reyes 22:19). La teología cristiana histórica ve aquí una revelación implícita de la comunión Trinitaria.'
    }
  ] : [
    {
      locus: 'Salmo 23:1a - Término YHWH',
      masoretic: 'יְהוָה (Adonay con qere perpetuum)',
      witnesses: '𝔐, 𝔔 (יהוה), 𝔊 (κύριος), 𝔖 (ܡܪܝܐ), 𝔙 (Dominus)',
      analysis: 'Unanimidad absoluta en los testigos primarios. La Septuaginta y versiones hijas estandarizan la traducción con el apelativo "Señor".'
    },
    {
      locus: 'Salmo 23:1b - רֹעִי (ro\'i)',
      masoretic: 'Participio activo Qal con sufijo pronominal 1ª pers. sing. (de רָעָה)',
      witnesses: '𝔐: "mi pastor" (sustantivo/participio) | 𝔊: ποιμαίνει με ("me pastorea" - verbo activo durativo)',
      analysis: 'Divergencia morfofuncional entre el hebreo (predicado nominal) y el griego alejandrino (verbalizado en presente durativo).'
    }
  ];

  return (
    <div style={{
      background: 'rgba(7, 9, 14, 0.92)',
      border: '1px solid rgba(212,175,55,0.25)',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Encabezado del Módulo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(212,175,55,0.18)',
            border: '1px solid var(--gold-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scale size={18} color="var(--gold-400)" />
          </div>
          <div>
            <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.18rem', fontWeight: '800' }}>
              Aparato de Crítica Textual & Estratificación de Fuentes
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Cotejo filológico de códices primarios, variantes scribales y fracciones compuestas (J, E, P, D y Toledot)
            </span>
          </div>
        </div>

        {/* Selector de Sub-Pestañas */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(4,5,8,0.95)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', flexWrap: 'wrap' }}>
          <button
            onClick={() => setViewTab('literary_sources')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: viewTab === 'literary_sources' ? '800' : '500',
              background: viewTab === 'literary_sources' ? 'linear-gradient(135deg, var(--gold-400) 0%, var(--gold-600) 100%)' : 'transparent',
              color: viewTab === 'literary_sources' ? '#07080c' : 'var(--gold-300)',
              border: viewTab === 'literary_sources' ? '1px solid #ffd700' : 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitBranch size={13} />
            <span>Fuentes & Compendio (J, E, P)</span>
          </button>

          <button
            onClick={() => setViewTab('witnesses')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: viewTab === 'witnesses' ? '700' : '500',
              background: viewTab === 'witnesses' ? 'rgba(212,175,55,0.22)' : 'transparent',
              color: viewTab === 'witnesses' ? 'var(--gold-200)' : 'var(--text-muted)',
              border: viewTab === 'witnesses' ? '1px solid var(--gold-400)' : 'none',
              cursor: 'pointer'
            }}
          >
            Testigos Primarios (5 Códices)
          </button>

          <button
            onClick={() => setViewTab('variants')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: viewTab === 'variants' ? '700' : '500',
              background: viewTab === 'variants' ? 'rgba(212,175,55,0.22)' : 'transparent',
              color: viewTab === 'variants' ? 'var(--gold-200)' : 'var(--text-muted)',
              border: viewTab === 'variants' ? '1px solid var(--gold-400)' : 'none',
              cursor: 'pointer'
            }}
          >
            Aparato de Variantes (Siglas)
          </button>

          <button
            onClick={() => setViewTab('secular_critical')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: viewTab === 'secular_critical' ? '700' : '500',
              background: viewTab === 'secular_critical' ? 'rgba(212,175,55,0.22)' : 'transparent',
              color: viewTab === 'secular_critical' ? 'var(--gold-200)' : 'var(--text-muted)',
              border: viewTab === 'secular_critical' ? '1px solid var(--gold-400)' : 'none',
              cursor: 'pointer'
            }}
          >
            Contraste Histórico-Crítico Laico
          </button>
        </div>
      </div>

      {/* =========================================================================
          VISTA 1: ESTRATIFICACIÓN LITERARIA & FUENTES (HIPÓTESIS DOCUMENTAL)
         ========================================================================= */}
      {viewTab === 'literary_sources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Banner Académico Introductorio */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(15,23,42,0.6) 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Puzzle size={18} color="var(--gold-400)" />
              <span className="font-cinzel" style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--gold-200)' }}>
                Génesis como Compendio & Tejido Multidocumental
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0 }}>
              La crítica textual y la crítica de fuentes contemporánea (Julius Wellhausen, Martin Noth y la erudición de Göttingen) 
              demuestran que el libro de <strong>Génesis no fue redactado de un solo trazo</strong>, sino que es un magnífico 
              <strong> compendio de tradiciones orales, archivos sacerdotales y ciclos familiares</strong> soldados cuidadosamente 
              por un Redactor final (R) durante y después del exilio babilónico.
            </p>
          </div>

          {/* Comparativa de los 2 Relatos de Creación en Génesis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            
            {/* Bloque 1: Fuente Sacerdotal (P) */}
            <div style={{
              background: 'rgba(11, 14, 22, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#60a5fa', background: 'rgba(59,130,246,0.15)', padding: '3px 10px', borderRadius: '4px' }}>
                  FUENTE SACERDOTAL (P - Priestercodex)
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Génesis 1:1 – 2:3</span>
              </div>
              <h5 style={{ margin: '4px 0 0', fontSize: '1rem', color: '#ffffff' }}>
                La Creación Cósmica Trascendente (Himno Litúrgico)
              </h5>
              <ul style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.65, margin: 0, paddingLeft: '18px' }}>
                <li><strong>Nombre Divino:</strong> Exclusivamente <em>Elohim</em> (Dios majestuoso y universal).</li>
                <li><strong>Método de Creación:</strong> Mandato verbal trascendente (<em>«Dijo Dios... y fue así»</em>). Dios no toca la materia con manos.</li>
                <li><strong>Orden Cósmico:</strong> 6 días simétricos (3 de separación + 3 de adorno) culminando en el día 7 (el Shabat litúrgico).</li>
                <li><strong>Antropología:</strong> Hombre y mujer son creados simultáneamente como clímax cósmico a <em>«imagen y semejanza de Dios»</em>.</li>
                <li><strong>Sitz im Leben (Contexto):</strong> Consuelo para los exiliados en Babilonia, demostrando que su Dios creó los cielos y no los ídolos caldeos como Marduk.</li>
              </ul>
            </div>

            {/* Bloque 2: Fuente Yahvista (J) */}
            <div style={{
              background: 'rgba(11, 14, 22, 0.95)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#facc15', background: 'rgba(234,179,8,0.15)', padding: '3px 10px', borderRadius: '4px' }}>
                  FUENTE YAHVISTA (J - Jehovista)
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Génesis 2:4b – 3:24</span>
              </div>
              <h5 style={{ margin: '4px 0 0', fontSize: '1rem', color: '#ffffff' }}>
                El Relato Antropológico del Edén & la Caída
              </h5>
              <ul style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.65, margin: 0, paddingLeft: '18px' }}>
                <li><strong>Nombre Divino:</strong> <em>Yahvé Elohim</em> (El Señor Dios personal y de pacto).</li>
                <li><strong>Método de Creación:</strong> Antropomórfico y cercano: Dios actúa como un alfarero que modela al hombre del polvo (<em>adamah</em>) y sopla en su nariz.</li>
                <li><strong>Geografía Terrenal:</strong> Un huerto localizado en el Oriente con 4 ríos identificables (Pisón, Gihón, Hidekel/Tigris y Éufrates).</li>
                <li><strong>Antropología:</strong> El hombre es creado primero; luego la vegetación, los animales, y finalmente la mujer a partir del costado del hombre.</li>
                <li><strong>Tono Literario:</strong> Sabiduría popular, drama psicológico, la serpiente, la tentación moral y las consecuencias de la finitud.</li>
              </ul>
            </div>

          </div>

          {/* El Relato Compuesto del Diluvio */}
          <div style={{
            background: 'rgba(11, 14, 22, 0.95)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitBranch size={16} color="var(--gold-400)" />
              <span className="font-cinzel" style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--gold-200)' }}>
                Fusión Microquirúrgica en el Diluvio (Génesis 6 – 9)
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>
              El relato del Diluvio es el ejemplo cumbre del compendio bíblico. El redactor no eliminó las discrepancias de sus fuentes, 
              sino que las entrelazó versículo por versículo:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(234,179,8,0.06)', borderLeft: '3px solid #eab308', padding: '10px 14px', borderRadius: '4px' }}>
                <strong style={{ color: '#facc15', fontSize: '0.8rem' }}>Estrato J (Yahvista):</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  «De todo animal limpio tomarás siete parejas...» (Gen 7:2). La lluvia dura 40 días y 40 noches. Al final, Noé suelta un cuervo y una paloma, y ofrece sacrificios sobre un altar donde Yahvé huele el suave aroma.
                </p>
              </div>

              <div style={{ background: 'rgba(59,130,246,0.06)', borderLeft: '3px solid #3b82f6', padding: '10px 14px', borderRadius: '4px' }}>
                <strong style={{ color: '#60a5fa', fontSize: '0.8rem' }}>Estrato P (Sacerdotal):</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  «De dos en dos entraron en el arca...» (Gen 6:19). Las aguas prevalecen 150 días. Noé no ofrece sacrificios (porque en P el sacerdocio solo comienza en el Sinaí con Aarón). Se sella con el pacto del arcoíris.
                </p>
              </div>
            </div>
          </div>

          {/* Las 10 Toledot: El Esqueleto Arquitectónico de Génesis */}
          <div style={{
            background: 'rgba(11, 14, 22, 0.95)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bookmark size={16} color="var(--gold-400)" />
              <span className="font-cinzel" style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--gold-200)' }}>
                Las 10 Toledot (תּוֹלְדֹת): Los 10 Eslabones del Compendio
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>
              El autor-compilador estructuró todo el Génesis utilizando 10 fórmulas de enlace genealógico y narrativo llamadas 
              <strong> Toledot</strong> (<em>«Estas son las generaciones de...»</em>), que demuestran la arquitectura de compilación del libro:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '4px' }}>
              {[
                { num: "1", ref: "Gen 2:4", title: "Cielos y la Tierra" },
                { num: "2", ref: "Gen 5:1", title: "Adán y su Linaje" },
                { num: "3", ref: "Gen 6:9", title: "Noé y el Arca" },
                { num: "4", ref: "Gen 10:1", title: "Hijos de Noé (Naciones)" },
                { num: "5", ref: "Gen 11:10", title: "Sem (Línea Mesiánica)" },
                { num: "6", ref: "Gen 11:27", title: "Taré (Ciclo Abraham)" },
                { num: "7", ref: "Gen 25:12", title: "Ismael (Árabes del Desierto)" },
                { num: "8", ref: "Gen 25:19", title: "Isaac (Jacob y Esaú)" },
                { num: "9", ref: "Gen 36:1", title: "Esaú (Edón)" },
                { num: "10", ref: "Gen 37:2", title: "Jacob (Saga de José en Egipto)" }
              ].map(t => (
                <div key={t.num} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--gold-400)', minWidth: '18px' }}>{t.num}.</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: '600' }}>{t.title}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{t.ref}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          VISTA 2: TESTIGOS PRIMARIOS DE MANUSCRITOS
         ========================================================================= */}
      {viewTab === 'witnesses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Lista de Códices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Seleccionar Códice o Manuscrito:
            </span>
            {witnesses.map((witness) => {
              const isSelected = selectedWitness.siglum === witness.siglum;
              return (
                <button
                  key={witness.siglum}
                  onClick={() => setSelectedWitnessSiglum(witness.siglum)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.02)',
                    border: isSelected ? '1px solid var(--gold-400)' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    fontSize: '1.1rem',
                    fontFamily: 'serif',
                    color: isSelected ? 'var(--gold-300)' : 'var(--gold-500)',
                    minWidth: '24px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {witness.siglum}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: isSelected ? '#ffffff' : 'var(--text-muted)' }}>
                      {witness.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {witness.date}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ficha Detallada del Manuscrito Seleccionado */}
          <div style={{
            background: 'rgba(11, 14, 22, 0.95)',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212,175,55,0.15)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem', fontFamily: 'serif', color: 'var(--gold-400)', fontWeight: 'bold' }}>
                  {selectedWitness.siglum}
                </span>
                <span className="font-cinzel" style={{ fontSize: '1.02rem', fontWeight: '700', color: '#ffffff' }}>
                  {selectedWitness.name}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                {selectedWitness.date}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Lengua & Familia Textual:
              </span>
              <p style={{ margin: '2px 0 0', fontSize: '0.86rem', color: '#93c5fd' }}>
                {selectedWitness.language}
              </p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '14px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', textTransform: 'uppercase', fontWeight: '700' }}>
                Transcripción Paleográfica del Manuscrito:
              </span>
              <p style={{
                margin: '8px 0',
                fontSize: '1.45rem',
                lineHeight: 1.8,
                direction: selectedWitness.siglum === '𝔐' || selectedWitness.siglum === '𝔔' || selectedWitness.siglum === '𝔖' ? 'rtl' : 'ltr',
                color: '#ffd700',
                fontFamily: selectedWitness.siglum === '𝔊 (LXX)' ? "'SBL Greek', 'Gentium Plus', serif" : "'SBL Hebrew', 'Ezra SIL', serif",
                letterSpacing: '0.5px'
              }}>
                {selectedWitness.transcription}
              </p>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'block' }}>
                Traducción académica: {selectedWitness.translation}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Notas Críticas & Significado Exegético:
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {selectedWitness.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 3: APARATO DE VARIANTES CRÍTICAS (SIGLAS FORMALES)
         ========================================================================= */}
      {viewTab === 'variants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.84rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.06)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.18)' }}>
            <strong>Criterio de la Crítica Textual:</strong> Cotejo filológico de variantes significativas, lecciones difíciles (<em>lectio difficilior potior</em>) y lectura más breve (<em>lectio brevior</em>) en los manuscritos bíblicos.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {variants.map((variant, vIdx) => (
              <div
                key={vIdx}
                style={{
                  background: 'rgba(11, 14, 22, 0.95)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: '8px',
                  padding: '16px 18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--gold-200)' }}>
                    {variant.locus}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#93c5fd', background: 'rgba(59,130,246,0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                    {variant.witnesses}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Lectura masorética testigo: </span>
                  <span style={{ color: '#fef08a', fontFamily: "'SBL Hebrew', serif", fontWeight: '600', padding: '0 4px' }}>
                    {variant.masoretic}
                  </span>
                </div>

                <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                  {variant.analysis}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 4: CONTRASTE HISTÓRICO-CRÍTICO LAICO (SECULAR)
         ========================================================================= */}
      {viewTab === 'secular_critical' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          
          {/* Bloque 1: Comparativa Cosmogónica con Mesopotamia */}
          <div style={{
            background: 'rgba(11, 14, 22, 0.95)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={16} color="#93c5fd" />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Desmitificación Radical del Enuma Elish Babilónico
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0 }}>
              En el mito babilónico del <em>Enuma Elish</em>, el cosmos surge de una sangrienta teomaquia (guerra entre dioses) donde Marduk despedaza a Tiamat (el caos acuático salado). En contraste secular, <strong>Génesis 1 desmitifica la creación</strong>: el abismo primigenio (<em>tehom</em>, cognado lingüístico de Tiamat) no es un monstruo divino hostil, sino mera materia inanimada que obedece sumisa la palabra soberana del Creador.
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--gold-300)', marginTop: '4px' }}>
              Subversión teológica: Cero batalla cósmica; orden y propósito racional absoluto.
            </div>
          </div>

          {/* Bloque 2: Reducción del Sol y la Luna a "Lumbreras" */}
          <div style={{
            background: 'rgba(11, 14, 22, 0.95)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#4ade80" />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Secularización de los Astros Celestiales
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0 }}>
              En Egipto (Ra) y Mesopotamia (Shamash y Sin), el sol y la luna eran deidades supremas que controlaban el destino humano. El autor de Génesis 1 <strong>ni siquiera menciona sus nombres propios en hebreo (shemesh y yareaj)</strong> para evitar connotaciones idolátricas; los llama despectivamente «lumbrera mayor y lumbrera menor», tratándolos como meras lámparas de servicio temporal.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#4ade80', marginTop: '4px' }}>
              Antídoto contra la astrología babilónica y el fatalismo pagano del ANE.
            </div>
          </div>

          {/* Bloque 3: Datación Lingüística (CBH vs LBH) */}
          <div style={{
            background: 'rgba(11, 14, 22, 0.95)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="var(--gold-400)" />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--gold-300)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Filología Histórica: Lenguaje Sacerdotal Arcaizante
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0 }}>
              Los eruditos lingüistas (Avi Hurvitz, Gary Rendsburg) han analizado la gramática de Génesis 1: no presenta préstamos persas o griegos típicos del <em>Hebreo Bíblico Tardío (LBH)</em> de la época helenística. Emplea un <em>Hebreo Clásico (CBH)</em> pulido y arcaizante, propio de los círculos sacerdotales del Templo de Jerusalén antes de la caída en el 586 a.C.
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--gold-400)', marginTop: '4px' }}>
              Consenso laico: Preservación de archivos litúrgicos pre-exílicos compilados en el post-exilio.
            </div>
          </div>

          {/* Bloque 4: La Creación de la Humanidad como Reyes/Sacerdotes */}
          <div style={{
            background: 'rgba(11, 14, 22, 0.95)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#f472b6" />
              <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Democratización de la "Imagen de Dios"
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0 }}>
              En las inscripciones del Antiguo Oriente, <strong>únicamente el monarca o faraón</strong> era considerado «imagen visible de dios» (<em>tzelem elohim</em>), mientras que el pueblo común era creado como siervos para alimentar a los dioses. Génesis 1 subvierte esta jerarquía clasista: <strong>todo ser humano, varón y mujer, posee la dignidad regia y sacerdotal inviolable</strong> de ser imagen divina.
            </p>
            <div style={{ fontSize: '0.78rem', color: '#fce7f3', marginTop: '4px' }}>
              Fundamento ético universal de los derechos humanos y el valor ontológico de la persona.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
