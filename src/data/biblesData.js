// Base de datos de pasajes bíblicos en múltiples versiones, con raíces hebreas/griegas y exégesis
export const BIBLES_DATA = [
  {
    id: "salmo-23",
    book: "Salmos",
    chapter: 23,
    versesRange: "1-6",
    title: "El Señor es mi Pastor",
    theme: "Confianza, Paz y Provisión",
    background: "Compuesto por David, evocando sus años como pastor en los desiertos de Judea. Refleja la seguridad absoluta en la fidelidad divina aun en los valles más oscuros.",
    originalWords: [
      { word: "Yahvé Rohi", language: "Hebreo", meaning: "El Señor es mi Pastor", strong: "H7462", note: "Implica cuidado personal, guía tierna, protección activa y sustento diario." },
      { word: "Shalom", language: "Hebreo", meaning: "Paz completa, nada falta, plenitud", strong: "H7965", note: "No es mera ausencia de guerra, sino bienestar y plenitud integral del alma." },
      { word: "Tsalmaveth", language: "Hebreo", meaning: "Sombra de muerte o tiniebla profunda", strong: "H6757", note: "Metáfora para los cañones peligrosos donde acechan fieras y desfiladeros traicioneros." }
    ],
    versions: {
      RVR1960: [
        { num: 1, text: "Jehová es mi pastor; nada me faltará." },
        { num: 2, text: "En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará." },
        { num: 3, text: "Confortará mi alma; me guiará por sendas de justicia por amor de su nombre." },
        { num: 4, text: "Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento." },
        { num: 5, text: "Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosando." },
        { num: 6, text: "Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días." }
      ],
      NTV: [
        { num: 1, text: "El Señor es mi pastor; tengo todo lo que necesito." },
        { num: 2, text: "En verdes praderas me hace descansar; me conduce a corrientes de aguas tranquilas." },
        { num: 3, text: "Él renueva mis fuerzas; me guía por sendas correctas para honrar su nombre." },
        { num: 4, text: "Aun cuando pase por el valle más oscuro, no temeré, porque tú estás a mi lado; tu vara y tu vara de pastor me protegen y me reconfortan." },
        { num: 5, text: "Me preparas un banquete en presencia de mis enemigos; me honras ungiendo mi cabeza con aceite; mi copa se desborda de bendiciones." },
        { num: 6, text: "Ciertamente tu bondad y tu amor inagotable me seguirán todos los días de mi vida, y en la casa del Señor viviré por siempre." }
      ],
      NVI: [
        { num: 1, text: "El Señor es mi pastor, nada me falta." },
        { num: 2, text: "En verdes pastos me hace descansar; a las aguas tranquilas me conduce." },
        { num: 3, text: "Me infunde nuevas fuerzas; me guía por sendas de justicia por amor a su nombre." },
        { num: 4, text: "Aunque cruce por oscuros valles, no temeré ningún peligro, porque tú estás a mi lado; tu vara y tu bastón me dan seguridad." },
        { num: 5, text: "Dispones ante mí un banquete en presencia de mis enemigos; has ungido con perfume mi cabeza; has llenado mi copa hasta el borde." },
        { num: 6, text: "La bondad y el amor me seguirán todos los días de mi vida, y en la casa del Señor habitaré para siempre." }
      ],
      KJV: [
        { num: 1, text: "The Lord is my shepherd; I shall not want." },
        { num: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
        { num: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
        { num: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
        { num: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
        { num: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever." }
      ]
    }
  },
  {
    id: "filipenses-4",
    book: "Filipenses",
    chapter: 4,
    versesRange: "4-9",
    title: "La Paz de Dios que Sobrepasa Todo Entendimiento",
    theme: "Paz Mental, Victoria sobre la Ansiedad, Gratitud",
    background: "Escrito por el apóstol Pablo encadenado en una prisión romana. A pesar del confinamiento físico, irradia una alegría sobrenatural y ofrece el antídoto definitivo contra la angustia mental.",
    originalWords: [
      { word: "Chara", language: "Griego", meaning: "Gozo, regocijo profundo", strong: "G5479", note: "No depende de las circunstancias externas, sino de la comunión íntima con Cristo." },
      { word: "Eirene", language: "Griego", meaning: "Paz, sosiego que une lo roto", strong: "G1515", note: "Paz que actúa como centinela militar vigilando el corazón y la mente." },
      { word: "Merimnao", language: "Griego", meaning: "Afanarse, mente dividida o distraída", strong: "G3309", note: "Describe el efecto desgastante de la ansiedad que fragmenta los pensamientos." }
    ],
    versions: {
      RVR1960: [
        { num: 4, text: "Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!" },
        { num: 5, text: "Vuestra gentileza sea conocida de todos los hombres. El Señor está cerca." },
        { num: 6, text: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." },
        { num: 7, text: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús." },
        { num: 8, text: "Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable, todo lo que es de buen nombre; si hay virtud alguna, si algo digno de alabanza, en esto pensad." },
        { num: 9, text: "Lo que aprendisteis y recibisteis y oísteis y visteis en mí, esto haced; y el Dios de paz estará con vosotros." }
      ],
      NTV: [
        { num: 4, text: "Alégrense siempre en el Señor. Insisto: ¡Alégrense!" },
        { num: 5, text: "Que todos vean que son considerados en todo lo que hacen. Recuerden que el Señor viene pronto." },
        { num: 6, text: "No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho." },
        { num: 7, text: "Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús." },
        { num: 8, text: "Y ahora, amados hermanos, una cosa más para terminar. Concéntrense en todo lo que es verdadero, todo lo honorable, todo lo justo, todo lo puro, todo lo bello y todo lo admirable. Piensen en cosas excelentes y dignas de alabanza." },
        { num: 9, text: "Sigan poniendo en práctica todo lo que aprendieron y recibieron de mí, todo lo que oyeron de mis labios y me vieron hacer. Entonces el Dios de paz estará con ustedes." }
      ],
      NVI: [
        { num: 4, text: "Alégrense siempre en el Señor. Vuelvo a insistir: ¡Alégrense!" },
        { num: 5, text: "Que su amabilidad sea evidente a todos. El Señor está cerca." },
        { num: 6, text: "No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias." },
        { num: 7, text: "Y la paz de Dios, que sobrepasa todo entendimiento, cuidará sus corazones y sus pensamientos en Cristo Jesús." },
        { num: 8, text: "Por último, hermanos, consideren bien todo lo verdadero, todo lo respetable, todo lo justo, todo lo puro, todo lo amable, todo lo digno de admiración, en fin, todo lo que sea excelente o merezca elogio." },
        { num: 9, text: "Pongan en práctica lo que de mí han aprendido, recibido y oído, y lo que han visto en mí, y el Dios de paz estará con ustedes." }
      ],
      KJV: [
        { num: 4, text: "Rejoice in the Lord alway: and again I say, Rejoice." },
        { num: 5, text: "Let your moderation be known unto all men. The Lord is at hand." },
        { num: 6, text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God." },
        { num: 7, text: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
        { num: 8, text: "Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things." },
        { num: 9, text: "Those things, which ye have both learned, and received, and heard, and seen in me, do: and the God of peace shall be with you." }
      ]
    }
  },
  {
    id: "isaias-40",
    book: "Isaías",
    chapter: 40,
    versesRange: "28-31",
    title: "Nuevas Fuerzas para los Cansados",
    theme: "Restauración, Esperanza y Fortaleza Sobrenatural",
    background: "Palabras de consuelo para un pueblo extenuado en cautiverio. Recuerda la soberanía y la inmensidad del Creador de los confines de la tierra.",
    originalWords: [
      { word: "Qavah", language: "Hebreo", meaning: "Esperar pacientemente, entrelazarse", strong: "H6960", note: "Implica trenzar nuestras débiles fuerzas con el poder indestructible de Dios hasta ser uno solo." },
      { word: "Chalphu", language: "Hebreo", meaning: "Renovar, intercambiar", strong: "H2498", note: "Intercambio divino: Tú le das a Dios tu agotamiento humano y Él te entrega Su vigor infinito." }
    ],
    versions: {
      RVR1960: [
        { num: 28, text: "¿No has sabido, no has oído que el Dios eterno es Jehová, el cual creó los confines de la tierra? No desfallece, ni se fatiga con cansancio, y su entendimiento no hay quien lo alcance." },
        { num: 29, text: "Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas." },
        { num: 30, text: "Los muchachos se fatigan y se cansan, los jóvenes flaquean y caen;" },
        { num: 31, text: "pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán." }
      ],
      NTV: [
        { num: 28, text: "¿Acaso nunca han oído? ¿Nunca han entendido? El Señor es el Dios eterno, el Creador de toda la tierra. Él nunca pierde fuerzas ni se agota. Nadie puede medir la profundidad de su entendimiento." },
        { num: 29, text: "Él da poder a los indefensos y fortaleza a los débiles." },
        { num: 30, text: "Hasta los jóvenes se debilitan y se cansan, y los hombres jóvenes caen exhaustos." },
        { num: 31, text: "En cambio, los que confían en el Señor encontrarán nuevas fuerzas; volarán alto, como con alas de águila. Correrán y no se cansarán; caminarán y no desmayarán." }
      ],
      NVI: [
        { num: 28, text: "¿Acaso no lo sabes? ¿Es que no lo has oído? El Señor es el Dios eterno, el Creador de los confines de la tierra. No se cansa ni se fatiga, y su inteligencia es insondable." },
        { num: 29, text: "Él fortalece al cansado y acrecienta las fuerzas del débil." },
        { num: 30, text: "Aun los jóvenes se cansan y se fatigan, y los muchachos tropiezan y caen;" },
        { num: 31, text: "pero los que confían en el Señor renovarán sus fuerzas; volarán como las águilas: correrán y no se fatigarán, caminarán y no se cansarán." }
      ],
      KJV: [
        { num: 28, text: "Hast thou not known? hast thou not heard, that the everlasting God, the Lord, the Creator of the ends of the earth, fainteth not, neither is weary? there is no searching of his understanding." },
        { num: 29, text: "He giveth power to the faint; and to them that have no might he increaseth strength." },
        { num: 30, text: "Even the youths shall faint and be weary, and the young men shall utterly fall:" },
        { num: 31, text: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." }
      ]
    }
  },
  {
    id: "romanos-8",
    book: "Romanos",
    chapter: 8,
    versesRange: "31-39",
    title: "Más que Vencedores en Su Amor",
    theme: "Seguridad Inquebrantable, Gracia y Triunfo",
    background: "El clímax teológico de la carta de Pablo a Roma, disipando cualquier sombra de condenación, temor o separación.",
    originalWords: [
      { word: "Hypernikao", language: "Griego", meaning: "Súper vencedores, triunfo arrollador", strong: "G5245", note: "No solo sobrevivir a la batalla, sino salir enriquecidos espiritualmente por medio de Cristo." },
      { word: "Agape", language: "Griego", meaning: "Amor sacrificial incondicional", strong: "G26", note: "El amor de Dios que no depende de nuestros méritos ni fluctúa ante nuestras caídas." }
    ],
    versions: {
      RVR1960: [
        { num: 31, text: "¿Qué, pues, diremos a esto? Si Dios es por nosotros, ¿quién contra nosotros?" },
        { num: 32, text: "El que no escatimó ni a su propio Hijo, sino que lo entregó por todos nosotros, ¿cómo no nos dará también con él todas las cosas?" },
        { num: 37, text: "Antes, en todas estas cosas somos más que vencedores por medio de aquel que nos amó." },
        { num: 38, text: "Por lo cual estoy seguro de que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir," },
        { num: 39, text: "ni lo alto, ni lo profundo, ni ninguna otra cosa creada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro." }
      ],
      NTV: [
        { num: 31, text: "¿Qué podemos decir acerca de cosas tan maravillosas como estas? Si Dios está a favor de nosotros, ¿quién podrá ponerse en nuestra contra?" },
        { num: 32, text: "Si Dios no se guardó ni a su propio Hijo, sino que lo entregó por todos nosotros, ¿no nos dará también todo lo demás?" },
        { num: 37, text: "Claro que no, a pesar de todas estas cosas, nuestro triunfo es absoluto por medio de Cristo, quien nos amó." },
        { num: 38, text: "Y estoy convencido de que nada podrá jamás separarnos del amor de Dios. Ni la muerte ni la vida, ni ángeles ni demonios, ni nuestros temores de hoy ni nuestras preocupaciones de mañana; ni siquiera los poderes del infierno pueden separarnos del amor de Dios." },
        { num: 39, text: "Ningún poder en las alturas ni en las profundidades, de hecho, nada en toda la creación podrá jamás separarnos del amor de Dios, que está revelado en Cristo Jesús nuestro Señor." }
      ],
      NVI: [
        { num: 31, text: "¿Qué diremos frente a esto? Si Dios está de nuestra parte, ¿quién puede estar en contra nuestra?" },
        { num: 32, text: "El que no escatimó ni a su propio Hijo, sino que lo entregó por todos nosotros, ¿cómo no habrá de darnos generosamente, junto con él, todas las cosas?" },
        { num: 37, text: "Sin embargo, en todo esto somos más que vencedores por medio de aquel que nos amó." },
        { num: 38, text: "Pues estoy convencido de que ni la muerte ni la vida, ni los ángeles ni los demonios, ni lo presente ni lo por venir, ni los poderes," },
        { num: 39, text: "ni lo alto ni lo profundo, ni cosa alguna en toda la creación podrá apartarnos del amor que Dios nos ha manifestado en Cristo Jesús nuestro Señor." }
      ],
      KJV: [
        { num: 31, text: "What shall we then say to these things? If God be for us, who can be against us?" },
        { num: 32, text: "He that spared not his own Son, but delivered him up for us all, how shall he not with him also freely give us all things?" },
        { num: 37, text: "Nay, in all these things we are more than conquerors through him that loved us." },
        { num: 38, text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come," },
        { num: 39, text: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." }
      ]
    }
  },
  {
    id: "proverbios-3",
    book: "Proverbios",
    chapter: 3,
    versesRange: "1-8",
    title: "Confianza de Todo Corazón y Dirección Divina",
    theme: "Sabiduría, Guía y Rendición Total",
    background: "Instrucciones de sabiduría de Salomón. Enfatiza que la verdadera inteligencia humana consiste en no confiar en el propio juicio autónomo, sino en someter cada senda al Señor.",
    originalWords: [
      { word: "Bātach", language: "Hebreo", meaning: "Confiar, arrojarse de bruces con seguridad", strong: "H982", note: "Describe la actitud de quien se recuesta completamente en alguien fuerte sabiendo que no caerá." },
      { word: "Yāshar", language: "Hebreo", meaning: "Hacer recto, allanar el camino", strong: "H3474", note: "Dios no solo muestra el camino; quita los obstáculos insalvables y nivela la vereda." }
    ],
    versions: {
      RVR1960: [
        { num: 1, text: "Hijo mío, no te olvides de mi ley, y tu corazón guarde mis mandamientos;" },
        { num: 2, text: "porque largura de días y años de vida y paz te aumentarán." },
        { num: 3, text: "Nunca se aparten de ti la misericordia y la verdad; átalas a tu cuello, escríbelas en la tabla de tu corazón;" },
        { num: 4, text: "y hallarás gracia y buena opinión ante los ojos de Dios y de los hombres." },
        { num: 5, text: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia." },
        { num: 6, text: "Reconócelo en todos tus caminos, y él enderezará tus veredas." },
        { num: 7, text: "No seas sabio en tu propia opinión; teme a Jehová, y apártate del mal;" },
        { num: 8, text: "porque será medicina a tu cuerpo, y refrigerio para tus huesos." }
      ],
      NTV: [
        { num: 1, text: "Hijo mío, nunca olvides las cosas que te he enseñado; guarda mis mandatos en tu corazón." },
        { num: 2, text: "Si así lo haces, vivirás muchos años, y tu vida será colmada de paz." },
        { num: 3, text: "¡Nunca permitas que la lealtad ni la bondad te abandonen! Átalas alrededor de tu cuello; escríbelas en lo profundo de tu corazón." },
        { num: 4, text: "Así cosecharás el favor de Dios y de la gente, y ganarás buena reputación." },
        { num: 5, text: "Confía en el Señor con todo tu corazón; no dependas de tu propio entendimiento." },
        { num: 6, text: "Busca su voluntad en todo lo que hagas, y él te mostrará cuál camino tomar." },
        { num: 7, text: "No te dejes impresionar por tu propia sabiduría. En cambio, teme al Señor y aléjate del mal." },
        { num: 8, text: "Entonces darás salud a tu cuerpo y fortaleza a tus huesos." }
      ],
      NVI: [
        { num: 1, text: "Hijo mío, no te olvides de mis enseñanzas; guarda en tu corazón mis mandamientos;" },
        { num: 2, text: "porque prolongarán tu vida muchos años y te traerán prosperidad." },
        { num: 3, text: "Que nunca te abandonen el amor y la verdad: llévalos atados alrededor de tu cuello y escríbelos en el libro de tu corazón." },
        { num: 4, text: "Así contarás con el favor de Dios y de los hombres, y ganarás buena fama." },
        { num: 5, text: "Confía en el Señor de todo corazón, y no en tu propia inteligencia." },
        { num: 6, text: "Reconócelo en todos tus caminos, y él allanará tus sendas." },
        { num: 7, text: "No seas sabio en tu propia opinión; teme al Señor y aléjate del mal." },
        { num: 8, text: "Esto será medicina para tu cuerpo y salud para tus huesos." }
      ],
      KJV: [
        { num: 1, text: "My son, forget not my law; but let thine heart keep my commandments:" },
        { num: 2, text: "For length of days, and long life, and peace, shall they add to thee." },
        { num: 3, text: "Let not mercy and truth forsake thee: bind them about thy neck; write them upon the table of thine heart:" },
        { num: 4, text: "So shalt thou find favour and good understanding in the sight of God and man." },
        { num: 5, text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding." },
        { num: 6, text: "In all thy ways acknowledge him, and he shall direct thy paths." },
        { num: 7, text: "Be not wise in thine own eyes: fear the Lord, and depart from evil." },
        { num: 8, text: "It shall be health to thy navel, and marrow to thy bones." }
      ]
    }
  },
  {
    id: "juan-15",
    book: "Juan",
    chapter: 15,
    versesRange: "1-8",
    title: "La Vid Verdadera y la Permanencia Fructífera",
    theme: "Intimidad, Comunión Continua y Fruto",
    background: "Discurso de despedida de Jesús en el aposento alto camino al Getsemaní. Establece la relación orgánica y vital e indispensable entre el discípulo y el Salvador.",
    originalWords: [
      { word: "Menō", language: "Griego", meaning: "Permanecer, morar, habitar continuamente", strong: "G3306", note: "No una visita ocasional de domingo, sino residencia continua de vida compartida." },
      { word: "Kathairō", language: "Griego", meaning: "Podar, limpiar", strong: "G2508", note: "El Padre limpia la rama fértil quitando lo superfluo para que concentre su savia y dé mayor fruto." }
    ],
    versions: {
      RVR1960: [
        { num: 1, text: "Yo soy la vid verdadera, y mi Padre es el labrador." },
        { num: 2, text: "Todo pámpano que en mí no lleva fruto, lo quitará; y todo aquel que lleva fruto, lo limpiará, para que lleve más fruto." },
        { num: 3, text: "Ya vosotros estáis limpios por la palabra que os he hablado." },
        { num: 4, text: "Permaneced en mí, y yo en vosotros. Como el pámpano no puede llevar fruto por sí mismo, si no permanece en la vid, así tampoco vosotros, si no permanecéis en mí." },
        { num: 5, text: "Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer." },
        { num: 7, text: "Si permanecéis en mí, y mis palabras permanecen en vosotros, pedid todo lo que queréis, y os será hecho." },
        { num: 8, text: "En esto es glorificado mi Padre, en que llevéis mucho fruto, y seáis así mis discípulos." }
      ],
      NTV: [
        { num: 1, text: "Yo soy la vid verdadera, y mi Padre es el labrador." },
        { num: 2, text: "Él corta de mí toda rama que no produce fruto y poda las ramas que sí dan fruto, para que den aún más." },
        { num: 3, text: "Ustedes ya han sido limpiados y purificados por el mensaje que les di." },
        { num: 4, text: "Permanezcan en mí, y yo permaneceré en ustedes. Pues una rama no puede producir fruto si la cortan de la vid, y ustedes tampoco pueden ser fructíferos a menos que permanezcan en mí." },
        { num: 5, text: "Ciertamente, yo soy la vid; ustedes son las ramas. Los que permanecen en mí y yo en ellos producirán mucho fruto porque, separados de mí, no pueden hacer nada." },
        { num: 7, text: "Si ustedes permanecen en mí y mis palabras permanecen en ustedes, pueden pedir lo que quieran, ¡y les será concedido!" },
        { num: 8, text: "Cuando producen mucho fruto, demuestran que son mis verdaderos discípulos. Eso le da mucha gloria a mi Padre." }
      ],
      NVI: [
        { num: 1, text: "Yo soy la vid verdadera, y mi Padre es el labrador." },
        { num: 2, text: "Él corta de mí toda rama que no produce fruto, y poda toda rama que da fruto para que dé más fruto todavía." },
        { num: 3, text: "Ustedes ya están limpios por la palabra que les he comunicado." },
        { num: 4, text: "Permanezcan en mí, y yo permaneceré en ustedes. Así como ninguna rama puede dar fruto por sí misma, sino que tiene que permanecer en la vid, así tampoco ustedes pueden dar fruto si no permanecen en mí." },
        { num: 5, text: "Yo soy la vid y ustedes son las ramas. El que permanece en mí, como yo en él, dará mucho fruto; separados de mí no pueden ustedes hacer nada." },
        { num: 7, text: "Si permanecen en mí y mis palabras permanecen en ustedes, pidan lo que quieran, y se les concederá." },
        { num: 8, text: "Mi Padre es glorificado cuando ustedes dan mucho fruto y muestran así que son mis discípulos." }
      ],
      KJV: [
        { num: 1, text: "I am the true vine, and my Father is the husbandman." },
        { num: 2, text: "Every branch in me that beareth not fruit he taketh away: and every branch that beareth fruit, he purgeth it, that it may bring forth more fruit." },
        { num: 3, text: "Now ye are clean through the word which I have spoken unto you." },
        { num: 4, text: "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me." },
        { num: 5, text: "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing." },
        { num: 7, text: "If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you." },
        { num: 8, text: "Herein is my Father glorified, that ye bear much fruit; so shall ye be my disciples." }
      ]
    }
  },
  {
    id: "salmo-91",
    book: "Salmos",
    chapter: 91,
    versesRange: "1-6",
    title: "Morar Bajo la Sombra del Omnipotente",
    theme: "Protección Inexpugnable, Refugio y Fidelidad",
    background: "Canto lírico sapiencial sobre el amparo de Dios en tiempos de plaga, peligro nocturno y guerra. Utiliza las cuatro designaciones supremas de Dios: Elyón, Shaddai, YHWH y Elohim.",
    originalWords: [
      { word: "Sether Elyon", language: "Hebreo", meaning: "Lugar secreto del Altísimo", strong: "H5643", note: "Alude al Lugar Santísimo, accesible solo por la sangre del pacto y la intimidad reverente." },
      { word: "Tsel Shaddai", language: "Hebreo", meaning: "Sombra del Todopoderoso Nutridor", strong: "H6738", note: "La sombra de las alas protectoras de la Deidad que cubre y nutre a sus hijos en el desierto." }
    ],
    versions: {
      RVR1960: [
        { num: 1, text: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente." },
        { num: 2, text: "Diré yo a Jehová: Esperanza mía, y castillo mío; mi Dios, en quien confiaré." },
        { num: 3, text: "Él te librará del lazo del cazador, de la peste destructora." },
        { num: 4, text: "Con sus plumas te cubrirá, y debajo de sus alas estarás seguro; escudo y adarga es su verdad." },
        { num: 5, text: "No temerás el terror nocturno, ni saeta que vuele de día," },
        { num: 6, text: "ni pestilencia que ande en oscuridad, ni mortandad que en medio del día destruya." }
      ],
      NTV: [
        { num: 1, text: "Los que viven al amparo del Altísimo encontrarán descanso a la sombra del Todopoderoso." },
        { num: 2, text: "Declaro lo siguiente acerca del Señor: Solo él es mi refugio, mi lugar seguro; él es mi Dios y en él confío." },
        { num: 3, text: "Te rescatará de toda trampa y te protegerá de enfermedades mortales." },
        { num: 4, text: "Con sus plumas te cubrirá y con sus alas te dará refugio. Sus fieles promesas son tu armadura y tu protección." },
        { num: 5, text: "No le temerás a los terrores de la noche ni a la flecha lanzada en el día." },
        { num: 6, text: "No temerás a la enfermedad que acecha en la oscuridad, ni a la catástrofe que estalla al mediodía." }
      ],
      NVI: [
        { num: 1, text: "El que habita al abrigo del Altísimo se acoge a la sombra del Todopoderoso." },
        { num: 2, text: "Yo le digo al Señor: «Tú eres mi refugio, mi fortaleza, el Dios en quien confío»." },
        { num: 3, text: "Solo él puede librarte de las trampas del cazador y de mortíferas plagas," },
        { num: 4, text: "pues te cubrirá con sus plumas y bajo sus alas hallarás refugio. ¡Su verdad será tu escudo y tu baluarte!" },
        { num: 5, text: "No temerás el terror de la noche, ni la flecha que vuela de día," },
        { num: 6, text: "ni la peste que acecha en las sombras, ni la plaga que destruye a mediodía." }
      ],
      KJV: [
        { num: 1, text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty." },
        { num: 2, text: "I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust." },
        { num: 3, text: "Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence." },
        { num: 4, text: "He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler." },
        { num: 5, text: "Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;" },
        { num: 6, text: "Nor for the pestilence that walketh in darkness; nor for the destruction that wasteth at noonday." }
      ]
    }
  }
];

export const BIBLE_VERSIONS = [
  { id: "RVR1960", name: "Reina-Valera 1960", tag: "Clásica Reverente", language: "Español" },
  { id: "NTV", name: "Nueva Traducción Viviente", tag: "Clara y Emotiva", language: "Español" },
  { id: "NVI", name: "Nueva Versión Internacional", tag: "Equilibrada y Contemporánea", language: "Español" },
  { id: "KJV", name: "King James Version", tag: "Poética Histórica", language: "English" }
];
