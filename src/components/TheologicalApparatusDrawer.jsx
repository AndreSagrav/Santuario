import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Landmark, 
  ScrollText, 
  Compass, 
  ShieldCheck, 
  Copy, 
  Check, 
  Flame,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  Scale,
  Calendar,
  MapPin
} from 'lucide-react';
import { queryVerseApparatus } from '../services/criticalApparatusService';
import SacredContentRenderer from '../utils/sacredFormatter';
import TextualCriticismWorkbench from './TextualCriticismWorkbench';
import SacredGeographyMap from './SacredGeographyMap';
import HistoricalTimelineViewer from './HistoricalTimelineViewer';
import { getBookCorpus } from '../services/scholarlyApparatusEngine';

export default function TheologicalApparatusDrawer({ 
  isOpen, 
  onClose, 
  verseContext, // { book, chapter, verseNum, verseRange, text, version, verses }
  onConsultAI 
}) {
  const [activeDimension, setActiveDimension] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [apparatusContent, setApparatusContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const displayRef = verseContext?.verseRange 
    ? `${verseContext?.book || ''} ${verseContext?.chapter || ''}:${verseContext?.verseRange || ''}`
    : `${verseContext?.book || ''} ${verseContext?.chapter || ''}:${verseContext?.verseNum || ''}`;

  const corpus = getBookCorpus(verseContext?.book || '');

  useEffect(() => {
    if (isOpen && verseContext) {
      loadApparatus();
    } else {
      setApparatusContent('');
    }
  }, [isOpen, verseContext?.book, verseContext?.chapter, verseContext?.verseRange, verseContext?.verseNum]);

  if (!isOpen || !verseContext) return null;

  const loadApparatus = async () => {
    if (!verseContext) return;
    setIsLoading(true);
    try {
      const result = await queryVerseApparatus({
        book: verseContext.book,
        chapter: verseContext.chapter,
        verseNum: verseContext.verseNum,
        verseRange: verseContext.verseRange,
        text: verseContext.text,
        version: verseContext.version || 'RVR1960'
      });
      setApparatusContent(result);
    } catch (e) {
      setApparatusContent('Ocurrió una interrupción al generar el aparato crítico. Por favor reintente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!apparatusContent) return;
    navigator.clipboard.writeText(apparatusContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extraer secciones específicas del texto devuelto por la IA o motor exegético
  const getSectionContent = (sectionNum) => {
    if (!apparatusContent) return '';
    const regex = new RegExp(`(?:^|\\n)\\s*(?:#+\\s*)?${sectionNum}\\.?\\s*([^\\n]+)([\\s\\S]*?)(?=(?:\\n\\s*(?:#+\\s*)?\\d+\\.?\\s*[^\\n]+)|$)`, 'i');
    const match = apparatusContent.match(regex);
    if (match) {
      return `${match[1]}\n${match[2]}`.trim();
    }
    const sectionKeywords = [
      '',
      ['exégesis', 'morfología', 'lingüística'],
      ['contexto histórico', 'ane', 'sociocultural', 'trasfondo'],
      ['crítica textual', 'manuscritos', 'códice', 'variantes'],
      ['geografía', 'topografía', 'orografía', 'clima'],
      ['hermenéutica', 'pacto', 'cristológico', 'cristología']
    ];
    const keywords = sectionKeywords[sectionNum];
    if (keywords) {
      for (const kw of keywords) {
        const kwRegex = new RegExp(`(?:^|\\n)\\s*(?:#+\\s*)?([^\\n]*${kw}[^\\n]*)([\\s\\S]*?)(?=(?:\\n\\s*(?:#+\\s*)?\\d+\\.?\\s*[^\\n]+)|$)`, 'i');
        const kwMatch = apparatusContent.match(kwRegex);
        if (kwMatch) return `${kwMatch[1]}\n${kwMatch[2]}`.trim();
      }
    }
    return '';
  };

  // Generador de tarjetas de lenguas originales adaptadas al libro y pasaje activo
  const getOriginalCards = () => {
    if (corpus.isOldTestament) {
      if (corpus.book.includes('Crónicas')) {
        return {
          primaryTitle: 'Texto Masorético (Codex Leningradensis B19A):',
          primaryText: 'דִּבְרֵי הַיָּמִים • עֹזְרֵי הַמִּלְחָמָה בְּצִקְלַג',
          primaryTranslit: "Dibrê Hay-yamîm • 'ozrê ham-milḥamah b-Tsiqlag",
          secondaryTitle: 'Septuaginta Griega (1 Paralipómenos LXX):',
          secondaryText: 'Καὶ οὗτοι οἱ ἐλθόντες εἰς Σεκελακ • βοηθοῦντες ἐν πολέμῳ',
          secondaryTranslit: 'Kai houtoi hoi elthontes eis Sekelak • boēthountes en polemō',
          morphologyItems: [
            { spanish: 'Ayudadores en la guerra', term: 'עֹזְרֵי', translit: "'ozrê", strong: 'H5828', grammar: 'Part. activo plural constr. Qal', note: 'Describe una milicia leal cohesionada por juramento de fidelidad militar y espiritual.' },
            { spanish: 'Valientes / Hombres de poder', term: 'גִּבּוֹרִים', translit: 'gibbôrîm', strong: 'H1368', grammar: 'Sustantivo masc. plural', note: 'Guerreros veteranos de probada virtud moral, valentía y lealtad.' },
            { spanish: 'Siclag (Enclave)', term: 'צִקְלַג', translit: 'Tsiqlag', strong: 'H6860', grammar: 'Topónimo del Néguev', note: 'Base estratégica de David donde se fraguó la unificación de las doce tribus.' }
          ]
        };
      }
      if (corpus.book.includes('Génesis')) {
        const chap = Number(verseContext?.chapter) || 1;
        if (chap === 15) {
          return {
            primaryTitle: 'Texto Masorético (BHS / Codex Leningradensis B19A):',
            primaryText: 'אַחַר הַדְּבָרִים הָאֵלֶּה הָיָה דְבַר־יְהוָה אֶל־אַבְרָם בַּמַּחֲזֶה לֵאמֹר אַל־תִּירָא אַבְרָם אָנֹכִי מָגֵן לָךְ שְׂכָרְךָ הַרְבֵּה מְאֹד',
            primaryTranslit: "Ajar hadevarim ha'elleh hayah devar-YHVH 'el-Avram bammajazeh lemor: 'Al-tirá Avram, 'anoki magén lak, sekharka harbeh me'od",
            secondaryTitle: 'Septuaginta Griega (Génesis 15 LXX):',
            secondaryText: 'Μετὰ δὲ τὰ ῥήματα ταῦτα ἐγενήθη ῥῆμα κυρίου πρὸς Αβραμ ἐν ὁράματι λέγων Μὴ φοβοῦ, Αβραμ· ἐγὼ ὑπερασπίζω σου· ὁ μισθός σου πολὺς ἔσται σφόδρα',
            secondaryTranslit: "Meta de ta rhēmata tauta egenēthē rhēma kyriou pros Abram en horamati legōn: Mē phobou, Abram; egō hyperaspizō sou; ho misthos sou polys estai sphodra",
            morphologyItems: [
              { spanish: 'No temas', term: 'אַל־תִּירָא', translit: 'Al-tirá', strong: 'H3372', grammar: 'Negación אַל + Qal Imperfecto 2ms (Jussivo)', note: 'Fórmula divina de oráculo de salvación: disipa el temor existencial de Abram garantizando paz absoluta.' },
              { spanish: 'Escudo / Protector', term: 'מָגֵן', translit: 'Magén', strong: 'H4043', grammar: 'Sustantivo masculino absoluto', note: 'Metáfora de defensa soberana: Dios no solo da protección, sino que Él mismo es el escudo viviente de Abram.' },
              { spanish: 'Tu galardón / Recompensa', term: 'שְׂכָרְךָ', translit: 'Sekharkha', strong: 'H7939', grammar: 'Sustantivo masculino con sufijo 2ms', note: 'Recompensa infinita: el Eterno mismo es la herencia viva de quien camina por fe ante la falta de heredero.' },
              { spanish: 'Visión profética', term: 'בַּמַּחֲזֶה', translit: 'Bammajazeh', strong: 'H4236', grammar: 'Prefijo Bet + sustantivo masc. (raíz חָזָה)', note: 'Primera mención de revelación en visión en el canon bíblico; preludio al conteo de las estrellas en la noche.' },
              { spanish: 'Palabra de Jehová', term: 'דְּבַר־יְהוָה', translit: 'Devar-YHVH', strong: 'H1697 / H3068', grammar: 'Constructo verbal + Tetragrámaton', note: 'La palabra viva y vinculante que precede a toda evidencia visible y sella la promesa del pacto.' }
            ]
          };
        }

        if (chap >= 12 && chap <= 25) {
          return {
            primaryTitle: 'Texto Masorético (BHS / Codex Leningradensis B19A):',
            primaryText: 'וְאֶעֶשְׂךָ לְגוֹי גָּדוֹל וַאֲבָרֶכְךָ וַאֲגַדְּלָה שְׁמֶךָ וֶהְיֵה בְּרָכָה',
            primaryTranslit: "We'e'eska legoy gadol wa'avarekheka wa'agaddelah shemeka wehyeh berakah",
            secondaryTitle: 'Septuaginta Griega (LXX Patriarcal):',
            secondaryText: 'καὶ ποιήσω σε εἰς ἔθνος μέγα καὶ εὐλογήσω σε καὶ μεγαλυνῶ τὸ ὄνομά σου',
            secondaryTranslit: 'Kai poiēsō se eis ethnos mega kai eulogēsō se',
            morphologyItems: [
              { spanish: 'Vete por ti mismo', term: 'לֶךְ־לְךָ', translit: 'Lej-lejá', strong: 'H3212', grammar: 'Imperativo Qal 2ms + dativo ético', note: 'Llamamiento radical de ruptura con la idolatría de Ur para seguir la voz de Dios.' },
              { spanish: 'Bendición / Sé bendición', term: 'בְּרָכָה', translit: 'Berajah', strong: 'H1293', grammar: 'Sustantivo femenino', note: 'El propósito del pacto no es acumular privilegio, sino irradiar redención a todas las naciones.' },
              { spanish: 'Nación grande', term: 'גּוֹי גָּדוֹל', translit: 'Goy gadol', strong: 'H1471 / H1419', grammar: 'Sustantivo masc. + adjetivo', note: 'Promesa de descendencia incontable cumplida tipológicamente en Israel y espiritualmente en la Iglesia.' }
            ]
          };
        }

        return {
          primaryTitle: 'Texto Masorético (BHS / Codex Leningradensis):',
          primaryText: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
          primaryTranslit: "Bereshit bara Elohim 'et hashamayim w'et ha'aretz",
          secondaryTitle: 'Septuaginta Griega (Génesis LXX):',
          secondaryText: 'Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν',
          secondaryTranslit: 'En archē epoiēsen ho theos ton ouranon kai tēn gēn',
          morphologyItems: [
            { spanish: 'En el principio', term: 'בְּרֵאשִׁית', translit: 'Bereshit', strong: 'H7225', grammar: 'Sustantivo femenino constructo con prefijo Bet', note: 'Apertura solemne que designa el punto de partida absoluto del tiempo y el cosmos ordenado por Dios.' },
            { spanish: 'Creó', term: 'בָּרָא', translit: 'Bará', strong: 'H1254', grammar: 'Verbo Qal Perfecto 3ª masc. sing.', note: 'Creación soberana ex nihilo (sin materia preexistente). Su sujeto exclusivo en todo el Tanaj bíblico es Dios.' },
            { spanish: 'Dios', term: 'אֱלֹהִים', translit: 'Elohim', strong: 'H430', grammar: 'Sustantivo masculino plural con verbo en singular', note: 'Plural de majestad creadora absoluta que denota la plenitud de poder y soberanía infinita.' },
            { spanish: 'Los cielos y la tierra', term: 'הַשָּׁמַיִם וְהָאָרֶץ', translit: "hashamayim w'et ha'aretz", strong: 'H8064 / H776', grammar: 'Merismo hebreo cosmológico', note: 'Figura de merismo que abarca la totalidad del universo creado, de lo más alto a lo más profundo.' }
          ]
        };
      }
      if (corpus.book.includes('Salmo')) {
        return {
          primaryTitle: 'Texto Masorético Tiberiense (BHS):',
          primaryText: 'יְהוָה רֹעִי לֹא אֶחְסָר',
          primaryTranslit: "YHVH ro'i lo 'eḥsar",
          secondaryTitle: 'Septuaginta Griega (Salmos LXX):',
          secondaryText: 'κύριος ποιμαίνει με καὶ οὐδέν με ὑστερήσει',
          secondaryTranslit: 'Kyrios poimainei me kai ouden me hysterēsei',
          morphologyItems: [
            { spanish: 'Mi pastor / me pastorea', term: 'רֹעִי', translit: "Ro'î", strong: 'H7462', grammar: 'Participio activo Qal con sufijo 1s', note: 'Acción continua: «pastoreándome de continuo». Cuidado tierno, defensa y guía ininterrumpida.' },
            { spanish: 'Nada me faltará', term: 'לֹא אֶחְסָר', translit: "Lo 'eḥsar", strong: 'H2637', grammar: 'Negación absoluta + Qal Imperfecto 1s', note: 'Certeza inquebrantable de que en la comunión con el Eterno nunca habrá carencia vital.' },
            { spanish: 'El Señor / Yahweh', term: 'יְהוָה', translit: 'Yahwéh', strong: 'H3068', grammar: 'Nombre propio sagrado inefable (Tetragrámaton)', note: 'El Dios autosuficiente y fiel que entra en pacto personal e inquebrantable con su pueblo.' }
          ]
        };
      }
      return {
        primaryTitle: 'Texto Masorético (Codex Leningradensis B19A):',
        primaryText: 'כֹּה אָמַר יְהוָה • תּוֹרַת יְהוָה תְּמִימָה',
        primaryTranslit: "Koh 'amar YHVH • Torat YHVH temimah",
        secondaryTitle: 'Septuaginta Griega (LXX Alejandrina):',
        secondaryText: 'ὁ νόμος τοῦ κυρίου ἄμωμος • ἐπιστρέφων ψυχάς',
        secondaryTranslit: 'Ho nomos tou kyriou amōmos',
        morphologyItems: [
          { spanish: 'El Señor / Yahweh', term: 'יְהוָה', translit: 'Yahwéh', strong: 'H3068', grammar: 'Tetragrámaton sagrado', note: 'Nombre propio inefable del Dios de la alianza eterna.' },
          { spanish: 'Misericordia / Amor Leal', term: 'חֶסֶד', translit: 'Jésed', strong: 'H2617', grammar: 'Sustantivo masculino', note: 'Gracia, fidelidad de pacto y amor entrañable e incondicional.' },
          { spanish: 'Paz / Plenitud', term: 'שָׁלוֹם', translit: 'Shalom', strong: 'H7965', grammar: 'Sustantivo masculino', note: 'Integridad cósmica, justicia, reposo y bienestar integral divino.' }
        ]
      };
    } else {
      return {
        primaryTitle: 'Novum Testamentum Graece (NA28 / Textus Receptus):',
        primaryText: 'χάρις ὑμῖν καὶ εἰρήνη ἀπὸ θεοῦ πατρὸς ἡμῶν',
        primaryTranslit: 'Charis hymin kai eirēnē apo theou patros hēmōn',
        secondaryTitle: 'Vulgata Latina (San Jerónimo):',
        secondaryText: 'Gratia vobis et pax a Deo Patre et Domino Iesu Christo',
        secondaryTranslit: 'Vulgata Clementina / Stuttgart',
        morphologyItems: [
          { spanish: 'Gracia', term: 'χάρις', translit: 'Jaris', strong: 'G5485', grammar: 'Sustantivo femenino nominativo', note: 'Favor y benevolencia inmerecida otorgada libremente por Dios a través de Cristo.' },
          { spanish: 'Fe / Fidelidad', term: 'πίστις', translit: 'Pistis', strong: 'G4102', grammar: 'Sustantivo femenino nominativo', note: 'Confianza activa, convicción firme y entrega de lealtad absoluta.' },
          { spanish: 'Paz', term: 'εἰρήνη', translit: 'Eirēnē', strong: 'G1515', grammar: 'Sustantivo femenino nominativo', note: 'Paz mesiánica reconciliadora sellada en la cruz y derramada por el Espíritu Santo.' }
        ]
      };
    }
  };

  // Generador de tarjetas de pacto cristocéntrico
  const getCovenantCards = () => {
    if (corpus.book.includes('Crónicas')) {
      return [
        {
          badge: 'Pacto Davídico (1 Crón 17 / 2 Sam 7)',
          color: 'var(--gold-400)',
          bg: 'rgba(212,175,55,0.06)',
          border: 'rgba(212,175,55,0.25)',
          text: 'La concentración de las 12 tribus en torno a David en Hebrón sella la promesa del trono eterno. David unifica la adoración cúltica y el sacerdocio como preparación para la edificación del Templo.'
        },
        {
          badge: 'Cumplimiento Mesiánico en Cristo',
          color: '#93c5fd',
          bg: 'rgba(59,130,246,0.06)',
          border: 'rgba(147,197,253,0.25)',
          text: 'Jesucristo, el Hijo de David definitivo, congrega a los valientes de la fe de toda tribu, lengua y nación, derribando los poderes de las tinieblas y reinando con justicia inmutable.'
        },
        {
          badge: 'Discernimiento de los Tiempos',
          color: '#4ade80',
          bg: 'rgba(74,222,128,0.06)',
          border: 'rgba(74,222,128,0.25)',
          text: 'Como los sabios de Isacar «entendidos en los tiempos para saber lo que Israel debía hacer» (1 Crón 12:32), la iglesia discierne la soberanía del Rey Jesús en la historia.'
        }
      ];
    }
    if (corpus.book.includes('Salmo')) {
      return [
        {
          badge: 'Pacto Davídico',
          color: 'var(--gold-400)',
          bg: 'rgba(212,175,55,0.06)',
          border: 'rgba(212,175,55,0.25)',
          text: 'El rey David se despoja de su manto real para declararse oveja y siervo de YHWH, el verdadero pastor de Israel.'
        },
        {
          badge: 'Cumplimiento Mesiánico',
          color: '#93c5fd',
          bg: 'rgba(59,130,246,0.06)',
          border: 'rgba(147,197,253,0.25)',
          text: 'Jesús sella Ezequiel 34: «Yo soy el buen pastor; el buen pastor su vida da por las ovejas» (Jn 10:11).'
        },
        {
          badge: 'Pacto Eterno (Hebreos 13:20)',
          color: '#f472b6',
          bg: 'rgba(244,114,182,0.06)',
          border: 'rgba(244,114,182,0.25)',
          text: '«El Dios de paz que resucitó de los muertos a nuestro Señor Jesucristo, el gran pastor de las ovejas por la sangre del pacto eterno».'
        }
      ];
    }
    if (corpus.book.includes('Génesis')) {
      const chap = Number(verseContext?.chapter) || 1;
      if (chap >= 12 && chap <= 25) {
        return [
          {
            badge: 'Pacto Abrahámico Soberano (Génesis 15:1-18)',
            color: 'var(--gold-400)',
            bg: 'rgba(212,175,55,0.06)',
            border: 'rgba(212,175,55,0.25)',
            text: 'Dios sella el pacto unilateral pasando en fuego (horno humeante y antorcha) entre los animales divididos. Dios asume en solitario el juramento solemne de fidelidad hacia Abram y su descendencia.'
          },
          {
            badge: 'La Justificación por la Fe (Génesis 15:6)',
            color: '#93c5fd',
            bg: 'rgba(59,130,246,0.06)',
            border: 'rgba(147,197,253,0.25)',
            text: '«Y creyó a Jehová, y le fue contado por justicia». Citado por el apóstol Pablo en Romanos 4 y Gálatas 3 como la piedra angular del evangelio: la salvación por la fe en Cristo, no por obras de la ley.'
          },
          {
            badge: 'La Promesa de la Simiente Mesiánica',
            color: '#4ade80',
            bg: 'rgba(74,222,128,0.06)',
            border: 'rgba(74,222,128,0.25)',
            text: '«Mira ahora los cielos, y cuenta las estrellas... así será tu simiente». Gálatas 3:16 revela que la promesa definitiva no hablaba de muchos linajes, sino de uno: Jesucristo, salvador de todas las naciones.'
          }
        ];
      }

      return [
        {
          badge: 'Pacto Edénico & Mandato Creacional (Gén 1-2)',
          color: 'var(--gold-400)',
          bg: 'rgba(212,175,55,0.06)',
          border: 'rgba(212,175,55,0.25)',
          text: 'Dios establece al ser humano a Su imagen y semejanza (Imago Dei) como mayordomo de la creación, en santidad y comunión perfecta con el Creador.'
        },
        {
          badge: 'Cristo, Verbo Creador & Sustentador',
          color: '#93c5fd',
          bg: 'rgba(59,130,246,0.06)',
          border: 'rgba(147,197,253,0.25)',
          text: 'Juan 1:1-3 y Colosenses 1:16 revelan que en Cristo fueron creadas todas las cosas en los cielos y en la tierra; Él es anterior a todas las cosas y en Él todas subsisten.'
        },
        {
          badge: 'El Protoevangelio & Victoria del Mesías (Gén 3:15)',
          color: '#4ade80',
          bg: 'rgba(74,222,128,0.06)',
          border: 'rgba(74,222,128,0.25)',
          text: 'La primera promesa redentora del pacto: la simiente de la mujer aplastará la cabeza de la serpiente, culminando en la resurrección triunfal de Jesús.'
        }
      ];
    }
    if (corpus.isOldTestament) {
      return [
        {
          badge: 'Pacto de Redención & Promesa',
          color: 'var(--gold-400)',
          bg: 'rgba(212,175,55,0.06)',
          border: 'rgba(212,175,55,0.25)',
          text: `El pasaje de ${verseContext?.book || ''} se inserta en el despliegue progresivo del pacto de Dios con su pueblo escogido, preservando la línea de la promesa redentora.`
        },
        {
          badge: 'Cumplimiento Tipológico en Cristo',
          color: '#93c5fd',
          bg: 'rgba(59,130,246,0.06)',
          border: 'rgba(147,197,253,0.25)',
          text: 'Toda la Escritura hebrea encuentra su «Sí y Amén» en Cristo Jesús (2 Cor 1:20), quien personifica y culmina las promesas hechas a los padres.'
        }
      ];
    }
    return [
      {
        badge: 'El Nuevo Pacto Consumado',
        color: 'var(--gold-400)',
        bg: 'rgba(212,175,55,0.06)',
        border: 'rgba(212,175,55,0.25)',
        text: 'Sellado en la sangre de Jesús para justificación eterna, trayendo comunión directa y acceso confiado ante el trono de la gracia.'
      },
      {
        badge: 'Esperanza Escatológica & Victoria',
        color: '#93c5fd',
        bg: 'rgba(59,130,246,0.06)',
        border: 'rgba(147,197,253,0.25)',
        text: 'La proclamación de la resurrección confirma que la muerte y el pecado han sido vencidos, anticipando los cielos nuevos y la tierra nueva.'
      }
    ];
  };

  const origCards = getOriginalCards();
  const covCards = getCovenantCards();

  if (!isOpen || !verseContext) return null;

  const dimensions = [
    { id: 'all', label: 'Aparato 5D', icon: Layers, badge: '5 Dim.' },
    { id: 'exegesis', label: '1. Exégesis', icon: BookOpen, badge: 'Heb/Gr' },
    { id: 'history', label: '2. Historia & ANE', icon: Landmark, badge: 'Línea Tiempo' },
    { id: 'textual', label: '3. Crítica Textual', icon: Scale, badge: '5 Códices' },
    { id: 'geography', label: '4. Geografía & Clima', icon: Compass, badge: 'Topografía' },
    { id: 'covenant', label: '5. Pacto Sagrado', icon: ShieldCheck, badge: 'Cristocéntrico' }
  ];

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      background: 'rgba(3, 4, 7, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '12px 16px',
      overflow: 'hidden'
    }}>
      
      {/* Estación de Trabajo Panorámica Expandible (Espaciosa, anclada arriba, sin cortes ni apelotamiento) */}
      <div style={{
        width: '98vw',
        maxWidth: '1720px',
        height: 'calc(100vh - 24px)',
        maxHeight: 'calc(100vh - 24px)',
        background: 'linear-gradient(180deg, #090c14 0%, #050609 100%)',
        border: '1px solid rgba(212,175,55,0.35)',
        borderRadius: '16px',
        boxShadow: '-10px 0 50px rgba(0,0,0,0.9), 0 0 50px rgba(212,175,55,0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        animation: 'zoomIn 0.25s ease'
      }}>
        
        {/* =========================================================================
            1. BARRA SUPERIOR DE CONTROL & HERRAMIENTAS ACADÉMICAS
           ========================================================================= */}
        <div style={{
          padding: '14px 28px',
          borderBottom: '1px solid rgba(212,175,55,0.22)',
          background: 'rgba(8, 11, 18, 0.98)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Identidad del Pasaje y Rango Seleccionado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(212,175,55,0.14)',
              border: '1.5px solid var(--gold-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(212,175,55,0.25)'
            }}>
              <ScrollText size={22} color="var(--gold-400)" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: 'var(--gold-400)', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.12em',
                  background: 'rgba(212,175,55,0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(212,175,55,0.3)'
                }}>
                  Gabinete de Investigación Crítica 5D
                </span>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd', background: 'rgba(59,130,246,0.12)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(147,197,253,0.25)' }}>
                  Rigor Factual 0.2
                </span>
                {verseContext?.verses?.length > 1 && (
                  <span style={{ fontSize: '0.72rem', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(74,222,128,0.25)', fontWeight: '700' }}>
                    {verseContext.verses.length} versículos seleccionados
                  </span>
                )}
              </div>
              <h3 className="font-cinzel gold-text-gradient" style={{ fontSize: '1.55rem', fontWeight: '800', margin: 0 }}>
                {displayRef}
              </h3>
            </div>
          </div>

          {/* Texto del Rango en Estudio */}
          <div style={{
            flex: '1 1 380px',
            maxWidth: '680px',
            maxHeight: '68px',
            overflowY: 'auto',
            padding: '8px 14px',
            background: 'rgba(212,175,55,0.04)',
            border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--gold-100)',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.5
            }}>
              «{verseContext.text}»
            </p>
          </div>

          {/* Botones de Control: Maximizar / Copiar / Cerrar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: isExpanded ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.25)',
                color: isExpanded ? 'var(--gold-300)' : 'var(--text-muted)',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title={isExpanded ? "Reducir a panel lateral" : "Expandir a pantalla completa"}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isExpanded ? 'Gabinete Lateral' : 'Pantalla Completa'}</span>
            </button>

            <button
              onClick={handleCopy}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(212,175,55,0.2)',
                color: 'var(--gold-300)',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Copiar aparato crítico"
            >
              {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-muted)',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title="Cerrar gabinete"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. SELECTOR DE LAS 5 DIMENSIONES TEOLÓGICAS (PANORÁMICO, SIN CORTES)
           ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: '6px',
          padding: '10px 20px',
          background: 'rgba(5, 7, 11, 0.98)',
          borderBottom: '1px solid rgba(212,175,55,0.18)',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            const isSelected = activeDimension === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => setActiveDimension(dim.id)}
                title={`${dim.label} (${dim.badge})`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? '700' : '500',
                  background: isSelected ? 'linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.1) 100%)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? 'var(--gold-400)' : 'rgba(255,255,255,0.06)'}`,
                  color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 0 15px rgba(212,175,55,0.15)' : 'none',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Icon size={14} color={isSelected ? 'var(--gold-400)' : 'currentColor'} style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: isSelected ? '700' : '500' }}>{dim.label}</span>
                {dim.badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    color: isSelected ? 'var(--gold-300)' : '#71717a',
                    background: 'rgba(0,0,0,0.35)',
                    padding: '2px 5px',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}>
                    {dim.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            3. ÁREA DE ESTUDIO EXPANSIVA & SIN APELOTAMIENTOS
           ========================================================================= */}
        <div style={{
          flex: 1,
          padding: '28px 32px',
          overflowY: 'auto',
          lineHeight: 1.7,
          fontSize: '0.95rem',
          color: 'var(--text-main)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              gap: '18px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(212,175,55,0.1)',
                border: '2px solid var(--gold-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={28} color="var(--gold-400)" className="animate-spin" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="font-cinzel gold-text-gradient" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                  Cotejando Códices & Crítica Pentadimensional
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Analizando variantes de Qumrán, LXX, Leningrado B19A y geografía física de Judea...
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* =========================================================================
                  MODO A: APARATO COMPLETO 5D (REJILLA PANORÁMICA DE 2 COLUMNAS AMPLIAS)
                 ========================================================================= */}
              {activeDimension === 'all' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
                  gap: '24px',
                  alignItems: 'start'
                }}>
                  
                  {/* COLUMNA IZQUIERDA: FILOLOGÍA, MORFOLOGÍA & CRÍTICA TEXTUAL */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Dimensión 1: Exégesis Morfosintáctica */}
                    <div style={{
                      background: 'rgba(10, 13, 20, 0.85)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '12px',
                      padding: '22px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BookOpen size={18} color="var(--gold-400)" />
                          <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
                            1. Exégesis Lingüística & Morfología
                          </h4>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--gold-300)', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.25)' }}>
                          Hebreo Masorético & LXX
                        </span>
                      </div>

                      {/* Tarjetas de Idiomas Originales */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{origCards.primaryTitle}</span>
                          <div style={{ fontFamily: corpus.isOldTestament ? "'SBL Hebrew', serif" : "'SBL Greek', serif", fontSize: '1.35rem', color: '#fef08a', direction: corpus.isOldTestament ? 'rtl' : 'ltr', marginTop: '4px' }}>
                            {origCards.primaryText}
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>{origCards.primaryTranslit}</span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{origCards.secondaryTitle}</span>
                          <div style={{ fontFamily: "'SBL Greek', serif", fontSize: '1.15rem', color: '#fef08a', marginTop: '4px' }}>
                            {origCards.secondaryText}
                          </div>
                          <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>{origCards.secondaryTranslit}</span>
                        </div>
                      </div>

                      {/* Fichas Léxicas con Español Destacado, Original y Morfología */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        {origCards.morphologyItems.map((item, idx) => (
                          <div key={idx} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(212,175,55,0.22)',
                            borderRadius: '10px',
                            padding: '14px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                                «{item.spanish || item.term}»
                              </span>
                              <span style={{
                                fontSize: '0.72rem',
                                color: 'var(--gold-400)',
                                background: 'rgba(212,175,55,0.12)',
                                border: '1px solid rgba(212,175,55,0.3)',
                                padding: '2px 7px',
                                borderRadius: '4px',
                                fontWeight: '700'
                              }}>
                                {item.strong || ''}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                fontFamily: corpus.isOldTestament ? "'SBL Hebrew', serif" : "'SBL Greek', serif",
                                color: '#fef08a',
                                fontWeight: '700',
                                fontSize: '1.2rem',
                                direction: corpus.isOldTestament ? 'rtl' : 'ltr'
                              }}>
                                {item.term}
                              </span>
                              {item.translit && (
                                <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.82rem' }}>
                                  ({item.translit})
                                </span>
                              )}
                            </div>

                            {item.grammar && (
                              <span style={{ fontSize: '0.74rem', color: '#60a5fa', fontWeight: '700' }}>
                                {item.grammar}
                              </span>
                            )}

                            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.55' }}>
                              {item.note}
                            </p>
                          </div>
                        ))}
                      </div>

                      {getSectionContent(1) && (
                        <SacredContentRenderer content={getSectionContent(1)} multiColumn={true} />
                      )}
                    </div>

                    {/* Dimensión 3: Crítica Textual Real */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <TextualCriticismWorkbench verseRef={displayRef} verseContext={verseContext} />
                    </div>

                  </div>

                  {/* COLUMNA DERECHA: GEOGRAFÍA, HISTORIA ANE & PACTO */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Dimensión 4: Geografía Sagrada & Topografía */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <SacredGeographyMap bookName={verseContext.book} chapter={verseContext.chapter} verseRef={displayRef} />
                    </div>

                    {/* Dimensión 2: Contexto Histórico & ANE (Línea de Tiempo) */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <HistoricalTimelineViewer bookName={verseContext.book} chapter={verseContext.chapter} verseRef={displayRef} />
                    </div>

                    {/* Dimensión 5: Teología del Pacto */}
                    <div style={{
                      background: 'rgba(10, 13, 20, 0.85)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: '12px',
                      padding: '22px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                        <ShieldCheck size={18} color="var(--gold-400)" />
                        <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>
                          5. Teología del Pacto & Cristología
                        </h4>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                        {covCards.map((card, idx) => (
                          <div key={idx} style={{ background: card.bg, padding: '12px 14px', borderRadius: '8px', border: `1px solid ${card.border}` }}>
                            <span style={{ fontSize: '0.72rem', color: card.color, fontWeight: '700', textTransform: 'uppercase' }}>{card.badge}</span>
                            <p style={{ fontSize: '0.84rem', color: '#e2e8f0', margin: '4px 0 0', lineHeight: 1.5 }}>
                              {card.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {getSectionContent(5) && (
                        <SacredContentRenderer content={getSectionContent(5)} multiColumn={false} />
                      )}
                    </div>

                  </div>

                </div>
              )}

              {/* =========================================================================
                  MODO B: DIMENSIÓN 1 - EXÉGESIS & MORFOLOGÍA (TRÍPTICO FILOLÓGICO)
                 ========================================================================= */}
              {activeDimension === 'exegesis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Tríptico Filológico en 3 Columnas */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '16px'
                  }}>
                    {/* Columna A: Texto Masorético / Original Primario */}
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold-400)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {origCards.primaryTitle}
                      </span>
                      <div style={{ fontFamily: corpus.isOldTestament ? "'SBL Hebrew', serif" : "'SBL Greek', serif", fontSize: '1.45rem', color: '#fef08a', direction: corpus.isOldTestament ? 'rtl' : 'ltr', margin: '10px 0' }}>
                        {origCards.primaryText}
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                        {origCards.primaryTranslit}
                      </p>
                    </div>

                    {/* Columna B: Septuaginta Griega / Versión Secundaria */}
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {origCards.secondaryTitle}
                      </span>
                      <div style={{ fontFamily: "'SBL Greek', serif", fontSize: '1.25rem', color: '#fef08a', margin: '10px 0' }}>
                        {origCards.secondaryText}
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                        {origCards.secondaryTranslit}
                      </p>
                    </div>

                    {/* Columna C: Morfosintaxis Clave */}
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Lemas & Raíces Fuertes ({verseContext.book})
                      </span>
                      <div style={{ fontSize: '0.86rem', color: '#e2e8f0', marginTop: '10px', lineHeight: 1.7 }}>
                        {origCards.morphologyItems.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '6px' }}>
                            • <strong>{item.term}:</strong> {item.note}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Análisis Exegético en Rejilla de Tarjetas */}
                  <div style={{ marginTop: '8px' }}>
                    <SacredContentRenderer 
                      content={getSectionContent(1) || apparatusContent} 
                      multiColumn={true} 
                    />
                  </div>

                </div>
              )}

              {/* =========================================================================
                  MODO C: DIMENSIÓN 2 - CONTEXTO HISTÓRICO & ANE (LÍNEA DE TIEMPO + ANÁLISIS)
                 ========================================================================= */}
              {activeDimension === 'history' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', alignItems: 'start' }}>
                  <HistoricalTimelineViewer bookName={verseContext.book} verseRef={displayRef} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                        <Landmark size={18} color="var(--gold-400)" />
                        <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                          Contexto Histórico & Arqueológico ({verseContext.book})
                        </h4>
                      </div>
                      
                      {getSectionContent(2) && (
                        <SacredContentRenderer content={getSectionContent(2)} multiColumn={true} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODO D: DIMENSIÓN 3 - CRÍTICA TEXTUAL REAL & COTEJO DE MANUSCRITOS
                 ========================================================================= */}
              {activeDimension === 'textual' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <TextualCriticismWorkbench verseRef={displayRef} verseContext={verseContext} />
                  {getSectionContent(3) && (
                    <SacredContentRenderer content={getSectionContent(3)} multiColumn={true} />
                  )}
                </div>
              )}

              {/* =========================================================================
                  MODO E: DIMENSIÓN 4 - GEOGRAFÍA SAGRADA & TOPOGRAFÍA INTERACTIVA
                 ========================================================================= */}
              {activeDimension === 'geography' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', alignItems: 'start' }}>
                  <SacredGeographyMap bookName={verseContext.book} chapter={verseContext.chapter} verseRef={displayRef} />
                  
                  <div style={{ background: 'rgba(10, 13, 20, 0.85)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(212,175,55,0.18)', paddingBottom: '10px' }}>
                      <Compass size={18} color="var(--gold-400)" />
                      <h4 className="font-cinzel gold-text-gradient" style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                        Geografía Teológica & Relieve ({verseContext.book})
                      </h4>
                    </div>

                    {getSectionContent(4) && (
                      <SacredContentRenderer content={getSectionContent(4)} multiColumn={true} />
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MODO F: DIMENSIÓN 5 - TEOLOGÍA DEL PACTO & CUMPLIMIENTO CRISTOLÓGICO
                 ========================================================================= */}
              {activeDimension === 'covenant' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '16px'
                  }}>
                    {covCards.map((card, idx) => (
                      <div key={idx} style={{ background: card.bg, padding: '18px', borderRadius: '12px', border: `1px solid ${card.border}` }}>
                        <span style={{ fontSize: '0.76rem', color: card.color, fontWeight: '700', textTransform: 'uppercase' }}>
                          {card.badge}
                        </span>
                        <p style={{ fontSize: '0.86rem', color: '#e2e8f0', margin: '6px 0 0', lineHeight: 1.6 }}>
                          {card.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {getSectionContent(5) && (
                    <SacredContentRenderer content={getSectionContent(5)} multiColumn={true} />
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* =========================================================================
            4. PIE DEL GABINETE CON FUENTES PRIMARIAS Y ACCIÓN RUAJ
           ========================================================================= */}
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid rgba(212,175,55,0.18)',
          background: 'rgba(6, 8, 13, 0.98)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--gold-400)' }}>Fuentes Consultadas:</span>
            <span>Codex Leningradensis B19A • Qumrán 4QPs • LXX Rahlfs-Hanhart • BDB • HALOT • BDAG</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onConsultAI?.({
                passage: {
                  title: `${verseContext.book} ${verseContext.chapter}:${verseContext.verseNum}`,
                  book: verseContext.book,
                  chapter: verseContext.chapter
                },
                mood: 'Investigación Académica & Crítica Textual'
              });
            }}
            className="gold-btn-gradient"
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.84rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={15} />
            <span>Profundizar con Ruaj Académico</span>
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}
