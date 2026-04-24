export const SUBJECT_KEYS = ['emath', 'omath', 'ephysic', 'ophysic'] as const;

export type SubjectId = (typeof SUBJECT_KEYS)[number];
