// Lista canónica de los 66 libros bíblicos divididos por testamento y sección
export const CANONICAL_BOOKS = [
  // Antiguo Testamento - Pentateuco
  { name: "Génesis", chapters: 50, testament: "AT", group: "Pentateuco" },
  { name: "Éxodo", chapters: 40, testament: "AT", group: "Pentateuco" },
  { name: "Levítico", chapters: 27, testament: "AT", group: "Pentateuco" },
  { name: "Números", chapters: 36, testament: "AT", group: "Pentateuco" },
  { name: "Deuteronomio", chapters: 34, testament: "AT", group: "Pentateuco" },

  // Históricos
  { name: "Josué", chapters: 24, testament: "AT", group: "Históricos" },
  { name: "Jueces", chapters: 21, testament: "AT", group: "Históricos" },
  { name: "Rut", chapters: 4, testament: "AT", group: "Históricos" },
  { name: "1 Samuel", chapters: 31, testament: "AT", group: "Históricos" },
  { name: "2 Samuel", chapters: 24, testament: "AT", group: "Históricos" },
  { name: "1 Reyes", chapters: 22, testament: "AT", group: "Históricos" },
  { name: "2 Reyes", chapters: 25, testament: "AT", group: "Históricos" },
  { name: "1 Crónicas", chapters: 29, testament: "AT", group: "Históricos" },
  { name: "2 Crónicas", chapters: 36, testament: "AT", group: "Históricos" },
  { name: "Esdras", chapters: 10, testament: "AT", group: "Históricos" },
  { name: "Nehemías", chapters: 13, testament: "AT", group: "Históricos" },
  { name: "Ester", chapters: 10, testament: "AT", group: "Históricos" },

  // Poéticos y Sapienciales
  { name: "Job", chapters: 42, testament: "AT", group: "Poéticos" },
  { name: "Salmos", chapters: 150, testament: "AT", group: "Poéticos" },
  { name: "Proverbios", chapters: 31, testament: "AT", group: "Poéticos" },
  { name: "Eclesiastés", chapters: 12, testament: "AT", group: "Poéticos" },
  { name: "Cantares", chapters: 8, testament: "AT", group: "Poéticos" },

  // Profetas Mayores
  { name: "Isaías", chapters: 66, testament: "AT", group: "Profetas Mayores" },
  { name: "Jeremías", chapters: 52, testament: "AT", group: "Profetas Mayores" },
  { name: "Lamentaciones", chapters: 5, testament: "AT", group: "Profetas Mayores" },
  { name: "Ezequiel", chapters: 48, testament: "AT", group: "Profetas Mayores" },
  { name: "Daniel", chapters: 12, testament: "AT", group: "Profetas Mayores" },

  // Profetas Menores
  { name: "Oseas", chapters: 14, testament: "AT", group: "Profetas Menores" },
  { name: "Joel", chapters: 3, testament: "AT", group: "Profetas Menores" },
  { name: "Amós", chapters: 9, testament: "AT", group: "Profetas Menores" },
  { name: "Abdías", chapters: 1, testament: "AT", group: "Profetas Menores" },
  { name: "Jonás", chapters: 4, testament: "AT", group: "Profetas Menores" },
  { name: "Miqueas", chapters: 7, testament: "AT", group: "Profetas Menores" },
  { name: "Nahúm", chapters: 3, testament: "AT", group: "Profetas Menores" },
  { name: "Habacuc", chapters: 3, testament: "AT", group: "Profetas Menores" },
  { name: "Sofonías", chapters: 3, testament: "AT", group: "Profetas Menores" },
  { name: "Hageo", chapters: 2, testament: "AT", group: "Profetas Menores" },
  { name: "Zacarías", chapters: 14, testament: "AT", group: "Profetas Menores" },
  { name: "Malaquías", chapters: 4, testament: "AT", group: "Profetas Menores" },

  // Nuevo Testamento - Evangelios y Hechos
  { name: "Mateo", chapters: 28, testament: "NT", group: "Evangelios" },
  { name: "Marcos", chapters: 16, testament: "NT", group: "Evangelios" },
  { name: "Lucas", chapters: 24, testament: "NT", group: "Evangelios" },
  { name: "Juan", chapters: 21, testament: "NT", group: "Evangelios" },
  { name: "Hechos", chapters: 28, testament: "NT", group: "Historia" },

  // Epístolas Paulinas
  { name: "Romanos", chapters: 16, testament: "NT", group: "Epístolas Paulinas" },
  { name: "1 Corintios", chapters: 16, testament: "NT", group: "Epístolas Paulinas" },
  { name: "2 Corintios", chapters: 13, testament: "NT", group: "Epístolas Paulinas" },
  { name: "Gálatas", chapters: 6, testament: "NT", group: "Epístolas Paulinas" },
  { name: "Efesios", chapters: 6, testament: "NT", group: "Epístolas Paulinas" },
  { name: "Filipenses", chapters: 4, testament: "NT", group: "Epístolas Paulinas" },
  { name: "Colosenses", chapters: 4, testament: "NT", group: "Epístolas Paulinas" },
  { name: "1 Tesalonicenses", chapters: 5, testament: "NT", group: "Epístolas Paulinas" },
  { name: "2 Tesalonicenses", chapters: 3, testament: "NT", group: "Epístolas Paulinas" },
  { name: "1 Timoteo", chapters: 6, testament: "NT", group: "Epístolas Paulinas" },
  { name: "2 Timoteo", chapters: 4, testament: "NT", group: "Epístolas Paulinas" },
  { name: "Tito", chapters: 3, testament: "NT", group: "Epístolas Paulinas" },
  { name: "Filemón", chapters: 1, testament: "NT", group: "Epístolas Paulinas" },

  // Epístolas Generales
  { name: "Hebreos", chapters: 13, testament: "NT", group: "Epístolas Generales" },
  { name: "Santiago", chapters: 5, testament: "NT", group: "Epístolas Generales" },
  { name: "1 Pedro", chapters: 5, testament: "NT", group: "Epístolas Generales" },
  { name: "2 Pedro", chapters: 3, testament: "NT", group: "Epístolas Generales" },
  { name: "1 Juan", chapters: 5, testament: "NT", group: "Epístolas Generales" },
  { name: "2 Juan", chapters: 1, testament: "NT", group: "Epístolas Generales" },
  { name: "3 Juan", chapters: 1, testament: "NT", group: "Epístolas Generales" },
  { name: "Judas", chapters: 1, testament: "NT", group: "Epístolas Generales" },

  // Revelación
  { name: "Apocalipsis", chapters: 22, testament: "NT", group: "Profecía" }
];
