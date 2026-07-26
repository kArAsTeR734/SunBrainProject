export const CATALOG_ITEMS = [
  { id: 'ephysic', path: 'ephysic', title: 'ЕГЭ Физика' },
  { id: 'emath', path: 'emath', title: 'ЕГЭ Математика' },
  { id: 'ophysic', path: 'ophysic', title: 'ОГЭ Физика' },
  { id: 'omath', path: 'omath', title: 'ОГЭ Математика' },
] as const;

export type SubjectPath = (typeof CATALOG_ITEMS)[number]['path'];
