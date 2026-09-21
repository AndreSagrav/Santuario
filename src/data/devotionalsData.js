// ============================================================================
// BASE DE DATOS MAESTRA DE PLANES DEVOCIONALES SEMANALES - SANTUARIO AI
// 4 Semanas Estructuradas (28 Días de Altar) + Generación Continua por IA
// ============================================================================

export const WEEKS_DATA = [
  {
    id: "semana-1",
    weekNumber: 1,
    title: "Semana 1: Fundamentos de Paz, Provisión y Victoria",
    description: "7 días para anclar el alma en la gracia inquebrantable de Dios, calmar el afán y aprender a descansar en Su soberanía suprema.",
    theme: "Paz, Confianza y Seguridad Eterna",
    days: [
      {
        id: "devo-1",
        day: "Día 1",
        weekNumber: 1,
        title: "El Susurro de la Paz en Medio del Caos",
        subtitle: "Cómo anclar el alma cuando las circunstancias amenazan con desbordarte",
        passageId: "filipenses-4",
        highlightVerse: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.",
        highlightRef: "Filipenses 4:7",
        category: "Paz & Ansiedad",
        emotionTarget: "ansioso",
        durationMinutes: 8,
        reflection: `La palabra que el apóstol Pablo utiliza para 'guardar' (phroureo) es un término militar romano que describe a un destacamento de soldados fuertemente armados apostados en las murallas de una fortaleza para impedir cualquier infiltración enemiga.

Cuando la ansiedad intenta sitiar tu mente —bombardeándote con preguntas de '¿qué pasará si...?', deudas, temores sobre el futuro o dolores del pasado—, Dios no te ofrece una simple fórmula de pensamiento positivo. Te ofrece un Centinela Celestial: Su propia Paz.

Esta paz no es la ausencia de problemas, sino la presencia viva de una Persona. No es negociable con el mundo; trasciende toda lógica humana porque proviene de la soberanía de Aquel que calma la tempestad con un solo mandato.`,
        journalPrompts: [
          "¿Cuál es el pensamiento o preocupación recurrente que hoy intenta robarte la quietud?",
          "Si creyeras al 100% que la Paz de Dios está custodiando tu mente ahora mismo, ¿qué decisión tomarías diferente hoy?"
        ],
        guidedPrayer: `Señor y Padre Santo, hoy decido soltar el control ilusorio de lo que no puedo cambiar. En tus manos deposito mis incertidumbres, mis silencios y mis temores no expresados. 

Reclamo tu Paz que sobrepasa toda comprensión humana como una fortaleza alrededor de mis pensamientos. Que en este instante cada fibra de mi ser reconozca que Tú estás en el trono y nada te toma por sorpresa. En el nombre de Jesús, amén.`
      },
      {
        id: "devo-2",
        day: "Día 2",
        weekNumber: 1,
        title: "La Mesa en el Desierto",
        subtitle: "Descubriendo la abundancia de Dios aun frente a lo adverso",
        passageId: "salmo-23",
        highlightVerse: "Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosando.",
        highlightRef: "Salmos 23:5",
        category: "Provisión & Confianza",
        emotionTarget: "agradecido",
        durationMinutes: 10,
        reflection: `En el antiguo Oriente Medio, preparar una mesa y servir un banquete a un viajero en presencia de sus perseguidores era la máxima declaración de protección y pacto inviolable por parte de un anfitrión poderoso. Mientras el huésped estuviera comiendo bajo la tienda del anfitrión, ningún enemigo se atrevería a tocarle un solo cabello.

Dios no espera a que todos tus problemas desaparezcan para bendecirte. Él monta un banquete de gracia, paz y revelación justo en medio del campo de batalla. Ungir tu cabeza con aceite era la señal de que no eras un esclavo ni un mendigo: eras un invitado de honor de la realeza.

Hoy tu copa no está medio vacía ni a medias: rebosa con la fidelidad de Aquel que jamás te abandonará en el camino.`,
        journalPrompts: [
          "¿En qué área de tu vida has sentido escasez o intimidación recientemente?",
          "Haz un recuento de 3 favores inmerecidos que Dios te ha brindado en los últimos 30 días."
        ],
        guidedPrayer: `Buen Pastor, te doy gracias porque no dependo del clima económico ni de las opiniones humanas para tener sustento y paz. Tú eres quien me cubre, quien me sacia y quien me guía a aguas de reposo.

Acepto hoy tu unción de gozo y declaro que mi copa rebosa de tu favor. Camino con la cabeza en alto, confiando en tu dirección perfecta. Amén.`
      },
      {
        id: "devo-3",
        day: "Día 3",
        weekNumber: 1,
        title: "El Poder del Renuevo Divino",
        subtitle: "El intercambio sagrado: tu debilidad por Su fuerza indomable",
        passageId: "isaias-40",
        highlightVerse: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.",
        highlightRef: "Isaías 40:31",
        category: "Fortaleza & Renovación",
        emotionTarget: "cansado",
        durationMinutes: 7,
        reflection: `La palabra hebrea para 'esperar' en este versículo es 'Qavah', que originalmente se usaba para el acto de torcer y entrelazar hebras débiles de lino para formar una soga gruesa e indestructible.

Esperar en Dios no es sentarse pasivamente con los brazos cruzados; es entrelazar activamente tus frágiles fuerzas con la omnipotencia divina. En este intercambio santo, tú le entregas tu cansancio crónico, tu fatiga emocional y tus límites humanos, y Él te imparte la resistencia de Su Espíritu.

Las águilas no gastan energía aleteando desesperadamente en las tormentas; extienden sus alas y aprovechan las corrientes de aire ascendente para elevarse por encima de las nubes negras. Hoy estás invitado a remontar el vuelo con las corrientes de Su gracia.`,
        journalPrompts: [
          "¿Dónde has estado intentando luchar únicamente con tus propias fuerzas humanas?",
          "¿Qué carga necesitas descargar hoy a los pies de la cruz para poder volar ligero?"
        ],
        guidedPrayer: `Dios Eterno, reconozco que mis fuerzas humanas son finitas y que muchas veces me siento exhausto por la rutina y los desafíos. Hoy elijo entrelazar mi vida con tu Espíritu.

Toma mi agotamiento y dame tu vigor sobrenatural. Enséñame a reposar en tu promesa y a elevarme por encima de cualquier tormenta terrenal. En el nombre de Jesús, amén.`
      },
      {
        id: "devo-4",
        day: "Día 4",
        weekNumber: 1,
        title: "Amor Inseparable y Triunfo Absoluto",
        subtitle: "La certeza irrevocable de pertenecerle a Cristo",
        passageId: "romanos-8",
        highlightVerse: "Antes, en todas estas cosas somos más que vencedores por medio de aquel que nos amó.",
        highlightRef: "Romanos 8:37",
        category: "Identidad & Seguridad",
        emotionTarget: "herido",
        durationMinutes: 9,
        reflection: `El apóstol Pablo crea una palabra audaz en griego: 'Hypernikao', que se traduce literalmente como 'súper vencedores' o 'vencedores extraordinarios'. 

Un vencedor común tiene que pelear palmo a palmo y muchas veces termina herido y exhausto. Un 'hiper-vencedor' recibe los despojos, la corona y la victoria sin haber tenido que pagar la deuda infinita del castigo, porque Cristo ya peleó y venció en la cruz por nosotros.

Ningún veredicto del pasado, ninguna acusación de culpabilidad y ninguna angustia del presente tiene la potestad de quebrar el lazo del amor de Dios hacia ti. Estás sellado, protegido y respaldado por el Rey del Universo.`,
        journalPrompts: [
          "¿Hay alguna culpa o mentira del pasado que te haga dudar del amor incondicional del Padre?",
          "Escribe una declaración de victoria personal basada en Romanos 8 para proclamarla hoy."
        ],
        guidedPrayer: `Señor Jesús, gracias por tu sacrificio que canceló toda condenación en mi contra. Hoy descanso en la certeza inamovible de tu amor. 

Nada me puede apartar de tu presencia: ni mis dudas, ni mis tropiezos, ni el dolor pasajero. Me pongo en pie como más que vencedor en tu Santo Nombre. Amén.`
      },
      {
        id: "devo-5",
        day: "Día 5",
        weekNumber: 1,
        title: "La Brújula del Corazón Rendido",
        subtitle: "El descanso de no apoyarte en tu propia prudencia",
        passageId: "proverbios-3",
        highlightVerse: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.",
        highlightRef: "Proverbios 3:5-6",
        category: "Sabiduría & Dirección",
        emotionTarget: "direccion",
        durationMinutes: 8,
        reflection: `La palabra hebrea para 'fíate' es 'Bātach', una expresión vívida que describe el acto de dejarse caer con todo el peso del cuerpo sobre una superficie segura, sin reservas ni planes de escape.
        
El mayor agotamiento de la vida moderna no proviene del trabajo físico, sino de la sobrecarga de calcularlo todo con nuestra limitada prudencia humana. Pensar que el rumbo de nuestra vida depende enteramente de nuestras estrategias genera una tensión silenciosa pero corrosiva.
        
Reconocer a Dios no es pedirle que bendiga planes ya decididos; es consultarlo antes de dar el primer paso. Cuando rindes el timón, Él asume la responsabilidad de enderezar y allanar cada senda torcida.`,
        journalPrompts: [
          "¿En qué decisión crucial estás tentado a actuar guiado solo por tu lógica humana o la prisa?",
          "¿Qué implicaría para ti hoy 'dejarte caer con todo el peso' en los brazos del Señor respecto a esa situación?"
        ],
        guidedPrayer: `Señor Todopoderoso, renuncio a la tiranía de querer tener todas las respuestas. Reconozco que mis ojos solo ven el presente inmediato, pero Tú conoces el fin desde el principio.
        
Hoy te entrego mis dudas, mis proyectos y mi futuro. Guía mis pasos, endereza mis veredas y pon paz en mi corazón mientras espero en tu tiempo perfecto. En el nombre de Jesús, amén.`
      },
      {
        id: "devo-6",
        day: "Día 6",
        weekNumber: 1,
        title: "El Misterio de la Vid y los Pámpanos",
        subtitle: "El fruto que brota de la comunión íntima, no del activismo estéril",
        passageId: "juan-15",
        highlightVerse: "Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer.",
        highlightRef: "Juan 15:5",
        category: "Comunión & Fructificación",
        emotionTarget: "agradecido",
        durationMinutes: 9,
        reflection: `Una rama nunca se estresa, no gime ni hace esfuerzos titánicos para producir uvas. La rama simplemente se dedica a una sola tarea: permanecer firmemente unida al tronco para recibir el flujo incesante de savia vital. El fruto no es el resultado del esfuerzo febril del pámpano, sino la consecuencia natural de su conexión íntima con la vid.
        
Jesús emplea el verbo griego 'Menō' (morar, hacer morada continua). Muchos creyentes viven visitando a Dios como turistas en momentos de emergencia, en lugar de habitar en Él como residentes permanentes.
        
Cuando tu vida espiritual se desconecta de la fuente, cualquier actividad religiosa se vuelve una carga pesada. Al permanecer en Su presencia, el amor, el gozo, la paz y la victoria brotan con la misma naturalidad con la que el racimo brota de la vid sana.`,
        journalPrompts: [
          "¿Sientes que tu vida espiritual ha caído en el cansancio del activismo en lugar de la frescura de la comunión?",
          "¿Qué hábito práctico puedes cultivar a partir de hoy para 'permanecer' conectado con Jesús a lo largo de tu jornada?"
        ],
        guidedPrayer: `Amado Jesús, Vid Verdadera de mi vida, confieso que muchas veces intento resolver y producir resultados espirituales con mis propias fuerzas desconectadas de Ti. 
        
Hoy decido morar en Ti. Poda en mi corazón todo lo que estorba la comunión y permite que tu savia de gracia, amor y santidad fluya a través de mí para bendecir a otros. Amén.`
      },
      {
        id: "devo-7",
        day: "Día 7",
        weekNumber: 1,
        title: "El Secreto del Lugar Santísimo",
        subtitle: "Inexpugnables bajo la sombra del Dios Todopoderoso",
        passageId: "salmo-91",
        highlightVerse: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré.",
        highlightRef: "Salmos 91:1-2",
        category: "Refugio & Fortaleza",
        emotionTarget: "herido",
        durationMinutes: 10,
        reflection: `El término 'abrigo' traduce el hebreo 'Sether', que evoca el Lugar Secreto, la cámara más interior del tabernáculo donde la gloria Shekinah de Dios reposaba sobre el arca del pacto. Aquel era un recinto inexpugnable: ninguna tormenta del desierto, ningún ejército invasor y ninguna flecha podía penetrar el santuario de Dios.
        
Habitar bajo la sombra del 'Shaddai' —el Dios suficiente que nutre y cobija con poder supremo— transforma radicalmente nuestra postura ante la vida. Quien habita allí no vive a merced de las noticias alarmantes, ni teme el terror nocturno, porque su escondite es más alto que cualquier peligro terrenal.
        
Hoy cierra esta semana entrando deliberadamente en ese Lugar Secreto. No eres un transeúnte vulnerable; eres un hijo amado protegido por el escudo y adarga de Su verdad inquebrantable.`,
        journalPrompts: [
          "¿Cuáles son los 'terrores de la noche' o miedos silenciosos que han querido acechar tu paz últimamente?",
          "Declara en voz alta los nombres santos de Dios (Elyón, Shaddai, Yahvé, Elohim) como tu refugio personal para esta nueva etapa."
        ],
        guidedPrayer: `Altísimo y Fiel Señor, mi Dios y mi Fortaleza inamovible, me refugio bajo tus alas santas. Declaro que Tú eres mi esperanza y mi castillo frente a cualquier asechanza del enemigo.
        
Descanso en tu fidelidad que me cubre de día y de noche. Concluyo esta semana con el alma colmada de gratitud y entro en tu reposo divino sabiendo que mi vida está escondida con Cristo en Dios. En el nombre glorioso de Jesús, amén.`
      }
    ]
  },
  {
    id: "semana-2",
    weekNumber: 2,
    title: "Semana 2: La Travesía del Desierto hacia la Promesa",
    description: "7 días de transformación espiritual: de la queja a la fe inquebrantable, del desierto de la prueba a la conquista de las promesas de Dios.",
    theme: "Perseverancia, Transformación y Conquista",
    days: [
      {
        id: "devo-w2-1",
        day: "Día 1",
        weekNumber: 2,
        title: "El Maná de Cada Mañana",
        subtitle: "Aprender a confiar en la provisión diaria sin atesorar afán para mañana",
        passageId: "salmo-23",
        highlightVerse: "Y Jehová dijo a Moisés: He aquí yo os haré llover pan del cielo; y el pueblo saldrá, y recogerá diariamente la porción de un día.",
        highlightRef: "Éxodo 16:4",
        category: "Confianza Diaria",
        emotionTarget: "ansioso",
        durationMinutes: 8,
        reflection: `Dios no le dio a Israel un almacén de comida para diez años; les dio maná nuevo cada madrugada. Cuando algunos intentaron acumularlo por desconfianza en el mañana, el pan se corrompió. 

La fe es un músculo que se entrena día a día. Tu Padre celestial no te pide que resuelvas el año completo en tu mente hoy; te pide que recojas la porción de gracia reservada para esta jornada. Mañana Su fidelidad se renovará antes de que salga el sol.`,
        journalPrompts: [
          "¿En qué asunto estás intentando acumular soluciones para el futuro en vez de confiar en el maná de hoy?",
          "Agradece a Dios por una provisión específica que recibiste hoy."
        ],
        guidedPrayer: `Padre Bueno, renuncio a la pesadumbre del mañana. Gracias por el pan y la fuerza que me concedes hoy. Sé que tu fidelidad no se agota y que tus misericordias son nuevas cada mañana. Amén.`
      },
      {
        id: "devo-w2-2",
        day: "Día 2",
        weekNumber: 2,
        title: "El Agua de la Roca Viva",
        subtitle: "Cuando lo más árido se convierte en la fuente de tu milagro",
        passageId: "isaias-40",
        highlightVerse: "He aquí que yo estaré delante de ti allí sobre la peña en Horeb; y golpearás la peña, y saldrán de ella aguas, y beberá el pueblo.",
        highlightRef: "Éxodo 17:6",
        category: "Gracia en la Sequedad",
        emotionTarget: "cansado",
        durationMinutes: 9,
        reflection: `En el desierto de Refidim no había agua natural. La lógica humana dictaba la muerte por sed. Sin embargo, Dios mandó a golpear la roca de granito para que brotaran torrentes de agua pura.

El apóstol Pablo revela más tarde que aquella Roca espiritual que los seguía era Cristo (1 Corintios 10:4). De la herida de la cruz brotó la salvación y el río de agua viva que sacia tu alma para siempre. Aunque hoy mires a tu alrededor y veas desierto, de la Roca brotará tu socorro.`,
        journalPrompts: [
          "¿En qué área de tu vida sientes que estás en un desierto seco y sin esperanza?",
          "Declara que de la Roca de Cristo brotarán ríos de agua viva en medio de tu circunstancia."
        ],
        guidedPrayer: `Cristo Jesús, Roca Eterna, me acerco a Ti sediento de tu gracia. Sacia mi corazón reseco y haz brotar ríos de paz y vida en medio de mi desierto. Amén.`
      },
      {
        id: "devo-w2-3",
        day: "Día 3",
        weekNumber: 2,
        title: "Si tu Presencia no va Conmigo",
        subtitle: "La única señal innegociable que distingue a los hijos del Reino",
        passageId: "filipenses-4",
        highlightVerse: "Y Moisés respondió: Si tu presencia no ha de ir conmigo, no nos saques de aquí.",
        highlightRef: "Éxodo 33:15",
        category: "Pasión por Su Presencia",
        emotionTarget: "direccion",
        durationMinutes: 10,
        reflection: `Dios le había ofrecido a Moisés un ángel que los guiara a la Tierra Prometida, una tierra que fluye leche y miel. Pero Moisés no quería bendiciones sin el Bendecidor. Su respuesta sacudió el cielo: 'Si tu Presencia no va con nosotros, no quiero ir'.

El éxito en el Reino no se mide por territorios conquistados ni metas alcanzadas, sino por la cercanía íntima de Su Presencia. Donde está el Espíritu del Señor, allí hay libertad, respaldo y gloria.`,
        journalPrompts: [
          "¿Estás persiguiendo metas personales o estás asegurándote de que la Presencia de Dios encabece tus pasos?",
          "¿Qué significa para ti hoy habitar en la Presencia de Dios antes de emprender cualquier proyecto?"
        ],
        guidedPrayer: `Señor, no quiero dar un solo paso sin Ti. Más que tus dones, anhelo tu Presencia manifiesta. Sé mi guía, mi compañero y mi corona en cada camino que emprenda. Amén.`
      },
      {
        id: "devo-w2-4",
        day: "Día 4",
        weekNumber: 2,
        title: "Esfuérzate y Sé Valiente",
        subtitle: "Vencer el temor al futuro con la armadura de la Promesa",
        passageId: "romanos-8",
        highlightVerse: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.",
        highlightRef: "Josué 1:9",
        category: "Coraje Espiritual",
        emotionTarget: "herido",
        durationMinutes: 8,
        reflection: `Josué acababa de perder a Moisés, su mentor y el líder indiscutible de la nación. Ahora le tocaba cruzar el caudaloso Jordán y enfrentar a gigantes armados. El mandato divino no fue: 'Sé fuerte porque eres capaz', sino: 'Sé valiente porque YO ESTOY CONTIGO'.

La verdadera valentía bíblica no es la ausencia de temblor, sino el avance decidido con la Palabra de Dios como ancla. Si Dios va contigo, el gigante ya está derrotado antes del primer golpe.`,
        journalPrompts: [
          "¿Qué obstáculo o cambio repentino te ha estado intimidando últimamente?",
          "Escribe Josué 1:9 en tu diario personal y léelo como un decreto de Dios sobre tu vida."
        ],
        guidedPrayer: `Señor de los Ejércitos, echo fuera todo espíritu de temor e indecisión. Me ciño con tu valentía y proclamo que dondequiera que pise la planta de mis pies, Tú vas delante de mí como poderoso gigante. Amén.`
      },
      {
        id: "devo-w2-5",
        day: "Día 5",
        weekNumber: 2,
        title: "Claman los Justos y Jehová Oye",
        subtitle: "La respuesta infalible del Padre al clamor del corazón quebrantado",
        passageId: "salmo-91",
        highlightVerse: "Claman los justos, y Jehová oye, y los libra de todas sus angustias. Cercano está Jehová a los quebrantados de corazón.",
        highlightRef: "Salmos 34:17-18",
        category: "Sanidad & Consuelo",
        emotionTarget: "herido",
        durationMinutes: 9,
        reflection: `David escribió este salmo en una de las horas más humillantes de su vida, fingiendo locura ante el rey de Gat y escondiéndose en la solitaria cueva de Adulam. No escribió desde un palacio dorado, sino desde el eco de una caverna oscura.

Aun allí, descubrió que Dios no rechaza el dolor honesto. Dios no guarda distancia del corazón que sangra; se acerca con ternura y coloca un vallado angelical alrededor de los que le temen.`,
        journalPrompts: [
          "¿Qué herida o dolor has intentado reprimir o callar por temor a parecer débil?",
          "Derrama con total sinceridad tu corazón en oración, sabiendo que el Señor está a tu lado."
        ],
        guidedPrayer: `Padre Consolador, gracias porque no tengo que actuar ni fingir ante Ti. Tú conoces cada una de mis lágrimas y sanas mis heridas más íntimas. Hoy me refugio en tu abrazo paternal. Amén.`
      },
      {
        id: "devo-w2-6",
        day: "Día 6",
        weekNumber: 2,
        title: "El Gozo Inquebrantable en la Prueba",
        subtitle: "Cómo el fuego de la dificultad purifica el oro de tu carácter",
        passageId: "juan-15",
        highlightVerse: "Hermanos míos, tened por sumo gozo cuando os halléis en diversas pruebas, sabiendo que la prueba de vuestra fe produce paciencia.",
        highlightRef: "Santiago 1:2-3",
        category: "Madurez Espiritual",
        emotionTarget: "agradecido",
        durationMinutes: 8,
        reflection: `Santiago no dice que las pruebas en sí sean agradables; dice que el resultado final es motivo de sumo gozo. El orfebre somete el metal precioso al fuego ardiente no para destruirlo, sino para que las escorias e impurezas suban a la superficie y puedan ser removidas.

Cuando el orfebre ve su propio rostro reflejado nítidamente en el crisol de oro derretido, sabe que la obra está completa. Cada prueba en tu vida es el taller divino donde Cristo está esculpiendo Su imagen en ti.`,
        journalPrompts: [
          "¿Qué prueba actual te está enseñando paciencia y dependencia de Dios?",
          "Elige agradecer a Dios en medio de la dificultad por la madurez que está forjando en tu espíritu."
        ],
        guidedPrayer: `Señor Jesús, concédeme la gracia de ver mis dificultades a través de tus ojos eternos. Que en medio de cualquier crisol, mi carácter sea purificado hasta reflejar tu gloria. En Ti me gozo, amén.`
      },
      {
        id: "devo-w2-7",
        day: "Día 7",
        weekNumber: 2,
        title: "Bástate mi Gracia: Poder en la Debilidad",
        subtitle: "La paradoja santa: cuando soy débil, entonces soy verdaderamente fuerte",
        passageId: "proverbios-3",
        highlightVerse: "Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad.",
        highlightRef: "2 Corintios 12:9",
        category: "Gracia Triunfante",
        emotionTarget: "cansado",
        durationMinutes: 10,
        reflection: `Pablo rogó tres veces que el Señor le quitara el doloroso aguijón en la carne. La respuesta de Dios no fue retirar el aguijón, sino entregarle una provisión inagotable: 'Mi Gracia te basta'.

La autosuficiencia humana es la enemiga número uno del poder divino. Cuando reconoces tus límites y declaras 'no puedo solo', el poder de la resurrección de Cristo reposa sobre ti como una tienda de gloria. No eres fuerte por tu elocuencia o capacidad; eres fuerte porque Su Espíritu habita en tu vasija de barro.`,
        journalPrompts: [
          "¿Cuál es tu 'aguijón' o debilidad que te recuerda a diario tu necesidad absoluta de Dios?",
          "Haz de 'Bástate mi Gracia' tu lema victorioso para cerrar esta semana de altar."
        ],
        guidedPrayer: `Señor Jesús, descanso en tu Gracia sobrenatural. Abrazo mi debilidad para que tu poder se perfeccione en mí. Gracias por acompañarme a lo largo de este desierto y asegurarme la victoria en la cruz. Amén.`
      }
    ]
  },
  {
    id: "semana-3",
    weekNumber: 3,
    title: "Semana 3: Sabiduría Celestial y Discernimiento en la Tormenta",
    description: "7 días para afinar el oído espiritual, edificar la vida sobre la Roca inconmovible y vestirse con toda la armadura de Dios.",
    theme: "Sabiduría, Discernimiento y Fortaleza Inconmovible",
    days: [
      {
        id: "devo-w3-1",
        day: "Día 1",
        weekNumber: 3,
        title: "El Árbol Plantado junto a Aguas Vivas",
        subtitle: "Raíces profundas que no temen la sequía ni los vientos huracanados",
        passageId: "salmo-23",
        highlightVerse: "Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no cae; y todo lo que hace, prosperará.",
        highlightRef: "Salmos 1:3",
        category: "Sabiduría de Vida",
        emotionTarget: "direccion",
        durationMinutes: 8,
        reflection: `Un árbol junto al río no depende del clima de la superficie; sus raíces se sumergen en las profundidades del lecho acuífero. Cuando viene el calor abrasador, sus hojas permanecen verdes y lozanas porque bebe de una fuente subterránea inagotable.

Meditar en la Palabra de Dios día y noche es sumergir las raíces de tu corazón en el manantial del Espíritu. El mundo podrá tambalearse, las modas pasarán, pero quien está arraigado en la Verdad dará fruto en su tiempo y permanecerá inquebrantable.`,
        journalPrompts: [
          "¿Qué 'corrientes de agua' están nutriendo tus pensamientos a diario?",
          "Dedica 10 minutos hoy a profundizar en las Escrituras para nutrir tus raíces espirituales."
        ],
        guidedPrayer: `Padre Celestial, quiero ser como ese árbol fértil arraigado en tu Verdad. Aleja mis pies del consejo de los impíos y haz que mi delicia esté siempre en tu Santa Ley. Amén.`
      },
      {
        id: "devo-w3-2",
        day: "Día 2",
        weekNumber: 3,
        title: "Guarda tu Corazón como el Tesoro Supremo",
        subtitle: "Proteger el manantial del cual brota cada decisión y destino",
        passageId: "proverbios-3",
        highlightVerse: "Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida.",
        highlightRef: "Proverbios 4:23",
        category: "Pureza & Enfoque",
        emotionTarget: "herido",
        durationMinutes: 8,
        reflection: `En las ciudades antiguas, el pozo de agua potable era custodiado día y noche por los soldados más leales. Si el enemigo lograba envenenar la fuente central, toda la ciudad caía sin necesidad de asedio.

Tu corazón es el manantial de tu existencia espiritual. Lo que dejas entrar por tus ojos, lo que permites que resuene en tus oídos y los rencores que toleras en tu interior determinan el flujo de tu vida. Guarda tu corazón con la cerradura del perdón y el sello de la santidad.`,
        journalPrompts: [
          "¿Hay alguna conversación, imagen o resentimiento que esté enturbiando la pureza de tu corazón?",
          "Haz una oración de renuncia a cualquier raíz de amargura para restaurar el manantial."
        ],
        guidedPrayer: `Señor, purifica mi corazón con tu fuego santo. Cierra mis ojos a la vanidad y mis oídos a la queja. Que de mi interior solo manen aguas de vida, amor y verdad para tu gloria. Amén.`
      },
      {
        id: "devo-w3-3",
        day: "Día 3",
        weekNumber: 3,
        title: "La Casa Edificada sobre la Roca",
        subtitle: "La tormenta golpea a ambas casas, pero solo una permanece en pie",
        passageId: "filipenses-4",
        highlightVerse: "Descendió lluvia, y vinieron ríos, y soplaron vientos, y golpearon contra aquella casa; y no cayó, porque estaba fundada sobre la roca.",
        highlightRef: "Mateo 7:25",
        category: "Cimiento Inconmovible",
        emotionTarget: "ansioso",
        durationMinutes: 9,
        reflection: `Jesús contó que dos constructores enfrentaron exactamente la misma tempestad: las mismas lluvias torrenciales, los mismos vientos demoledores. La diferencia entre el colapso trágico y la firmeza absoluta no estuvo en la fuerza del viento, sino en el cimiento subterráneo que nadie veía.

Oír las palabras de Cristo y obedecerlas es cavar hondo hasta encontrar la Roca. Las tormentas de la vida son inevitables, pero quien edifica sobre la obediencia a la Palabra jamás sufrirá ruina espiritual.`,
        journalPrompts: [
          "¿En qué área de tu vida has estado construyendo sobre la arena de las opiniones pasajeras?",
          "Identifica una instrucción clara que Jesús te ha dado y disponte a obedecerla hoy mismo."
        ],
        guidedPrayer: `Cristo Jesús, Roca Eterna, en Ti cimento mi vida, mi familia y mis anhelos. Venga la lluvia y soplen los vientos, sé que no caeré porque Tú eres mi fundamento seguro. Amén.`
      },
      {
        id: "devo-w3-4",
        day: "Día 4",
        weekNumber: 3,
        title: "La Sabiduría que Desciende de lo Alto",
        subtitle: "Diferenciar la astucia terrenal del discernimiento pacífico y puro",
        passageId: "proverbios-3",
        highlightVerse: "Pero la sabiduría que es de lo alto es primeramente pura, después pacífica, amable, benigna, llena de misericordia y de buenos frutos, sin incertidumbre ni hipocresía.",
        highlightRef: "Santiago 3:17",
        category: "Discernimiento Santo",
        emotionTarget: "direccion",
        durationMinutes: 8,
        reflection: `La sabiduría del mundo se caracteriza por la ambición personal, la manipulación, el ruido y la competencia implacable. Pero la sabiduría de Dios tiene un aroma inconfundible: es pura, trae paz, es amable y está repleta de frutos de misericordia.

Si una decisión te produce desasosiego, división, manipulación o culpa, no proviene de lo alto. Dios guía a Sus hijos con el testimonio suave de Su Santo Espíritu, trayendo claridad diáfana y serenidad profunda.`,
        journalPrompts: [
          "Frente a tus dudas actuales, ¿estás buscando una salida astuta o la sabiduría pacífica de Dios?",
          "Pide al Espíritu Santo el don de discernimiento para actuar con rectitud y mansedumbre."
        ],
        guidedPrayer: `Dios de Sabiduría, derrama sobre mi mente la sabiduría celestial. Quita de mí toda arrogancia y enséñame a responder con mansedumbre, misericordia y fruto santo en cada situación. Amén.`
      },
      {
        id: "devo-w3-5",
        day: "Día 5",
        weekNumber: 3,
        title: "La Armadura Invicta del Creyente",
        subtitle: "Estar firmes contra las asechanzas del enemigo en el día malo",
        passageId: "romanos-8",
        highlightVerse: "Por tanto, tomad toda la armadura de Dios, para que podáis resistir en el día malo, y habiendo acabado todo, estar firmes.",
        highlightRef: "Efesios 6:13",
        category: "Guerra Espiritual",
        emotionTarget: "cansado",
        durationMinutes: 10,
        reflection: `El apóstol Pablo estaba encadenado a un centurión romano cuando escribió sobre la armadura de Dios. Observó el cinto, la coraza, el calzado, el escudo, el yelmo y la espada. Pero notó un detalle crucial: la armadura romana no tenía protección para la espalda.

Un soldado de Cristo nunca está diseñado para retroceder huyendo de la batalla. Con el Escudo de la Fe apagas todos los dardos encendidos del maligno, y con la Espada del Espíritu —que es la Palabra de Dios proclamada con autoridad— haces huir las tinieblas.`,
        journalPrompts: [
          "¿Qué dardo de mentira, culpa o desaliento ha estado arrojando el enemigo a tu mente?",
          "Vístete deliberadamente hoy con la coraza de justicia y el yelmo de la salvación mediante la oración."
        ],
        guidedPrayer: `Señor Todopoderoso, me visto con tu armadura sagrada. Con el escudo de la fe apago toda flecha del enemigo y con tu Palabra declaro victoria sobre mi hogar y mi destino. Amén.`
      },
      {
        id: "devo-w3-6",
        day: "Día 6",
        weekNumber: 3,
        title: "La Mirada en las Alturas Celestiales",
        subtitle: "Mirar desde la perspectiva del Trono y no desde la pequeñez de la tierra",
        passageId: "juan-15",
        highlightVerse: "Si, pues, habéis resucitado con Cristo, buscad las cosas de arriba, donde está Cristo sentado a la diestra de Dios. Poned la mira en las cosas de arriba, no en las de la tierra.",
        highlightRef: "Colosenses 3:1-2",
        category: "Perspectiva del Reino",
        emotionTarget: "direccion",
        durationMinutes: 8,
        reflection: `Cuando caminas al nivel del suelo en un laberinto, cada pared parece un callejón sin salida infranqueable. Pero si te elevas en un avión y observas el laberinto desde arriba, la salida es evidente y los muros se ven diminutos.

Poner la mirada en las cosas de arriba no es escapar de la realidad; es contemplar tu vida desde la perspectiva soberana de Aquel que ya venció. Tu identidad y tu ciudadanía pertenecen al cielo; nada de lo terrenal tiene poder para definir tu destino final.`,
        journalPrompts: [
          "¿Qué circunstancia terrenal ha estado consumiendo tu atención y robándote la perspectiva de fe?",
          "Eleva tu mirada hoy y declara que tus problemas están bajo los pies de Cristo."
        ],
        guidedPrayer: `Padre Amado, saca mis ojos del fango de la queja y el temor terrenal. Elevo mi mirada al trono de Cristo y declaro que mi vida está escondida en Su victoria inmortal. Amén.`
      },
      {
        id: "devo-w3-7",
        day: "Día 7",
        weekNumber: 3,
        title: "La Lámpara Encendida: Orad sin Cesar",
        subtitle: "Transformar la vida entera en una conversación ininterrumpida con el Creador",
        passageId: "salmo-91",
        highlightVerse: "Estad siempre gozosos. Orad sin cesar. Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.",
        highlightRef: "1 Tesalonicenses 5:16-18",
        category: "Comunión Continua",
        emotionTarget: "agradecido",
        durationMinutes: 9,
        reflection: `Orar sin cesar no significa vivir de rodillas en un monasterio las 24 horas del día. Significa mantener la 'pantalla' del corazón permanentemente abierta a la Presencia de Dios. Es convertir cada respiración, cada trabajo y cada decisión en un diálogo sagrado con el Padre.

Cuando la oración se convierte en el aliento natural de tu espíritu, el gozo no se apaga cuando llega la noche y la gratitud se vuelve un escudo protector contra la amargura. Cierra esta semana consagrando tu vida como un templo donde el incienso nunca se apaga.`,
        journalPrompts: [
          "¿Cómo puedes integrar pequeñas oraciones breves y conscientes a lo largo de tu día de trabajo?",
          "Escribe 5 motivos profundos de gratitud para cerrar esta tercera semana de altar."
        ],
        guidedPrayer: `Señor, haz de mi vida un altar continuo de alabanza. Que en cada momento mi corazón esté en sintonía con tu Santo Espíritu. Te alabo, te agradezco y me entrego a Ti por entero. Amén.`
      }
    ]
  },
  {
    id: "semana-4",
    weekNumber: 4,
    title: "Semana 4: El Fuego del Altar e Intimidad en el Santuario",
    description: "7 días de consagración profunda, adoración en espíritu y verdad, y revelación plena del amor incondicional del Padre Celestial.",
    theme: "Consagración, Adoración e Intimidad en el Santuario",
    days: [
      {
        id: "devo-w4-1",
        day: "Día 1",
        weekNumber: 4,
        title: "El Fuego que no Debe Apagarse en el Altar",
        subtitle: "La custodia incansable de la devoción y la pasión por Dios",
        passageId: "isaias-40",
        highlightVerse: "El fuego arderá continuamente en el altar; no se apagará.",
        highlightRef: "Levítico 6:13",
        category: "Fuego & Consagración",
        emotionTarget: "cansado",
        durationMinutes: 9,
        reflection: `El fuego del altar del tabernáculo no fue encendido por mano humana; descendió milagrosamente del cielo como señal de la aceptación de Dios (Levítico 9:24). Sin embargo, Dios le encargó a los sacerdotes una tarea innegociable: añadir leña cada mañana para que el fuego nunca se extinguiera.

Dios pone el fuego sobrenatural en tu corazón, pero a ti te corresponde poner la leña diaria de la oración, la adoración y la meditación en las Escrituras. El fuego nunca se apaga por falta de poder de Dios, sino por falta de leña en el altar de nuestra devoción.`,
        journalPrompts: [
          "¿Sientes que el fuego de tu primer amor hacia Dios ha disminuido en los últimos tiempos?",
          "¿Qué 'leña' concreta vas a colocar en tu altar espiritual hoy para reavivar la llama sagrada?"
        ],
        guidedPrayer: `Espíritu Santo, sopla sobre las brasas de mi corazón. Aviva el fuego de tu amor en mi interior. Hoy pongo en el altar mi tiempo y mi voluntad para que tu llama sagrada arda sin cesar. Amén.`
      },
      {
        id: "devo-w4-2",
        day: "Día 2",
        weekNumber: 4,
        title: "Mi Alma Tiene Sed de Ti en Tierra Seca",
        subtitle: "La búsqueda desesperada de la gloria divina cuando todo lo demás palidece",
        passageId: "salmo-23",
        highlightVerse: "Dios, Dios mío eres tú; de madrugada te buscaré; mi alma tiene sed de ti, mi carne te anhela, en tierra seca y árida donde no hay aguas, para ver tu poder y tu gloria.",
        highlightRef: "Salmos 63:1-2",
        category: "Sed Espiritual",
        emotionTarget: "direccion",
        durationMinutes: 9,
        reflection: `David compuso este salmo en el desierto de Judá, mientras huía de su propio hijo Absalón. Rodeado de riscos calcinados, despojado de su palacio y sin comodidades, David no oró pidiendo coronas ni ejércitos: oró pidiendo VER LA GLORIA Y EL PODER DE DIOS.

Cuando un creyente descubre que la Presencia de Dios es mejor que la vida misma, ningún desierto terrenal puede robarle la plenitud. Tu mayor satisfacción no proviene de los oasis del mundo, sino de beber directamente de la Fuente de agua viva.`,
        journalPrompts: [
          "¿Qué anhelo profundo supera a cualquier bendición material en tu corazón?",
          "Dedica un tiempo de adoración en silencio, contemplando la belleza y santidad de Dios."
        ],
        guidedPrayer: `Dios mío, Tú eres mi herencia y mi delicia. De madrugada te busco y en Ti reposa mi alma. Muéstrame tu gloria y que mi vida sea un cántico continuo a tu majestad. Amén.`
      },
      {
        id: "devo-w4-3",
        day: "Día 3",
        weekNumber: 4,
        title: "El Encuentro con la Majestad: Santo, Santo, Santo",
        subtitle: "La visión que purifica los labios y transforma el llamado de por vida",
        passageId: "romanos-8",
        highlightVerse: "Y el uno al otro daba voces, diciendo: Santo, santo, santo, Jehová de los ejércitos; toda la tierra está llena de su gloria.",
        highlightRef: "Isaías 6:3",
        category: "Santidad & Reverencia",
        emotionTarget: "herido",
        durationMinutes: 10,
        reflection: `El año en que murió el rey Uzías, Isaías vio al verdadero Rey: el Señor sentado en un trono alto y sublime, y Sus faldas llenaban el templo. Frente a la santidad infinita de Dios, Isaías no se jactó de ser profeta; clamó: '¡Ay de mí que soy muerto!'.

Solo cuando contemplamos la santidad de Dios reconocemos nuestra condición y valoramos el carbón encendido del altar que toca nuestros labios y quita toda culpa. La gracia perdona, purifica y nos habilita para responder con valentía: 'Heme aquí, envíame a mí'.`,
        journalPrompts: [
          "¿Con qué nivel de reverencia y asombro te acercas a la presencia de Dios?",
          "Pide al Señor que purifique tus palabras y acciones para ser un testigo fiel en tu entorno."
        ],
        guidedPrayer: `Santo, Santo, Santo es tu Nombre, Señor Todopoderoso. Me postro ante tu majestad con reverencia. Limpia mis labios y mi corazón con el fuego de tu altar, y heme aquí para hacer tu voluntad. Amén.`
      },
      {
        id: "devo-w4-4",
        day: "Día 4",
        weekNumber: 4,
        title: "Planes de Paz y Esperanza Futura",
        subtitle: "El pacto de bienestar que prevalece por encima del exilio y la incertidumbre",
        passageId: "filipenses-4",
        highlightVerse: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
        highlightRef: "Jeremías 29:11",
        category: "Esperanza Inmutable",
        emotionTarget: "ansioso",
        durationMinutes: 8,
        reflection: `Esta célebre promesa no fue dada en tiempos de fiesta en Jerusalén; fue enviada en una carta a los cautivos desterrados en Babilonia. Dios les estaba diciendo: 'Aunque hoy estén en una tierra extraña y el dolor parezca eterno, mis diseños para ustedes son de shalom (paz, plenitud, bienestar) y no de calamidad'.

Los pensamientos de Dios hacia ti no cambian con las estaciones difíciles. Aunque no comprendas el capítulo intermedio de tu historia, el Autor celestial ya ha escrito el desenlace victorioso. Confía en el Guionista de tu redención.`,
        journalPrompts: [
          "¿Qué incertidumbre respecto al futuro te ha estado quitando el sueño?",
          "Alinea tu mente con los 'pensamientos de paz' que Dios tiene para ti y tu familia."
        ],
        guidedPrayer: `Padre Soberano, descanso en tus planes perfectos. Aunque mis ojos no vean el camino completo, confío en que tu corazón hacia mí siempre es de paz, bondad y redención. En tus manos reposo, amén.`
      },
      {
        id: "devo-w4-5",
        day: "Día 5",
        weekNumber: 4,
        title: "La Oración Sacerdotal: Que Sean Uno",
        subtitle: "El anhelo más íntimo del corazón de Jesús en la víspera de la cruz",
        passageId: "juan-15",
        highlightVerse: "Para que todos sean uno; como tú, oh Padre, en mí, y yo en ti, que también ellos sean uno en nosotros; para que el mundo crea que tú me enviaste.",
        highlightRef: "Juan 17:21",
        category: "Unidad & Amor Divino",
        emotionTarget: "agradecido",
        durationMinutes: 10,
        reflection: `Horas antes de ser entregado en Getsemaní, Jesús elevó la oración más sublime de las Escrituras. No pidió que el Padre librara a Sus discípulos de toda dificultad, sino que los guardara en unidad santa y en el amor del Padre.

La mayor credencial del Evangelio ante un mundo fracturado y polarizado no son los argumentos elocuentes, sino el amor sobrenatural y la comunión entre los redimidos. Vivir en Cristo es reflejar la misma unidad tierna y perfecta que existe entre el Padre y el Hijo.`,
        journalPrompts: [
          "¿Hay algún hermano en la fe o familiar con quien necesites restablecer lazos de perdón y unidad?",
          "Ora hoy por la iglesia y por la unidad de todos los creyentes en tu comunidad."
        ],
        guidedPrayer: `Amado Jesús, gracias por interceder por mí ante el Padre. Enséñame a amar como Tú amaste y a ser un instrumento de paz y reconciliación en tu cuerpo. Amén.`
      },
      {
        id: "devo-w4-6",
        day: "Día 6",
        weekNumber: 4,
        title: "Acerquémonos Confiadamente al Trono de Gracia",
        subtitle: "El velo desgarrado que te abre acceso ilimitado al corazón de Dios",
        passageId: "proverbios-3",
        highlightVerse: "Acerquémonos, pues, confiadamente al trono de la gracia, para alcanzar misericordia y hallar gracia para el oportuno socorro.",
        highlightRef: "Hebreos 4:16",
        category: "Acceso Seguro",
        emotionTarget: "herido",
        durationMinutes: 9,
        reflection: `En el Antiguo Pacto, entrar al Lugar Santísimo sin invitación y sin la sangre expiatoria significaba muerte inmediata. Pero en el instante en que Jesús expiró en la cruz, el espeso velo del templo se rasgó de arriba hacia abajo por mano de Dios.

El acceso está abierto. El trono de Dios ya no es un tribunal de condenación; es el Trono de la Gracia. Puedes acercarte en cualquier momento con tus cargas, tus dudas y tus flaquezas, sabiendo que encontrarás misericordia y el socorro oportuno exactamente a tiempo.`,
        journalPrompts: [
          "¿Qué culpa o temor te ha impedido correr con libertad a los brazos del Padre?",
          "Da un paso de fe y entra hoy confiadamente al Trono de la Gracia a pedir Su socorro."
        ],
        guidedPrayer: `Sumo Sacerdote Celestial, gracias porque por tu sangre tengo libre entrada al Padre. Me acerco con confianza y recibo hoy tu misericordia y tu gracia oportuna para cada una de mis necesidades. Amén.`
      },
      {
        id: "devo-w4-7",
        day: "Día 7",
        weekNumber: 4,
        title: "He Aquí Estoy a la Puerta y Llamo",
        subtitle: "Cenar con el Rey en la intimidad permanente del alma",
        passageId: "salmo-91",
        highlightVerse: "He aquí, yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él conmigo.",
        highlightRef: "Apocalipsis 3:20",
        category: "Comunión Eterna",
        emotionTarget: "agradecido",
        durationMinutes: 10,
        reflection: `Cenar en la cultura bíblica era el mayor símbolo de hospitalidad, amistad entrañable y comunión de pacto. No era un refrigerio rápido de pie; era compartir el pan, el vino y el corazón durante horas de intimidad sincera.

Jesús no derriba la puerta de tu corazón con violencia. Toca con ternura y espera el eco de tu amor. Al culminar este ciclo de cuatro semanas de altar espiritual, la invitación sigue en pie: mantén abierta la puerta del santuario interior, para cenar cada día con el Rey de Gloria.`,
        journalPrompts: [
          "¿En qué áreas de tu vida Jesús ha estado tocando la puerta con amor y paciencia?",
          "Haz un compromiso solemne de mantener viva tu cita diaria con Dios en este Santuario de intimidad."
        ],
        guidedPrayer: `Señor Jesús, abre de par en par las puertas de mi corazón. Entra y cena conmigo. Que mi vida sea tu morada permanente y que nunca me aparte de tu amor. Te amo y te alabo por siempre, amén.`
      }
    ]
  }
];

// Devocionales por defecto (Semana 1) para compatibilidad hacia atrás
export const DEVOTIONALS_DATA = WEEKS_DATA[0].days;

// Helper para determinar la semana activa en el ciclo mensual/anual
export function getCurrentWeekIndex() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekOfYear = Math.floor((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
  return (weekOfYear % 4); // 0 = Semana 1, 1 = Semana 2, 2 = Semana 3, 3 = Semana 4
}
