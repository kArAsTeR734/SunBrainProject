import { KnowledgeTestSubject } from '@features/Test/models/types.ts';

export const KNOWLEDGE_TEST_SUBJECTS: KnowledgeTestSubject[] = [
  {
    id: 'emath',
    title: 'ЕГЭ Математика',
    examLabel: 'ЕГЭ',
    subjectLabel: 'Математика',
    examTaskCount: 19,
  },
  {
    id: 'omath',
    title: 'ОГЭ Математика',
    examLabel: 'ОГЭ',
    subjectLabel: 'Математика',
    examTaskCount: 25,
  },
  {
    id: 'ephysic',
    title: 'ЕГЭ Физика',
    examLabel: 'ЕГЭ',
    subjectLabel: 'Физика',
    examTaskCount: 30,
  },
  {
    id: 'ophysic',
    title: 'ОГЭ Физика',
    examLabel: 'ОГЭ',
    subjectLabel: 'Физика',
    examTaskCount: 25,
  },
];

export const getKnowledgeTestSubjectById = (
  id: string,
): KnowledgeTestSubject | undefined => {
  return KNOWLEDGE_TEST_SUBJECTS.find((subject) => subject.id === id);
};
